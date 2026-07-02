const accessModel = require('../models/accessModel');
const authModel = require('../models/authModel');

const accessController = {
    // 1. Get all lecturers (with their courses)
    getAllLecturers: async (req, res) => {
        try {
            const [lecturers] = await require('../config/db').pool.query(`
                SELECT u.id, u.name, u.email, u.created_at,
                    COUNT(c.id) as course_count
                FROM users u
                LEFT JOIN courses c ON u.id = c.lecturer_id
                WHERE u.role = 'lecturer'
                GROUP BY u.id
                ORDER BY u.created_at DESC
            `);

            // Get courses for each lecturer
            for (let lecturer of lecturers) {
                const [courses] = await require('../config/db').pool.query(
                    'SELECT id, code, title, semester, credit_hours FROM courses WHERE lecturer_id = ?',
                    [lecturer.id]
                );
                lecturer.courses = courses;
            }

            res.json({
                count: lecturers.length,
                lecturers
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // 2. Get single lecturer with courses
    getLecturerById: async (req, res) => {
        try {
            const { id } = req.params;

            const [lecturers] = await require('../config/db').pool.query(
                'SELECT id, name, email, role, is_verified, created_at FROM users WHERE id = ? AND role = ?',
                [id, 'lecturer']
            );

            if (lecturers.length === 0) {
                return res.status(404).json({ message: 'Lecturer not found' });
            }

            const lecturer = lecturers[0];

            // Get courses
            const [courses] = await require('../config/db').pool.query(
                'SELECT id, code, title, description, semester, credit_hours, created_at FROM courses WHERE lecturer_id = ?',
                [id]
            );
            lecturer.courses = courses;

            // Get access grants for this lecturer
            const [access] = await require('../config/db').pool.query(`
                SELECT ac.*, c.code as course_code, c.title as course_title, h.name as hod_name
                FROM access_controls ac
                JOIN courses c ON ac.course_id = c.id
                JOIN users h ON ac.hod_id = h.id
                WHERE ac.lecturer_id = ?
            `, [id]);
            lecturer.access_grants = access;

            res.json({ lecturer });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // 3. HOD grants access to lecturer
    grantAccess: async (req, res) => {
        try {
            const hodId = req.user.id;

            // Only HOD can grant access
            if (req.user.role !== 'hod') {
                return res.status(403).json({ message: 'Only HOD can grant access' });
            }

            const { lecturer_id, course_id, semester, access_level, start_datetime, end_datetime, note } = req.body;

            // Validate required fields
            if (!lecturer_id || !course_id || !semester || !start_datetime || !end_datetime) {
                return res.status(400).json({ message: 'lecturer_id, course_id, semester, start_datetime, end_datetime are required' });
            }

            // Validate lecturer exists and is lecturer
            const lecturer = await authModel.findByEmail((await require('../config/db').pool.query('SELECT email FROM users WHERE id = ?', [lecturer_id]))[0][0]?.email);
            if (!lecturer || lecturer.role !== 'lecturer') {
                return res.status(400).json({ message: 'Invalid lecturer' });
            }

            // Validate course exists
            const [courses] = await require('../config/db').pool.query('SELECT id FROM courses WHERE id = ?', [course_id]);
            if (courses.length === 0) {
                return res.status(400).json({ message: 'Course not found' });
            }

            // Validate access level
            const validLevels = ['view', 'download', 'edit'];
            if (access_level && !validLevels.includes(access_level)) {
                return res.status(400).json({ message: 'Access level must be view, download, or edit' });
            }

            // Validate semester
            const validSemesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
            if (!validSemesters.includes(semester)) {
                return res.status(400).json({ message: 'Invalid semester' });
            }

            // Check for duplicate active access
            const duplicate = await accessModel.checkDuplicate(lecturer_id, course_id, semester);
            if (duplicate) {
                return res.status(400).json({ message: 'Access already granted for this lecturer, course and semester' });
            }

            // Validate dates
            const start = new Date(start_datetime);
            const end = new Date(end_datetime);
            if (end <= start) {
                return res.status(400).json({ message: 'End datetime must be after start datetime' });
            }

            const accessId = await accessModel.create(
                hodId,
                lecturer_id,
                course_id,
                semester,
                access_level || 'view',
                start_datetime,
                end_datetime,
                note
            );

            res.status(201).json({
                message: 'Access granted successfully',
                accessId
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // 4. View all access controls
    getAllAccess: async (req, res) => {
        try {
            let access;
            if (req.user.role === 'hod') {
                access = await accessModel.getByHod(req.user.id);
            } else {
                access = await accessModel.getByLecturer(req.user.id);
            }

            res.json({
                count: access.length,
                access
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // 5. View access by ID
    getAccessById: async (req, res) => {
        try {
            const { id } = req.params;
            const access = await accessModel.getById(id);

            if (!access) {
                return res.status(404).json({ message: 'Access control not found' });
            }

            // Check authorization
            if (req.user.role !== 'hod' && access.lecturer_id !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized to view this access' });
            }

            res.json({ access });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // 6. Update access
    updateAccess: async (req, res) => {
        try {
            const { id } = req.params;
            const hodId = req.user.id;

            // Only HOD can update
            if (req.user.role !== 'hod') {
                return res.status(403).json({ message: 'Only HOD can update access' });
            }

            const access = await accessModel.getById(id);
            if (!access) {
                return res.status(404).json({ message: 'Access control not found' });
            }

            // Only the HOD who created it can update
            if (access.hod_id !== hodId) {
                return res.status(403).json({ message: 'Not authorized to update this access' });
            }

            const { access_level, start_datetime, end_datetime, note, is_active } = req.body;

            const updates = {};
            if (access_level) {
                const validLevels = ['view', 'download', 'edit'];
                if (!validLevels.includes(access_level)) {
                    return res.status(400).json({ message: 'Invalid access level' });
                }
                updates.access_level = access_level;
            }
            if (start_datetime) updates.start_datetime = start_datetime;
            if (end_datetime) updates.end_datetime = end_datetime;
            if (note !== undefined) updates.note = note;
            if (is_active !== undefined) updates.is_active = is_active;

            if (Object.keys(updates).length === 0) {
                return res.status(400).json({ message: 'No fields to update' });
            }

            // Validate dates if both provided
            if (updates.start_datetime && updates.end_datetime) {
                const start = new Date(updates.start_datetime);
                const end = new Date(updates.end_datetime);
                if (end <= start) {
                    return res.status(400).json({ message: 'End datetime must be after start datetime' });
                }
            }

            await accessModel.update(id, updates);
            res.json({ message: 'Access updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // 7. Delete access
    deleteAccess: async (req, res) => {
        try {
            const { id } = req.params;
            const hodId = req.user.id;

            // Only HOD can delete
            if (req.user.role !== 'hod') {
                return res.status(403).json({ message: 'Only HOD can delete access' });
            }

            const access = await accessModel.getById(id);
            if (!access) {
                return res.status(404).json({ message: 'Access control not found' });
            }

            // Only the HOD who created it can delete
            if (access.hod_id !== hodId) {
                return res.status(403).json({ message: 'Not authorized to delete this access' });
            }

            await accessModel.delete(id);
            res.json({ message: 'Access deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
};

module.exports = accessController;
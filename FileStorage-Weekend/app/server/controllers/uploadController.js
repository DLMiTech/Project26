const UploadModel = require('../models/uploadModel');
const CourseRepositoryModel = require('../models/courseRepositoryModel');
const AccessCheck = require('../utils/accessCheck');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const UPLOAD_DIR = path.join(__dirname, '../uploads');

const UploadController = {
    async create(req, res) {
        try {
            const { course_repository_id, index_number, serial_number } = req.body;
            const lecture_id = req.user.id;
            const file = req.file;

            if (!course_repository_id || !file) {
                return res.status(400).json({
                    success: false,
                    message: 'course_repository_id and file are required'
                });
            }

            // Get course_id from course_repository_id
            const courseRepo = await CourseRepositoryModel.getById(course_repository_id);
            if (!courseRepo) {
                return res.status(404).json({
                    success: false,
                    message: 'Course repository not found'
                });
            }

            // Check access (modify level required to upload)
            const hasAccess = await AccessCheck.hasAccess(req.user.id, courseRepo.course_id, 'modify');
            if (!hasAccess && req.user.role !== 'hod') {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have modify access for this course'
                });
            }

            const file_path = `/uploads/${file.filename}`;

            const upload = await UploadModel.create({
                course_repository_id,
                lecture_id,
                file_path,
                index_number: index_number || null,
                serial_number: serial_number || null
            });

            res.status(201).json({
                success: true,
                message: 'File uploaded successfully',
                data: upload
            });
        } catch (error) {
            console.error('Error creating upload:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    async getAllCourseUpload(req, res) {
        try {
            const { course_repository_id } = req.params;

            const uploads = await UploadModel.getAllCourseUpload(course_repository_id);
            if (uploads.length === 0) {
                return res.status(200).json({
                    success: true,
                    count: 0,
                    data: []
                });
            }

            // Check access for first upload's course (all same course)
            const course_id = uploads[0].course_id;
            const hasAccess = await AccessCheck.hasAccess(req.user.id, course_id, 'view');
            if (!hasAccess && req.user.role !== 'hod') {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have access to view these uploads'
                });
            }

            res.status(200).json({
                success: true,
                count: uploads.length,
                data: uploads
            });
        } catch (error) {
            console.error('Error fetching uploads:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { index_number, serial_number } = req.body;

            const upload = await UploadModel.getById(id);
            if (!upload) {
                return res.status(404).json({
                    success: false,
                    message: 'Upload not found'
                });
            }

            // Only HOD or the uploader can update
            const canModify = await AccessCheck.isHODOrOwner(req.user.id, req.user.role, upload.lecture_id);
            if (!canModify) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only update your own uploads'
                });
            }

            const updated = await UploadModel.update(id, {
                index_number,
                serial_number
            });

            res.status(200).json({
                success: true,
                message: 'Upload updated successfully',
                data: updated
            });
        } catch (error) {
            console.error('Error updating upload:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;

            const upload = await UploadModel.getById(id);
            if (!upload) {
                return res.status(404).json({
                    success: false,
                    message: 'Upload not found'
                });
            }

            // Only HOD or the uploader can delete
            const canModify = await AccessCheck.isHODOrOwner(req.user.id, req.user.role, upload.lecture_id);
            if (!canModify) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only delete your own uploads'
                });
            }

            // Delete file from disk
            const filePath = path.join(UPLOAD_DIR, path.basename(upload.file_path));
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            const deleted = await UploadModel.delete(id);

            res.status(200).json({
                success: true,
                message: 'Upload deleted successfully',
                data: deleted
            });
        } catch (error) {
            console.error('Error deleting upload:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    async downloadOneUpload(req, res) {
        try {
            const { id } = req.params;

            const upload = await UploadModel.getById(id);
            if (!upload) {
                return res.status(404).json({
                    success: false,
                    message: 'Upload not found'
                });
            }

            // Check access (download level required)
            const hasAccess = await AccessCheck.hasAccess(req.user.id, upload.course_id, 'download');
            if (!hasAccess && req.user.role !== 'hod') {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have download access for this course'
                });
            }

            const filePath = path.join(UPLOAD_DIR, path.basename(upload.file_path));
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({
                    success: false,
                    message: 'File not found on server'
                });
            }

            res.download(filePath, path.basename(upload.file_path));
        } catch (error) {
            console.error('Error downloading upload:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    async downloadAllInOne(req, res) {
        try {
            const { course_repository_id } = req.params;

            const uploads = await UploadModel.getAllCourseUpload(course_repository_id);
            if (uploads.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No uploads found for this course'
                });
            }

            // Check access (download level required)
            const course_id = uploads[0].course_id;
            const hasAccess = await AccessCheck.hasAccess(req.user.id, course_id, 'download');
            if (!hasAccess && req.user.role !== 'hod') {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have download access for this course'
                });
            }

            // Set headers for multiple file download (as tar/zip stream)
            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', `attachment; filename=course_${course_repository_id}_files.zip`);

            const archive = archiver('zip', { zlib: { level: 9 } });
            archive.pipe(res);

            for (const upload of uploads) {
                const filePath = path.join(UPLOAD_DIR, path.basename(upload.file_path));
                if (fs.existsSync(filePath)) {
                    archive.file(filePath, { name: path.basename(upload.file_path) });
                }
            }

            await archive.finalize();
        } catch (error) {
            console.error('Error downloading all uploads:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    async downloadAllAsZip(req, res) {
        try {
            const { course_repository_id } = req.params;

            const uploads = await UploadModel.getAllCourseUpload(course_repository_id);
            if (uploads.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No uploads found for this course'
                });
            }

            // Check access (download level required)
            const course_id = uploads[0].course_id;
            const hasAccess = await AccessCheck.hasAccess(req.user.id, course_id, 'download');
            if (!hasAccess && req.user.role !== 'hod') {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have download access for this course'
                });
            }

            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', `attachment; filename=course_${course_repository_id}_all.zip`);

            const archive = archiver('zip', { zlib: { level: 9 } });
            archive.pipe(res);

            for (const upload of uploads) {
                const filePath = path.join(UPLOAD_DIR, path.basename(upload.file_path));
                if (fs.existsSync(filePath)) {
                    archive.file(filePath, { name: path.basename(upload.file_path) });
                }
            }

            await archive.finalize();
        } catch (error) {
            console.error('Error downloading all as zip:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    async zipAllCourseUpload(req, res) {
        try {
            const { course_repository_id } = req.params;

            const uploads = await UploadModel.getAllCourseUpload(course_repository_id);
            if (uploads.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No uploads found for this course'
                });
            }

            // Check access (download level required)
            const course_id = uploads[0].course_id;
            const hasAccess = await AccessCheck.hasAccess(req.user.id, course_id, 'download');
            if (!hasAccess && req.user.role !== 'hod') {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have download access for this course'
                });
            }

            // Create zip file on disk
            const zipFileName = `course_${course_repository_id}_${Date.now()}.zip`;
            const zipPath = path.join(UPLOAD_DIR, zipFileName);
            const output = fs.createWriteStream(zipPath);
            const archive = archiver('zip', { zlib: { level: 9 } });

            archive.pipe(output);

            for (const upload of uploads) {
                const filePath = path.join(UPLOAD_DIR, path.basename(upload.file_path));
                if (fs.existsSync(filePath)) {
                    archive.file(filePath, { name: path.basename(upload.file_path) });
                }
            }

            await archive.finalize();

            // Wait for zip to finish writing
            await new Promise((resolve, reject) => {
                output.on('close', resolve);
                archive.on('error', reject);
            });

            res.status(200).json({
                success: true,
                message: 'Zip created successfully',
                data: {
                    zip_path: `/uploads/${zipFileName}`,
                    zip_file: zipFileName
                }
            });
        } catch (error) {
            console.error('Error zipping uploads:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
};

module.exports = UploadController;
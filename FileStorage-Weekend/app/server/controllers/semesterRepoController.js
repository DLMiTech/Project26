const SemesterRepoModel = require('../models/semesterRepoModel');
const RepositoryModel = require('../models/repositoryModel');

const SemesterRepoController = {
    async create(req, res) {
        try {
            const { repository_id, name } = req.body;

            // Validation
            if (!repository_id || !name) {
                return res.status(400).json({
                    success: false,
                    message: 'repository_id and name are required'
                });
            }

            // Validate name (1st or 2nd)
            const validNames = ['1st', '2nd'];
            if (!validNames.includes(name)) {
                return res.status(400).json({
                    success: false,
                    message: 'Semester name must be 1st or 2nd'
                });
            }

            // Check if repository exists
            const repoExists = await RepositoryModel.getById(repository_id);
            if (!repoExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Repository not found'
                });
            }

            // Check if semester already exists for this repository
            const exists = await SemesterRepoModel.existsByNameAndRepo(repository_id, name);
            if (exists) {
                return res.status(409).json({
                    success: false,
                    message: `Semester ${name} already exists for this repository`
                });
            }

            const semesterRepo = await SemesterRepoModel.create({
                repository_id,
                name
            });

            res.status(201).json({
                success: true,
                message: 'Semester created successfully',
                data: semesterRepo
            });
        } catch (error) {
            console.error('Error creating semester:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    async getAll(req, res) {
        try {
            const semesters = await SemesterRepoModel.getAll();
            res.status(200).json({
                success: true,
                count: semesters.length,
                data: semesters
            });
        } catch (error) {
            console.error('Error fetching semesters:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    async getByRepository(req, res) {
        try {
            const { repository_id } = req.params;

            const repoExists = await RepositoryModel.getById(repository_id);
            if (!repoExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Repository not found'
                });
            }

            const semesters = await SemesterRepoModel.getByRepositoryId(repository_id);
            res.status(200).json({
                success: true,
                count: semesters.length,
                data: semesters
            });
        } catch (error) {
            console.error('Error fetching semesters by repository:', error);
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

            const semester = await SemesterRepoModel.delete(id);
            if (!semester) {
                return res.status(404).json({
                    success: false,
                    message: 'Semester not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Semester deleted successfully',
                data: semester
            });
        } catch (error) {
            console.error('Error deleting semester:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
};

module.exports = SemesterRepoController;
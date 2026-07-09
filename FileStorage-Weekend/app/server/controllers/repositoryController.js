const RepositoryModel = require('../models/repositoryModel');

const RepositoryController = {
    async create(req, res) {
        try {
            const { year } = req.body;

            // Validation
            if (!year) {
                return res.status(400).json({
                    success: false,
                    message: 'Year is required'
                });
            }

            // Validate year format (4-digit number)
            const yearNum = parseInt(year);
            if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
                return res.status(400).json({
                    success: false,
                    message: 'Year must be a valid 4-digit number'
                });
            }

            // Check if year already exists
            const exists = await RepositoryModel.existsByYear(yearNum);
            if (exists) {
                return res.status(409).json({
                    success: false,
                    message: `Repository for year ${yearNum} already exists`
                });
            }

            const repository = await RepositoryModel.create({ year: yearNum });

            res.status(201).json({
                success: true,
                message: 'Repository created successfully',
                data: repository
            });
        } catch (error) {
            console.error('Error creating repository:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    async getAll(req, res) {
        try {
            const repositories = await RepositoryModel.getAll();
            res.status(200).json({
                success: true,
                count: repositories.length,
                data: repositories
            });
        } catch (error) {
            console.error('Error fetching repositories:', error);
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

            const repository = await RepositoryModel.delete(id);
            if (!repository) {
                return res.status(404).json({
                    success: false,
                    message: 'Repository not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Repository deleted successfully',
                data: repository
            });
        } catch (error) {
            console.error('Error deleting repository:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
};

module.exports = RepositoryController;
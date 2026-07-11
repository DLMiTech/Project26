const Faculty = require('../models/facultyModel');

const createFaculty = async (req, res) => {
  try {
    const { name, code } = req.body;
    if (!name || !code) return res.status(400).json({ message: 'Name and code are required' });
    const facultyId = await Faculty.create(name, code);
    const faculty = await Faculty.findById(facultyId);
    res.status(201).json({ message: 'Faculty created successfully', faculty });
  } catch (error) {
    res.status(500).json({ message: 'Error creating faculty', error: error.message });
  }
};

const getAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.findAll();
    res.json({ faculties });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching faculties', error: error.message });
  }
};

const getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
    res.json({ faculty });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching faculty', error: error.message });
  }
};

const updateFaculty = async (req, res) => {
  try {
    const { name, code } = req.body;
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
    await Faculty.update(req.params.id, name, code);
    res.json({ message: 'Faculty updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating faculty', error: error.message });
  }
};

const deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
    await Faculty.remove(req.params.id);
    res.json({ message: 'Faculty deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting faculty', error: error.message });
  }
};

module.exports = {
  createFaculty,
  getAllFaculties,
  getFacultyById,
  updateFaculty,
  deleteFaculty
};

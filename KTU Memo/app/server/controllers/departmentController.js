const Department = require('../models/departmentModel');

const createDepartment = async (req, res) => {
  try {
    const { faculty_id, name } = req.body;
    if (!faculty_id || !name) return res.status(400).json({ message: 'Faculty ID and name are required' });
    const departmentId = await Department.create(faculty_id, name);
    const department = await Department.findById(departmentId);
    res.status(201).json({ message: 'Department created successfully', department });
  } catch (error) {
    res.status(500).json({ message: 'Error creating department', error: error.message });
  }
};

const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.json({ departments });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching departments', error: error.message });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.json({ department });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching department', error: error.message });
  }
};

const getDepartmentsByFaculty = async (req, res) => {
  try {
    const departments = await Department.findByFaculty(req.params.facultyId);
    res.json({ departments });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching departments', error: error.message });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { faculty_id, name } = req.body;
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    await Department.update(req.params.id, faculty_id, name);
    res.json({ message: 'Department updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating department', error: error.message });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    await Department.remove(req.params.id);
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting department', error: error.message });
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  getDepartmentsByFaculty,
  updateDepartment,
  deleteDepartment
};

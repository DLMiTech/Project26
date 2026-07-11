const UserDepartment = require('../models/userDepartmentModel');

const joinDepartment = async (req, res) => {
  try {
    const { user_id, department_id } = req.body;
    if (!user_id || !department_id) return res.status(400).json({ message: 'User ID and Department ID are required' });
    const joinId = await UserDepartment.join(user_id, department_id);
    res.status(201).json({ message: 'User joined department successfully', joinId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'User already in this department' });
    res.status(500).json({ message: 'Error joining department', error: error.message });
  }
};

const leaveDepartment = async (req, res) => {
  try {
    const { user_id, department_id } = req.body;
    if (!user_id || !department_id) return res.status(400).json({ message: 'User ID and Department ID are required' });
    await UserDepartment.remove(user_id, department_id);
    res.json({ message: 'User left department successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error leaving department', error: error.message });
  }
};

const getUserDepartments = async (req, res) => {
  try {
    const departments = await UserDepartment.findByUser(req.params.userId);
    res.json({ departments });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user departments', error: error.message });
  }
};

const getDepartmentUsers = async (req, res) => {
  try {
    const users = await UserDepartment.findByDepartment(req.params.departmentId);
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching department users', error: error.message });
  }
};

module.exports = {
  joinDepartment,
  leaveDepartment,
  getUserDepartments,
  getDepartmentUsers
};

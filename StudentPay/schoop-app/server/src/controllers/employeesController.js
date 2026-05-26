import employeeModel from "../models/employeeModel.js";


const getAllEmployees = async (req, res) => {
    try {
        const employees = await employeeModel.getAllEmployees()

        res.status(200).json({
            status: 200,
            data: employees
        });

    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
        })
    }
}

const createEmployee = async (req, res) => {

    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            status: 400,
            message: "Name and email required"
        });
    }

    try {

        const result = await employeeModel.createEmployee(name, email);

        res.status(201).json({
            status: 201,
            data: {
                id: result.insertId,
                name,
                email
            }
        });

    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
        })
    }
};

const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {

        await employeeModel.updateEmployee(id, name, email);

        res.status(200).json({
            message: "Employee updated"
        });

    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
        })
    }
};

const deleteEmployee = async (req, res) => {

    const { id } = req.params;
    try {
        await employeeModel.deleteEmployee(id);

        res.status(204).json({
            status: 204,
            message: "Employee deleted"
        });

    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
        })
    }
};

const getEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        const employee = await employeeModel.getEmployee(id);

        if (!employee) {
            return res.status(404).json({
                status: 404,
                message: "Employee not found"
            });
        }

        res.status(200).json({
            status: 200,
            data: employee
        });

    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
        })
    }
};

export default {getAllEmployees, createEmployee, updateEmployee, deleteEmployee, getEmployee}
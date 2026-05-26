import pool from "../config/db.js";

const getAllEmployees = async () => {
    const [rows] = await pool.query("SELECT * FROM employees");
    return rows;
};

const getEmployee = async (id) => {
    const [rows] = await pool.query(
        "SELECT * FROM employees WHERE id = ?",
        [id]
    );
    return rows[0];
};

const createEmployee = async (name, email) => {
    const [result] = await pool.query(
        "INSERT INTO employees (name,email) VALUES (?,?)",
        [name, email]
    );
    return result;
};

const updateEmployee = async (id, name, email) => {
    const [result] = await pool.query(
        "UPDATE employees SET name=?, email=? WHERE id=?",
        [name, email, id]
    );
    return result;
};

const deleteEmployee = async (id) => {
    const [result] = await pool.query(
        "DELETE FROM employees WHERE id=?",
        [id]
    );
    return result;
};

export default {
    getAllEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee
};
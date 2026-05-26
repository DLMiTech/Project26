import pool from "../config/db.js";

const findUserByEmail = async (email) => {

    const [rows] = await pool.execute(
        "SELECT * FROM student_auth WHERE email = ?",
        [email]
    );

    return rows[0];
};


const updateRefreshToken = async (email, refreshToken) => {

    const [result] = await pool.execute(
        "UPDATE users SET refreshToken = ? WHERE email = ?",
        [refreshToken, email]
    );

    return result;
};

const findUserByRefreshToken = async (refreshToken) => {

    const [rows] = await pool.execute(
        "SELECT * FROM users WHERE refreshToken = ?",
        [refreshToken]
    );

    return rows[0];
};

const removeRefreshToken = async (username) => {

    const [result] = await pool.execute(
        "UPDATE users SET refreshToken = NULL WHERE username = ?",
        [username]
    );

    return result;
};

export default {
    findUserByEmail,
    updateRefreshToken,
    findUserByRefreshToken,
    removeRefreshToken
};
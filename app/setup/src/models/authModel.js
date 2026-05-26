import pool from "../config/db.js";

const findUserByUsername = async (username) => {

    const [rows] = await pool.execute(
        "SELECT * FROM users WHERE username = ?",
        [username]
    );

    return rows[0];
};

const createUser = async (username, password, roles) => {

    const [result] = await pool.execute(
        "INSERT INTO users (username, password, roles) VALUES (?,?,?)",
        [username, password, JSON.stringify(roles)]
    );

    return result;
};

const updateRefreshToken = async (username, refreshToken) => {

    const [result] = await pool.execute(
        "UPDATE users SET refreshToken = ? WHERE username = ?",
        [refreshToken, username]
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
    findUserByUsername,
    createUser,
    updateRefreshToken,
    findUserByRefreshToken,
    removeRefreshToken
};
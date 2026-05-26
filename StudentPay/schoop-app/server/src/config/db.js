import mysql from 'mysql2/promise';
import 'dotenv/config';

const conn = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

// Test connection
const testConnection = async () => {
    try {
        const connection = await conn.getConnection();
        console.log("✅ Connected to MySQL Database");
        connection.release();
    } catch (err) {
        console.error("❌ Database connection failed:", err.message);
    }
};

testConnection();

export default conn;
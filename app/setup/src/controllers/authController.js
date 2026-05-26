import authModel from "../models/authModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";


const createNewUser = async (req, res) => {

    const { user, pwd } = req.body;

    if (!user || !pwd) {
        return res.status(400).json({
            status: 400,
            message: "Username and password required"
        });
    }

    const duplicate = await authModel.findUserByUsername(user);

    if (duplicate) {
        return res.status(409).json({
            status: 409,
            message: `User ${user} already exists`
        });
    }

    try {

        const hashedPwd = await bcrypt.hash(pwd, 10);

        const roles = { User: 2000 };

        await authModel.createUser(user, hashedPwd, roles);

        res.status(201).json({
            status: 201,
            message: `User ${user} created`
        });

    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message
        });
    }
};


const loginUser = async (req, res) => {

    try {
        const { user, pwd } = req.body;

        const foundUser = await authModel.findUserByUsername(user);

        if (!foundUser) {
            return res.status(401).json({
                status: 401,
                message: "Wrong username or password"
            });
        }

        const match = await bcrypt.compare(pwd, foundUser.password);

        if (!match) {
            return res.status(401).json({
                status: 401,
                message: "Wrong username or password"
            });
        }

        let roles;
        if (typeof foundUser.roles === "string") {
            roles = Object.values(JSON.parse(foundUser.roles));
        } else {
            roles = Object.values(foundUser.roles);
        }

        const accessToken = jwt.sign(
            {
                UserInfo: {
                    username: foundUser.username,
                    roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30m" }
        );

        const refreshToken = jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        await authModel.updateRefreshToken(foundUser.username, refreshToken);

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            status: 200,
            message: `User ${foundUser.username} has been logged in`,
            accessToken: accessToken
        });
    }catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        })
    }
};


const refreshToken = async (req, res) => {

    try {
        const cookies = req.cookies;

        if (!cookies?.jwt) return res.status(401).json({
            status: 401,
            message: `Unauthorized`
        });

        const refreshToken = cookies.jwt;

        const foundUser = await authModel.findUserByRefreshToken(refreshToken);

        if (!foundUser) {
            return res.status(403).json({
                status: 403,
                message: "Forbidden, refresh token not found"
            });
        }

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {

                if (err || foundUser.username !== decoded.username) {
                    return res.status(403).json({
                        status: 403,
                        message: "Forbidden, refresh token username not matching"
                    });
                }

                let roles;
                if (typeof foundUser.roles === "string") {
                    roles = Object.values(JSON.parse(foundUser.roles));
                } else {
                    roles = Object.values(foundUser.roles);
                }

                const accessToken = jwt.sign(
                    {
                        UserInfo: {
                            username: foundUser.username,
                            roles
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "30m" }
                );

                res.status(200).json({
                    status: 200,
                    message: 'Token refreshed successfully!',
                    accessToken: accessToken
                })
            }
        );
    }catch(err) {
        res.status(500).json({
            status: 500,
            message: err.message
        })
    }
};


const logoutUser = async (req, res) => {

    try {
        const cookies = req.cookies;

        if (!cookies?.jwt) return res.status(204).json({
            status: 204,
            message: `No content, logged in successfully!`
        });

        const refreshToken = cookies.jwt;

        const foundUser = await authModel.findUserByRefreshToken(refreshToken);

        if (foundUser) {
            await authModel.removeRefreshToken(foundUser.username);
        }

        res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

        res.status(204).json({
            status: 204,
            message: `logged in successfully!`
        });
    }catch (err){
        res.status(500).json({
            status: 500,
            message: err.message
        })
    }
};


export default { createNewUser, loginUser, refreshToken, logoutUser };

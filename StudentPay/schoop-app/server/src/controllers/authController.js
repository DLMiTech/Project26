import authModel from "../models/authModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";


const loginUser = async (req, res) => {

    try {
        const { email, password} = req.body;

        const foundUser = await authModel.findUserByEmail(email);

        if (!foundUser) {
            return res.status(401).json({
                status: 401,
                message: "Wrong email or password"
            });
        }

        const match = await bcrypt.compare(password, foundUser.password);

        if (!match) {
            return res.status(401).json({
                status: 401,
                message: "Wrong email or password"
            });
        }

        let roles;
        if (typeof foundUser.role === "string") {
            roles = Object.values(JSON.parse(foundUser.role));
        } else {
            roles = Object.values(foundUser.role);
        }

        const accessToken = jwt.sign(
            {
                UserInfo: {
                    email: foundUser.email,
                    roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        const refreshToken = jwt.sign(
            { email: foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "10d" }
        );

        await authModel.updateRefreshToken(foundUser.email, refreshToken);

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            status: 200,
            message: `Login Successful.`,
            data: {
                accessToken: accessToken,
                user: foundUser,
            }
        });
    }catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        })
    }
};


const forgotPassword = async (req, res) => {

    try {
        const { email} = req.body;

        const foundUser = await authModel.findUserByEmail(email);

        if (!foundUser) {
            return res.status(401).json({
                status: 401,
                message: "This email not registered as a student"
            });
        }

        //ToDo Send SMS

        res.status(200).json({
            status: 200,
            message: `Verify account to reset your password.`,
            data: {
                email: foundUser.email,
            }
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


export default { loginUser, forgotPassword, refreshToken, logoutUser };

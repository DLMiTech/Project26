import axios from "axios";

import URLService from "../service/URLService.jsx";
import AuthVerify from "../service/AuthVerify.jsx";

class AuthRequest {

    static BASE_URL = URLService.baseURL();

    static async register(payload) {
        try {
            const response = await axios.post(`${this.BASE_URL}/auth/register`, payload);
            return response.data;
        } catch (err) {
            return {
                status: err.response?.status,
                message: err.response?.data?.message || err.message,
                data: err.response?.data,
            };
        }
    }

    static async verify_otp(payload) {
        try {
            const response = await axios.post(`${this.BASE_URL}/auth/verify-otp`, payload);
            return response.data;
        } catch (err) {
            return {
                status: err.response?.status,
                message: err.response?.data?.message || err.message,
                data: err.response?.data,
            };
        }
    }

    static async verify_login_otp(payload) {
        try {
            const response = await axios.post(`${this.BASE_URL}/auth/verify-login-otp`, payload);
            return response.data;
        } catch (err) {
            return {
                status: err.response?.status,
                message: err.response?.data?.message || err.message,
                data: err.response?.data,
            };
        }
    }

    static async login(payload) {
        try {
            const response = await axios.post(`${this.BASE_URL}/auth/login`, payload);
            return response.data;
        } catch (err) {
            return {
                status: err.response?.status,
                message: err.response?.data?.message || err.message,
                data: err.response?.data,
            };
        }
    }

    static async forgot_password(payload) {
        try {
            const response = await axios.post(`${this.BASE_URL}/auth/forgot-password`, payload);
            return response.data;
        } catch (err) {
            return {
                status: err.response?.status,
                message: err.response?.data?.message || err.message,
                data: err.response?.data,
            };
        }
    }

    static async verify_forgot_password_otp(payload) {
        try {
            const response = await axios.post(`${this.BASE_URL}/auth/verify-forgot-password-otp`, payload);
            return response.data;
        } catch (err) {
            return {
                status: err.response?.status,
                message: err.response?.data?.message || err.message,
                data: err.response?.data,
            };
        }
    }

    static async reset_password(payload) {
        try {
            const response = await axios.post(`${this.BASE_URL}/auth/reset-password`, payload);
            return response.data;
        } catch (err) {
            return {
                status: err.response?.status,
                message: err.response?.data?.message || err.message,
                data: err.response?.data,
            };
        }
    }


    static async logout(payload) {
        try {
            if (await AuthVerify.isAuthorized()){
                const response = await axios.post(`${this.BASE_URL}/auth/logout`, payload, {
                    headers: {
                        Authorization: `Bearer ${AuthVerify.getToken()}`,
                    },
                });
                return response.data;
            }
        } catch (err) {
            return {
                status: err.response?.status,
                message: err.response?.data?.message || err.message,
                data: err.response?.data,
            };
        }
    }

}

export default AuthRequest;
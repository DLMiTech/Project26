import axios from "axios";
import { jwtDecode } from "jwt-decode";
import URLService from "./URLService.jsx";

class AuthVerify {

    static BASE_URL = URLService.baseURL();


    static saveToken(token) {
        localStorage.setItem("ACCESS_TOKEN", token);
    }

    static getToken() {
        return localStorage.getItem("ACCESS_TOKEN");
    }


    static decodeToken() {
        const token = this.getToken();
        if (!token) return null;

        try {
            return jwtDecode(token);
        } catch (err) {
            console.error("Error decoding token:", err);
            return null;
        }
    }



    static userHasRoles(allowedRoles) {
        const decoded = this.decodeToken();
        if (!decoded?.data?.role) return false;

        return allowedRoles.includes(decoded.data.role);
    }


    static async isAuthorized() {
        const token = this.getToken();
        if (!token) return false;

        const decoded = this.decodeToken();

        if (!decoded) return false;

        const now = Math.floor(Date.now() / 1000);

        if (decoded.exp <= now) {

            return await this.refreshTokens();
        }

        return true;
    }



    static logout() {
        localStorage.removeItem("ACCESS_TOKEN");
    }


    static refreshTokens = async () => {

        try {
            const response = await axios.get(`${this.BASE_URL}/refreshToken.php?generateRefreshToken=${true}`, {
                headers: {
                    Authorization: `Bearer ${AuthVerify.getToken()}`,
                },
            });


            if (response.data.status === 200 && response.data.newToken) {
                this.saveToken(response.data.newToken);
                return true;
            } else {
                this.logout();
                return false;
            }

        } catch (error) {
            console.error("Error refreshing token:", error);
            this.logout();
            return false;
        }
    };


}

export default AuthVerify;
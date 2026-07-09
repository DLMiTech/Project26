import {jwtDecode} from "jwt-decode";
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
        if (!decoded?.role) return false;

        return allowedRoles.includes(decoded.role);
    }


    static async isAuthorized() {
        const token = this.getToken();
        if (!token) return false;

        return this.decodeToken();
    }

    static logout() {
        localStorage.removeItem("ACCESS_TOKEN");
    }

}

export default AuthVerify;
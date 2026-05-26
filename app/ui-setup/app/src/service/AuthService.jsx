import jwtDecode from "jwt-decode";

class AuthService {
    
    static logout() {
        localStorage.removeItem("ACCESS_TOKEN");
        localStorage.removeItem("REFRESH_TOKEN");
    }


    static saveToken(token, tokenName) {
        localStorage.setItem(tokenName, token);
    }

    static getToken() {
        return localStorage.getItem("ACCESS_TOKEN");
    }

    static decodeToken() {
        try {
            return jwtDecode(this.getToken());
        } catch (err) {
            console.error("Error decoding token:", err);
            return null;
        }
    }


    static userHasRoles(allowedRoles) {
        const token = this.getToken();
        if (!token || !this.isAuthorized()) return false;

        const decoded = this.decodeToken();
        return allowedRoles.includes(decoded?.data?.role);
    }



    static async isAuthorized() {
        const token = this.getToken();
        if (!token) return false;

        return this.decodeToken();
    }



    static isLoggedIn = () => {
        const token = this.getToken();
        return !!token;
    }

    static getUserRole() {
        const decodedToken = this.decodeToken();
        return decodedToken?.data?.role || null;
    }

    static isLoggedInWithRoles(requiredRoles) {
        if (!this.isLoggedIn()) return false;
        const userRole = this.getUserRole();
        return requiredRoles.includes(userRole);
    }

}

export default AuthService;
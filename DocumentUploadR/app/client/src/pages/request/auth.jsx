import axios from "axios";

import URLService from "../service/URLService.jsx";
import AuthVerify from "../service/AuthVerify.jsx";

class AuthRequest {

    static BASE_URL = URLService.baseURL();

    static async postAuth(registerData) {
        // eslint-disable-next-line no-useless-catch
        try {
            const response = await axios.post(`${this.BASE_URL}/auth`, registerData);
            return response.data;

        } catch (err) {
            throw err;
        }
    }

    static async postAuthToken(payload) {
        // eslint-disable-next-line no-useless-catch
        try {
            if (await AuthVerify.isAuthorized()){
                const response = await axios.post(`${this.BASE_URL}/auth`, payload, {
                    headers: {
                        Authorization: `Bearer ${AuthVerify.getToken()}`,
                    },
                });
                return response.data;
            }
        } catch (err) {
            throw err;
        }
    }

}

export default AuthRequest;
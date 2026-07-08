import axios from "axios";

import URLService from "../service/URLService.jsx";
import AuthVerify from "../service/AuthVerify.jsx";
import AuthRequest from "./auth.jsx";

class CourseRequest {

    static BASE_URL = URLService.baseURL();

    static async getAll() {
        try {
            if (await AuthVerify.isAuthorized()){
                const response = await axios.get(`${this.BASE_URL}/courses`, {
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

export default CourseRequest;
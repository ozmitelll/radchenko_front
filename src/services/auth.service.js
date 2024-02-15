// src/services/auth.service.js

import axios from "axios";
import authHeader from './auth-header'

const API_URL = "http://localhost:8080/api/auth/";

class AuthService {
    login(username, password) {
        return axios
            .post(API_URL + "signin", {
                username,
                password
            })
            .then(response => {
                if (response.data.accessToken) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("user");
    }

    register(username, email, password) {
        return axios.post(API_URL + "signup", {
            username,
            email,
            password
        });
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    createExampleUser() {
        const exampleUser = {
            id: 1,
            username: 'exampleUser',
            email: 'exampleUser@example.com',
            accessToken: 'exampleAccessToken'
        };

        localStorage.setItem('user', JSON.stringify(exampleUser));
    }
}

export default new AuthService();
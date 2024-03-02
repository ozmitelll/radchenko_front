// src/services/auth.service.js

import axios from "axios";
import {jwtDecode} from "jwt-decode";
import Cookies from "universal-cookie";

const API_URL = "http://172.20.10.2:8000/auth";

class AuthService {
    constructor() {
        this.cookies = new Cookies();
    }
    login(username, password) {
        const requestBody = new URLSearchParams({
            'grant_type': '',
            'username': username,
            'password': password,
            'scope': '',
            'client_id': '',
            'client_secret': ''
        });

        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        return axios.post(API_URL+ '/token', requestBody.toString(), config)
            .then(response => {
                if (response.data.access_token) {
                    this.cookies.set("jwt", response.data.access_token, { path: '/' });
                    return response.status;
                }
            });
    }

    logout() {
        this.cookies.remove("jwt");
        localStorage.setItem('hasLoggedInBefore', 'false');
    }


    getCurrentUser() {
        const jwt = this.cookies.get('jwt');
        if (jwt) {
            const decodedJwt = jwtDecode(jwt);
            return {
                'name': decodedJwt.name,
                    'email': decodedJwt.email,
                    'is_admin': decodedJwt.is_admin,
                    'unit': decodedJwt.unit,
                    'username': decodedJwt.username
            } ;
        }
        return null;
    }

    getUnit(id){
        const config = {
            headers: {
                'Accept': 'application/json',
            }
        };

        return axios.get(API_URL + `/${id}/unit`, config)
            .then(response => {
                return response.data
            });

    }

}
const authServiceInstance = new AuthService();
export default authServiceInstance
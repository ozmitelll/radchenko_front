// src/services/auth.service.js

import axios from "axios";
import Cookies from "universal-cookie";

const API_URL = `http://172.20.10.2:8000/orders`;

class OrderService {
    constructor() {
        this.cookies = new Cookies();
    }

    getOrders(page, unit) {
        const jwt = this.cookies.get('jwt');
        if (unit == "") {
            const config = {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
                params: {
                    page: page,
                }
            };
            return axios.get(API_URL, config)
                .then(response => {
                    return response.data
                });
        } else {
            const config = {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
                params: {
                    page: page,
                    unit: unit
                }
            };
            return axios.get(API_URL, config)
                .then(response => {
                    return response.data
                });
        }
    }

    getSortedOrders(){
        const jwt = this.cookies.get('jwt');
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
        };
        return axios.post(API_URL + '/sorted', config)
            .then(response => {
                return response.data
            });
    }

    getOrder(id) {
        const jwt = this.cookies.get('jwt');
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
        };
        return axios.get(API_URL + `/${id}`, config)
            .then(response => {
                return response.data
            });
    }

    confirmOrder(id, date, price) {
        const jwt = this.cookies.get('jwt');
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },

        };
        const data = {
            status: true,
            total_cost: price,
            date: date
        }
        return axios.put(API_URL + `/${id}`, data, config)
            .then(response => {
                return response.data
            });
    }

    deleteOrder(id) {
        const jwt = this.cookies.get('jwt');
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
        };
        return axios.delete(API_URL + `/${id}`, config)
            .then(response => {
                return response.data
            });
    }


    create(data) {
        const jwt = this.cookies.get('jwt');
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${jwt}`
            }
        };
        return axios.post(API_URL + '/create', data, config)
            .then(response => {
                return response.data
            });
    }

    getMoneys() {
        const jwt = this.cookies.get('jwt');
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${jwt}`
            }
        };
        return axios.post(API_URL + '/money', config)
            .then(response => {
                return response.data
            });
    }


}

const OrderServiceInstance = new OrderService();
export default OrderServiceInstance
// src/services/auth.service.js

import axios from "axios";
import Cookies from "universal-cookie";

const API_URL = `http://172.20.10.2:8000/orders`;

class OrderService {
    constructor() {
        this.cookies = new Cookies();
    }
    getOrders(page,unit) {
        const jwt = this.cookies.get('jwt');
        if(unit == "") {
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
        }
        else{
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

    getOrdersByUnit(unit) {
        const jwt = this.cookies.get('jwt');
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            params:{
                unit:unit
            }
        };

        return axios.get(API_URL, config)
            .then(response => {
                return response.data
            });

    }



    create(data){
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


}
const OrderServiceInstance = new OrderService();
export default OrderServiceInstance
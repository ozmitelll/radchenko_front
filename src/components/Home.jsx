import { ToastContainer, toast } from 'react-toastify';
import {useEffect, useState} from "react";
import AuthService from "../services/auth.service";
import AnalyticsCard from "./AnalyticsCard";
import OrderService from "../services/order.service"; // Import your AnalyticsCard component

const Home = () => {
    const [orders, setOrders] = useState([])
    const [cash , setCash] = useState(0)
    useEffect(() => {
        const hasLoggedInBefore = localStorage.getItem('hasLoggedInBefore');
        let timeoutId;
        fetchOrders();
        if (hasLoggedInBefore === 'false') {
            timeoutId = setTimeout(() => {
                toast.success('Login successfully!');
                localStorage.setItem('hasLoggedInBefore', 'true');
            }, 100);
        }

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    const fetchOrders = async () => {
        try {
            const result = await OrderService.getSortedOrders();
            setOrders(result.orders);
            const moneys = await OrderService.getMoneys()
            setCash(moneys.moneys.toFixed(0));
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    return (
        <>
            <h1 className={'text-5xl text-white text-center pt-4'}>Статистика та аналітика</h1>
            <div className="flex flex-wrap mt-4">
                <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 p-4">
                    <AnalyticsCard title={'Усього підтверджено заявок'} data={orders.length}/>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 p-4">
                    <AnalyticsCard title={'Усього зароблено коштів'} data={cash + ' ₴'}/>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 p-4">
                    <AnalyticsCard title="Усього в процессі" data={orders.length/2}/>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 p-4">
                    <AnalyticsCard title="Успіх робіт" data={'94.3%'}/>
                </div>
            </div>
            <ToastContainer position={"bottom-left"} draggable={true}/>
        </>
    );
};

export default Home;

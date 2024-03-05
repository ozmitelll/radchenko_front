import {useEffect, useState} from "react";
import AuthService from "../services/auth.service";
import OrderService from "../services/order.service";
import {toast} from "react-toastify";
import {useHistory} from "react-router-dom";

const Queue = () => {
    const history = useHistory()
    const [orders, setOrders] = useState([])
    const [user, setUser] = useState(null)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchUnit, setSearchUnit] = useState("");
    const [historyNumber, setHistoryNumber] = useState("")

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);
        fetchOrders(currentPage);
    }, []);

    const fetchOrders = async (page) => {
        try {
            const result = await OrderService.getSortedOrders();
            setOrders(result.orders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const updateProgress = (order) => {
        if (order != null) {
            const timeOfStart = new Date(order.time_of_start);
            const timeOfEnd = new Date(order.time_of_end);
            const currentDate = new Date();

            const progress = ((currentDate - timeOfStart) / (timeOfEnd - timeOfStart)) * 100;
            return progress.toFixed(4);
        }
        return 0; // default progress if order is null
    };

    useEffect(() => {
        const intervalIds = orders.map((order) => {
            const intervalId = setInterval(() => {
                setOrders((prevOrders) => {
                    const updatedOrders = prevOrders.map((o) => {
                        if (o.id === order.id) {
                            return { ...o, progress: updateProgress(o) };
                        }
                        return o;
                    });
                    return updatedOrders;
                });
            }, 2000);
            return intervalId;
        });

        return () => {
            intervalIds.forEach(clearInterval);
        };
    }, [orders]);

    return(
        <>
            <h1 className={'text-5xl text-white text-center my-4'}>Черга</h1>
            <div className="relative overflow-x-auto shadow-md">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead
                        className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            №
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Номер заявки
                        </th>
                        <th scope="col" className="px-6 py-3">
                            № В/Ч
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Техніка
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Загальна вартість
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Статус
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Дата постановки
                        </th>
                        <th scope="col" className="px-6 py-3">Прогрес</th>
                        <th scope="col" className="px-6 py-3"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders && orders.map((order, index) => (
                        <tr key={index}
                            className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                            <td className="px-6 py-4">
                                {index + 1}
                            </td>
                            <td scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {order.number_order}
                            </td>
                            <td scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {order.unit}
                            </td>
                            <td className="px-6 py-4">
                                {order.technics.map((tech, index) => (
                                    <span key={index}>
                                        {tech.name}
                                        {index < order.technics.length - 1 && ', '}
                                    </span>
                                ))}
                            </td>
                            <td className="px-6 py-4">
                                {order.total_cost ? order.total_cost + ' грн.' : 'На оцінюванні'}
                            </td>
                            <td className="px-6 py-4">
                                {order.is_active ?
                                    <div className="flex items-center">
                                        <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>
                                        Активна
                                    </div> : <div className="flex items-center">
                                        <div className="h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div>
                                        В очікуванні
                                    </div>
                                }
                            </td>
                            <td className="px-6 py-4">
                                {new Date(order.time_of_execution).toISOString().slice(0, 19).replace("T", " ")}
                            </td>

                            <td>
                                <p className={"text-center"}>{order.progress}%</p>
                            </td>
                            <td>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Queue
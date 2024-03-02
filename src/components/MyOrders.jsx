import {ToastContainer} from "react-toastify";
import OrderService from '../services/order.service';
import {useEffect, useState} from "react";
import AuthService from "../services/auth.service";
import login from "./Login";

const MyOrders = () => {
    const [orders, setOrders] = useState([])
    const [user, setUser] = useState(null)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchUnit, setSearchUnit] = useState("");

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);
        fetchOrders(currentPage);
    }, []);

    const fetchOrders = async (page) => {
        try {
            const result = await OrderService.getOrders(page,searchUnit);
            const orderS = result.data
            setOrders(orderS);
            setTotalPages(result.totalPages);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const handlePageChange = async (page) => {
        await fetchOrders(page)
        setCurrentPage(page);

    };
    const handleSearchByUnit = async (e) =>{
        e.preventDefault();
        setCurrentPage(1)

        await fetchOrders(currentPage,searchUnit)
    }

    return (
        <div className={'bg-gray-50 dark:bg-gray-900'}>
            <div className={'flex items-center justify-between'}>
                <h1 className={'text-5xl text-white text-left my-4 pl-10'}>{user && user.is_admin ? "Усі заявки:" : 'Мої заявки:'}</h1>
                <form className="max-w-md w-1/2 pr-10">
                    <label htmlFor="default-search"
                           className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Пошук</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                      stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input type="search" id="default-search"
                               className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                               placeholder="Пошук по номеру частини..."
                               value={searchUnit}
                               onChange={(e) => setSearchUnit(e.target.value)}
                               required/>
                        <button onClick={(e)=>handleSearchByUnit(e)}
                                className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Пошук
                        </button>
                    </div>
                </form>
            </div>

            <div className="relative overflow-x-auto shadow-md">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                        <th scope="col" className="px-6 py-3"></th>
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

                            <td></td>
                            <td></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className={'flex justify-center items-center mt-4'}>
                    <nav aria-label="Page navigation example">
                        <ul className="inline-flex -space-x-px text-sm ">
                            <li>
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white rounded-l-2xl`}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                            </li>
                            {Array.from({length: totalPages}, (_, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => handlePageChange(index + 1)}
                                        className={`flex items-center justify-center px-3 h-8 leading-tight ${
                                            currentPage === index + 1
                                                ? "text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                                                : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                            <li>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white rounded-r-2xl`}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <ToastContainer position={"bottom-left"}/>
        </div>
    );
}

export default MyOrders
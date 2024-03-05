import {useEffect, useState} from "react";
import AuthService from "../services/auth.service";
import {useLocation} from "react-router-dom";

const Header = () => {
    const location = useLocation()
    const [user, setUser] = useState(null)
    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);
    }, []);

    const handleLogout = () => {
        AuthService.logout();
        setUser(null);
    };

    return (
        <header>
            <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <a href="/" className="flex items-center">
                        <span
                            className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Моніторинг та управління <br/>ремонтним процесом військової техніки</span>
                    </a>
                    <div className="flex items-center lg:order-2">
                        {user ? <a href="/login"
                                   onClick={handleLogout}
                                   className="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white">Вийти
                        </a> : <a href="/login"
                                  className="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white">Увійти</a>}
                    </div>
                    <div
                        className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
                        id="mobile-menu-2"
                    >
                        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            <li>
                                <a
                                    href="/"
                                    className={`block py-2 pr-4 pl-3 ${
                                        location.pathname === "/" ? "text-white" : "text-gray-500"
                                    } rounded lg:bg-transparent lg:p-0 dark:hover:bg-gray-700 hover:underline transition duration-300`}
                                    aria-current="page"
                                >
                                    Головна
                                </a>
                            </li>
                            <li>
                                {user && user.is_admin ? <a
                                    href="/orders"
                                    className={`block py-2 pr-4 pl-3 ${
                                        location.pathname === "/my-orders" ? "text-white" : "text-gray-500"
                                    } rounded lg:bg-transparent lg:p-0 dark:hover:bg-gray-700 hover:underline transition duration-300`}
                                >
                                    Заявки
                                </a> : <a
                                    href="/orders"
                                    className={`block py-2 pr-4 pl-3 ${
                                        location.pathname === "/my-orders" ? "text-white" : "text-gray-500"
                                    } rounded lg:bg-transparent lg:p-0 dark:hover:bg-gray-700 hover:underline transition duration-300`}
                                >
                                    Мої заявки
                                </a>}
                            </li>
                            <li>
                                <a
                                    href="/create-order"
                                    className={`block py-2 pr-4 pl-3 ${
                                        location.pathname === "/create-order" ? "text-white" : "text-gray-500"
                                    } rounded lg:bg-transparent lg:p-0 dark:hover:bg-gray-700 hover:underline transition duration-300`}
                                >
                                    Створити заявку
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/queue"
                                    className={`block py-2 pr-4 pl-3 ${
                                        location.pathname === "/queue" ? "text-white" : "text-gray-500"
                                    } rounded lg:bg-transparent lg:p-0 dark:hover:bg-gray-700 hover:underline transition duration-300`}
                                >
                                    Черга
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>)
}

export default Header
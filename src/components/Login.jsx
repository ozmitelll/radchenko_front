// src/components/Login.js

import React, {useEffect, useState} from 'react';
import AuthService from '../services/auth.service';
import {useHistory} from "react-router-dom";
import {ToastContainer, toast} from 'react-toastify';

const Login = () => {
    const history = useHistory()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
            history.push('/');
        }
    }, [history]);
    const handleLogin = async () => {
        try {
            const response = await AuthService.login(username, password);
            if (response === 200) {
                history.push('/')
                toast.success("Успішно авторизовано!");
                window.location.reload()
            } else {
                setError('Невірно введено логін або пароль!');
                toast.error("Невірно введено логін або пароль!");
            }
        } catch (error) {
            setError('Невірно введено логін або пароль!');
            toast.error("Невірно введено логін або пароль!");
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div
                    className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold text-center leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Увійти до системи
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label htmlFor="username"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Логін
                                </label>
                                <input type="text" name="username" id="username"
                                       value={username}
                                       onChange={(e) => setUsername(e.target.value)}
                                       className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       placeholder="Введіть ваш логін" required=""/>
                            </div>
                            <div>
                                <label htmlFor="password"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Пароль</label>
                                <input type="password" name="password" id="password" placeholder="••••••••"
                                       value={password}
                                       onChange={(e) => setPassword(e.target.value)}
                                       className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       required=""/>
                            </div>
                            <button type="submit"
                                    onClick={handleLogin}
                                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Увійти
                            </button>

                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer stacked style={{fontFamily: 'Poppins'}} position={"bottom-left"}  draggable={true}
            />
        </section>

    );
};

export default Login;

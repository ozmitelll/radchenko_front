import React, {useEffect, useState} from 'react';
import OrderService from '../services/order.service';
import {jwtDecode} from "jwt-decode";
import AuthService from "../services/auth.service";
import {toast, ToastContainer} from "react-toastify";

const DetailOrder = ({match}) => {
    const [orderDetails, setOrderDetails] = useState(null);
    const [techniques, setTechniques] = useState([]);
    const [editablePrice, setEditablePrice] = useState(false);
    const [process, setProcess] = useState(0)
    const [openTechniques, setOpenTechniques] = useState([]); // New state for managing open/closed state of each technique
    const [editableTimeOfEnd, setEditableTimeOfEnd] = useState(false);
    const [user, setUser] = useState(null)
    const toggleAccordion = (index) => {
        setOpenTechniques((prevOpenTechniques) => {
            const updatedOpenTechniques = [...prevOpenTechniques];
            updatedOpenTechniques[index] = !updatedOpenTechniques[index];
            return updatedOpenTechniques;
        });
    };


    useEffect(() => {
        setUser(AuthService.getCurrentUser())
        fetchOrderDetails();

    }, [match.params.id]);

    useEffect(() => {
        updateProgress()
        const intervalId = setInterval(() => {
            updateProgress();
        }, 2000);

        return () => {
            clearInterval(intervalId);
        };
    }, [orderDetails]);

    const updateProgress = ()=>{
        if (orderDetails != null) {
            const timeOfStart = new Date(orderDetails.time_of_start);
            const timeOfEnd = new Date(orderDetails.time_of_end);
            const currentDate = new Date();

            const progress = ((currentDate - timeOfStart) / (timeOfEnd - timeOfStart)) * 100;
            setProcess(progress);
        }
    }


    const fetchOrderDetails = async () => {
        try {
            const result = await OrderService.getOrder(match.params.id);
            setOrderDetails(result['order']);
            setOpenTechniques(new Array(result['order'].technics.length).fill(false));
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };
    const handlePriceChange = (e) => {
        if (editablePrice) {
            setOrderDetails((prevOrderDetails) => ({
                ...prevOrderDetails,
                total_cost: e.target.value,
            }));
        }
        toast.success(`Ціна на заявку ${orderDetails.number_order} була успішно встановлена!`)
    };

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        const originalDate = new Date(selectedDate);

        // Add 2 hours to the date
        const newDate = new Date(originalDate.getTime() + 2 * 60 * 60 * 1000);

        // Format the new date as a string for input
        const formattedNewDate = newDate.toISOString().slice(0, 16); // Format to "yyyy-MM-ddTHH:mm"

        setOrderDetails((prevOrderDetails) => ({
            ...prevOrderDetails,
            time_of_end: formattedNewDate,
        }));
    }

    const handleConfirm = () => {
        toast.success(`Заявка ${orderDetails.number_order} була успішно підтверджена!`)
        OrderService.confirmOrder(orderDetails.id, orderDetails.time_of_end, orderDetails.total_cost)
        window.location.reload()
    }
    console.log(process)
    return (
        <div>
            {orderDetails ? <h2 className="text-5xl py-4 font-bold text-center text-gray-900 dark:text-white">Деталі про
                    зявку {orderDetails.number_order} </h2> :
                <h2 className="text-5xl text-center py-4 font-bold text-gray-900 dark:text-white">Прогрузка</h2>}
            {orderDetails && orderDetails.time_of_start && process > 0 ?
                <h2 className="text-3xl text-center py-4 font-bold text-gray-900 dark:text-white">Прогрес виконання : {process.toFixed(4)}%</h2> : <></>}
            {orderDetails ? <div className="p-4 w-full gap-8 h-full md:h-auto flex">
            <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5 h-1/2 w-1/2 ">
                    <div
                        className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Інформація зявки:
                        </h3>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Статус: {orderDetails.is_active ? <u>Активна</u> : <u>На очікуванні</u>}
                        </h3>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                        <div className="w-full">
                            <label htmlFor="number_order"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Номер
                                заяви</label>
                            <input type="text" name="number_order" id="number_order"
                                   value={orderDetails.number_order}
                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                   placeholder="" required="" disabled={true}/>
                        </div>
                        <div className="w-full">
                            <label htmlFor="unit"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Номер
                                В/Ч</label>
                            <input type="text" name="unit" id="unit"
                                   value={orderDetails.unit}
                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                   placeholder="" required="" disabled={true}/>
                        </div>
                        <div className="w-full">
                            <label htmlFor="price"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Загальна
                                вартість
                            </label>
                            <input
                                type="number"
                                name="price"
                                id="price"
                                value={editablePrice ? orderDetails.total_cost : orderDetails.total_cost}
                                onChange={handlePriceChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder=""
                                required=""
                                disabled={!editablePrice}
                            />
                            {!editablePrice && !orderDetails.is_active && (
                                <button
                                    onClick={() => setEditablePrice(true)}
                                    className="inline-flex items-center w-1/2 justify-center px-2.5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                                    Встановити ціну
                                </button>
                            )}
                        </div>


                        <div className="w-full">
                            <label htmlFor="price"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Орієнтовна
                                дата закінчення
                            </label>
                            <input
                                type="datetime-local"
                                name="time_of_end"
                                id="time_of_end"
                                defaultValue={orderDetails.time_of_end ? orderDetails.time_of_end.slice(0, -6) : ''}
                                onChange={handleDateChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder=""
                                required={true}
                                disabled={orderDetails.is_active}
                            />
                        </div>
                    </div>
                    {user && !orderDetails.is_active && user.is_admin ? (
                        <button
                            onClick={() => handleConfirm()}
                            className="inline-flex items-center float-right justify-center px-2.5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-700 rounded-lg focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900 hover:bg-green-800">
                            Підвердити заявку
                        </button>
                    ) : <></>}
                </div>


                <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5 w-1/2">

                    <div
                        className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Прикріплена техніка:
                        </h3>
                    </div>

                    {orderDetails.technics && orderDetails.technics.map((techniques, index) => (
                        <div key={index}>
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl my-2 text-left focus:ring-primary-600 focus:border-primary-600 flex items-start justify-between w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            >
                                {openTechniques[index] ? (
                                    <>
                                        |{index + 1}| - {techniques.name}
                                        <svg
                                            className="w-4 h-4 transform -translate-y transition-transform duration-300"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 15l7-7 7 7"
                                            ></path>
                                        </svg>
                                    </>
                                ) : (
                                    <>
                                        |{index + 1}| - {techniques.name}
                                        <svg
                                            className="w-4 h-4 transform translate-y- transition-transform duration-300"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 9l-7 7-7-7"
                                            ></path>
                                        </svg>
                                    </>
                                )}
                            </button>
                            <div
                                style={{
                                    maxHeight: openTechniques[index] ? '500px' : '0',
                                    transition: 'max-height 0.3s ease-in-out',
                                    overflow: 'hidden',
                                }}
                            >
                                {openTechniques[index] && (
                                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 rounded-b-2xl">
                                        <div className="sm:col-span-2">
                                            <label
                                                htmlFor={`name-${index}`}
                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                Назва техніки
                                            </label>
                                            <input
                                                type="text"
                                                name={`name-${index}`}
                                                id={`name-${index}`}
                                                value={techniques.name}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                placeholder="Введіть назву техніки (прикл. Ноутбук, Синтезатор частот)"
                                                required=""
                                            />
                                        </div>
                                        <div className="w-full">
                                            <label
                                                htmlFor={`brand-${index}`}
                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                Виробник
                                            </label>
                                            <input
                                                type="text"
                                                name={`brand-${index}`}
                                                id={`brand-${index}`}
                                                value={techniques.brand}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                placeholder="Виробник (бренд)"
                                                required=""
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor={`category-${index}`}
                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                Категорія
                                            </label>
                                            <select
                                                id={`category-${index}`}
                                                value={techniques.category}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            >
                                                <option selected="">Оберіть категорію</option>
                                                <option value="ТВ/Монітори">ТВ/Монітори</option>
                                                <option value="ПК">ПК</option>
                                                <option value="Генератори">Генератори</option>
                                                <option value="Консолі/Кабелі">Консолі/Кабелі</option>
                                                <option value="Автомобіль/Вантажівка">Автомобіль/Вантажівка</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label
                                                htmlFor={`item-weight-${index}`}
                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                Вага (кг)
                                            </label>
                                            <input
                                                type="number"
                                                name={`item-weight-${index}`}
                                                id={`item-weight-${index}`}
                                                value={techniques.itemWeight}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                placeholder="0"
                                                required=""
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label
                                                htmlFor={`description-${index}`}
                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                Детальний опис
                                            </label>
                                            <textarea
                                                id={`description-${index}`}
                                                rows="8"
                                                value={techniques.description}
                                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                placeholder="Ваш детальний опис"
                                            ></textarea>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>


                    ))}
                </div>
            </div> : <></>}
            <ToastContainer position={"bottom-left"} draggable={true} stacked/>
        </div>
    );
};

export default DetailOrder;

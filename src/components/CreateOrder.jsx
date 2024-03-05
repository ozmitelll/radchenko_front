import {useState} from "react";
import {ToastContainer,toast} from "react-toastify";
import OrderService from "../services/order.service";
import AuthService from "../services/auth.service";
import {useHistory} from "react-router-dom";

const CreateOrder = () => {
    const history = useHistory()
    const [techniques, setTechniques] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        category: '',
        itemWeight: '',
        description: '',
    });

    const handleCreateOrder =  async () => {
        const data = {
            "number_order": "",
            "technics": techniques,
            "total_cost": 0,
            "is_active": false,
            "unit": AuthService.getCurrentUser().unit,
            "time_of_execution": Date.now()
        }
        await OrderService.create(data)
        history.push('/orders');
    }
    const handleAddTechnique = () => {
        setShowForm(true);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();

        if (
            formData.name.trim() === '' ||
            formData.brand.trim() === '' ||
            formData.category.trim() === '' ||
            formData.itemWeight.trim() === ''
        ) {
            toast.warning("Будь ласка, заповніть всі обов'язкові поля");
            return;
        }

        setTechniques([...techniques, formData]);

        setFormData({
            name: '',
            brand: '',
            category: '',
            itemWeight: '',
            description: '',
        });

        setShowForm(false);

        toast.success(`Техніка ${formData.name} - успішно додана до списку`);
    };
    const handleDeleteTechnique = (index, name) => {
        const updatedTechniques = [...techniques];
        updatedTechniques.splice(index, 1);
        setTechniques(updatedTechniques);
        toast.info(`Техніка ${name} - видалена зі списку`);
    };

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="py-4 px-4 mx-auto max-w-2xl lg:py-8">
                <div className={'flex justify-center items-center gap-10'}>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Створити заявку на ремонт</h2>
                    {showForm ? <></> : <button
                        onClick={handleAddTechnique}
                        className="inline-flex items-center px-5 py-2.5  text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                    >
                        Додати техніку
                    </button>}

                </div>
                {showForm && (<form onSubmit={handleFormSubmit}>
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                            <div className="sm:col-span-2">
                                <label htmlFor="name"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Назва
                                    техніки <span className="text-red-500">*</span></label>
                                <input type="text" name="name" id="name"
                                       value={formData.name}
                                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                       placeholder="Введіть назву техніки (прикл. Ноутбук, Синтезатор частот)"
                                       required=""/>
                            </div>
                            <div className="w-full">
                                <label htmlFor="brand"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Виробник <span
                                    className="text-red-500">*</span></label>
                                <input type="text" name="brand" id="brand"
                                       value={formData.brand}
                                       onChange={(e) => setFormData({...formData, brand: e.target.value})}
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                       placeholder="Виробник (бренд)" required=""/>
                            </div>
                            <div>
                                <label htmlFor="category"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Категорія <span
                                    className="text-red-500">*</span></label>
                                <select id="category"
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                    <option selected="">Оберіть категорію</option>
                                    <option value="ТВ/Монітори">ТВ/Монітори</option>
                                    <option value="ПК">ПК</option>
                                    <option value="Генератори">Генератори</option>
                                    <option value="Консолі/Кабелі">Консолі/Кабелі</option>
                                    <option value="Автомобіль/Вантажівка">Автомобіль/Вантажівка</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="item-weight"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Вага
                                    (кг) <span className="text-red-500">*</span></label>
                                <input type="number" name="item-weight" id="item-weight"
                                       value={formData.itemWeight}
                                       onChange={(e) => setFormData({...formData, itemWeight: e.target.value})}
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                       placeholder="0" required=""/>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="description"

                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Детальний
                                    опис</label>
                                <textarea id="description" rows="8"
                                          value={formData.description}
                                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                                          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                          placeholder="Ваш детальний опис"></textarea>
                            </div>
                        </div>
                        <button type="submit"
                                className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                            Додати до списку
                        </button>
                    </form>
                )}
                {techniques.length > 0 && (
                    <div className="relative overflow-x-auto shadow-md mt-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white my-2">Додані техніки:</h3>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead
                                className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    №
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Назва техніки
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Категорія
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Вага
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Дія
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {techniques.map((technique, index) => (
                                <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <td className="px-6 py-4">
                                        {index + 1}
                                    </td>
                                    <th scope="row"
                                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {technique.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {technique.category}
                                    </td>
                                    <td className="px-6 py-4">
                                        {technique.itemWeight}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleDeleteTechnique(index, technique.name)}
                                            className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer"
                                        >
                                            Видалити
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <button
                            onClick={handleCreateOrder}
                            className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-500 rounded-lg focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900 hover:bg-green-800">
                            Подати заявку
                        </button>
                    </div>
                )}

            </div>
            <ToastContainer position={"bottom-left"} draggable={true}/>
        </section>
    )
}

export default CreateOrder
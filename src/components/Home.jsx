import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from "react";
import AuthService from "../services/auth.service";

const Home = () => {

    useEffect(() => {
        const hasLoggedInBefore = localStorage.getItem('hasLoggedInBefore');
        let timeoutId;

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

    return (
        <>
            <h1 className={'text-5xl'}>Home</h1>
            <ToastContainer position={"bottom-left"} />
        </>
    );
};

export default Home;

import React from 'react';

const AnalyticsCard = ({ title, data, bg_color }) => {
    return (
        <div className='bg-gray-600 p-4 rounded-lg shadow-md h-[250px]'>
            <div className="flex items-center justify-center h-5/6">
                <p className={'text-9xl text-white'}>{data}</p>
            </div>
            <h2 className="text-lg text-white font-bold mb-2 text-center">{title}</h2>

        </div>
    );
};

export default AnalyticsCard;

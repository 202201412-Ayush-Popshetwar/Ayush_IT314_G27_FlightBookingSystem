import React from 'react';

const RecommendList = () => {
    const recommendations = [
        { logo: '/img/logo/spiceJet.png', route: 'AMD to BOM', price: 'INR 3500' },
        { logo: '/img/logo/vistara.png', route: 'AMD to BOM', price: 'INR 3600' },
        { logo: '/img/logo/indigo.png', route: 'AMD to BOM', price: 'INR 3700' },
        { logo: '/img/logo/airIndia.png', route: 'AMD to BOM', price: 'INR 3800' },
        { logo: '/img/logo/GoFirst.png', route: 'AMD to BOM', price: 'INR 3750' },
    ];

    return (
        <div className="flex flex-col items-center mt-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Recommended Flights</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-screen-xl w-full px-4">
                {recommendations.map((item, index) => (
                    <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
                        <img src={item.logo} alt="" className="w-full h-40 object-contain" />
                        <div className="p-4">
                            <h2 className="text-lg font-semibold text-gray-800">{item.route}</h2>
                            <h3 className="text-md text-gray-600">{item.price}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecommendList;
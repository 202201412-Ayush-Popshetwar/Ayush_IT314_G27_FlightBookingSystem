import React from "react";
import { useNavigate } from "react-router-dom";

const Featured = () => {
    const navigate = useNavigate();

    const featuredRoutes = [
        { image: '/img/featured/BOM_DEL.jpg', title: 'Mumbai to Delhi' },
        { image: '/img/featured/BLR_DEL.jpg', title: 'BLR to DEL' },
        { image: '/img/featured/AMD_BOM.jpg', title: 'AMD to BOM' },
    ];

    const handleImageClick = (title) => {
        const [from, to] = title.split(' to ');
        const date = [{ startDate: new Date('2023-06-26'), endDate: new Date('2023-06-26'), key: 'selection' }];
        const options = { adult: 1, children: 0 };
        navigate('/search', { state: { from, to, date, options } });
    };

    return (
        <div className="flex flex-col items-center mt-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Featured Routes</h1>
            <div className="flex flex-wrap justify-center max-w-[1024px] mx-auto gap-5">
                {featuredRoutes.map((route, index) => (
                    <div
                        key={index}
                        className="flex-1 min-w-[300px] max-w-[30vw] h-[30vh] relative rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105"
                        onClick={() => handleImageClick(route.title)}
                    >
                        <img src={route.image} alt={route.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 left-5 text-white">
                            <h1 className="text-lg font-bold text-white">{route.title}</h1>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Featured;
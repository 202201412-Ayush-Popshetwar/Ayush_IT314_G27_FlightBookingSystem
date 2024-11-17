import React from "react";

const Featured = () => {
    const featuredRoutes = [
        { image: '/img/featured/BOM_DEL.jpg', title: 'BOM to DEL' },
        { image: '/img/featured/BLR_DEL.jpg', title: 'BLR to DEL' },
        { image: '/img/featured/AMD_BOM.jpg', title: 'AMD to BOM' },
    ];

    return (
        <div className="flex flex-col items-center mt-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Featured Routes</h1>
            <div className="flex flex-wrap justify-center max-w-[1024px] mx-auto gap-5">
                {featuredRoutes.map((route, index) => (
                    <div key={index} className="  flex-1 min-w-[300px] max-w-[30vw] h-[30vh] relative rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105">
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
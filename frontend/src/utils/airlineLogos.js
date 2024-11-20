const airlineLogos = {
    'SpiceJet': '/img/logo/spiceJet.png',
    'Vistara': '/img/logo/vistara.png',
    'Indigo': '/img/logo/indigo.png',
    'Air India': '/img/logo/airIndia.png',
    'Go First': '/img/logo/GoFirst.png',
    // Add more airlines as needed
};

export const getAirlineLogo = (airlineName) => {
    // Default fallback logo if airline not found
    const defaultLogo = '/img/logo/default-airline.png';
    
    // Try to match exact name first
    if (airlineLogos[airlineName]) {
        return airlineLogos[airlineName];
    }
    
    // Try case-insensitive match
    const lowercaseAirlineName = airlineName.toLowerCase();
    const match = Object.entries(airlineLogos).find(([key]) => 
        key.toLowerCase() === lowercaseAirlineName
    );
    
    return match ? match[1] : defaultLogo;
}; 
import { FlightTakeoff, FlightLand } from '@mui/icons-material';
import { getAirlineLogo } from '../utils/airlineLogos';
import { useNavigate } from 'react-router-dom';
import { handleError } from '../utils';

const SearchItem = ({ flight,loggedInUser, setLoggedInUser }) => {

    const navigate = useNavigate();
    const searchParams = JSON.parse(localStorage.getItem('searchParams'))
    const getNumericPrice = (priceString) => {
        return Number(priceString.replace(/,/g, ''));
    };
    const handleSelectFlight = () => {
        console.log(loggedInUser);
        if (!loggedInUser) {
            handleError('Please login to select flight');
            navigate('/login');
            return;
        }
        if (flight.availableseats <= 0) {
            handleError("This flight is fully booked!");
            return;
        }

        const totalPassengers = searchParams.options.adult + searchParams.options.children;
        const basePrice = getNumericPrice(flight.price) * totalPassengers;
        const bookingDetails = {
            flight: flight,
            basePrice: basePrice,
            totalPrice: basePrice,
            passengerCount: totalPassengers,
            date: searchParams.date
        };
        localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
        navigate('/booking');
    };

    const handleSelect = () => {
        if (flight.availableseats <= 0) {
            handleError("This flight is fully booked!");
            return;
        }
        handleSelectFlight();
    };

    return (
        <div className={`bg-white p-4 rounded-lg shadow-md ${flight.availableseats <= 0 ? 'opacity-75' : ''}`}>
            {/* Airline and Flight Number */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    {/* Airline Logo */}
                    <div className="w-16 h-16 flex items-center justify-center">
                        <img
                            src={getAirlineLogo(flight.airline)}
                            alt={`${flight.airline} logo`}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/img/logo/default-airline.png';
                            }}
                        />
                    </div>
                    <div>
                        <span className="text-lg font-semibold text-blue-600">{flight.airline}</span>
                        <p className="text-sm text-gray-500">Flight {flight.flight_num}</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-bold text-blue-600">₹{flight.price}</span>
                    <p className="text-sm text-gray-500">per person</p>
                </div>
            </div>

            {/* Flight Details */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4 md:gap-0">
                {/* Departure */}
                <div className="text-center">
                    <p className="text-xl font-bold">{flight.dep_time}</p>
                    <p className="text-sm text-gray-600">{flight.from}</p>
                </div>

                {/* Flight Duration - Updated Design */}
                <div className="flex flex-col items-center flex-1 px-4 min-w-[200px] md:min-w-[300px] lg:min-w-[400px]">
                    <p className="text-sm text-gray-500">{flight.duration}</p>
                    <div className="relative w-full">
                        <div className="w-full h-[2px] bg-blue-500 my-2"></div>
                        <div className="absolute w-full flex justify-between top-[-8px]">
                            <FlightTakeoff className="text-blue-500 transform -translate-x-1/2 -translate-y-1/2 " />
                            <FlightLand className="text-blue-500 transform translate-x-1/2 -translate-y-1/2" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500">
                        {flight.stops === "non-stop" ? "Non-stop" : `${flight.stops}`}
                    </p>
                </div>

                {/* Arrival */}
                <div className="text-center">
                    <p className="text-xl font-bold">{flight.arr_time}</p>
                    <p className="text-sm text-gray-600">{flight.to}</p>
                </div>
            </div>

            {/* Additional Info */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
                <div className="flex gap-4 text-sm text-gray-600">
                    <span className="capitalize">Class: {flight.class}</span>
                    <span>•</span>
                    <span>{flight.stops === "non-stop" ? "Direct Flight" : `${flight.stops}`}</span>
                </div>
                <button 
                    className={`px-4 py-2 rounded-md ${
                        flight.availableseats <= 0 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white transition`}
                    onClick={handleSelect}
                    disabled={flight.availableseats <= 0}
                >
                    {flight.availableseats <= 0 ? 'Fully Booked' : 'Select'}
                </button>
            </div>
        </div>
    );
};

export default SearchItem;
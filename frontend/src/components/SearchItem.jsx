import { FlightTakeoff, FlightLand, AccessTime } from '@mui/icons-material';

const SearchItem = () => {
    return (
        <div className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow">
            {/* Airline Info */}
            <div className="flex items-center gap-4 mb-4 pb-2 border-b">
                <img
                    src="https://example.com/airline-logo.png" // Replace with actual airline logo
                    alt="Airline Logo"
                    className="w-12 h-12 object-contain"
                />
                <span className="text-lg font-semibold">IndiGo Airlines</span>
            </div>

            {/* Flight Details */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {/* Time and Route Info */}
                <div className="flex-1 flex items-center gap-4">
                    {/* Departure */}
                    <div className="flex flex-col items-center">
                        <span className="text-xl font-bold">09:00</span>
                        <span className="text-sm text-gray-500">DEL</span>
                    </div>

                    {/* Flight Path */}
                    <div className="flex-1 flex flex-col items-center">
                        <div className="flex items-center w-full">
                            <FlightTakeoff className="text-blue-500" />
                            <div className="flex-1 h-[2px] bg-blue-500 mx-2"></div>
                            <FlightLand className="text-blue-500" />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <AccessTime fontSize="small" />
                            <span>2h 15m</span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">Direct</span>
                        </div>
                    </div>

                    {/* Arrival */}
                    <div className="flex flex-col items-center">
                        <span className="text-xl font-bold">11:15</span>
                        <span className="text-sm text-gray-500">BOM</span>
                    </div>
                </div>

                {/* Price and Booking */}
                <div className="w-full md:w-auto flex flex-col items-end gap-2">
                    <div className="flex flex-col items-end">
                        <span className="text-2xl font-bold text-blue-600">₹4,499</span>
                        <span className="text-sm text-gray-500">per person</span>
                    </div>
                    <button className="w-full md:w-auto bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors">
                        Select Flight
                    </button>
                </div>
            </div>

            {/* Flight Details */}
            <div className="mt-4 pt-4 border-t flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <span className="font-semibold">Flight No:</span>
                    <span>6E 2431</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold">Aircraft:</span>
                    <span>Airbus A320</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold">Class:</span>
                    <span>Economy</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold">Baggage:</span>
                    <span>15 kg</span>
                </div>
            </div>

            {/* Fare Features */}
            <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Free Meals</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Refundable</span>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Seat Selection</span>
            </div>
        </div>
    );
};

export default SearchItem;
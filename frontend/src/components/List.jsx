import React, { useEffect, useState, useRef } from 'react';
import Navbar from './Navbar.jsx';
import Header from './Header.jsx';
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "./SearchItem";
import Footer from './Footer.jsx';
import axios from "axios";
import {
    FlightTakeoff,
    FlightLand,
    CalendarToday,
    People,
    Search
} from '@mui/icons-material';
import { Pagination } from '@mui/material';
import { getApiUrl } from '../utils/config.js';

const List = ({ loggedInUser, setLoggedInUser }) => {

    const airports = [
        "Delhi",
        "Mumbai",
        "Kolkata",
        "Chennai",
        "Bangalore",
        "Hyderabad"
      ];

    const location = useLocation();
    const [from, setFrom] = useState(location.state.from);
    const [to, setTo] = useState(location.state.to);
    const [date, setDate] = useState(location.state.date);
    const [openDate, setOpenDate] = useState(false);
    const [openOptions, setOpenOptions] = useState(false);
    const [options, setOptions] = useState(location.state.options);
    const [flights, setFlights] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [flightsPerPage] = useState(10);
    const [sortByPrice, setSortByPrice] = useState('');
    const [sortByDuration, setSortByDuration] = useState('');
    const [selectedAirline, setSelectedAirline] = useState('');
    const [selectedStops, setSelectedStops] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const dateRef = useRef(null);
    const optionsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dateRef.current && !dateRef.current.contains(event.target)) {
                setOpenDate(false);
            }
            if (optionsRef.current && !optionsRef.current.contains(event.target)) {
                setOpenOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        fetchFlights();
    }, []);

    const handleOption = (name, operation) => {
        setOptions((prev) => ({
            ...prev,
            [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
        }));
    };
    localStorage.setItem('searchParams', JSON.stringify({
        from,
        to,
        date,
        options
      }));
    const fetchFlights = async () => {
        try {
            const start_date = format(date[0].startDate, 'dd-MM-yyyy');
            console.log('Search parameters:', { from, to, start_date });
            
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/search/flight`, {
                params: {
                    from,
                    to,
                    start_date,
                },
            });
            
            if (response.data.success) {
                setFlights(response.data.flights);
                console.log('Flights found:', response.data.flights);
            } else {
                console.log('No flights found');
                setFlights([]);
            }
        } catch (error) {
            console.error('Error fetching flights:', error);
            setFlights([]);
        }
    };

    const getUniqueAirlines = () => {
        return [...new Set(flights.map(flight => flight.airline))];
    };

    const getUniqueStops = () => {
        return [...new Set(flights.map(flight => flight.stops))];
    };
    const getUniqueClasses = () => {
        return [...new Set(flights.map(flight => flight.class))];
    };

    // Function to convert price string to number
    const priceToNumber = (priceStr) => {
        // Remove commas and convert to number
        return Number(priceStr.replace(/,/g, ''));
    };

    const durationToMinutes = (duration) => {
        const [hours, minutes] = duration.split(' ').map(part => parseInt(part));
        return (hours * 60) + minutes;
    };
    

    // Update the getSortedAndFilteredFlights function
    const getSortedAndFilteredFlights = () => {
        let processedFlights = [...flights];
        
        // Apply airline filter
        if (selectedAirline) {
            processedFlights = processedFlights.filter(flight => flight.airline === selectedAirline);
        }
        
        // Apply stops filter
        if (selectedStops) {
            processedFlights = processedFlights.filter(flight => flight.stops === selectedStops);
        }
        if (selectedClass) {
            processedFlights = processedFlights.filter(flight => flight.class === selectedClass)
        }
        
        // Apply duration sorting
        if (sortByDuration === 'duration_asc') {
            processedFlights.sort((a, b) => durationToMinutes(a.duration) - durationToMinutes(b.duration));
        } else if (sortByDuration === 'duration_desc') {
            processedFlights.sort((a, b) => durationToMinutes(b.duration) - durationToMinutes(a.duration));
        }
        
        // Apply price sorting
        if (sortByPrice === 'price_asc') {
            processedFlights.sort((a, b) => priceToNumber(a.price) - priceToNumber(b.price));
        } else if (sortByPrice === 'price_desc') {
            processedFlights.sort((a, b) => priceToNumber(b.price) - priceToNumber(a.price));
        }
        
        

        // Apply pagination
        const indexOfLastFlight = currentPage * flightsPerPage;
        const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
        return processedFlights.slice(indexOfFirstFlight, indexOfLastFlight);
    };

    const getTotalPages = () => {
        let filteredFlights = [...flights];
        if (selectedAirline) {
            filteredFlights = filteredFlights.filter(flight => flight.airline === selectedAirline);
        }
        return Math.ceil(filteredFlights.length / flightsPerPage);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [sortByPrice, selectedAirline]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div>
            <Navbar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
            <Header type="list" />
            <div className="flex justify-center px-4 mt-5">
                <div className="w-full max-w-7xl">
                    {/* Container for desktop layout */}
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Search Section - Will be at top in mobile, left side in desktop */}
                        <div className="w-full lg:w-80">
                            <div className="bg-[#003580] p-4 rounded-lg lg:sticky lg:top-5">
                                <h1 className="text-xl text-white font-semibold mb-4">Search</h1>

                                {/* From Field */}
                                <div className="mb-4">
                                <label className="block text-sm mb-2 text-white">From</label>
                                <div className="relative h-14">
                                    <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center">
                                    <FlightTakeoff className="text-gray-400" size={20} />
                                    </div>
                                    <select
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    className="text-black w-full h-full pl-12 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                    <option value="">Select Origin</option>
                                    {airports.map((airport) => (
                                        <option key={airport} value={airport}>
                                        {airport}
                                        </option>
                                    ))}
                                    </select>
                                </div>
                                </div>

                                {/* To Field */}
                                <div className="mb-4">
                                <label className="block text-sm mb-2 text-white">To</label>
                                <div className="relative h-14">
                                    <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center">
                                    <FlightLand className="text-gray-400" size={20} />
                                    </div>
                                    <select
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    className="text-black w-full h-full pl-12 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                    <option value="">Select Destination</option>
                                    {airports.map((airport) => (
                                        airport !== from && (
                                        <option key={airport} value={airport}>
                                            {airport}
                                        </option>
                                        )
                                    ))}
                                    </select>
                                </div>
                                </div>

                                {/* Date Field */}
                                <div className="mb-4" ref={dateRef}>
                                    <label className="block text-sm mb-2 text-white">Travel Dates</label>
                                    <div className="relative h-14">
                                        <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center">
                                            <CalendarToday className="text-gray-400" size={20} />
                                        </div>
                                        <button
                                            onClick={() => {
                                                setOpenDate(!openDate);
                                                setOpenOptions(false);
                                            }}
                                            className="w-full h-full pl-12 pr-4 text-left border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {`${format(date[0].startDate, "MM/dd/yyyy")} to ${format(date[0].endDate, "MM/dd/yyyy")}`}
                                        </button>
                                        {openDate && (
                                            <div className="absolute z-20 mt-1 ">
                                                <DateRange
                                                    editableDateInputs={true}
                                                    onChange={(item) => setDate([item.selection])}
                                                    moveRangeOnFirstSelection={false}
                                                    ranges={date}
                                                    minDate={new Date('2023-06-26')}
                                                    className="bg-white shadow-lg rounded-md"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Passengers Field */}
                                <div className="mb-4" ref={optionsRef}>
                                    <label className="block text-sm mb-2 text-white">Passengers</label>
                                    <div className="relative h-14">
                                        <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center">
                                            <People className="text-gray-400" size={20} />
                                        </div>
                                        <button
                                            onClick={() => setOpenOptions(!openOptions)}
                                            className="w-full h-full pl-12 pr-4 text-left border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {`${options.adult} adult${options.adult !== 1 ? 's' : ''}, ${options.children} ${options.children === 1 ? 'child' : 'children'}`}
                                        </button>
                                        {openOptions && (
                                            <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md p-4 z-20 w-64">
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-700">Adult</span>
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                disabled={options.adult <= 1}
                                                                className="w-8 h-8 border border-blue-500 rounded-md flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                                onClick={() => handleOption("adult", "d")}
                                                            >
                                                                -
                                                            </button>
                                                            <span className="w-8 text-center text-gray-700">{options.adult}</span>
                                                            <button
                                                                disabled={options.adult >= 10}
                                                                className="w-8 h-8 border border-blue-500 rounded-md flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                                onClick={() => handleOption("adult", "i")}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-700">Children</span>
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                disabled={options.children <= 0}
                                                                className="w-8 h-8 border border-blue-500 rounded-md flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                                onClick={() => handleOption("children", "d")}
                                                            >
                                                                -
                                                            </button>
                                                            <span className="w-8 text-center text-gray-700">{options.children}</span>
                                                            <button
                                                                disabled={options.children >= 10}
                                                                className="w-8 h-8 border border-blue-500 rounded-md flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                                onClick={() => handleOption("children", "i")}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button 
                                    className="w-full h-14 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition flex items-center justify-center space-x-2"
                                    onClick={fetchFlights}
                                >
                                    <Search className="text-white" size={20} />
                                    <span>Search</span>
                                </button>
                            </div>
                        </div>

                        {/* Sorting and Filtering Section */}
                        <div className="mt-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-600 mb-1">Sort by Price</label>
                                    <select
                                        value={sortByPrice}
                                        onChange={(e) => setSortByPrice(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Default</option>
                                        <option value="price_asc">Price: Low to High</option>
                                        <option value="price_desc">Price: High to Low</option>
                                    </select>
                                </div>    
                            </div>
                            <div className="flex-1">
                                    <label className="block text-sm text-gray-600 mb-1">Sort by Duration</label>
                                    <select
                                        value={sortByDuration}
                                        onChange={(e) => setSortByDuration(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Default</option>
                                        <option value="duration_asc">Lowest to Highest</option>
                                        <option value="duration_desc">Highest to Lowest</option>
                                    </select>
                                </div>   
                            <div className="flex-1">
                                    <label className="block text-sm text-gray-600 mb-1">Filter by Airline</label>
                                    <select
                                        value={selectedAirline}
                                        onChange={(e) => setSelectedAirline(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">All Airlines</option>
                                        {getUniqueAirlines().map((airline) => (
                                            <option key={airline} value={airline}>
                                                {airline}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            <div className="flex-1">
                                    <label className="block text-sm text-gray-600 mb-1">Filter by Stops</label>
                                    <select
                                        value={selectedStops}
                                        onChange={(e) => setSelectedStops(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All Stops</option>
                                        {getUniqueStops().map((stops) => (
                                            <option key={stops} value={stops}>
                                                {stops}
                                            </option>
                                            ))}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-600 mb-1">Filter by Class</label>
                                    <select
                                        value={selectedClass}
                                        onChange={(e) => setSelectedClass(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All Classes</option>
                                        {getUniqueClasses().map((flightClass) => (
                                            <option key={flightClass} value={flightClass}>
                                                {flightClass}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                        </div>

                        {/* Results Section */}
                        <div className="flex-1">
                            {flights.length > 0 ? (
                                <>
                                    <div className="space-y-4">
                                        {getSortedAndFilteredFlights().map((flight, index) => (
                                            <SearchItem key={index} flight={flight} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
                                        ))}
                                    </div>
                                    <div className="flex justify-center mt-6 mb-8">
                                        <Pagination 
                                            count={getTotalPages()}
                                            page={currentPage}
                                            onChange={handlePageChange}
                                            color="primary"
                                            size="large"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-40 flex items-center justify-center bg-white rounded-lg shadow">
                                    <h1 className="text-xl text-gray-500">No flights found</h1>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default List;
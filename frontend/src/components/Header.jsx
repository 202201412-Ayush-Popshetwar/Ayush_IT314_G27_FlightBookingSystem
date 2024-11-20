import { useEffect, useRef, useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format } from 'date-fns';
import { useNavigate } from "react-router-dom";
import {
  Search,
  HelpOutline,
  CheckCircle,
  FlightTakeoff,
  FlightLand,
  Stars,
  AirplanemodeActive,
  People,
  CalendarToday
} from '@mui/icons-material';

const Header = ({ type }) => {

  const airports = [
    "Delhi",
    "Mumbai",
    "Kolkata",
    "Chennai",
    "Bangalore",
    "Hyderabad"
  ];
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [openDate, setOpenDate] = useState(false);
  const [date, setDate] = useState([{
    startDate: new Date('2023-06-26'),
    endDate: new Date('2023-06-26'),
    key: "selection"
  }]);

  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0
  });

  const navigate = useNavigate();
  const dateRef = useRef(null);
  const containerRef = useRef(null);

  const handleOption = (name, operation) => {
    setOptions((prev) => ({
      ...prev,
      [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
    }));
  };

  const handleSearch = async () => {
    // Basic validation
    if (!from || !to) {
      alert("Please enter both origin and destination cities");
      return;
    }

    // Format the date as required by the backend (dd-MM-yyyy)
    const formattedDate = format(date[0].startDate, 'dd-MM-yyyy');
    
    // Store search parameters in localStorage for List component
    localStorage.setItem('searchParams', JSON.stringify({
      from,
      to,
      date,
      options
    }));

    // Navigate to flights page with search parameters
    navigate("/flights", {
      state: {
        from,
        to,
        date,
        options
      }
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        dateRef.current &&
        !dateRef.current.contains(event.target)
      ) {
        setOpenDate(false);
        setOpenOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderSearchForm = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white">
          Fly Smart – Find Cheap and Comfortable Flights for Every Journey!
        </h1>
        <p className="text-white">
          Enjoy affordable fares, earn rewards on every booking - Unlock instant savings of 10% with a Free SkyLynx Account
        </p>
      </div>

      <div className="border-2 border-white-400 rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* From Field */}
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

          {/* To Field */}
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

          {/* Date Field */}
          <div ref={dateRef} className="relative h-14">
        <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center">
            <CalendarToday className="text-gray-400" size={20} />
        </div>
        <button
            onClick={() => {
            setOpenDate(!openDate);
            }}
            className="w-full h-full pl-12 pr-4 text-left border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            {`${format(date[0].startDate, 'MM/dd/yyyy')} to ${format(date[0].endDate, 'MM/dd/yyyy')}`}
        </button>
        {openDate && (
            <div className="absolute top-full left-0 z-20 mt-1">
            <DateRange
                editableDateInputs={true}
                onChange={(item) => setDate([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={date}
                className="bg-white shadow-lg rounded-md"
            />
            </div>
        )}
        </div>

          {/* Passengers Field */}
          <div className="relative h-14">
            <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center">
              <People className="text-gray-400" size={20} />
            </div>
            <button
              onClick={() => {
                setOpenOptions(!openOptions);
                setOpenDate(false);
              }}
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

        {/* Search Button */}
        <button onClick={handleSearch} className="w-full h-14 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition flex items-center justify-center space-x-2">
        <Search className="text-white" size={20} />
            <span className="text-white">Search</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative bg-[#003580] text-white py-8 shadow-lg" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="flex items-center justify-center sm:justify-start h-14 cursor-pointer rounded-lg border border-white p-2 hover:bg-white/10 transition" onClick={() => navigate("/")}>
            <AirplanemodeActive className="text-white" size={20} />
            <span className="ml-2 text-white">Flights</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start h-14 cursor-pointer rounded-lg border border-white p-2 hover:bg-white/10 transition">
            <CheckCircle className="text-white" size={20} />
            <span className="ml-2 text-white">Check-In</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start h-14 cursor-pointer rounded-lg border border-white p-2 hover:bg-white/10 transition" onClick={() => navigate("/faq")}>
            <HelpOutline className="text-white" size={20} />
            <span className="ml-2 text-white">FAQ</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start h-14 cursor-pointer rounded-lg border border-white p-2 hover:bg-white/10 transition" onClick={() => navigate("/rewards")}>
            <Stars className="text-white" size={20} />
            <span className="ml-2 text-white">Rewards</span>
          </div>
        </div>
        {type !== "list" && renderSearchForm()}
      </div>
    </div>
  );
};

export default Header;
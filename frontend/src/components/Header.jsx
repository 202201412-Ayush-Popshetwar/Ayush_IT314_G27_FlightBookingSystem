import "./index.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faMagnifyingGlass, faPlane, faPlaneArrival, faPlaneCircleCheck, faPlaneDeparture, faUserGroup, faWebAwesome } from "@fortawesome/free-solid-svg-icons";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { DateRange } from 'react-date-range';
import { useState } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";


const Header = ({type}) => {
    const [openDate, setOpenDate] = useState(false);
    const navigate = useNavigate();
    const [date, setDate] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);

    const [openOptions, setOpenOptions] = useState(false);
    const [options, setOptions] = useState({
        adult: 1,
        children: 0,
    });


    const handleOption = (name, operation) => {
        setOptions((prev) => {
            return {
                ...prev,
                [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
            }
        });
    };

    const handleSearch = () => {
        navigate("/booking",{
            state: {
                from,
                to,
                date,
                options,
            },
        });
    };

    return (
        <div className="header">
            <div className={type==="list"? "headerContainer listMode":"headerContainer"}>
                <div className="headerList">
                    <div className="headerListItem active">
                        <FontAwesomeIcon icon={faPlane} />
                        <span>Flights</span>
                    </div>
                    <div className="headerListItem">
                        <FontAwesomeIcon icon={faPlaneCircleCheck} />
                        <span>Check-In</span>
                    </div>
                    <div className="headerListItem">
                        <FontAwesomeIcon icon={faCircleQuestion} />
                        <button onClick={()=>{
                            navigate("/faq")
                        }}>FAQ</button>
                    </div>
                    <div className="headerListItem">
                        <FontAwesomeIcon icon={faWebAwesome} />
                        <span>Rewards</span>
                    </div>
                </div>
                {type!=="list" &&
                <>    
                <h1 className="headerTitle">Fly Smart – Find Cheap and Comfortable Flights for Every Journey!</h1>
                <p className="headerDesc">Enjoy affordable fares, earn rewards on every booking - Unlock instant savings of 10% with a Free SkyLynx Account</p>
                
                <div className="headerSearch">
                    <div onClick={()=>{setOpenOptions(false);setOpenDate(false)}} className="headerSearchItem">
                        <FontAwesomeIcon icon={faPlaneDeparture} className="headerIcon" />
                        <input
                            type="text"
                            placeholder="From"
                            className="headerSearchInput"
                        />
                    </div>
                    <div onClick={()=>{setOpenOptions(false);setOpenDate(false)}} className="headerSearchItem">
                        <FontAwesomeIcon icon={faPlaneArrival} className="headerIcon" />
                        <input
                            type="text"
                            placeholder="To"
                            className="headerSearchInput"
                        />
                    </div>
                    <div className="headerSearchItem">
                        <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                        <span onClick={() => {setOpenDate(!openDate);setOpenOptions(false)}} className="headerSearchText">{`${format(date[0].startDate, "MM/dd/yyyy")} to ${format(date[0].endDate, "MM/dd/yyyy")}`}</span>
                        {openDate && <DateRange
                            editableDataInputs={true}
                            onChange={(item) => setDate([item.selection])}
                            moveRangeOnFirstSelection={false}
                            ranges={date}
                            className="date"
                        />}
                    </div>
                    <div className="headerSearchItem">
                        <FontAwesomeIcon icon={faUserGroup} className="headerIcon" />
                        <span onClick={()=>{setOpenOptions(!openOptions);setOpenDate(false)}}className="headerSearchText">{`${options.adult} adult ${options.children} children`}</span>
                        {openOptions && <div className="options">
                            <div className="optionItem">
                                <span className="optionText">Adult</span>
                                <button
                                    disabled={options.adult <= 1}
                                    className="optionCounterButton" onClick={() => handleOption("adult", "d")}>-</button>
                                <span className="optionCounterNumber">{options.adult}</span>
                                <button
                                    disabled={options.adult >= 10}
                                    className="optionCounterButton" onClick={() => handleOption("adult", "i")}>+</button>
                            </div>
                            <div className="optionItem">
                                <span className="optionText">Children</span>
                                <button
                                    disabled={options.children <= 0}
                                    className="optionCounterButton" onClick={() => handleOption("children", "d")}>-</button>
                                <span className="optionCounterNumber">{options.children}</span>
                                <button
                                    disabled={options.children >= 10}
                                    className="optionCounterButton" onClick={() => handleOption("children", "i")}>+</button>
                            </div>
                        </div>
                        }
                    </div>
                    <div className="headerSearchItem">
                        <button className="headerBtn">
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="searchIcon" />
                            Search
                        </button>
                    </div>
                </div>
                </>}
            </div>
        </div>
    )
}

export default Header;
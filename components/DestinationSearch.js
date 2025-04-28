// import LoadingBubble from "@/components/LoadingBubble";
// import {useState, useEffect, useRef} from "react";
// import {useSelector} from "react-redux";
// import {store} from "@/app/store";
// import {RxCross2} from "react-icons/rx";
// import axios from "axios";
// import {getAmadeusToken, getAirportResults} from "../util/amadeus";

let currState = 0;
let currIndex = -1;
let currLength = 0;

export function fixFormatting(name) {
    let words = name.split(" ");
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0] + words[i].substring(1).toLowerCase();
    }
    return words.join(" ");
}


export function fixFormattingWithSlash(name) {
    let words = name.split(" ");
    for (let i = 0; i < words.length; i++) {
        if (words[i].includes('/')) {
            let parts = words[i].split('/');
            for (let j = 0; j < parts.length; j++) {
                parts[j] = parts[j][0].toUpperCase() + parts[j].substring(1).toLowerCase();
            }
            words[i] = parts.join('/');
        } else {
            words[i] = words[i][0].toUpperCase() + words[i].substring(1).toLowerCase();
        }
    }
    return words.join(" ");
}

// function selectAirport(location, iata, setChosenAirport, number) {
//     store.dispatch({
//         type: "state/setAirport",
//         payload: {iata: iata, name: location},
//     });
//     setChosenAirport(`${location}`);
//     document.getElementById(`airportOptions${number}`).style.display = "none";
// }

// function useOutsideAlerter(ref) {
//     useEffect(() => {
//         function handleClickOutside(event) {
//             if (ref.current && !ref.current.parentNode.contains(event.target)) {
//                 ref.current.style.display = "none";
//             }
//         }
//
//         document.addEventListener("click", handleClickOutside);
//         return () => {
//             document.removeEventListener("click", handleClickOutside);
//         };
//     }, [ref]);
// }

// function findAirports(e, setAirports, setChosenAirport, token, number) {
//     currState++;
//     const leState = currState;
//     document.getElementById(`airportOptions${number}`).style.display = "block";
//     setTimeout(() => {
//         if (leState == currState && e.target.value.length > 0) {
//             getAirportResults(e.target.value, token).then((info) => {
//                 if (info[1] == 200) {
//                     info[0].then((body) => {
//                         const airports = body.data != undefined ? body.data : [];
//                         let renderedAirports = [];
//                         for (let i = 0; i < airports.length; i++) {
//                             if (airports[i].iataCode == "ORD" || airports[i].iataCode == "IND") {
//                                 continue;
//                             }
//                             let displayName = fixFormatting(airports[i].address.cityName);
//                             if (airports[i].address.stateCode == undefined) {
//                                 displayName += ", " + airports[i].address.countryCode;
//                             } else {
//                                 displayName += ", " + airports[i].address.stateCode;
//                             }
//                             if (airports[i].iataCode == "EWR") {
//                                 displayName = "Newark, NJ";
//                             }
//                             renderedAirports.push(
//                                 <div
//                                     key={i}
//                                     id={i}
//                                     className={`flex justify-between items-center text-black p-2 mx-3 hover:cursor-pointer hover:font-bold ${
//                                         i != 0 ? "border-t" : ""
//                                     }`}
//                                     onClick={() =>
//                                         selectAirport(
//                                             displayName,
//                                             airports[i].iataCode,
//                                             setChosenAirport,
//                                             number
//                                         )
//                                     }
//                                 >
//                                     <div className="flex-grow">{airports[i].iataCode}</div>
//                                     <div className="opacity-40">{displayName}</div>
//                                 </div>
//                             );
//                         }
//                         if (renderedAirports.length == 0) {
//                             renderedAirports.push(
//                                 <div
//                                     key={0}
//                                     className="flex justify-center items-center text-black p-1"
//                                 >
//                                     No results found...
//                                 </div>
//                             );
//                         }
//                         if (leState == currState) {
//                             setAirports(renderedAirports);
//                         }
//                         currLength = renderedAirports.length;
//                     });
//                 } else {
//                     setAirports([
//                         <div key={0} className="flex justify-center items-center text-black p-1">
//                             Please try the search again later.
//                         </div>,
//                     ]);
//                     currLength = 0;
//                 }
//                 currIndex = -1;
//             });
//         }
//     }, 200);
// }

// function inputHandler(e, setChosenAirport, number) {
//     if (document.getElementById(`first${number}`) == null) {
//         return;
//     }
//     if (
//         document.getElementById(`first${number}`).getAttribute("is-active") == "true" ||
//         document.getElementById(`first${number}`).getAttribute("is-active") == "on"
//     ) {
//         const child = document.getElementById(`airportOptions${number}`).children[0];
//         if (
//             child != undefined &&
//             child.getAttribute("id") != null &&
//             (e.key == "ArrowUp" || e.key == "ArrowDown")
//         ) {
//             e.preventDefault();
//             if (document.getElementById(`${currIndex}`) != null) {
//                 document.getElementById(`${currIndex}`).style.fontWeight = "normal";
//             }
//             if (e.key == "ArrowDown") {
//                 if (currIndex + 1 < currLength) {
//                     currIndex++;
//                 }
//             } else {
//                 if (currIndex - 1 > -1) {
//                     currIndex--;
//                 }
//             }
//             if (document.getElementById(`${currIndex}`) != null) {
//                 document.getElementById(`${currIndex}`).style.fontWeight = "bold";
//             }
//         }
//         if (e.key == "Enter" && currIndex != -1) {
//             const item = document.getElementById(`${currIndex}`).children;
//             selectAirport(item[1].innerHTML, item[0].innerHTML, setChosenAirport, number);
//         }
//     }
// }


// export default function DestinationSearch({number}) {
//     const [token, setToken] = useState("");
//     const [airports, setAirports] = useState([]);
//     const tripOption = useSelector((state) => state.state.tripOption);
//     const wrapperRef = useRef(null);
//     const airportVal = useSelector((state) => state.state.airport);
//     const [chosenAirport, setChosenAirport] = useState(
//         useSelector((state) => state.state.airportFull)
//     );
//
//     useOutsideAlerter(wrapperRef);
//
//
//     useEffect(() => {
//         getAmadeusToken().then((json) => {
//             setToken(json.access_token);
//         });
//
//         const fetchUserData = async () => {
//             try {
//                 const response = await axios.post("/api/users/account", {
//                     withCredentials: true,
//                 });
//                 const user = response.data.user;
//                 if (user && user.airport) {
//                     setChosenAirport(user.airport.name);
//                     store.dispatch({
//                         type: "state/setAirport",
//                         payload: {iata: user.airport.iata, name: user.airport.name},
//                     });
//                 }
//             } catch (error) {
//                 // console.error("Error fetching user data:", error);
//             }
//         };
//
//         fetchUserData();
//
//         document.addEventListener("keydown", (e) => {
//             inputHandler(e, setChosenAirport, number);
//         });
//         document.addEventListener("click", (e) => {
//             const input = e.target;
//             if (input.id == `first${number}`) {
//                 if (input.getAttribute("is-active") !== "true") {
//                     input.setAttribute("is-active", "true");
//                 }
//             } else {
//                 const inputBox = document.getElementById(`first${number}`);
//                 if (inputBox != null && inputBox != undefined) {
//                     if (inputBox.getAttribute("is-active") === "true") {
//                         inputBox.setAttribute("is-active", "false");
//                     } else if (inputBox.getAttribute("is-active") === "on") {
//                         inputBox.setAttribute("is-active", "true");
//                     }
//                 }
//             }
//         });
//     }, []);
//     return (
//         <div className="relative w-full text-lg h-16">
//             {chosenAirport == "" ? (
//                 <input
//                     type="text"
//                     id={`first${number}`}
//                     name={`first${number}`}
//                     onKeyDown={(e) => {
//                         if (e.key == "Enter") {
//                             e.preventDefault();
//                         }
//                     }}
//                     className={`${
//                         tripOption == -1
//                             ? "bg-gray-100 border hover:cursor-default"
//                             : "bg-white border-2 focus:border-theme"
//                     } rounded-lg outline-none w-full p-3 h-full transition duration-200`}
//                     placeholder={
//                         tripOption != -1
//                             ? tripOption % 2
//                                 ? "Origin/Home"
//                                 : "Destination/Home"
//                             : "No trip option selected"
//                     }
//                     onClick={(e) => {
//                         if (tripOption == -1) {
//                             e.currentTarget.blur();
//                         }
//                     }}
//                     onChange={(e) => {
//                         if (e.target.value.length == 0) {
//                             setAirports([]);
//                             return;
//                         }
//                         setAirports([<LoadingBubble className="size-8" key={0}/>]);
//                         findAirports(e, setAirports, setChosenAirport, token, number);
//                     }}
//                     autoComplete="off"
//                 />
//             ) : (
//                 <div className="border rounded-lg w-full p-1 h-full text-base" id="test">
//                     <div className="w-full h-full flex justify-between items-center bg-gray-100 rounded-md p-3">
//                         <div className="text-clip w-[80%]">
//                             {airportVal + " - " + chosenAirport}
//                         </div>
//                         <div className="h-full flex justify-center items-center">
//                             <RxCross2
//                                 className="hover:cursor-pointer text-red-500"
//                                 size={25}
//                                 onClick={() => {
//                                     setChosenAirport("");
//                                     setAirports([]);
//                                     store.dispatch({
//                                         type: "state/setAirport",
//                                         payload: {iata: "", name: ""},
//                                     });
//                                     store.dispatch({
//                                         type: "state/resetLatest",
//                                     });
//                                 }}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             )}
//
//             <div
//                 ref={wrapperRef}
//                 id={`airportOptions${number}`}
//                 className={`absolute rounded-lg appearance-none w-full text-base top-full bg-white left-0 z-50${
//                     airports.length != 0 ? " shadow border" : ""
//                 }`}
//             >
//                 {airports}
//             </div>
//         </div>
//     );
// }

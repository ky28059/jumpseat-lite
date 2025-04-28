"use client";

import { FC, memo, useEffect, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { mapStyle, mapStyleDark } from "./MapStyle";
import { Direction } from "@prisma/client";

import "./Map.css";


type MapProps = {
    center: google.maps.LatLngLiteral,
    flightPlanCoordinates: google.maps.LatLngLiteral[][],
    direction?: Direction,
    theme: string | undefined
};

const Map: FC<MapProps> = (props) => {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: "AIzaSyCQpn22SpB96Z_kNYnuiUD9L-NszkIImB4",
    });

    const [isDarkMode, setIsDarkMode] = useState(props.theme === "dark");

    const mapRef = useRef<google.maps.Map | null>(null);
    const polylineRef = useRef<google.maps.Polyline[]>([]);

    const onLoad = (map: google.maps.Map) => {
        mapRef.current = map;
        updatePolyLines();
    };

    const fitBounds = (map: google.maps.Map) => {
        if (!props.flightPlanCoordinates.length) return;

        const bounds = new google.maps.LatLngBounds();
        props.flightPlanCoordinates.forEach((path) => {
            path.forEach((coord) => {
                bounds.extend({ lat: coord.lat, lng: coord.lng });
            });
        });
        map.fitBounds(bounds);
    };

    const planeSvgPath =
        "M22 16.21v-1.895L14 8V4a2 2 0 0 0-4 0v4.105L2 14.42v1.789l8-2.81V18l-3 2v2l5-2 5 2v-2l-3-2v-4.685l8 2.895z";

    function updatePolyLines() {
        if (!mapRef.current) return;

        // Clear any existing polylines
        if (polylineRef.current.length > 0) {
            polylineRef.current.forEach((polyline) => polyline.setMap(null));
        }

        if (props.flightPlanCoordinates.length > 0) {
            // Store the new polylines in the ref
            polylineRef.current = props.flightPlanCoordinates.map((path) => {
                const newPolyline = new google.maps.Polyline({
                    path,
                    geodesic: true,
                    strokeColor: "#3c83f6",
                    strokeWeight: 3,
                    icons: [{
                        icon: {
                            path: planeSvgPath,
                            fillColor: isDarkMode ? "#ffffff" : "#000000",
                            fillOpacity: 1,
                            strokeWeight: 0, // No outline
                            scale: 1, // Adjust size if necessary
                            anchor: new google.maps.Point(11, 16),
                            rotation: props.direction === "fromSchool" ? 0 : 180,
                        },
                        offset: "50%",
                    }],
                });

                newPolyline.setMap(mapRef.current);
                return newPolyline;
            });

            // Fit map bounds to the new polylines
            fitBounds(mapRef.current);
        } else {
            // If there are no flight paths, clear the reference
            polylineRef.current = [];
        }
    }

    useEffect(updatePolyLines, [props.flightPlanCoordinates, isDarkMode, props.direction, mapRef.current]);

    useEffect(() => {
        const handleThemeChange = () => {
            setIsDarkMode(document.documentElement.classList.contains("dark"));
        };
        window.addEventListener("themeChange", handleThemeChange);

        return () => window.removeEventListener("themeChange", handleThemeChange);
    }, []);

    return isLoaded ? (
        <div className="bg-gray-300 h-full w-full min-h-[100px]">
            <GoogleMap
                id="map"
                mapContainerStyle={{ width: "100%", height: "100%", minHeight: "100px" }}
                center={props.center}
                zoom={14}
                onLoad={onLoad}
                options={{
                    streetViewControl: false,
                    fullscreenControl: false,
                    mapTypeControl: false,
                    styles: isDarkMode ? mapStyleDark : mapStyle,
                    clickableIcons: false,
                    zoomControl: false,
                    minZoom: 2
                }}
            />
        </div>
    ) : null;
};

export default memo(Map);

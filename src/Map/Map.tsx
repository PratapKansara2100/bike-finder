import { useEffect, useState } from 'react';
import {
    GoogleMap,
    // Marker,
    // DirectionsRenderer,
    // Circle,
    // MarkerClusterer,
} from '@react-google-maps/api';
// import Places from './places';
// import Distance from './distance';
import './Map.css';
type LatLngLiteral = google.maps.LatLngLiteral;
// type DirectionsResult = google.maps.DirectionsResult;
// type MapOptions = google.maps.MapOptions;

// so that user's location is auto detected, but not working as geolocation is asynchronous
// function getUserCoordinate(): LatLngLiteral {
//     let curCoords: LatLngLiteral = { lat: 49.248077, lng: -123.041301 };
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition((position) => {
//             curCoords = { lat: position.coords.latitude, lng: position.coords.longitude };
//             console.log(position);
//         });
//     }
//     return curCoords;
// }

function Map() {
    const [latLng, setlatLng] = useState({ lat: 49.248077, lng: -123.041301 });
    useEffect(() => {
        (function getUserCoordinate(): LatLngLiteral {
            let curCoords: LatLngLiteral = { lat: 49.248077, lng: -123.041301 };
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    setlatLng({ lat: position.coords.latitude, lng: position.coords.longitude });
                });
            }
            return curCoords;
        })();
    }, []);

    // const latLang = useMemo((): LatLngLiteral => {
    //     return getUserCoordinate();
    // }, []);
    // const latLng = useMemo((): LatLngLiteral => ({ lat: 49.248077, lng: -123.041301 }), []);
    console.log(latLng);
    return (
        <div className="container">
            <GoogleMap zoom={10} center={latLng} mapContainerClassName="map-actual"></GoogleMap>
        </div>
    );
}

// const defaultOptions = {
//     strokeOpacity: 0.5,
//     strokeWeight: 2,
//     clickable: false,
//     draggable: false,
//     editable: false,
//     visible: true,
// };
// const closeOptions = {
//     ...defaultOptions,
//     zIndex: 3,
//     fillOpacity: 0.05,
//     strokeColor: '#8BC34A',
//     fillColor: '#8BC34A',
// };
// const middleOptions = {
//     ...defaultOptions,
//     zIndex: 2,
//     fillOpacity: 0.05,
//     strokeColor: '#FBC02D',
//     fillColor: '#FBC02D',
// };
// const farOptions = {
//     ...defaultOptions,
//     zIndex: 1,
//     fillOpacity: 0.05,
//     strokeColor: '#FF5252',
//     fillColor: '#FF5252',
// };

// const generateHouses = (position: LatLngLiteral) => {
//     const _houses: Array<LatLngLiteral> = [];
//     for (let i = 0; i < 100; i++) {
//         const direction = Math.random() < 0.5 ? -2 : 2;
//         _houses.push({
//             lat: position.lat + Math.random() / direction,
//             lng: position.lng + Math.random() / direction,
//         });
//     }
//     return _houses;
// };
export default Map;

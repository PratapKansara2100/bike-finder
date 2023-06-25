import { useMemo } from 'react';
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

let curCoords: LatLngLiteral = { lat: 0, lng: 0 };
function getUserCoordinate(): LatLngLiteral {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            curCoords = { lat: position.coords.latitude, lng: position.coords.longitude };
            console.log(position);
        });
    } else curCoords = { lat: 49.248077, lng: -123.041301 };
    return curCoords;
}

function Map() {
    const latLang = useMemo((): LatLngLiteral => {
        return getUserCoordinate();
    }, []);
    console.log(latLang);

    return (
        <div className="container">
            <div>
                <GoogleMap zoom={10} center={latLang}></GoogleMap>
            </div>
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

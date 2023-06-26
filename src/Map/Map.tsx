import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import {
    GoogleMap,
    Marker,
    DirectionsRenderer,
    Circle,
    MarkerClusterer,
    InfoBox,
} from '@react-google-maps/api';
import Places from './Places';
// import Distance from './distance';
import './Map.css';
import MapContainer from './MapContainer';

type LatLngLiteral = google.maps.LatLngLiteral;
// type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

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
const citiesBC: string[] = ['Abbotsford', 'Burnaby', 'Vanocouver', 'Richmond', 'Victoria'];
function Map() {
    const mapRef = useRef<GoogleMap>();
    const [latLng, setlatLng] = useState<LatLngLiteral>({ lat: 49.248077, lng: -123.041301 });
    const [userLocation, setUserLocation] = useState<LatLngLiteral>();
    const mapOptions = useMemo<MapOptions>(() => {
        return { disableDefaultUI: true, clickableIcons: false, mapId: 'a4e414a0f398b366' };
    }, []);
    useEffect(() => {
        (function getUserCoordinate(): void {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    setlatLng({ lat: position.coords.latitude, lng: position.coords.longitude });
                });
            }
        })();
    }, []);
    const onLoad = useCallback((map: any) => (mapRef.current = map), []);
    // prettier-ignore

    return (
        <>
            <form>
                <label>Your location: </label>
                <span>
                    <Places setLocation={(position: LatLngLiteral):void => {
                        setUserLocation(position);
                        mapRef.current?.panTo(position);
                        }}></Places>
                    
                    <span className="description"> City: </span>
                    <select className="dropdown" name="cities">
                        <option value="around you">Around you</option>
                        {citiesBC.length &&
                            citiesBC.map((city) => <option value={city}>{city}</option>)}
                    </select>
                </span>
            </form>
            <br />
            <MapContainer>
                <div className="container">
                    <GoogleMap
                        zoom={9}
                        center={latLng}
                        mapContainerClassName="map-actual"
                        options={mapOptions}
                        onLoad={onLoad}
                    ></GoogleMap>
                </div>
            </MapContainer>
        </>
    );
}

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

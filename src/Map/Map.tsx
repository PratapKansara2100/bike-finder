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
import './Map.scss';
import MapContainer from './MapContainer';

type LatLngLiteral = google.maps.LatLngLiteral;
// type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;
type storesData = {
    name: string;
    area: string;
    address: string;
    onlineStore: boolean;
    url: string;
};
//prettier-ignore
const data1 = [{'name': 'Alien E-bikes & Scooters Ltd.', 'area': 'Surrey', 'address': '#3 9530 189 St.', 'onlineStore': 'Yes', 'url': 'https://alienebikesandscooters.com'}, {'name': 'Aline Sports', 'area': 'Richmond', 'address': '11211 Birdgeport Rd 101', 'onlineStore': 'Yes', 'url': 'https://alinesport.com'}, {'name': 'All Battery Duncan ltd', 'area': 'Victoria', 'address': '5311 Trans Canada Highway', 'onlineStore': 'Yes', 'url': 'https://allbatterypowered.com'}, {'name': 'Alter Ego Bikes', 'area': 'Abbotsford', 'address': '106-30799 Simpson Road', 'onlineStore': 'Yes', 'url': 'https://alteregobikes.com'}, {'name': 'Amped Rides', 'area': 'Courtenay', 'address': '1235 Malahat Drive', 'onlineStore': 'Yes', 'url': 'https://amped-rides.com'}, {'name': 'AR Cycles', 'area': 'Mayne Island', 'address': '309 Wood Dale Dr', 'onlineStore': 'Yes', 'url': 'https://ARCycles.ca'}, {'name': 'Armada Trading Ltd.', 'area': 'Surrey', 'address': '13890 104Th Ave', 'onlineStore': 'Yes', 'url': 'https://armadascooters.com'}, {'name': 'Arrowsmith Mtn Cycle Ltd', 'area': 'Parksville', 'address': '674 East Island Highway', 'onlineStore': 'Yes', 'url': 'https://arrowsmithbikes.com'}];

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
const data: storesData[] = JSON.parse(JSON.stringify(data1));

function Map() {
    const mapRef = useRef<GoogleMap>();
    const [userCity, setUserCity] = useState<string>('Vancouver');
    const [displayAllStore, setDisplayAllStore] = useState<boolean>(false);
    const [userLocation, setUserLocation] = useState<LatLngLiteral>({
        lat: 49.248077,
        lng: -123.041301,
    });
    const mapOptions = useMemo<MapOptions>(() => {
        return { disableDefaultUI: true, clickableIcons: false, mapId: 'a4e414a0f398b366' }; //
    }, []);
    useEffect(() => {
        //getting the user coordinates if they exist
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
                getCity({ lat: position.coords.latitude, lng: position.coords.longitude });
            });
        }
    }, []);
    const onLoad = useCallback((map: any) => (mapRef.current = map), []);
    const toggleDisplayAllStore = (): void => {
        setDisplayAllStore(!displayAllStore);
    };

    async function getCity(coords: LatLngLiteral) {
        const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${
                coords.lng
            }&result_type=locality&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY!}`
        );
        const address = await res.json();
        setUserCity(address.results[0].address_components[0].long_name);
    }
    // prettier-ignore
    return (
        <>
            <form>
                <label>Your location: </label>
                <span >
                    <Places setcity={getCity} setLocation={(position: LatLngLiteral):void => {
                        setUserLocation(position);
                        mapRef.current?.panTo(position);
                        }}></Places>
                    
                    <span className="description"> City: </span>
                    <select className="dropdown" name="cities">
                        <option value="around you">Around you</option>
                        {citiesBC.length &&
                            citiesBC.map((city, i) => <option key={i} value={city}>{city}</option>)}
                    </select>
                    <span className="description"> Show all stores:  </span>
                    <input type="checkbox" className='checkboxx' onClick={toggleDisplayAllStore}/>
                </span>
            </form>
            <br />
            <MapContainer>
                <div className="container">
                    <GoogleMap
                        zoom={10}
                        center={userLocation}
                        mapContainerClassName="map-actual"
                        options={mapOptions}
                        onLoad={onLoad}
                    >
                        <Marker position={userLocation} icon='../UI/pin.png'></Marker>
                    </GoogleMap>
                </div>
            </MapContainer>
        </>
    );
}
// if userCity !== cities in bc list, then show a warning to users that they should select a location that is in bc.

// const generateHouses = (position: LatLngLiteral) => {
// if userCity !== cities in bc list, then show a warning to users that they should select a location that is in bc.
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

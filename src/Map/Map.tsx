import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import {
    GoogleMap,
    InfoWindowF,
    MarkerClusterer,
    MarkerF,
    DirectionsRenderer,
} from '@react-google-maps/api';
import Places from './Places';
import MapContainer from './MapContainer';
import './Map.scss';
import Bottom from '../Bottom/Bottom';
import bikeStorIcon from '../UI/bikeStore.png';

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;
type storesData = {
    name: string;
    area: string;
    address: string;
    onlineStore: string;
    url: string;
    coordinates: LatLngLiteral;
};
type storesDataNoCoords = {
    name: string;
    area: string;
    address: string;
    onlineStore: string;
    url: string;
    coordinates: null | undefined | LatLngLiteral;
};

type myError = {
    isError: boolean;
    value: string;
};
const data2: storesDataNoCoords[] = [
    {
        name: 'Alien E-bikes & Scooters Ltd.',
        area: 'Surrey',
        address: '3 9530 189 St.',
        onlineStore: 'Yes',
        url: 'https://alienebikesandscooters.com',
        coordinates: null,
    },
    {
        name: 'Aline Sports',
        area: 'Richmond',
        address: '11211 Birdgeport Rd 101',
        onlineStore: 'Yes',
        url: 'https://alinesport.com',
        coordinates: null,
    },
];

const data1: storesData[] = [
    {
        name: 'Alien E-bikes & Scooters Ltd.',
        area: 'Surrey',
        address: '3 9530 189 St.',
        onlineStore: 'Yes',
        url: 'https://alienebikesandscooters.com',
        coordinates: { lat: 49.1758709, lng: -122.6984493 },
    },
    {
        name: 'Aline Sports',
        area: 'Richmond',
        address: '11211 Birdgeport Rd 101',
        onlineStore: 'Yes',
        url: 'https://alinesport.com',
        coordinates: { lat: 49.19226310000001, lng: -123.0998919 },
    },
    {
        name: 'All Battery Duncan ltd',
        area: 'Victoria',
        address: '5311 Trans Canada Highway',
        onlineStore: 'Yes',
        url: 'https://allbatterypowered.com',
        coordinates: { lat: 48.7652679, lng: -123.6951755 },
    },
    {
        name: 'Alter Ego Bikes',
        area: 'Abbotsford',
        address: '106-30799 Simpson Road',
        onlineStore: 'Yes',
        url: 'https://alteregobikes.com',
        coordinates: { lat: 49.04637719999999, lng: -122.3704345 },
    },
    {
        name: 'Amped Rides',
        area: 'Courtenay',
        address: '1235 Malahat Drive',
        onlineStore: 'Yes',
        url: 'https://amped-rides.com',
        coordinates: { lat: 49.7019712, lng: -124.9654311 },
    },
    {
        name: 'AR Cycles',
        area: 'Mayne Island',
        address: '309 Wood Dale Dr',
        onlineStore: 'Yes',
        url: 'https://ARCycles.ca',
        coordinates: { lat: 48.8438501, lng: -123.3138204 },
    },
    {
        name: 'Armada Trading Ltd.',
        area: 'Surrey',
        address: '13890 104Th Ave',
        onlineStore: 'Yes',
        url: 'https://armadascooters.com',
        coordinates: { lat: 49.1910401, lng: -122.8371717 },
    },
    {
        name: 'Biktrix Enterprises Inc.',
        area: 'Vancouver',
        address: '2865 W Broadway',
        onlineStore: 'Yes',
        url: 'https://biktrix.ca',
        coordinates: { lat: 49.2642926, lng: -123.1696224 },
    },
];

const citiesBC: string[] = [
    'Abbotsford',
    'Burnaby',
    'Vancouver',
    'Richmond',
    'Victoria',
    'Surrey',
    'Washington',
];
const data: storesData[] = JSON.parse(JSON.stringify(data1));

function Map() {
    const mapRef = useRef<GoogleMap>();
    const [userCity, setUserCity] = useState<string>('Vancouver');
    const [displayAllStore, setDisplayAllStore] = useState<boolean>(false);
    const [userLocation, setUserLocation] = useState<LatLngLiteral>({
        lat: 49.248077,
        lng: -123.041301,
    });
    const [selectedMarker, setSelectedMarker] = useState<storesData>();
    const [directions, setDirections] = useState<DirectionsResult>();
    const [enhancedStores, setEnhancedStores] = useState<storesData[]>([...data1]);

    // no error in when the app starts
    let cityErrorState = useMemo<myError>(() => {
        return { isError: false, value: '' };
    }, []);

    const mapOptions = useMemo<MapOptions>(() => {
        return { disableDefaultUI: true, clickableIcons: false, mapId: 'a4e414a0f398b366' }; //
    }, []);

    useEffect(() => {
        //getting the user coordinates if they exist, setting the userLocation and city from the coordinates if they exist
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
                getCity({ lat: position.coords.latitude, lng: position.coords.longitude });
            });
        }
    }, []);

    // setting the city for the coordinates that are passed, gets city as using locality for result type in url, userCity is null, so get's error on page
    const getCity = async (coords: LatLngLiteral) => {
        try {
            cityErrorState.isError = false;
            const res = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${
                    coords.lng
                }&result_type=locality&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY!}`
            );
            const address = await res.json();
            setUserCity(address.results[0].address_components[0].long_name);
        } catch (e) {
            setUserCity('');
        }
    };

    if (!citiesBC.includes(userCity)) {
        cityErrorState.isError = true;
        cityErrorState.value =
            'Bike stores are only visible on the map in cities available in the City Dropdown above';
    }

    // changing the data according to the checkbox
    useEffect(() => {
        if (!displayAllStore) {
            setEnhancedStores(generateStoresInCity(userCity));
        } else setEnhancedStores(generateAllStores());
    }, [userCity, displayAllStore]);

    // handeling the checkbox change
    const toggleDisplayAllStore = (): void => {
        setDisplayAllStore(!displayAllStore);
    };

    // setting a reference to map onLoad, helps with panning
    const onLoad = useCallback((map: any) => (mapRef.current = map), []);

    const fetchDirections = (storeLocation: LatLngLiteral) => {
        if (!userLocation) return;
        // crating a new instance of direction service
        const service = new google.maps.DirectionsService();
        service.route(
            {
                origin: userLocation,
                destination: storeLocation,
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, stat) => {
                if (stat === 'OK' && result) {
                    setDirections(result);
                }
            }
        );
    };

    return (
        <>
            <form>
                <label>Your location: </label>
                <span>
                    <Places
                        setcity={getCity}
                        setLocation={(position: LatLngLiteral): void => {
                            setUserLocation(position);
                            mapRef.current?.panTo(position);
                        }}
                    ></Places>
                    <span className="description"> City: </span>
                    <select className="dropdown" name="cities">
                        <option value="around you">Around you</option>
                        {citiesBC.length &&
                            citiesBC.map((city, i) => (
                                <option key={i} value={city}>
                                    {city}
                                </option>
                            ))}
                    </select>
                    <span className="description"> Show all stores: </span>
                    <input type="checkbox" className="checkboxx" onClick={toggleDisplayAllStore} />
                </span>
            </form>
            <br />
            {cityErrorState.isError && <span className="error">{cityErrorState.value}</span>}
            <MapContainer>
                <div className="container">
                    <GoogleMap
                        zoom={10}
                        center={userLocation}
                        mapContainerClassName="map-actual"
                        options={mapOptions}
                        onLoad={onLoad}
                    >
                        {directions && (
                            <DirectionsRenderer directions={directions}></DirectionsRenderer>
                        )}
                        <MarkerF position={userLocation} />
                        {/* if no city error then (if no display All store then no cluster, just markerf. if display store then clustering with enhanced store as thart) */}
                        {!displayAllStore ? (
                            enhancedStores.map((store, i) => {
                                return (
                                    <MarkerF
                                        key={i}
                                        icon={bikeStorIcon}
                                        position={store.coordinates}
                                        onClick={() => {
                                            setSelectedMarker(store);
                                            setDirections(undefined);
                                        }}
                                    />
                                );
                            })
                        ) : (
                            <MarkerClusterer>
                                {(clusturer) => (
                                    <>
                                        {enhancedStores.map((store, i) => (
                                            <MarkerF
                                                key={i}
                                                position={store.coordinates}
                                                clusterer={clusturer}
                                                icon={bikeStorIcon}
                                                onClick={() => {
                                                    setSelectedMarker(store);
                                                    setDirections(undefined);
                                                }}
                                            />
                                        ))}
                                    </>
                                )}
                            </MarkerClusterer>
                        )}
                        {selectedMarker && (
                            <InfoWindowF
                                position={selectedMarker.coordinates}
                                onCloseClick={() => {
                                    setSelectedMarker(undefined);
                                    setDirections(undefined);
                                }}
                                options={{
                                    pixelOffset: new window.google.maps.Size(0, -20),
                                }}
                            >
                                <div className="info-box">
                                    <h2>{selectedMarker.name}</h2>
                                    <div>
                                        Adderss: {selectedMarker.address} <br />
                                        Online Store: {selectedMarker.onlineStore}
                                        <br />
                                        link: <a href={selectedMarker.url}>
                                            {selectedMarker.url}
                                        </a>{' '}
                                        <br />
                                        {directions
                                            ? 'Travel time: ' +
                                                  directions.routes[0].legs[0].duration?.text ||
                                              'Unknown'
                                            : ''}
                                    </div>
                                    <br />
                                    <button
                                        onClick={() => {
                                            fetchDirections(selectedMarker.coordinates);
                                        }}
                                    >
                                        get directions
                                    </button>
                                </div>
                            </InfoWindowF>
                        )}
                    </GoogleMap>
                </div>
            </MapContainer>
            <Bottom data={data2}></Bottom>
        </>
    );
}

const generateAllStores = (): storesData[] => {
    return data;
};

// }
const generateStoresInCity = (city: string): storesData[] => {
    const newData: storesData[] = data.filter((store) => store.area === city);
    return newData;
};
export default Map;

import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import {
    GoogleMap,
    InfoWindowF,
    MarkerClustererF,
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
    coordinates: null | undefined | LatLngLiteral | string;
};

type myError = {
    isError: boolean;
    value: string;
};

function getJson(url: string) {
    return fetch(url)
        .then((response) => response.json())
        .catch((error) => {
            console.error(error);
        });
}

const data1: storesData[] = [
    {
        name: 'Biktrix Enterprises Inc.',
        area: 'Vancouver',
        address: '2865 W Broadway',
        onlineStore: 'Yes',
        url: 'https://biktrix.ca',
        coordinates: { lat: 49.2642926, lng: -123.1696224 },
    },
];
const data2: storesDataNoCoords[] = [
    {
        name: '-',
        area: '-',
        address: '-',
        onlineStore: '-',
        url: '-',
        coordinates: '-',
    },
];

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
    const [storesNotOnMap, setStoresNotOnMap] = useState<storesDataNoCoords[]>([...data2]);
    const [allCities, setAllCities] = useState<string[]>(['Vancouver']);
    const [directionErrorState, setDirectionErrorState] = useState<boolean>(false);

    // no error in when the app starts
    let cityErrorState = useMemo<myError>(() => {
        return { isError: false, value: '' };
    }, []);

    const mapOptions = useMemo<MapOptions>(() => {
        return { disableDefaultUI: true, clickableIcons: false, mapId: 'a4e414a0f398b366' }; //
    }, []);

    // fetching data
    useEffect(() => {
        const promises = [
            getJson('https://bike-fnder-app-bucket.s3.us-west-1.amazonaws.com/allCities.json'),
            getJson('https://bike-fnder-app-bucket.s3.us-west-1.amazonaws.com/dataNoCoords.json'),
            getJson('https://bike-fnder-app-bucket.s3.us-west-1.amazonaws.com/dataWithCoords.json'),
        ];
        Promise.all(promises)
            .then((responses) => {
                // Handle the resolved responses
                responses.forEach((response, i) => {
                    if (i === 0) setAllCities(response);
                    if (i === 1) setStoresNotOnMap(response);
                    // if (i === 2) setEnhancedStores(response);
                });
                setUserCity('Vancouver');
            })
            .catch((error) => {
                // Handle errors, if any of the requests fail
                console.error(error);
            });
        setDisplayAllStore(true);
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

    if (!allCities.includes(userCity)) {
        cityErrorState.isError = true;
        cityErrorState.value =
            'Bike stores are only visible on the map in cities available in the City Dropdown above';
    }

    // handeling the checkbox change

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
                } else setDirectionErrorState(true);
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
                        {allCities &&
                            allCities.map((city, i) => (
                                <option key={i} value={city}>
                                    {city}
                                </option>
                            ))}
                    </select>
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
                            <MarkerClustererF>
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
                            </MarkerClustererF>
                        )}
                        {selectedMarker && (
                            <InfoWindowF
                                position={selectedMarker.coordinates}
                                onCloseClick={() => {
                                    setSelectedMarker(undefined);
                                    setDirections(undefined);
                                    setDirectionErrorState(false);
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
                                        style={{ backgroundColor: '#0377fc' }}
                                        onClick={() => {
                                            fetchDirections(selectedMarker.coordinates);
                                        }}
                                    >
                                        get directions
                                    </button>
                                    {directionErrorState ? (
                                        <div style={{ color: 'red' }}>
                                            unable to get direction: google maps api error
                                        </div>
                                    ) : (
                                        <br />
                                    )}
                                    <div>
                                        For stores showing outside of BC, check details manually
                                        (Technical-Error)*
                                    </div>
                                </div>
                            </InfoWindowF>
                        )}
                    </GoogleMap>
                </div>
            </MapContainer>
            <Bottom
                data={storesNotOnMap}
                number1={enhancedStores.length}
                number2={storesNotOnMap.length}
            ></Bottom>
        </>
    );
}

export default Map;

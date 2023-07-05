import React from 'react';
import './Bottom.css';
type storesDataNoCoords = {
    name: string;
    area: string;
    address: string;
    onlineStore: string;
    url: string;
    coordinates: null | undefined | LatLngLiteral;
};
type LatLngLiteral = google.maps.LatLngLiteral;

type BottomProps = {
    data: storesDataNoCoords[];
};

const Bottom = ({ data }: BottomProps) => {
    return (
        <div className="section-3">
            <h2>List of cities not displaying on the map: </h2>
            <table>
                <tr style={{ height: '50px', color: 'blue' }}>
                    <th>Retailer Name</th>
                    <th>City</th>
                    <th>Address</th>
                    <th>Online Store</th>
                    <th>Website</th>
                </tr>

                {data.map((store) => (
                    <tr style={{ height: '35px' }}>
                        <th>{store.name}</th>
                        <th>{store.area}</th>
                        <th>{store.address}</th>
                        <th>{store.onlineStore}</th>
                        <th>{store.url}</th>
                    </tr>
                ))}
            </table>
            <h2>Other Links:</h2>
            BC Rebate Program Official website:
            <a href="https://bcebikerebates.ca/"> bcebikerebates.ca </a>
            <br />
            How To:
            <a href="https://bcebikerebates.ca/4easysteps/"> bcebikerebates.ca/4easysteps</a>
            <br />
            Conditions:
            <a href="https://bcebikerebates.ca/programpolicies/">
                {' '}
                bcebikerebates.ca/programpolicies
            </a>
            <br />
        </div>
    );
};

export default Bottom;

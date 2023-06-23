import React from 'react';
import Card from '../UI/Card';

type MapProps = {
    children?: React.ReactNode;
};

const Map = ({ children }: MapProps) => {
    return <Card>{children}</Card>;
};

export default Map;

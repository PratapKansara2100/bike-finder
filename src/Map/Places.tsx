import React from 'react';
import Input from '../UI/Input';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from '@reach/combobox';
// import '@reach/combobox/styles.css';

type PlacesProps = {
    setLocation: (position: google.maps.LatLngLiteral) => void;
};

const Places = ({ setLocation }: PlacesProps) => {
    return (
        <>
            <Input
                placeholder="Your location: "
                input={{
                    type: 'text',
                }}
            />
        </>
    );
};

export default Places;

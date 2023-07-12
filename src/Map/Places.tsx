import React from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from '@reach/combobox';
import '@reach/combobox/styles.css';
import './Places.css';
type LatLngLiteral = google.maps.LatLngLiteral;

type PlacesProps = {
    setLocation: (position: google.maps.LatLngLiteral) => void;
    setcity: (coords: LatLngLiteral) => Promise<void>;
};

const Places = ({ setLocation, setcity }: PlacesProps) => {
    const {
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete();

    const adressSelectHandler = async (val: string) => {
        setValue(val, false);
        clearSuggestions();

        const results = await getGeocode({ address: val });
        const { lat, lng } = await getLatLng(results[0]);
        setLocation({ lat, lng });
        setcity({ lat: lat, lng: lng });
    };

    return (
        <>
            <Combobox onSelect={adressSelectHandler} className="combobox">
                <ComboboxInput
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                    }}
                    className="input-style"
                />
                <ComboboxPopover>
                    <ComboboxList>
                        {status === 'OK' &&
                            data.map(({ description, place_id }) => (
                                <ComboboxOption key={place_id} value={description} />
                            ))}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
        </>
    );
};

export default Places;

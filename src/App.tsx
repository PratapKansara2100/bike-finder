import { ReactNode } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { Grid } from 'react-loader-spinner';
import styles from './App.module.scss';
import Top from './Top/Header';
import Map from './Map/Map';
import Bottom from './Bottom/Bottom';

function App() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
        libraries: ['places'],
    });
    const mapDisplay: ReactNode = isLoaded ? (
        <Map />
    ) : (
        // this is the loading spinner
        <Grid
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="grid-loading"
            radius="12.5"
            wrapperStyle={{}}
            wrapperClass="loader-spinner"
            visible={true}
        />
    );
    return (
        <div className={styles.App}>
            <Top />
            {mapDisplay}
            <Bottom />
        </div>
    );
}

export default App;

import styles from './App.module.scss';
// import { useLoadScript } from '@react-google-maps/api';
import Top from './Top/Top';
import Map from './Map/Map';
import Bottom from './Bottom/Bottom';

function App() {
    // const {isLoaded}= useLoadScript({googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!, libraries:['places']})
    return (
        <div className={styles.App}>
            <Top />
            <Map>Oh My god ehjlasfd</Map>
            <Bottom />
        </div>
    );
}

export default App;

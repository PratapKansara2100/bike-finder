import styles from './App.module.scss';

function App() {
    return (
        <div className={styles.App}>
            <div className={styles['App-top']}>
                <h1 className={styles['App-heading']}>
                    Locate the nearest participating retailer for the BC Electric Bike RebateProgram
                </h1>
                <form>
                    <label>Your location: </label>
                    <input type="text" />
                    <br />
                    <input type="submit" value="Submit" />
                </form>
            </div>  
        </div>
    );
}

export default App;

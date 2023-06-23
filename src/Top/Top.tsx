import React from 'react';
import Input from '../UI/Input';

import styles from './Top.module.scss';
import { useRef } from 'react';

// type TopProps = {
//     setAdress:(value:string) =>void
// };

const Top = () => {
    const locationRef = useRef(null);
    // function submitHandler(event: Event) {
    //     event.preventDefault();
    //     // const enteredAdress: string | null = locationRef.current.value.trim();
    // }

    return (
        <div className={styles['App-top']}>
            <h1 className={styles['App-heading']}>
                Locate the nearest participating retailer for the BC Electric Bike RebateProgram
                <br />
            </h1>
            <form>
                <label>Your location: </label>
                <Input
                    ref={locationRef}
                    placeholder="Your location: "
                    input={{
                        type: 'text',
                    }}
                />
                <input type="submit" value="Submit" />
            </form>
            <br />
        </div>
    );
};

export default Top;

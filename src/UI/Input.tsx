import './Input.css';
import React from 'react';

type InputProps = {
    ref: React.MutableRefObject<null>;
    placeholder?: string;
    input: { type: string };
};

const Input = React.forwardRef(function ({ ref, placeholder, input }: InputProps) {
    return (
        <>
            <input className="input-style" ref={ref} {...input}></input>
        </>
    );
});
export default Input;

import './Input.css';
import React from 'react';

type InputProps = {
    ref: React.MutableRefObject<null>;
    placeholder?: string;
    input: { type: string };
};

const Input = React.forwardRef(function ({ ref, placeholder, input }: InputProps) {
    return (
        <div>
            <input className="input-style" ref={ref} {...input}></input>
        </div>
    );
});
export default Input;

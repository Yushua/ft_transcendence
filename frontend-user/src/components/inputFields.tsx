import React from "react";

interface Props {
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
}

const inputFields = ({input, setInput}:Props) => {
    return (
        <form className= 'input'>
            <input type='input'
            placeholder="input=${input}"
            className="input_box"/>
            <button className="input_submit" type="submit">go</button>
        </form>
    )
}

export default inputFields
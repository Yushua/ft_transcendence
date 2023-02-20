import React from "react";

interface Props {
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
}

const inputFieldsUsername = ({username, setUsername}:Props) => {
    return (
        <form className= 'input'>
            <input type='input'
            value={username}
            onChange={
                (e)=>setUsername(e.target.value)
            }
            placeholder="input=${input}"
            className="input_box"/>
            <button className="input_submit" type="submit">go</button>
        </form>
    )
}

export default inputFieldsUsername 
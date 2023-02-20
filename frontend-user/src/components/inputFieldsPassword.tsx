import React from "react";

interface Props {
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
}

const inputFieldsPassword: React.FC<Props> = ({password, setPassword}) => {
    return (
        <form className= 'input'>
            <input type='input'
            value={password}
            onChange={
                (e)=>setPassword(e.target.value)
            }
            placeholder="input=${input}"
            className="input_box"/>
            <button className="input_submit" type="submit">go</button>
        </form>
    )
}


// export default inputFieldsusername 
export default inputFieldsPassword
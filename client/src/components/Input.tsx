import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-regular-svg-icons' // Import the faEye icon
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons' // Import the faEye icon

// Define a type for the props
type InputProps = {
    type: 'password' | 'text' | 'file',
    name: string,
    value?: string,
    onChange: React.ChangeEventHandler<HTMLInputElement>,
    className: string
}
const Input: React.FC<InputProps> = ({ type, onChange, name, value, className }) => {
    const [eye, setEye] = useState(false);
// Handle file input separately
    if(type === 'file'){
        return (
            <input type="file"  onChange={onChange} name={name} className={className} accept='image/png, image/jpeg, image/gif, image/webp' />
        )
    }

    //Handle password input
    if (type === 'password') {
        return <div className="relative flex items-center">
            <input type={type === 'password' && !eye ? "password" : "text"} onChange={onChange} name={name} value={value} className={`pr-10 ${className}`} />
            {type === 'password' && (
                <FontAwesomeIcon icon={!eye ? faEyeSlash : faEye} onClick={() => setEye(!eye)} className="absolute pt-5 inset-y-0 right-0 pr-3 flex items-center text-gray-600 cursor-pointer" />
            )}
        </div>

    }

    //Handle text input
    if (type === 'text') {

        return (
            <input type="text" onChange={onChange} name={name} value={value} className={className} />
        )
    }
    // If invalid type is given then return null
    return null;
}

export default Input
import React from 'react'

type ButtonChildrenType = {
    children: React.ReactNode,
    className : string
};

const Button: React.FC<ButtonChildrenType> = ({ children, className }) => {

        return (
            <button className={className} type='submit'>
                {children}
            </button>
        )
}

export default Button
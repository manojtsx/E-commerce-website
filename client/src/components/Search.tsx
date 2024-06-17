import React, { useState } from 'react';
import Input from './Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

interface SearchProps {
    onSearchChange : (searchValue : string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearchChange }) => {
    const [search, setSearch] = useState("");
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };
    const handleButtonClick = () =>{
        onSearchChange(search); // Call the callback function with the new search value
    }
    return (
        <div className="flex justify-center">
            <Input
                type='text'
                onChange={handleChange}
                name='search'
                value={search}
                className="mt-1 block w-full md:w-72 px-4 py-3 bg-white border border-gray-300 rounded-l-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <button onClick={handleButtonClick} className="mt-1 px-4 py-3 bg-blue-500 text-white rounded-r-lg border border-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
        </div>
    );
};

export default Search;
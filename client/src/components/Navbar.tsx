import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/auth-context';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { role, loggedIn, user } = useAuth(); // Assuming useAuth() returns an object with loggedIn status and user information

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Home</Link>
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div className={`md:flex md:items-center ${isOpen ? 'block' : 'hidden'}`}>

          {!loggedIn ? (
            <>
              <Link to="/login" className="block px-4 py-2 hover:bg-gray-700 rounded">Login</Link>
              <Link to="/register" className="block px-4 py-2 hover:bg-gray-700 rounded">Register</Link>
            </>
          ) : (role === 'admin' ? (
            <>
              <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-700 rounded">Dashboard</Link>
              <Link to="/admin/product" className="block px-4 py-2 hover:bg-gray-700 rounded">Product</Link>
              <Link to="/logout" className="block px-4 py-2 hover:bg-gray-700 rounded">Logout</Link>
            </>
          ) : (
            <>

              {/* Check if user is not null before using its properties */}
              {user && (
                <>
                  <Link to={`/user/${user._id}/orders`} className="block px-4 py-2 hover:bg-gray-700 rounded">Orders</Link>
                  <Link to={`/user/${user._id}/carts`} className="block px-4 py-2 hover:bg-gray-700 rounded">Carts</Link>
                </>
              )}
              <Link to="/logout" className="block px-4 py-2 hover:bg-gray-700 rounded">Logout</Link>
            </>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
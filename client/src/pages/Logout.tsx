import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context';
import Login from './Login';
const Logout : React.FC  = () => {
    const navigate = useNavigate();
    const {logout} = useAuth();
    useEffect(()=>{
      navigate('/login')
    },[])
   logout();
   return <Login />
}

export default Logout
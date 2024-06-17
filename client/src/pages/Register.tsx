import React, { useState } from 'react'
import Input from '../components/Input'
import Button from '../components/Button'
import { Link } from 'react-router-dom'
import { useAPI } from '../context/api-context'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'

type User = {
  name: string,
  address: string,
  username: string,
  password: string,
  confirmPassword: string
}

const Register: React.FC = () => {
  const API = useAPI();
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    name: "",
    address: "",
    username: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (user.password !== user.confirmPassword) {
        throw new Error('Your password and confirm password do not match');
      }
      const response = await fetch(`${API}api/auth/register`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg)
      } else {
        toast.success(data.msg);
        navigate('/login');
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
  <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-lg">
    <div>
      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
      <Input type='text' onChange={handleChange} name='name' value={user.name} className="mt-1 block w-full px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
    </div>
    <div>
      <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address:</label>
      <Input type='text' onChange={handleChange} name='address' value={user.address} className="mt-1 block w-full px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
    </div>
    <div>
      <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
      <Input type='text' onChange={handleChange} name='username' value={user.username} className="mt-1 block w-full px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
    </div>
    <div>
      <label htmlFor='password' className="block text-sm font-medium text-gray-700">Password:</label>
      <Input type='password' onChange={handleChange} name='password' value={user.password} className="mt-1 block w-full px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
    </div>
    <div>
      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password:</label>
      <Input type='password' onChange={handleChange} name='confirmPassword' value={user.confirmPassword} className="mt-1 block w-full px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
    </div>
    <Button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Register</Button>
    <p className="text-md text-center">Already have an account? <Link to='/login' className="font-medium text-blue-600 hover:text-blue-500">Click Here...</Link></p>
  </form>
</div>
  )
}

export default Register
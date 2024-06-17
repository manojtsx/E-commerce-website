import React, { useState } from 'react'
import Input from '../components/Input';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAPI } from '../context/api-context';
import { useAuth } from '../context/auth-context';
import { useNavigate } from 'react-router-dom';
//define type of user
type User = {
  username: string,
  password: string
}
const Login: React.FC = () => {
  const navigate = useNavigate();
  const API = useAPI();
  const { storeTokenInSS, setLoginStatus } = useAuth();
  const [user, setUser] = useState<User>({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false); // New state for loading indicator

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true when the form is submitted
    try {
      const response = await fetch(`${API}api/auth/login`, {
        method: "POST",
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify(user)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg);
      } else {
        toast.success(data.msg);
        storeTokenInSS(data.token);
        // change login status
        setLoginStatus(true);
        setIsLoading(false); // Set loading to false upon successful login
        if (data.user.role === 'user') navigate('/user');
        else navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setIsLoading(false); // Ensure loading is set to false if there's an error
      toast.error(err.message);
    }
  }
  return (
   <div className="flex justify-center items-center min-h-screen bg-gray-200">
  <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
    <div>
      <label htmlFor="username" className="block text-lg font-semibold text-gray-900">Username</label>
      <Input type='text' onChange={handleChange} name='username' value={user.username} className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
    </div>
    <div>
      <label htmlFor="password" className="block text-lg font-semibold text-gray-900">Password</label>
      <Input type='password' onChange={handleChange} name='password' value={user.password} className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
    </div>
    <Button className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}>
          {isLoading ? 'Loading...' : 'Login'}
        </Button>
    <p className="text-md text-center">Haven't registered yet ? <Link to='/register' className="font-medium text-blue-600 hover:text-blue-500">Click Here...</Link></p>
  </form>
</div>
  )
}

export default Login;
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAPI } from '../../context/api-context'
import { useAuth } from '../../context/auth-context'
import { useNavigate } from 'react-router-dom'

type OrderType = {
  _id: string,
  name: string,
  description: string,
  price: number,
  image: string,
  quantity: string
}
const Order: React.FC = () => {
  const API = useAPI();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderType[]>([])
  const [orderId, setOrderId] = useState<string>("");

  // method to getAllOrders
  const getAllOrders = async () => {
    try {
      if (user === null) {
        throw new Error("You are not logged In")
      }
      const response = await fetch(`${API}api/order/user/${id}/orders`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      
    
      if (!response.ok) {
        throw new Error(data.msg);
      } else {
        setOrder(data.products);
        setOrderId(data.orderId);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  }
  useEffect(() => {
    getAllOrders();
  }, []);

  // method to delete product from cart
  const deleteProductInOrder = async (id: string) => {
    try {
      const response = await fetch(`${API}api/order/${orderId}/products/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg);
      } else {
        toast.success(data.msg);
        let filteredOrder =order.filter((item) => item._id !== id); 
        setOrder(filteredOrder);
      } 
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  
  if(order.length == 0){
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
    <div className="text-center p-10 bg-white shadow-xl rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">No Orders Yet</h2>
      <p className="text-gray-600 mb-4">You haven't done any orders yet.</p>
      <a href="/" className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">Start Shopping</a>
    </div>
  </div>
      )
    }
  
  
  return (
    <div className="flex flex-col items-center">
      {
        order.map((item, index) => (
          <div key={index} className="border border-gray-300 p-4 my-2 w-4/5 flex">
            <div className="w-1/4"  onClick={() => navigate(`/product/${item._id}`)}>
              <img src={`${API}${item.image}`} alt={item.name} className="object-cover h-full w-full" />
            </div>
            <div className="w-3/4 pl-4">
              <p className="text-lg font-bold">{item.name}</p>
              <p className="text-gray-600">{item.description}</p>
              <div className="mt-2">
                <p className="text-green-500 font-bold">${item.price}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
             <button onClick={() => deleteProductInOrder(item._id)} className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300">Remove From Order</button>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default Order
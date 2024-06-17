import React, { useEffect, useState } from 'react'
import { useAPI } from '../context/api-context'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/auth-context'

type ProductType = {
  _id : string,
  name : string,
  description : string,
  price : number,
  image : string, 
  quantity : string
}

const ProductDetail : React.FC = () => {
  const API = useAPI();
  const {user,token} = useAuth();
  const {id} = useParams<{id : string}>();
  const [product, setProduct] = useState<ProductType>(
    {
      _id : "",
      name : "",
      description : "",
      price : 0,
      image : "",
      quantity : "",
    }
  );
  const getProductById =async() =>{
    try{
      const response = await fetch(`${API}api/product/${id}`,{
        method : "GET",
        headers : {
          'Content-Type' : 'application/json'
        }
      })
      const data = await response.json();
      if(!response.ok){
        throw new Error(data.msg)
      }else{
        setProduct(data.product);
      }
    }catch(err : any){
      toast.error(err.message)
    }
  }
  useEffect(()=>{
    getProductById();
  },[id]) // Added id as a dependency to useEffect
  
  //method to add product to cart
const addToCart = async() =>{
    try{
      if(user == null){
        throw new Error('You must login first');
      }
      const response = await fetch(`${API}api/cart/user/${user._id}/add`,{
        method : "POST",
        headers : {
          'Content-Type' : 'application/json',
          Authorization :  `Bearer ${token}`
        },
        body : JSON.stringify(product)
      }
      );
      const data = await response.json();
      if(!response.ok){
        throw new Error(data.msg);
      }else{
        toast.success(data.msg);
      }
    }catch(err : any){
      toast.error(err.message);
    }
}

  //method to add product to order
  const addToOrder = async() =>{
    try{
      if(user == null){
        throw new Error('You must login first');
      }
      const response = await fetch(`${API}api/order/user/${user._id}/add`,{
        method : "POST",
        headers : {
          'Content-Type' : 'application/json',
          Authorization :  `Bearer ${token}`
        },
        body : JSON.stringify(product)
      }
      );
      const data = await response.json();
      if(!response.ok){
        throw new Error(data.msg);
      }else{
        toast.success(data.msg);
      }
    }catch(err : any){
      toast.error(err.message);
    }
}
  return (
    <main className="max-w-4xl mx-auto mt-10">
  <div className="flex flex-col md:flex-row">
    <img src={`${API}${product.image.replace(/\\/g, '/')}`} alt={product.name} className="w-full md:w-1/2 h-auto object-cover" />
    <div className="flex flex-col justify-between p-4">
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-700 mb-4">{product.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-xl font-semibold">${product.price}</span>
        <span className="text-sm text-gray-600">Qty: {product.quantity}</span>
      </div>
      <div className="flex space-x-4 mt-4">
        <button onClick={addToCart} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 ease-in-out">
          Add to Cart
        </button>
        <button onClick={addToOrder} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 ease-in-out">
          Order Now
        </button>
      </div>
    </div>
  </div>
</main>
  )
}

export default ProductDetail
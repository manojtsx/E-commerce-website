import React, { useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAPI } from '../../context/api-context';
import { useAuth } from '../../context/auth-context';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

type ProductType = {
  name: string,
  description: string,
  price: number,
  quantity: string,
  image: File | null
}
const AddProduct: React.FC = () => {
  const API = useAPI();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductType>({
    name: "",
    description: "",
    price: -1,
    quantity: "",
    image: null
  });
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  // handling the changes in the input field
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      if (files && files[0].type.substr(0, 5) === 'image') {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setImagePreviewUrl(reader.result as string)
          }
        }
        reader.readAsDataURL(files[0])
      } else {
        setImagePreviewUrl('');
      }
      setProduct({ ...product, image: files ? files[0] : null })
    } else {

      setProduct({ ...product, [name]: value })
    }
  }
  // method for handling add product
  const addProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in product) {
      if (key === 'image' && product.image) {
        formData.append(key, product.image);
      } else {
        // For non-File values, ensure they are converted into string
        const value = product[key as keyof typeof product]
        if (value !== null && value !== undefined) {

          formData.append(key, value.toString())
        }
      }
    }
    try {
      const response = await fetch(`${API}api/product/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg);
      } else {
        toast.success(data.msg);
        navigate('/admin/product');
      }
    } catch (err: any) {
      toast.error(err.message)
    }
  }
  return (
    <div className="max-w-md mx-auto my-10 bg-white p-8 border border-gray-200 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">Add Product Panel</h2>
      <form className="space-y-6" onSubmit={addProduct}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
          <Input type="text" onChange={handleChange} name="name" value={product.name} className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description:</label>
          <Input type="text" onChange={handleChange} name="description" value={product.description} className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price:</label>
          <Input type="text" onChange={handleChange} name="price" value={product.price.toString()} className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity:</label>
          <Input type="text" onChange={handleChange} name="quantity" value={product.quantity} className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="image" className='block text-sm font-medium text-gray-700'>Image :</label>
          <Input type='file' onChange={handleChange} name='image' className='mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'></Input>
          {imagePreviewUrl && (
            <div className='mt-4'>
              <img src={imagePreviewUrl} alt="Image preview" className='max-w-xs max-h-xs' />
            </div>
          )}
        </div>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Add</Button>
      </form>
    </div>
  )
}

export default AddProduct
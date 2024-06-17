import React, { useEffect, useState } from 'react'
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/auth-context';
import { useAPI } from '../../context/api-context';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

type ProductType = {
  name: string,
  description: string,
  price: number,
  quantity: string,
  image : File | null |string
}
const EditProduct: React.FC = () => {
  const API = useAPI();
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<ProductType>({
    name: "",
    description: "",
    price: -1,
    quantity: "",
    image : null
  });
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  //method for getting product detail by id
  const getProduct = async () => {
    try {
      const response = await fetch(`${API}api/product/${id}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg);
      } else {
        setProduct({...data.product,
          image : data.product.image ? `${API}${data.product.image}` : null
        });
        setImagePreviewUrl(`${API}${data.product.image.replace(/\\/g, '/')}`)
      }
    } catch (err: any) {
      toast.error(err.message)
    }
  }
  // useEffect to call this method only during the frist component load
  useEffect(() => {
    getProduct();
  }, [id])
  //method for handling changes
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
  // method to submit edited form
  const editProduct = async (e : React.FormEvent<HTMLFormElement>) => {
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
      const response = await fetch(`${API}api/product/edit/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData //send the form data
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
      <form className="space-y-6" onSubmit={editProduct}>
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
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image:</label>
          <Input type="file" onChange={handleChange} name="image" className="mt-1 block w-full" />
          {imagePreviewUrl && (
            <div className='mt-4'>
              <img src={imagePreviewUrl} alt="Product" className='max-w-xs max-h-xs'/>
            </div>
          )}
        </div>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Edit</Button>
      </form>
    </div>
  )
}

export default EditProduct
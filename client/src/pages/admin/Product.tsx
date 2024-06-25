import React, { useEffect, useState } from 'react';
import { useAPI } from '../../context/api-context';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Search from '../../components/Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/auth-context';

type ProductType = {
  _id: string,
  name: string,
  description: string,
  price: number,
  image: string,
  quantity: number
}

const Product: React.FC = () => {
  const API = useAPI();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const getAllProducts = async () => {
    try {
      const response = await fetch(`${API}api/product/products`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg)
      } else {
        setProducts(data);
        setFilteredProducts(data); // Initialize filteredProducts with all products initially
      }
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  useEffect(() => {
    getAllProducts();
  }, [])

  // handle the search
  const handleSearchChange = (searchValue: string) => {
    if (searchValue === "") {
      setFilteredProducts(products); // If search is cleared, show all products again
    } else {
      const filtered = products.filter((item) => item.name.toLowerCase().includes(searchValue.toLowerCase()));
      setFilteredProducts(filtered);
      setProducts(filtered);
    }
  }

  // delete from the products
  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`${API}api/product/delete/${id}`, {
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
        const filtered = products.filter((item) => {
          return item._id !== id;
        })
        setFilteredProducts(filtered)

      }
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <main className="p-4">
      <Search onSearchChange={handleSearchChange} />
      <div className="flex justify-between my-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Product Panel</h2>
        <button onClick={()=>navigate('/admin/product/add')} className="inline-flex items-center bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-150 ease-in-out">
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          <span>Add Product</span>
        </button>
      </div>
      <div className="overflow-x-auto mt-6">
        <table className="w-full table-auto shadow-md rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">SN</th>
              <th className="px-6 py-3 text-left font-semibold">Name</th>
              <th className="px-6 py-3 text-left font-semibold">Price</th>
              <th className="px-6 py-3 text-left font-semibold">Quantity</th>
              <th className="px-6 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((item, index) => (
              <tr key={item._id} className="hover:bg-gray-100">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">{item.price}</td>
                <td className="px-6 py-4">{item.quantity}</td>
                <td className="px-6 py-4">
                  <button onClick={() => navigate(`/admin/product/${item._id}/edit`)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out">
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  <button onClick={() => deleteProduct(item._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 ml-2 rounded transition duration-150 ease-in-out">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default Product
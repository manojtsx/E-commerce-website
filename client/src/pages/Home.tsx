import React, { useEffect, useState } from 'react';
import { useAPI } from '../context/api-context';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Search from '../components/Search';

type ProductType = {
  _id: string,
  name: string,
  description: string,
  price: number,
  image: string,
  quantity: number
}

const Home: React.FC = () => {
    const API = useAPI();
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
        }
    }

    return (
        <main>
            <Search onSearchChange={handleSearchChange} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {
                    filteredProducts.map((item) => (
                        <div key={item._id} className="border rounded-lg overflow-hidden shadow-lg" onClick={() => navigate(`/product/${item._id}`)}>
                            
                            <img src={`${API}${item.image.replace(/\\/g, '/')}`} alt={item.name} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h2 className="text-lg font-bold">{item.name}</h2>
                                <p className="text-gray-700">{item.description}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-xl font-semibold">${item.price}</span>
                                    <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </main>
    )
}

export default Home
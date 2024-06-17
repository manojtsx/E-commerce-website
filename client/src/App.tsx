import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ProductDetail from "./pages/Product_Detail"
import Cart from "./pages/user/Cart"
import Order from "./pages/user/Order"
import Dashboard from "./pages/admin/Dashboard"
import AddProduct from "./pages/admin/AddProduct"
import EditProduct from "./pages/admin/EditProduct"
import User from "./pages/User"
import Admin from "./pages/Admin"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar"
import Product from "./pages/admin/Product"
import Logout from "./pages/Logout"

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/user" element={<User />}>
          <Route path=":id/carts" element={<Cart />} />
          <Route path=":id/orders" element={<Order />} />
        </Route>
        <Route path="/admin" element={<Admin />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="product" element={<Product />} />
          <Route path="product/add" element={<AddProduct />} />
          <Route path="product/:id/edit" element={<EditProduct />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App

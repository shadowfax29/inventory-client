import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Register from "./component/register";

import Login from './component/login';
import Account from './component/account';
import PrivateRoutes from './component/privateroute';
import Product from './component/products';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} /> 
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/account" element={<PrivateRoutes><Account/></PrivateRoutes>}/>
        <Route path='/products' element={<PrivateRoutes><Product/></PrivateRoutes>}/>
      </Routes>
    </div>
  );
}

export default App;

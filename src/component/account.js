import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { FiMinusCircle } from "react-icons/fi";
import Quagga from 'quagga';
import axios from "../config/axios"
export default function Account() {
  const { logout } = useAuth();
  const user = JSON.parse(localStorage.getItem("detail"));
  const [scannedResult, setScannedResult] = useState('');
  const [visible, setVisible] = useState(false);
  const [remove,setRemove]=useState(null)
  const [form, setForm] = useState({
    name: '',
    productId: '',
    quantity: 0,
    prize: '',
    total: 0
  });

  const handleremove = () => {
    setVisible(true);
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#cam')
      },
      decoder: {
        readers: ["ean_reader"]
      }
    }, function (err) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Initialization finished. Ready to start");
      Quagga.start();
    });

    Quagga.onDetected((result) => {
      console.log("Detected");
      const code = result.codeResult.code;
      console.log(`Scanned code: ${code}`);
      setRemove(code);
      if (code) {
        Quagga.stop();
        setVisible(false);
        console.log("Quagga stopped.");
      }
    });

}
if(remove){
  (async()=>{
    try{

      const removeitem=await axios.delete(`/api/deleteProduct/${remove}`,{
        headers:{
          Authorization:localStorage.getItem('token')
        }
      })
     
    }
    catch(err){
      console.log(err)
    }
  })()
}



const handleChange = (e) => {
  const { name, value } = e.target;
  setForm({
    ...form,
    [name]: value
  });
};

useEffect(() => {
  // Update the productId in form state when scannedResult changes
  if (scannedResult) {
    setForm((prevForm) => ({
      ...prevForm,
      productId: scannedResult
    }));
  }
}, [scannedResult]);

useEffect(() => {
  // Calculate the total whenever quantity or prize changes
  const total = form.quantity * parseFloat(form.prize || 0);
  setForm((prevForm) => ({
    ...prevForm,
    total: total.toFixed(2) // Keeping two decimal places for the total
  }));
}, [form.quantity, form.prize]);

const startScan = () => {
  setVisible(true);
  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector('#cam')
    },
    decoder: {
      readers: ["ean_reader"]
    }
  }, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Initialization finished. Ready to start");
    Quagga.start();
  });

  Quagga.onDetected((result) => {
    console.log("Detected");
    const code = result.codeResult.code;
    console.log(`Scanned code: ${code}`);
    setScannedResult(code);
    if (code) {
      Quagga.stop();
      setVisible(false);
      console.log("Quagga stopped.");
    }
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!form.productId || !form.name || !form.prize) {
    return alert('Please fill in all required fields.');
  }
  try {
    const product = await axios.post("/api/addProduct", form, {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    })
    console.log(product.data)
    setForm({
      name: '',
      productId: '',
      quantity: 0,
      prize: '',
      total: 0
    })
  }
  catch (err) {
    console.log(err)
  }
};

return (
  <>
    <nav className="navbar navbar-expand-lg navbar-light bg-success d-flex justify-content-between">
      <a className="navbar-brand text-white m-3" href="/">inventory</a>
      <p className='m-3 text-light'>({user.user.name})</p>
      <Link className="btn m-3 border-white" to="/products" >PRODUCTS</Link>
      <Link className='btn btn-dark m-3' to="/login" onClick={logout}>logout</Link>
    </nav>
    <div className='h-100 d-flex justify-content-around m-5 '>
      <button onClick={startScan} className='btn bg-primary'><MdOutlineAddCircleOutline size={70} /></button>
      <button onClick={handleremove} className='btn bg-danger'><FiMinusCircle size={70} /></button>
    </div>

    <div className="row justify-content-center mt-3">
      <div className="col-auto">
        <div id="cam-container" className="border" style={{ width: '400px', height: '200px', overflow: 'hidden', display: visible ? 'block' : 'none' }}>
          <div id="cam" style={{ width: '100%', height: '100%' }}></div>
        </div>
      </div>
    </div>

    <form className="card card-body m-auto bg-success-subtle" onSubmit={handleSubmit} style={{ maxWidth: '400px', width: '100%' }}>
      <div className='m-1'>
        <label className="form-label">productId</label>
        <input
          className="form-control"
          type="text"
          name="productId"
          value={form.productId}
          onChange={handleChange}
        />
      </div>
      <div className='m-1'>
        <label className="form-label">productName</label>
        <input
          className="form-control"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
      </div>
      <div className='m-1'>
        <label className="form-label">quantity</label>
        <input
          className="form-control"
          type="text"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
        />
        <button className="btn btn-warning m-2" type="button" onClick={() => setForm({ ...form, quantity: Number(form.quantity) + 1 })}>+</button>
        <button className='m-2 btn btn-danger' type="button" onClick={() => setForm({ ...form, quantity: Number(form.quantity) - 1 })}>-</button>
      </div>
      <div className='m-1'>
        <label className="form-label">prize</label>
        <input
          className="form-control"
          type="text"
          name="prize"
          value={form.prize}
          onChange={handleChange}
        />
      </div>
      <div className='m-1'>
        <label className="form-label">Total</label>
        <input
          className="form-control"
          type="text"
          name="total"
          value={form.total}
          readOnly
        />
      </div>
      <div className='m-1'>
        <input className='btn bg-light border-primary-subtle' type="submit" value="Submit" />
      </div>
    </form>
  </>
);
}

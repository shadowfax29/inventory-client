import { useEffect, useState } from "react"
import axios from "../config/axios"

export default function Product(){
    const [product,setProduct]=useState(null)
    useEffect(()=>{
const fetch=async()=>{
    try{
        const item=await axios.get("/api/products",{
            headers:{
                Authorization:localStorage.getItem("token")
            }
        })
        setProduct(item.data)
    }
    catch(err){
        console.log(err)
    }
        
    
}
fetch()
    },[])
    return(
        <div>
          
      {product ? (
       <table className="table table-dark table-striped">
       <thead>
         <tr>
           <th scope="col">#</th>
           <th scope="col">Product Id</th>
           <th scope="col">Product Name</th>
           <th scope="col">Prize</th>
           <th scope="col">Quantity</th>
           {/* Add more table headings if needed */}
         </tr>
       </thead>
       <tbody>
         {product.map((ele, index) => (
           <tr key={index}>
             <th scope="row">{index + 1}</th>
             <td>{ele.name}</td>
             <td>{ele.productId}</td>
             <td>{ele.prize}</td>
             <td>{ele.quantity}</td>
             {/* Add more table data cells for additional properties */}
           </tr>
         ))}
       </tbody>
     </table>
     
) : (
    <div className="container">
    <div className="row">
      <div className="col-md-6 offset-md-3">
      <div className="spinner-border" role="status">
<span className="visually-hidden">Loading...</span>
</div>
      </div>
    </div>
  </div>
)}

        </div>
    )
}
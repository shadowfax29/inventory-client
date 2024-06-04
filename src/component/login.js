
import { Formik } from 'formik';
import { useAuth } from '../context/AuthContext';
import * as Yup from 'yup';
import axios from "../config/axios"
import { useNavigate} from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
    const {dispatch}=useAuth()
    const navigate=useNavigate()
    const [serverError,setServerError]= useState(null)
    const handlelog=async(values)=>{
    
try{
    const tokenres=await axios.post("/api/user/login",values)
    localStorage.setItem("token",tokenres.data.token)
    setServerError(null)
    const res=await axios.get("/api/user",{
        headers:{
            Authorization:localStorage.getItem("token")
        }
    })
   dispatch({type:"login",payload:res.data})
   navigate("/account")
}
catch(err){
    
    setServerError(err?.response?.data?.error)
}
    }
  
  return (
    <div style={{ height: "100vh", display: "grid" }}>

      <Formik
        initialValues={{ email: "", password: "" }}
     onSubmit={handlelog}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email('Invalid email')
            .required("Required"),
          password: Yup.string()
            .required("Required")
        })}
      >
        
        {({
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit
        }) => (
          <form className="card card-body w-25 m-auto bg-success-subtle" onSubmit={handleSubmit}>
            {serverError&&(<div><p className='text-danger'>{serverError}</p></div>)}
                  <div className="mb-3">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                placeholder="Enter your email"
                type="text"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-control ${errors.email && touched.email ? "is-invalid" : ""}`}
              />
              {errors.email && touched.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                placeholder="Enter your password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-control ${errors.password && touched.password ? "is-invalid" : ""}`}
              />
              {errors.password && touched.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>

            <button className='btn btn-success m-3' type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </form>
        )}
      </Formik>
    </div>
  
  );
}

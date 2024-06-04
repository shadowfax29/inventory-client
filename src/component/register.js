import {useState} from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from "../config/axios"
import { Link, useNavigate } from 'react-router-dom';


export default function Register() {
  const [serverError,setServerError]=useState(null)
  const navigate=useNavigate()
  const handleSubmitt=async(values)=>{
 
      try{
        const res=await axios.post("/api/user/create",values)
        setServerError(null)
      navigate("/login")
      }
      catch(err){
   
        setServerError(err?.response?.data?.errors)
      }
      }
  
  return (
    <div style={{height:"100vh",display:"grid"}}>
      <Formik
        initialValues={{ email: "", name: "", password: ""}}
        onSubmit={handleSubmitt}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email('Invalid email')
            .required("Required"),
          name: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required("Required"),
          password: Yup.string()
            .required("Required")
            .matches(
              /^.*(?=.{10,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
              "Password must contain at least 10 characters, one uppercase, one lowercase, one digit and one special character"
            ),
        })}
      >
        {props => {
          const {
            values,
            touched,
            errors,
            dirty,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset
          } = props;
          return (
            <form className="card card-body  m-auto bg-success-subtle" onSubmit={handleSubmit} style={{ maxWidth: '400px', width: '100%' }}>
            {serverError&&(<div>{serverError.map((ele,i)=>{
              return <p key={i} className='text-danger'>{ele.msg}</p>
            })}</div>)}
                <label className="form-label" htmlFor="email" style={{ display: "block" }}>
                Email
              </label>
              <input
             
                id="email"
                placeholder="Enter your email"
                type="text"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.email && touched.email
                    ? "form-control"
                    : "form-control"
                }
              />
              {errors.email && touched.email && (
                <div className="input-feedback text-danger">{errors.email}</div>
              )}
            
             

              <label htmlFor="name" className="form-label" style={{ display: "block" }}>
                Name
              </label>
              <input
             
                id="name"
                placeholder="Enter your name"
                type="text"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.name && touched.name
                    ? "form-control"
                    : "form-control"
                }
              />
              {errors.name && touched.name && (
                <div className="input-feedback text-danger">{errors.name}</div>
              )}

          
              <label className="form-label"htmlFor="password" style={{ display: "block" }}>
                Password
              </label>
              <input
              
                id="password"
                placeholder="Enter your password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.password && touched.password
                    ? "form-control "
                    : "form-control"
                }
              />
              {errors.password && touched.password && (
                <div className="input-feedback text-danger ">{errors.password}</div>
              )}

              <button
              className='btn btn-success m-3'
                type="button"
             
                onClick={handleReset}
                disabled={!dirty || isSubmitting}
              >
                Reset
              </button>
              <button className='btn btn-success m-3' type="submit" disabled={isSubmitting}>
                Submit
              </button>
              <p>already have an account <Link to="/login">Log in</Link></p>

            </form>
          );
        }}
      </Formik>
    </div>
  );
}

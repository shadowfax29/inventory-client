import {createContext,useContext,useReducer} from "react"
 const AuthContext=createContext()
export const  useAuth=()=>{
return useContext(AuthContext)
}
const initial={
  user:null,
  isloggedin:false
}
const reducer=(state,action)=>{
  switch(action.type){
      case "login":{
        localStorage.setItem("detail",JSON.stringify({isloggedin:true,user:action.payload}))
          return ({...state, isLoggedIn: true, user: action.payload })
      }
      case "logout":{
        localStorage.removeItem("detail")
          return {...state, isLoggedIn: false, user: null } 
      }
      default:{
        return state
      }
  }
}

export const AuthProvider=({children})=>{

   
    
    const [user,dispatch]=useReducer(reducer,initial)
    const logout=()=>{
      localStorage.removeItem("token")
      dispatch({type:"logout"})
      
      }
    return (
        <AuthContext.Provider
          value={{user,dispatch,logout}}
        >
      
          {children}
        </AuthContext.Provider>
      );
}
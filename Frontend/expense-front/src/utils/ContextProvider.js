import React, {useState} from 'react'
import Context from './Context'

const ContextProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [firstname, setFirstName] = useState("")
    const [userName, setUserName] = useState("")
    const [frugalScore, setFrugalScore] = useState(70)
  
    return (
    <Context.Provider 
    value={{ isAuthenticated, setIsAuthenticated, firstname, setFirstName, userName, setUserName, frugalScore, setFrugalScore}}
    >
        {children}
    </Context.Provider>
    
  );
};

export default ContextProvider
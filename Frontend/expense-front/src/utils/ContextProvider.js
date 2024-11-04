import React, {useEffect, useState} from 'react'
import Context from './Context'

const ContextProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [firstname, setFirstName] = useState("")
    const [userName, setUserName] = useState("")
    const [frugalScore, setFrugalScore] = useState(70)
    const [userFinancialData, setUserFinancialData] = useState()
    
    const fetchUserFinancialData = async () => {
      try {
        // Send a GET request to your backend API
   
        const response = await fetch(`http://localhost:8000/api/financial-data/?user=${userName}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Include an authorization token if needed
            
          },
          
          
        });
    
        // Check if the response is successful
        if (!response.ok) {
          throw new Error("Failed to fetch user financial data");
        }
    
        // Parse the JSON response
        const data = await response.json();
        console.log("User Financial Data:", data);
    
        // You can update the state or perform other actions with the fetched data
        setUserFinancialData(data); // Replace `setUserFinancialData` with your state management function
      } catch (error) {
        console.error("Error fetching user financial data:", error);
        // Handle the error (e.g., show a message to the user)
      }
    };
    
    const saveToLocalStorage = (key, data)=>{
      localStorage.setItem(key, data)
    }

    const removeFromLocalStorage = (key)=>{
      localStorage.removeItem(key)
    }

    const signOut = ()=>{
      setIsAuthenticated(false)
      setFirstName("")
      setUserName("")
      setFrugalScore("")
      removeFromLocalStorage("userData")
    }

    const handleIfLoggedIn = ()=>{
     
      if(localStorage.getItem("userData")!=null){
        setFirstName(JSON.parse(localStorage.getItem("userData")).firstName)
        setUserName(JSON.parse(localStorage.getItem("userData")).userName)
        setIsAuthenticated(true)
        return
      }
      setIsAuthenticated(false)
    }
    useEffect(()=>{
      handleIfLoggedIn()
      fetchUserFinancialData()
    }, [])
    
  
    return (
    <Context.Provider 
    value={
      { isAuthenticated,
         setIsAuthenticated, 
         firstname, 
         setFirstName, 
         userName, 
         setUserName, 
         frugalScore, 
         setFrugalScore,
         saveToLocalStorage,
         signOut,
         userFinancialData,
         setUserFinancialData,
         fetchUserFinancialData
        }}
    >
        {children}
    </Context.Provider>
    
  );
};

export default ContextProvider
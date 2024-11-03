import React, {useState, useContext, useEffect} from 'react';
import "../styles/pages/Login.css";
import {Link, useNavigate} from 'react-router-dom'
import Context from '../utils/Context'

const Login = () => {
  const [formData, setFormData] = useState(
    {
      email: '',
      password: '',
    }
  )
  const history = useNavigate()
  const {setFirstName, setIsAuthenticated, setUserName, saveToLocalStorage, isAuthenticated} = useContext(Context)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json()
        alert(`${error.message}`)
        throw new Error('Failed to register.');
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      setFirstName(data.firstName)
      setIsAuthenticated(true)
      setUserName(data.email)
      saveToLocalStorage("userData",JSON.stringify({firstName:data.firstName, userName:data.email}))
      history("/")
    }catch(error){
      console.error("Error: ", error)
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(()=>{
    if(isAuthenticated){
      console.log(isAuthenticated)
      history("/")
    }
  },[isAuthenticated])

  return (
    <div className='Login-Overlay'>
      <div className='Login-Wrapper'>
        <form className='Login-Form open-sans-medium' onSubmit={handleSubmit}>
          <h2 className='Login-Form__Title'>Login</h2>
          <div className='Login-Form__Field'>
            <label className='Login-Form__Label' htmlFor='email'>Email</label>
            <input
              className='Login-Form__Input'
              type='email'
              id='email'
              name='email'
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='Login-Form__Field'>
            <label className='Login-Form__Label' htmlFor='password'>Password</label>
            <input
              className='Login-Form__Input'
              type='password'
              id='password'
              name='password'
              onChange={handleInputChange}
              required
            />
          </div>
          <button className='Login-Form__Button' type='submit'>Login</button>
          <p className='Login-Form__Signup'>
            Don't have an account? <Link to='/register'>Signup</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

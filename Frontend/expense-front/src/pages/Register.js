import React, { useState, useContext } from 'react';
import "../styles/pages/Register.css";
import { Link, useNavigate } from 'react-router-dom';
import Context from '../utils/Context'

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    countryCode: '+1', // Default country code
  });
  const {setFirstName, setIsAuthenticated, setUserName} = useContext(Context)
  const history = useNavigate()

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validatePasswords = () => {
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match.';
    }
    return '';
  };

  const validatePhoneNumber = () => {
    // check if the country code is kenyan
    if(formData.countryCode=="+254"){
        // check if numbers are ten
        if(formData.phoneNumber.startsWith("0")){
            formData.phoneNumber = formData.phoneNumber.slice(1, formData.phoneNumber.length)
        }
        if(formData.phoneNumber.length<9){
          return "phone number is too short";
        }
    }
    if(formData.phoneNumber.length>14){
      return "phone number is too long";
    } 
    console.log(formData.phoneNumber)
    return "";
  }

  const validateForm = () => {
    const newErrors = {};
    const passwordError = validatePasswords();
    const phoneNumberError = validatePhoneNumber();

    if (passwordError) newErrors.confirmPassword = passwordError;
    if (phoneNumberError) newErrors.phoneNumberError = phoneNumberError;

    if (!formData.firstname) newErrors.firstname = 'First name is required.';
    if (!formData.lastname) newErrors.lastname = 'Last name is required.';
    if (!formData.email) newErrors.email = 'Email is required.';
    if (!formData.password) newErrors.password = 'Password is required.';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:8000/api/register/', {
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
      setFirstName(formData.firstname)
      setIsAuthenticated(true)
      setUserName(formData.email)
      history("/")

      // Optionally redirect or show success message here

    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='Register-Overlay'>
      <div className='Register-Wrapper'>
        <form className='Register-Form open-sans-medium' onSubmit={handleSubmit}>
          <h2 className='Register-Form__Title'>Sign Up</h2>

          <div className='Register-Form__Field'>
            <label className='Register-Form__Label' htmlFor='firstname'>First Name</label>
            <input
              className='Register-Form__Input'
              type='text'
              id='firstname'
              name='firstname'
              value={formData.firstname}
              onChange={handleInputChange}
              required
            />
            {errors.firstname && <p className='Register-Form__Error'>{errors.firstname}</p>}
          </div>

          <div className='Register-Form__Field'>
            <label className='Register-Form__Label' htmlFor='lastname'>Last Name</label>
            <input
              className='Register-Form__Input'
              type='text'
              id='lastname'
              name='lastname'
              value={formData.lastname}
              onChange={handleInputChange}
              required
            />
            {errors.lastname && <p className='Register-Form__Error'>{errors.lastname}</p>}
          </div>

          <div className='Register-Form__Field'>
            <label className='Register-Form__Label' htmlFor='email'>Email</label>
            <input
              className='Register-Form__Input'
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            {errors.email && <p className='Register-Form__Error'>{errors.email}</p>}
          </div>

          <div className='Register-Form__Field'>
            <label className='Register-Form__Label' htmlFor='password'>Password</label>
            <input
              className='Register-Form__Input'
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            {errors.password && <p className='Register-Form__Error'>{errors.password}</p>}
          </div>

          <div className='Register-Form__Field'>
            <label className='Register-Form__Label' htmlFor='confirmPassword'>Confirm Password</label>
            <input
              className='Register-Form__Input'
              type='password'
              id='confirmPassword'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            {errors.confirmPassword && <p className='Register-Form__Error'>{errors.confirmPassword}</p>}
          </div>

          <div className='Register-Form__Field'>
            <label className='Register-Form__Label' htmlFor='phoneNumber'>Phone Number</label>
            <div className='Register-Form__PhoneWrapper'>
              <select
                className='Register-Form__Dropdown'
                name='countryCode'
                value={formData.countryCode}
                onChange={handleInputChange}
                required
              >
                <option value='+1'>+1 (USA)</option>
                <option value='+44'>+44 (UK)</option>
                <option value='+254'>+254 (Kenya)</option>
                <option value='+91'>+91 (India)</option>
                {/* Add more country codes as needed */}
              </select>
              <input
                className='Register-Form__Input'
                type='tel'
                id='phoneNumber'
                name='phoneNumber'
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            {errors.phoneNumber && <p className='Register-Form__Error'>{errors.phoneNumber}</p>}
          </div>

          <button className='Register-Form__Button' type='submit'>Sign Up</button>
          <p className='Login-Form__Signup'>
            Already have an account? <Link to='/login'>Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;

// import React from 'react';
// import "../styles/pages/Register.css";
// import {Link} from 'react-router-dom'

// const Register = () => {
//   const handleSubmit = (e) => {
//     e.preventDefault();
//   };

//   return (
//     <div className='Register-Overlay'>
//       <div className='Register-Wrapper'>
//         <form className='Register-Form open-sans-medium' onSubmit={handleSubmit}>
//           <h2 className='Register-Form__Title'>Sign Up</h2>
          
//           <div className='Register-Form__Field'>
//             <label className='Register-Form__Label' htmlFor='firstname'>First Name</label>
//             <input
//               className='Register-Form__Input'
//               type='text'
//               id='firstname'
//               name='firstname'
//               required
//             />
//           </div>

//           <div className='Register-Form__Field'>
//             <label className='Register-Form__Label' htmlFor='lastname'>Last Name</label>
//             <input
//               className='Register-Form__Input'
//               type='text'
//               id='lastname'
//               name='lastname'
//               required
//             />
//           </div>

//           <div className='Register-Form__Field'>
//             <label className='Register-Form__Label' htmlFor='email'>Email</label>
//             <input
//               className='Register-Form__Input'
//               type='email'
//               id='email'
//               name='email'
//               required
//             />
//           </div>

//           <div className='Register-Form__Field'>
//             <label className='Register-Form__Label' htmlFor='password'>Password</label>
//             <input
//               className='Register-Form__Input'
//               type='password'
//               id='password'
//               name='password'
//               required
//             />
//           </div>

//           <div className='Register-Form__Field'>
//             <label className='Register-Form__Label' htmlFor='confirmPassword'>Confirm Password</label>
//             <input
//               className='Register-Form__Input'
//               type='password'
//               id='confirmPassword'
//               name='confirmPassword'
//               required
//             />
//           </div>

//           <div className='Register-Form__Field'>
//             <label className='Register-Form__Label' htmlFor='phoneNumber'>Phone Number</label>
//             <div className='Register-Form__PhoneWrapper'>
//               <select className='Register-Form__Dropdown' name='countryCode' required>
//                 <option value='+1'>+1 (USA)</option>
//                 <option value='+44'>+44 (UK)</option>
//                 <option value='+254'>+254 (Kenya)</option>
//                 <option value='+91'>+91 (India)</option>
//                 {/* Add more country codes as needed */}
//               </select>
//               <input
//                 className='Register-Form__Input'
//                 type='tel'
//                 id='phoneNumber'
//                 name='phoneNumber'
//                 required
//               />
//             </div>
//           </div>

//           <button className='Register-Form__Button' type='submit'>Sign Up</button>
//           <p className='Login-Form__Signup'>
//             Already have an account? <Link to='/login'>Login</Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Register;

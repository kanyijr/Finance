import React, {useContext} from 'react'
import "../styles/components/Navbar.css"
import { useNavigate, Link, useLocation} from 'react-router-dom';
import Context from '../utils/Context'

const Navbar = () => {
  const {isAuthenticated, setIsAuthenticated, signOut} = useContext(Context);
  const history = useNavigate()
  const handleSignOut = ()=>{
    signOut()
    history("/login")
  }
  return (
    <nav className='Navbar'>
      <div className='Navbar__container u-d-flex'>
        <div className='Navbar__container-left'>
          <div className='Navbar__container-left-logo'>
            <Link to={"/"}>
              <h1 className='open-sans-medium'>Froogol</h1>
            </Link>
          </div>          
        </div>
        <div className='Navbar__container-middle '>
            <div className='Navbar__container-middle-links u-d-flex open-sans-regular'>
              <Link to={"/"}>
                <p className='Navbar__container-middle-links-link'>dashboard</p>
              </Link>
              <Link to={"/expenses/list"}>
                <p className='Navbar__container-middle-links-link'>expenses</p>
              </Link>
              <Link to={"/savings"}>
                <p className='Navbar__container-middle-links-link'>savings</p>
              </Link>
            </div>

        </div>
        <div className='Navbar__container-right'>
          {
            isAuthenticated?
              <div className='Navbar__container-right-icons'>
                <button onClick={handleSignOut} className='Navbar__cta-signout'>
                    Sign out
                </button>
              </div>
            :           
              <div className='Navbar__container-right-cta u-d-flex'>
                <Link to={"/login"}>
                  <button className='Navbar__cta-login'>Login</button>
                </Link>
                <Link to={"/register"}>
                  <button className='Navbar__cta-signup'>Sign up</button>
                </Link>

              </div>
         
          }
      
        </div>


      </div>
     

    </nav>
  )
};

export default Navbar
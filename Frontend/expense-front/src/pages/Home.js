import React, {useContext, useEffect, useState} from 'react'
import "../styles/pages/Home.css"
import Context from '../utils/Context'
import Metric from '../components/Metric'
import CircularProgressBar from '../components/CircularProgressBar'
import {useNavigate, Link} from 'react-router-dom'
import TrendChart from '../components/TrendChart'



const Home = () => {
  const {firstname, setFirstName, frugalScore, setFrugalScore, isAuthenticated, fetchUserFinancialData, userFinancialData} = useContext(Context)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const numStars = parseInt((frugalScore/100)*5)
  const history = useNavigate();
  const expenseData = [
    { date: '2024-01-01', amount: 50 },
    { date: '2024-02-01', amount: 100 },
    { date: '2024-03-01', amount: 75 },
    // Add more data as needed
  ];
  useEffect(()=>{
    console.log(!isAuthenticated)
    if(isAuthenticated==false){
      history("/login")
    }
    

  },[isAuthenticated])
  useEffect(()=>{
    fetchUserFinancialData()
  }, [])

  const handleCloseModal = ()=>{
    setIsModalOpen(false)
  }
  const handleOpenModal = ()=>{
    setIsModalOpen(true)
  }

  return (
    <div className='Home'>
      <div className='Home__container'>
        <p className='Home__greeting roboto-regular'>
          Good Evening, {firstname}
        </p>
        <h1 className='Home__title'>Dashboard</h1>
        <div className='Home__metrics u-d-flex'>

            <Metric bgColor={"emerald"} value={userFinancialData?userFinancialData.income:0} title={"Total Income"} icon={"bi-cash-coin"} dest={"/income/list"} prefix={"Ksh. "}/>
       
       
            <Metric bgColor={"red"} value={userFinancialData?userFinancialData.expenses:0} title={"Total Expenses"} icon={"bi-graph-down-arrow"} dest={"expenses/list"} prefix={"Ksh. "}/>
      

            <Metric bgColor={"blue"} value={userFinancialData?userFinancialData.savings:0} title={"Total Savings"} icon={"bi-briefcase"} dest={"/savings"} prefix={"Ksh. "}/>
        
        </div>
        <div className='Home__score u-d-flex'>
          <div className='Home__score-bar'> 
          <CircularProgressBar score={frugalScore} strokeWidth={10} size={200}/>

          </div>
          <div className='Home__score-right roboto-light'>
            <h1>
              Frugal Score
            </h1>
            <div className='Home__score-right-stars u-d-flex'>
              {
                Array.from({ length: numStars }).map((_, i) => (
                  <i key={i} className="bi bi-star-fill"></i>
                ))
              }            
            </div>

          </div>


        </div>
        <TrendChart expenseData={expenseData} />
   
     

      <div className='Home__plus-cta' onClick={handleOpenModal}>
      <i className="bi bi-plus-lg"></i>
      </div>
      <div className={`Home__plus-modal ${isModalOpen ? '' : 'u-d-hidden'}`}>
        <div className='Home__plus-modal-close' onClick={handleCloseModal}>
          <i className="bi bi-x-lg"></i>
        </div>
        <Link to={"/income/input"}>
          <div className='Home__plus-modal-action'>          
            <div className='Home__plus-modal-action-icon'> 
            <i className="bi bi-cash-coin"></i>
            </div>
            <p>Add Income</p>
          </div>
        </Link>
        <Link to={"/savings"}>
          <div className='Home__plus-modal-action'>
            <div className='Home__plus-modal-action-icon'> 
            <i className="bi bi-bank"></i>
            </div>
            <p>Save</p>
          </div>
        </Link>
        <Link to={"/expenses/input"}>
          <div className='Home__plus-modal-action'>
            <div className='Home__plus-modal-action-icon'> 
            <i className="bi bi-clipboard"></i>
            </div>
            <p>Record Expense</p>
          </div>
        </Link>
      </div>
      
      </div>
      
    </div>
  )
}

export default Home

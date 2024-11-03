import React from 'react'
import "../styles/pages/Savings.css"
import Metric from '../components/Metric'
import SavingCard from '../components/SavingCard'
import {useNavigate} from 'react-router-dom'
const Savings = () => {
  const history = useNavigate()
  return (
    <div className='Savings'>
      <div className='Savings__container'>
        <div className='Savings__header'>
          <div>
            <h1>Saving Goals</h1>
            <p>Track and manage you saving targets</p>
          </div>
          <button className='Savings__header-cta' onClick={()=>{history("/savings/input")}}>
            <i className='bi bi-plus-lg'></i>
            New Savings Goal
          </button>          

        </div>
        <div className='Savings__cards'>
          <Metric title={"Total Savings"} icon={"bi-wallet"} value={0} bgColor={"blue"} dest={""} prefix={"Ksh. "}/>
          <Metric title={"Active Goals"} icon={"bi-wallet"} value={0} bgColor={"bluegreen"} dest={""} prefix={""}/>
        </div>
        <div className='Savings__funds'>

          <SavingCard width={20}/>
          <SavingCard width={70}/>
        </div>
      </div>
    </div>
  )
}

export default Savings

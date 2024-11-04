import React, {useContext, useEffect, useState} from 'react'
import "../styles/pages/Savings.css"
import Metric from '../components/Metric'
import SavingCard from '../components/SavingCard'
import {useNavigate} from 'react-router-dom'
import Context from '../utils/Context'

const Savings = () => {
  const history = useNavigate()
  const {userName} = useContext(Context)
  const [savingsData, setSavingsData] = useState(0)
 

  const fetchSaving = async ()=>{
        var response = await fetch(`http://localhost:8000/api/users/saving-accounts/?user=${userName}`,{
          method:"GET",    
        })
        let data = await response.json()
        if(!response.ok){          
          alert(data.message)
        }
        else{
          
          setSavingsData(data)
          
        }
  }

  useEffect(()=>{
      if(userName){

        fetchSaving()
      }
  },[userName])
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
          <Metric title={"Total Savings"} icon={"bi-wallet"} value={savingsData?savingsData.total:0} bgColor={"blue"} dest={""} prefix={"Ksh. "}/>
          <Metric title={"Active Goals"} icon={"bi-wallet"} value={savingsData?savingsData.num_accounts:0} bgColor={"bluegreen"} dest={""} prefix={""}/>
        </div>
        <div className='Savings__funds'>
            {savingsData?savingsData.accounts.map((account, index)=><SavingCard title={account.title} id={account.account_id} startDate={account.start_date} endDate={account.end_date} currentAmount={account.current_amount} goal={account.goal}/>):<SavingCard/>}
        </div>
      </div>
    </div>
  )
}

export default Savings

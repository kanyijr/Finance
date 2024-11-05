import React, { useEffect, useState, useContext } from 'react'
import "../styles/components/SavingCard.css"
import Context from '../utils/Context'
import {useNavigate} from 'react-router-dom'

const SavingCard = ({id,title, startDate, endDate, currentAmount, goal}) => {
  const [width, setWidth] = useState(0)
  const [accountId, setAccountId] = useState(null)
  const [amount, setAmount] = useState(0)
  const [amountGoal, setAmountGoal] = useState(0)
  const [fundsToAdd, setFundsToAdd] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {userName} = useContext(Context)
  const [task, setTask] = useState("add")
  const history = useNavigate()

  const convertToString = (number) => {
    if (typeof number !== 'number') {
      throw new Error('Input must be a number');
    }
    
    // Convert the number to a string and format with commas
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const handleModalChange = (e)=>{
        setFundsToAdd(e.target.value)
  }
  const handleModalSubmit = async (e)=>{
    e.preventDefault()
    if(task==="add"){
      let  response = await fetch("http://localhost:8000/api/users/saving-accounts/update/",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({id:accountId, user:userName, amount:fundsToAdd})
      })
      let data = await response.json()
      if(!response.ok){
        alert(data.message)
      }else{
        alert(data.message)
      }
      window.location.reload()
    }else{
      let response = await fetch("http://localhost:8000/api/users/saving-accounts/update/",{
        method:"PUT",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({id:accountId, user:userName, amount:fundsToAdd})
      })
      let data = await response.json()
      if(!response.ok){
        alert(data.message)
      }else{
        alert(data.message)
      }
      window.location.reload()
    }

  }
  useEffect(()=>{
    if(goal){

      setWidth(Math.round((currentAmount/goal) * 100))
     
      setAmount(convertToString(currentAmount))
      setAmountGoal(convertToString(goal))
    }
    setAccountId(id)
  },[currentAmount, goal])
  return (
    <div className='SavingCard'>
      <div className='SavingCard__header'>
        <h2 className='SavingCard__header-title'>
           {title}
        </h2>
        <small className='SavingCard__header-date'>{startDate} - {endDate}</small>

      </div>
      <div className='SavingCard__body'>
        <div className='SavingCard__body-goal-amount'>
          <span>Ksh. {amount}</span>
          <span>Ksh. {amountGoal}</span>
        </div>
        <div className='SavingCard__body-progress'>
          <div className='SavingCard__body-progress-bar' style={{width:`${width}%`}}></div>
        </div>
        <p className='SavingCard__body-progress-status'>{width}% Complete</p>
        <div className='SavingCard__body-cta'>
          <button className='SavingCard__body-cta-btn' onClick={()=>{setIsModalOpen(true)}}>
            Add Funds
          </button>
          <button className='SavingCard__body-cta-btn' onClick={()=>{setTask("change"); setIsModalOpen(true)}}>
            Edit Goal
          </button>
        </div>

      </div>
     
      <form className={`SavingCard__modal ${isModalOpen?"":"u-d-hidden"}`} onSubmit={handleModalSubmit}>
        <i className='bi bi-x-lg' onClick={()=>{setIsModalOpen(false)}}></i>
        <label for="addFunds">
          Amount
        </label>
        <input type='text' id='addFunds' onChange={handleModalChange} value={fundsToAdd}/>
        <input type='submit' value={"add"}/>
      </form>
    </div>
  )
}

export default SavingCard
import React from 'react'
import "../styles/components/SavingCard.css"
const SavingCard = ({width}) => {
  return (
    <div className='SavingCard'>
      <div className='SavingCard__header'>
        <h2 className='SavingCard__header-title'>
           Emergency Fund
        </h2>
        <small className='SavingCard__header-date'>2024-01-01 - 2024-12-31</small>

      </div>
      <div className='SavingCard__body'>
        <div className='SavingCard__body-goal-amount'>
          <span>$5,000</span>
          <span>$10,000</span>
        </div>
        <div className='SavingCard__body-progress'>
          <div className='SavingCard__body-progress-bar' style={{width:`${width}%`}}></div>
        </div>
        <p className='SavingCard__body-progress-status'>20% Complete</p>
        <div className='SavingCard__body-cta'>
          <button className='SavingCard__body-cta-btn'>
            Add Funds
          </button>
          <button className='SavingCard__body-cta-btn'>
            Edit Goal
          </button>
        </div>

      </div>
    </div>
  )
}

export default SavingCard
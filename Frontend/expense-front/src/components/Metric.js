import React from 'react'
import "../styles/components/Metric.css"
import { Link } from 'react-router-dom';

const Metric = ({bgColor, title, value, icon, dest}) => {
    const convertToString = (number) => {
        if (typeof number !== 'number') {
          throw new Error('Input must be a number');
        }
        
        // Convert the number to a string and format with commas
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      };
  return (
    <div className={`Metric-card open-sans-medium ${bgColor}`}>
      <Link to={dest}>
        <div className='Metric-card__header'>
            <p className='Metric-card__header-title'>{title}</p>
            <i class={`bi ${icon}`}></i>
        </div>
        <div className='Metric-card__body open-sans-semi-bold'>
            Ksh. {convertToString(value)}

        </div>
      </Link>
    </div>
  )
}

export default Metric
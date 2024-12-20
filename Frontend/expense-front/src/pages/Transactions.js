import React, {useContext, useEffect, useState} from 'react'
import "../styles/pages/Transactions.css"
import Context from '../utils/Context'
import Metric from '../components/Metric'
import {useNavigate} from 'react-router-dom'

const Transactions = () => {
  const {userFinancialData, fetchUserFinancialData, userName} = useContext(Context)
  const [transactions, setTransactions] = useState([])
  const history = useNavigate()

  const convertToString = (number) => {
    if (typeof number !== 'number') {
      throw new Error('Input must be a number');
    }
    
    // Convert the number to a string and format with commas
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const fetchTransactionHistory = async ()=>{
        let response = await fetch(`http://localhost:8000/api/transactions/?user=${userName}`, {
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            }
        })
        var data = await response.json()
        if(!response.ok){
            alert(data.message)
        }else{
            console.log(data.transactions)
            for(let transaction of data.transactions){
                transaction.amount = convertToString(transaction.amount)
            }
            setTransactions(data.transactions)
        }
  }
  useEffect(()=>{
        fetchUserFinancialData()
        if(userName){
            fetchTransactionHistory()
        }
  }, [userName])
  return (
    <div className='Transactions'>
        <div className='Transactions__container'>
            <div className='Transactions__header'>
                <h3 className='Transactions__title'>Finance Management</h3>
                <div className='Transactions__header-btns'>
                    <button className='Transactions__header-btns-btn' onClick={()=>{history("/income/input")}}>
                        <i className="bi bi-plus-lg"></i>
                        <p>Add Income</p>
                    </button>
                    <button className='Transactions__header-btns-btn' onClick={()=>{history("/expenses/input")}}>
                        <i className="bi bi-plus-lg"></i>
                        <p>Add Expense</p>
                    </button>
                </div>               
            </div>
            <div className='Transactions__cards'>
                    <Metric bgColor={"emerald"} value={userFinancialData?userFinancialData.income:0} title={"Total Income"} icon={"bi-cash-coin"} dest={""} prefix={"Ksh. "}/>       
                    <Metric bgColor={"blue"} value={userFinancialData?userFinancialData.expenses:0} title={"Total Expenses"} icon={"bi-graph-down-arrow"} dest={""} prefix={"Ksh. "}/>
                    <Metric bgColor={"purple"} value={userFinancialData?userFinancialData.income - userFinancialData.expenses:0} title={"Net Balance"} icon={"bi-coin"} dest={""} prefix={"Ksh. "}/>
            </div>
            <div className='Transaction__table'>
                <div className='Transaction__table-header'>
                    <h3 className='Transaction__table-title'>Recent Transactions</h3>
                    <div className='Transaction__table-header-icons'>
                        <i className="bi bi-funnel"></i>
                        Filter
                    </div>
                </div>
                {/* table */}
                <table className='Transaction__table-table'>
                    <thead>
                        <tr>
                            <th>TYPE</th>
                            <th>AMOUNT</th>
                            <th>CATEGORY</th>
                            <th>DATE</th>
                            <th>DESCRIPTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {

                            transactions?transactions.map((transaction, index)=>(
                                        transaction.type=="Expense"?
                                        <tr>
                                        <td>
                                            <span className="transaction-type type-expense">
                                                <i className="bi bi-arrow-down-right"></i>
                                                Expense
                                            </span>
                                        </td>
                                        <td className="amount-expense">Ksh. {transaction.amount}</td>
                                        <td className="category">{transaction.category}</td>
                                        <td className="date">{transaction.date}</td>
                                        <td className="description">{transaction.description}</td>
                                    </tr> :
                                     <tr>
                                     <td>
                                         <span className="transaction-type type-income">
                                             <i className="bi bi-arrow-up-right"></i>
                                             Income
                                         </span>
                                     </td>
                                     <td className="amount-income">Ksh.{transaction.amount}</td>
                                     <td className="category">xxxx</td>
                                     <td className="date">{transaction.date}</td>
                                     <td className="description">{transaction.description}</td>
                                 </tr>

                            )):<></>
                        }
                       
                    </tbody>

                </table>

            </div>
        </div>

    </div>
  )
}

export default Transactions
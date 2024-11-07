import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import '../styles/components/TrendChart.css'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TrendChart = ({expenseData}) => {
  // Sample data - replace with your actual data
  const monthss = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const expensess = [1200, 1400, 1100, 1600, 13000, 15000];
  const [months, setMonths] = useState([])
  const [expenses, setExpenses] = useState([])
  console.log("Expense data"+ expenseData)
  const initData = (obj)=>{
    setExpenses([...expenses, obj.amount]);
    setMonths([...months, obj.date])
    
  }
  useEffect(()=>{
    expenseData.map((obj, index)=>(
            initData(obj)
    ))
  }, [expenseData])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: '',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `Expenses: Ksh.${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `Ksh.${value.toLocaleString()}`,
        },
      },
    },
  };

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Monthly Expenses',
        data: expenses,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#2563eb',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="Trend">
      <div className="Trend__chart">
        <Line options={options} data={data} />
      </div>
    </div>
  );
};

export default TrendChart;

import React from 'react';
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

const TrendChart = () => {
  // Sample data - replace with your actual data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const expenses = [1200, 1400, 1100, 1600, 13000, 15000];

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
// import React from 'react';
// import { Line } from 'react-chartjs-2';
// import 'chart.js/auto';

// const TrendChart = ({ expenseData }) => {
//   // Prepare the data for the chart
//   const data = {
//     labels: expenseData.map(item => item.date), // Dates for the x-axis
//     datasets: [
//       {
//         label: 'Expenses',
//         data: expenseData.map(item => item.amount), // Expense amounts for the y-axis
//         fill: false,
//         backgroundColor: 'rgba(75,192,192,0.6)',
//         borderColor: 'rgba(75,192,192,1)',
//         tension: 0.1
//       },
//     ],
//   };

//   const options = {
//     scales: {
//       x: {
//         type: 'time',
//         time: {
//           unit: 'month' // Adjust to your data granularity (day, month, etc.)
//         }
//       },
//       y: {
//         beginAtZero: true
//       }
//     }
//   };

//   return (
//     <div className="ExpenseTrendChart">
//       <Line data={data} options={options} />
//     </div>
//   );
// };

// export default TrendChart;

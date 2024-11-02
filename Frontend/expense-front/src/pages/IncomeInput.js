import React, { useState, useContext } from 'react';
import '../styles/pages/IncomeInput.css';
import Context from '../utils/Context'

const IncomeInput = () => {
  const [formData, setFormData] = useState({
    amount: '',
    date: '',
    description: '',
  });
  const {userName} = useContext(Context)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Preparing data to be sent in JSON format
    const incomeData = {
      amount: formData.amount,
      date: formData.date,
      description: formData.description,
      userName:userName
    };

    try {
      const response = await fetch('http://localhost:8000/api/incomes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(incomeData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit income data');
      }

      alert('Income data submitted successfully');
      setFormData({ amount: '', date: '', description: '' }); // Reset form
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting income data');
    }
  };

  return (
    <div className="IncomeInput-Wrapper">
      <h2 className="IncomeInput-Title">Add Income</h2>
      <form className="IncomeInput-Form" onSubmit={handleSubmit}>
        <div className="IncomeInput-Form__Field">
          <label className="IncomeInput-Form__Label" htmlFor="amount">
            Amount
          </label>
          <input
            className="IncomeInput-Form__Input"
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="IncomeInput-Form__Field">
          <label className="IncomeInput-Form__Label" htmlFor="date">
            Date
          </label>
          <input
            className="IncomeInput-Form__Input"
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="IncomeInput-Form__Field">
          <label className="IncomeInput-Form__Label" htmlFor="description">
            Description (Optional)
          </label>
          <textarea
            className="IncomeInput-Form__Textarea"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <button className="IncomeInput-Form__Button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default IncomeInput;

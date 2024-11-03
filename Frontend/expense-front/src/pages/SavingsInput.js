import React, { useState, useContext} from 'react';
import "../styles/pages/SavingsInput.css";
import Context from '../utils/Context'

const SavingsInput = () => {
  const {userName} = useContext(Context)
  const [formData, setFormData] = useState({
    savings_title: "",
    goal_amount: "",
    start_date: "",
    end_date: "",
    userName
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Replace with your API endpoint
    let response = await fetch("http://localhost:8000/api/savings-goal/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
    if(!response.ok){
        alert("Internal server error")
    }else{
        let data = await response.json()
        console.log("Success:", data);
        // Reset form or handle success
        setFormData({
          savings_title: "",
          goal_amount: "",
          start_date: "",
          end_date: "",
          userName
        });
    }
     
  };

  return (
    <div className="savings-input">
      <h2 className="savings-input__title">Create a Savings Goal</h2>
      <form className="savings-input__form" onSubmit={handleSubmit}>
        <div className="savings-input__field">
          <label htmlFor="savings_title" className="savings-input__label">
            Savings Title
          </label>
          <input
            type="text"
            id="savings_title"
            name="savings_title"
            className="savings-input__input"
            value={formData.savings_title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="savings-input__field">
          <label htmlFor="goal_amount" className="savings-input__label">
            Goal Amount
          </label>
          <input
            type="number"
            id="goal_amount"
            name="goal_amount"
            className="savings-input__input"
            value={formData.goal_amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="savings-input__field">
          <label htmlFor="start_date" className="savings-input__label">
            Start Date
          </label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            className="savings-input__input"
            value={formData.start_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="savings-input__field">
          <label htmlFor="end_date" className="savings-input__label">
            End Date
          </label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            className="savings-input__input"
            value={formData.end_date}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="savings-input__button">
          Save Goal
        </button>
      </form>
    </div>
  );
};

export default SavingsInput;

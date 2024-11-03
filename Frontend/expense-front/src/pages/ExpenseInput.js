import React, { useState, useEffect, useContext } from 'react';
import '../styles/pages/ExpenseInput.css';
import Context from '../utils/Context'
const ExpenseInput = () => {
  const [formData, setFormData] = useState({
    amount: '',
    date: '',
    description: '',
    category: '', // New category field
  });
  const {userName} = useContext(Context)
  const [categories, setCategories] = useState([]);

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/categories/');
        const data = await response.json();
        console.log(data)
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const expenseData = {
      amount: formData.amount,
      date: formData.date,
      description: formData.description,
      category: formData.category,
      user:userName
    };

    try {
      const response = await fetch('http://localhost:8000/api/expenses/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        let data = await response.json()
        alert(data.error)
        throw new Error('Failed to submit expense data');
      }

      alert('Expense data submitted successfully');
      setFormData({ amount: '', date: '', description: '', category: '' });
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting expense data');
    }
  };

  return (
    <div className="ExpenseInput-Wrapper">
      <h2 className="ExpenseInput-Title">Add Expense</h2>
      <form className="ExpenseInput-Form" onSubmit={handleSubmit}>
        <div className="ExpenseInput-Form__Field">
          <label className="ExpenseInput-Form__Label" htmlFor="amount">
            Amount
          </label>
          <input
            className="ExpenseInput-Form__Input"
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="ExpenseInput-Form__Field">
          <label className="ExpenseInput-Form__Label" htmlFor="date">
            Date
          </label>
          <input
            className="ExpenseInput-Form__Input"
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="ExpenseInput-Form__Field">
          <label className="ExpenseInput-Form__Label" htmlFor="description">
            Description (Optional)
          </label>
          <textarea
            className="ExpenseInput-Form__Textarea"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="ExpenseInput-Form__Field">
          <label className="ExpenseInput-Form__Label" htmlFor="category">
            Category
          </label>
          <select
            className="ExpenseInput-Form__Dropdown"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button className="ExpenseInput-Form__Button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ExpenseInput;

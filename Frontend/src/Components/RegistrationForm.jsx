import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../Redux/userSlice";
import { useNavigate } from "react-router-dom"; 
import "bootstrap/dist/css/bootstrap.min.css";

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { message, error } = useSelector((state) => state.user);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
  });

  const [validationError, setValidationError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");

    
    if (form.password.length < 8) {
      setValidationError("Password must be at least 8 characters long");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    dispatch(registerUser(form));
  };

  return (
    <div className="container mt-5 col-md-6">
      <h3 className="text-center mb-4">User Registration</h3>

    
      <div className="text-end mb-3">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/")}
        >
          ← View User List
        </button>
      </div>

      <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-light">
        
        <div className="form-group mb-3">
          <label className="form-label">First Name</label>
          <input
            type="text"
            name="firstName"
            className="form-control"
            value={form.firstName}
            onChange={handleChange}
            required
            maxLength={50}
          />
        </div>

        
        <div className="form-group mb-3">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            name="lastName"
            className="form-control"
            value={form.lastName}
            onChange={handleChange}
            required
            maxLength={50}
          />
        </div>

        
        <div className="form-group mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        
        <div className="form-group mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
          />
        </div>

        
        <div className="form-group mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            className="form-control"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        
        <div className="form-group mb-3">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            className="form-control"
            value={form.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>

        
        {validationError && <div className="alert alert-warning">{validationError}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <button className="btn btn-primary w-100 mt-3">Register</button>
      </form>
    </div>
  );
};

export default RegistrationForm;

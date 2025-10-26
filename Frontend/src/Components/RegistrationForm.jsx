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

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); 
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return -1;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;
    return age;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.firstName.trim()) newErrors.firstName = "*First Name is required";
    if (!form.lastName.trim()) newErrors.lastName = "*Last Name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) newErrors.email = "*Email is required";
    else if (!emailRegex.test(form.email))
      newErrors.email = "*Invalid email format";

    if (!form.password.trim()) newErrors.password = "*Password is required";
    else if (form.password.length < 8)
      newErrors.password = "*Password must be at least 8 characters long";

    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "*Passwords must match";

    if (!form.dateOfBirth) newErrors.dateOfBirth = "*Date of Birth is required";
    else if (calculateAge(form.dateOfBirth) < 18)
      newErrors.dateOfBirth = "*Must be 18 years old";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
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
          />
          {errors.firstName && (
            <small className="text-danger">{errors.firstName}</small>
          )}
        </div>

        
        <div className="form-group mb-3">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            name="lastName"
            className="form-control"
            value={form.lastName}
            onChange={handleChange}
          />
          {errors.lastName && (
            <small className="text-danger">{errors.lastName}</small>
          )}
        </div>

        
        <div className="form-group mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <small className="text-danger">{errors.email}</small>}
        </div>

        
        <div className="form-group mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && (
            <small className="text-danger">{errors.password}</small>
          )}
        </div>

        
        <div className="form-group mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            className="form-control"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <small className="text-danger">{errors.confirmPassword}</small>
          )}
        </div>

        
        <div className="form-group mb-3">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            className="form-control"
            value={form.dateOfBirth}
            onChange={handleChange}
          />
          {errors.dateOfBirth && (
            <small className="text-danger">{errors.dateOfBirth}</small>
          )}
        </div>

        
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {message && <div className="alert alert-success mt-3">{message}</div>}

        <button className="btn btn-primary w-100 mt-3">Register</button>
      </form>
    </div>
  );
};

export default RegistrationForm;

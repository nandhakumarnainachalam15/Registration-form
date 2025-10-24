import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUserById, updateUser, fetchUsers } from "../Redux/userSlice";
import "bootstrap/dist/css/bootstrap.min.css";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedUser, message, error } = useSelector((state) => state.user);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    dispatch(fetchUserById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedUser) {
      setForm({
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        email: selectedUser.email,
        dateOfBirth: selectedUser.dateOfBirth?.split("T")[0],
      });
    }
  }, [selectedUser]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUser({ id, userData: form })).then(() => {
      dispatch(fetchUsers());
      navigate("/");
    });
  };

  return (
    <div className="container mt-5 col-md-6">
      <h4 className="text-center mb-4">Edit User</h4>

      <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-light">
        {["firstName", "lastName", "email", "dateOfBirth"].map((f) => (
          <div className="form-group mb-3" key={f}>
            <label className="form-label text-capitalize">{f}</label>
            <input
              type={f === "dateOfBirth" ? "date" : "text"}
              name={f}
              className="form-control"
              value={form[f]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <div className="d-flex justify-content-between mt-3">
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/")}>Cancel</button>
          <button type="submit" className="btn btn-primary">Update User</button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;

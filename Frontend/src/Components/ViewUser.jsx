import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ Added useNavigate
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById } from "../Redux/userSlice";
import "bootstrap/dist/css/bootstrap.min.css";

const ViewUser = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ Initialize navigation
  const { selectedUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserById(id));
  }, [dispatch, id]);

  if (!selectedUser) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-5 col-md-6">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="m-0">User Details</h4>

        {/* 🔙 Back Button */}
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/")}
        >
          ← Back to User List
        </button>
      </div>

      <div className="card p-3 shadow-sm">
        <p><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
        <p><strong>Email:</strong> {selectedUser.email}</p>
        <p><strong>Date of Birth:</strong> {new Date(selectedUser.dateOfBirth).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default ViewUser;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser, fetchUserById } from "../Redux/userSlice";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleView = async (id) => {
    await dispatch(fetchUserById(id));
    navigate(`/view/${id}`);
  };

  const handleEdit = async (id) => {
    await dispatch(fetchUserById(id));
    navigate(`/edit/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Registered Users</h4>
        <button className="btn btn-primary" onClick={() => navigate("/register")}>
          ➕ Add New
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {users.length === 0 ? (
        <div className="alert alert-info text-center">No data available</div>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th className="text-center">Action Buttons</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.firstName} {u.lastName}</td>
                <td>{u.email}</td>
                <td className="text-center">
                  <button className="btn btn-sm btn-info me-2" onClick={() => handleView(u._id)}>View</button>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(u._id)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;

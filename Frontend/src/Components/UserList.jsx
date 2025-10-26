import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser, fetchUserById,clearMessage } from "../Redux/userSlice";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, error, loading } = useSelector((state) => state.user);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    dispatch(clearMessage());
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

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      dispatch(deleteUser(id));
    }
  };

  
  const filteredUsers = useMemo(() => {
    if (!debouncedSearch) return users;
    return users.filter((u) => {
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      const email = u.email.toLowerCase();
      return (
        fullName.includes(debouncedSearch) || email.includes(debouncedSearch)
      );
    });
  }, [debouncedSearch, users]);

  return (
    <div className="container mt-5">
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">Registered Users</h4>
        <button className="btn btn-primary" onClick={() => navigate("/register")}>
          ➕ Add New
        </button>
      </div>

      
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            className="btn btn-outline-secondary"
            onClick={() => setSearch("")}
          >
            ❌ Clear
          </button>
        )}
      </div>

      
      {error && <div className="alert alert-danger">{error}</div>}

      
      {loading ? (
        <div className="text-center mt-4">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="alert alert-info text-center shadow-sm">
          No users found{debouncedSearch && (
            <>
              {" "}
              for "<b>{debouncedSearch}</b>"
            </>
          )}
          .
        </div>
      ) : (
        <div className="table-responsive shadow-sm">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-dark text-center">
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th style={{ width: "25%" }}>⚙️Manage</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u._id}>
                  <td>{u.firstName} {u.lastName}</td>
                  <td>{u.email}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => handleView(u._id)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(u._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(u._id, `${u.firstName} ${u.lastName}`)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;

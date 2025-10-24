import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm";
import UserList from "./components/UserList";
import ViewUser from "./components/ViewUser";
import EditUser from "./components/EditUser";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/view/:id" element={<ViewUser />} />
        <Route path="/edit/:id" element={<EditUser />} />
      </Routes>
    </BrowserRouter>
  );
}

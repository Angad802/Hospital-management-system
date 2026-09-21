import React from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import Footer from "./components/footer";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Register from "./pages/register";
import Patients from "./pages/patients";
import Doctors from "./pages/doctors";
import Appointments from "./pages/Appointments";
import Department from "./pages/department";
import Billing from "./pages/Billing";
import Profile from "./pages/profile";

function App() {
    return (
        <div>
            <BrowserRouter>
                <Navbar />

                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />

                    <Route path="/" element={
                        <div className="main-layout">
                            <Sidebar />
                            <Dashboard />
                        </div>
                    } />

                    <Route path="/patients" element={
                        <div className="main-layout">
                            <Sidebar />
                            <Patients />
                        </div>
                    } />

                    <Route path="/doctors" element={
                        <div className="main-layout">
                            <Sidebar />
                            <Doctors />
                        </div>
                    } />

                    <Route path="/appointments" element={
                        <div className="main-layout">
                            <Sidebar />
                            <Appointments />
                        </div>
                    } />

                    <Route path="/appointment" element={
                        <div className="main-layout">
                            <Sidebar />
                            <Appointments />
                        </div>
                    } />

                    <Route path="/departments" element={
                        <div className="main-layout">
                            <Sidebar />
                            <Department />
                        </div>
                    } />

                    <Route path="/department" element={
                        <div className="main-layout">
                            <Sidebar />
                            <Department />
                        </div>
                    } />

                    <Route path="/billing" element={
                        <div className="main-layout">
                            <Sidebar />
                            <Billing />
                        </div>
                    } />

                    <Route path="/profile" element={
                        <div className="main-layout">
                            <Sidebar />
                            <Profile />
                        </div>
                    } />
                </Routes>

                <Footer />
            </BrowserRouter>
        </div>
    );
}
export default App;
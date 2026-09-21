import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
    const [token, setToken] = useState(() => sessionStorage.getItem("token"));
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setToken(sessionStorage.getItem("token"));
    }, [location]);

    useEffect(() => {
        const handleAuthSync = () => {
            setToken(sessionStorage.getItem("token"));
        };
        window.addEventListener("authChange", handleAuthSync);
        window.addEventListener("storage", handleAuthSync);
        return () => {
            window.removeEventListener("authChange", handleAuthSync);
            window.removeEventListener("storage", handleAuthSync);
        };
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        setToken(null);
        window.dispatchEvent(new Event("authChange"));
        navigate("/");
    };

    return (
        <header className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="brand-logo">
                    <span className="brand-icon">🏥</span>
                    <span className="brand-title">
                        Medi<span className="brand-red">core</span>
                    </span>
                    <span className="badge-care">HMS v2.4</span>
                </Link>

                <div className="system-status-indicator">
                    <span className="pulse-dot"></span>
                    <span className="status-text">Hospital System Online</span>
                </div>
            </div>

            <nav className="navlink">
                <Link to="/">Dashboard</Link>
                <Link to="/patients">Patients</Link>
                <Link to="/doctors">Doctors</Link>
                <Link to="/appointments">Appointments</Link>
            </nav>

            <div className="navbar-actions">
                {token ? (
                    <div className="user-nav-group">
                        <Link to="/profile" className="profile-pill-link">
                            <span className="user-avatar-sm">👤</span>
                            <span className="profile-pill-text">My Profile</span>
                        </Link>
                        <button
                            className="btn-logout"
                            onClick={handleLogout}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="auth-nav-group">
                        <Link to="/register">
                            <button className="btn-nav-register">Register</button>
                        </Link>
                        <Link to="/login">
                            <button className="btn-nav-login">
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z" />
                                    <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                                </svg>
                                Login
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Navbar;
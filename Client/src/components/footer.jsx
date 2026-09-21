import React from "react";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>© {new Date().getFullYear()} Medicore Hospital Management System. All Rights Reserved.</p>
                <div className="footer-links">
                    <span>NABH Certified Facility</span>
                    <span>•</span>
                    <span>HIPAA Compliant Data</span>
                    <span>•</span>
                    <span className="footer-emergency">Emergency Desk: +91 (800) 123-4567</span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

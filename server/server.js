import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "./middleware/authMiddleware.js";
import { getPatients, addPatient, deletePatient, updatePatient } from "./controller/patientsControllers.js";
import { getDoctors, addDoctor, deleteDoctor, updateDoctor } from "./controller/doctorsControllers.js";
import { getAppointments, addAppointment, deleteAppointment, updateAppointment } from "./controller/appointmentsControllers.js";
import { getDepartments, addDepartment, deleteDepartment, updateDepartment } from "./controller/departmentsControllers.js";
import { getBilling, addBill, deleteBill, updateBill } from "./controller/billingControllers.js";
import { getProfile, updateProfile } from "./controller/profileControllers.js";

dotenv.config();
import path from "path";
import { fileURLToPath } from "url";
import pool from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
    res.json({
        message: "medicore hms api is running"
    });
});

app.post("/api/auth/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All are required"
            });
        }

        const existinguser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (existinguser.rows.length > 0) {
            return res.status(400).json({
                message: "Email already exist"
            });
        }

        const hashedpassword = await bcrypt.hash(password, 10);

        await pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", [name, email, hashedpassword]);

        res.status(201).json({
            message: "Registration successfull"
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            message: "registration failed"
        });

    }
});

app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({
                message: "Invalid Email and password"
            });
        }
        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({
                message: "Invalid email and password"
            });
        }

        const token = jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role
        },
            process.env.JWT_SECRET || "medicore_secret_key_123",
            {
                expiresIn: "1h"
            }
        )

        res.status(200).json({
            message: "Login successfully",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Login failed"
        });
    }
});

// Profile
app.get("/api/profile", authMiddleware, getProfile);
app.put("/api/profile", authMiddleware, updateProfile);

// Patients
app.get("/api/patients", authMiddleware, getPatients);
app.post("/api/patients", authMiddleware, addPatient);
app.delete("/api/patients/:id", authMiddleware, deletePatient);
app.put("/api/patients/:id", authMiddleware, updatePatient);

// Doctors
app.get("/api/doctors", authMiddleware, getDoctors);
app.post("/api/doctors", authMiddleware, addDoctor);
app.delete("/api/doctors/:id", authMiddleware, deleteDoctor);
app.put("/api/doctors/:id", authMiddleware, updateDoctor);

// Appointments
app.get("/api/appointments", authMiddleware, getAppointments);
app.post("/api/appointments", authMiddleware, addAppointment);
app.delete("/api/appointments/:id", authMiddleware, deleteAppointment);
app.put("/api/appointments/:id", authMiddleware, updateAppointment);

// Departments
app.get("/api/departments", authMiddleware, getDepartments);
app.post("/api/departments", authMiddleware, addDepartment);
app.delete("/api/departments/:id", authMiddleware, deleteDepartment);
app.put("/api/departments/:id", authMiddleware, updateDepartment);

// Billing
app.get("/api/billing", authMiddleware, getBilling);
app.post("/api/billing", authMiddleware, addBill);
app.delete("/api/billing/:id", authMiddleware, deleteBill);
app.put("/api/billing/:id", authMiddleware, updateBill);

// Serve frontend for all non-API routes (SPA routing)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})

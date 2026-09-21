import pool from "../config/db.js";

export async function getAppointments(req, res) {
    try {
        const result = await pool.query(
            "SELECT * FROM appointments ORDER BY id DESC"
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to get appointments"
        });
    }
}

export async function addAppointment(req, res) {
    try {
        const { patient_name, doctor_name, appointment_date, appointment_time, status } = req.body;

        if (!patient_name || !doctor_name || !appointment_date || !appointment_time) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const appointmentStatus = status || "Pending";

        await pool.query(
            "INSERT INTO appointments (patient_name, doctor_name, appointment_date, appointment_time, status) VALUES ($1, $2, $3, $4, $5)",
            [patient_name, doctor_name, appointment_date, appointment_time, appointmentStatus]
        );

        res.status(201).json({
            message: "Appointment added successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to add appointment"
        });
    }
}

export async function deleteAppointment(req, res) {
    try {
        const { id } = req.params;

        await pool.query(
            "DELETE FROM appointments WHERE id = $1",
            [id]
        );

        res.status(200).json({
            message: "Appointment deleted successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to delete appointment"
        });
    }
}

export async function updateAppointment(req, res) {
    try {
        const { id } = req.params;
        const { patient_name, doctor_name, appointment_date, appointment_time, status } = req.body;

        if (!patient_name || !doctor_name || !appointment_date || !appointment_time) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const appointmentStatus = status || "Pending";

        await pool.query(
            "UPDATE appointments SET patient_name = $1, doctor_name = $2, appointment_date = $3, appointment_time = $4, status = $5 WHERE id = $6",
            [patient_name, doctor_name, appointment_date, appointment_time, appointmentStatus, id]
        );

        res.status(200).json({
            message: "Appointment updated successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to update appointment"
        });
    }
}

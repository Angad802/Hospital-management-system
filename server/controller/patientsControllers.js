import pool from "../config/db.js";

export async function getPatients(req, res) {
    try {
        const result = await pool.query(
            "SELECT * FROM patients ORDER BY id DESC"
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to get patients"
        });
    }
}

export async function addPatient(req, res) {
    try {
        const { name, age, gender, phone } = req.body;

        if (!name || !age || !gender || !phone) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        await pool.query(
            "INSERT INTO patients (name, age, gender, phone) VALUES ($1, $2, $3, $4)",
            [name, age, gender, phone]
        );

        res.status(201).json({
            message: "Patient added successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to add patient"
        });
    }
}

export async function deletePatient(req, res) {
    try {
        const { id } = req.params;

        await pool.query(
            "DELETE FROM patients WHERE id = $1",
            [id]
        );

        res.status(200).json({
            message: "Patient deleted successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to delete patient"
        });
    }
}

export async function updatePatient(req, res) {
    try {
        const { id } = req.params;
        const { name, age, gender, phone } = req.body;

        if (!name || !age || !gender || !phone) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        await pool.query(
            "UPDATE patients SET name = $1, age = $2, gender = $3, phone = $4 WHERE id = $5",
            [name, age, gender, phone, id]
        );

        res.status(200).json({
            message: "Patient updated successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to update patient"
        });
    }
}
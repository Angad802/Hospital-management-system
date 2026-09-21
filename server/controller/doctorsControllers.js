import pool from "../config/db.js";

export async function getDoctors(req, res) {
    try {
        const result = await pool.query(
            "SELECT * FROM doctors ORDER BY id DESC"
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to get doctors"
        });
    }
}

export async function addDoctor(req, res) {
    try {
        const { name, specialization, department, phone } = req.body;

        if (!name || !specialization || !department || !phone) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        await pool.query(
            "INSERT INTO doctors (name, specialization, department, phone) VALUES ($1, $2, $3, $4)",
            [name, specialization, department, phone]
        );

        res.status(201).json({
            message: "Doctor added successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to add doctor"
        });
    }
}

export async function deleteDoctor(req, res) {
    try {
        const { id } = req.params;

        await pool.query(
            "DELETE FROM doctors WHERE id = $1",
            [id]
        );

        res.status(200).json({
            message: "Doctor deleted successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to delete doctor"
        });
    }
}

export async function updateDoctor(req, res) {
    try {
        const { id } = req.params;
        const { name, specialization, department, phone } = req.body;

        if (!name || !specialization || !department || !phone) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        await pool.query(
            "UPDATE doctors SET name = $1, specialization = $2, department = $3, phone = $4 WHERE id = $5",
            [name, specialization, department, phone, id]
        );

        res.status(200).json({
            message: "Doctor updated successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to update doctor"
        });
    }
}

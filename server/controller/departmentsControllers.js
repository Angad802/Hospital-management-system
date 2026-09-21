import pool from "../config/db.js";

export async function getDepartments(req, res) {
    try {
        const result = await pool.query(
            "SELECT * FROM departments ORDER BY id ASC"
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to get departments"
        });
    }
}

export async function addDepartment(req, res) {
    try {
        const { name, description, doctor_count } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                message: "Department name and description are required"
            });
        }

        const count = doctor_count ? parseInt(doctor_count) : 0;

        await pool.query(
            "INSERT INTO departments (name, description, doctor_count) VALUES ($1, $2, $3)",
            [name, description, count]
        );

        res.status(201).json({
            message: "Department added successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to add department"
        });
    }
}

export async function deleteDepartment(req, res) {
    try {
        const { id } = req.params;

        await pool.query(
            "DELETE FROM departments WHERE id = $1",
            [id]
        );

        res.status(200).json({
            message: "Department deleted successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to delete department"
        });
    }
}

export async function updateDepartment(req, res) {
    try {
        const { id } = req.params;
        const { name, description, doctor_count } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                message: "Department name and description are required"
            });
        }

        const count = doctor_count !== undefined ? parseInt(doctor_count) : 0;

        await pool.query(
            "UPDATE departments SET name = $1, description = $2, doctor_count = $3 WHERE id = $4",
            [name, description, count, id]
        );

        res.status(200).json({
            message: "Department updated successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to update department"
        });
    }
}

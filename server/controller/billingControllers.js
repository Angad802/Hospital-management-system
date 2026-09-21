import pool from "../config/db.js";

export async function getBilling(req, res) {
    try {
        const result = await pool.query(
            "SELECT * FROM billing ORDER BY id DESC"
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to get bills"
        });
    }
}

export async function addBill(req, res) {
    try {
        const { patient_name, treatment, amount, bill_date, status } = req.body;

        if (!patient_name || !treatment || !amount || !bill_date) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const billStatus = status || "Pending";

        await pool.query(
            "INSERT INTO billing (patient_name, treatment, amount, bill_date, status) VALUES ($1, $2, $3, $4, $5)",
            [patient_name, treatment, amount, bill_date, billStatus]
        );

        res.status(201).json({
            message: "Bill added successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to add bill"
        });
    }
}

export async function deleteBill(req, res) {
    try {
        const { id } = req.params;

        await pool.query(
            "DELETE FROM billing WHERE id = $1",
            [id]
        );

        res.status(200).json({
            message: "Bill deleted successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to delete bill"
        });
    }
}

export async function updateBill(req, res) {
    try {
        const { id } = req.params;
        const { patient_name, treatment, amount, bill_date, status } = req.body;

        if (!patient_name || !treatment || !amount || !bill_date) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const billStatus = status || "Pending";

        await pool.query(
            "UPDATE billing SET patient_name = $1, treatment = $2, amount = $3, bill_date = $4, status = $5 WHERE id = $6",
            [patient_name, treatment, amount, bill_date, billStatus, id]
        );

        res.status(200).json({
            message: "Bill updated successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to update bill"
        });
    }
}

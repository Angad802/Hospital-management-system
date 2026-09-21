import pool from "../config/db.js";

export async function getProfile(req, res) {
    try {
        const result = await pool.query(
            "SELECT id, name, email, role, phone FROM users WHERE id = $1",
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user: result.rows[0]
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to get profile"
        });
    }
}

export async function updateProfile(req, res) {
    try {
        const { name, phone } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Name is required"
            });
        }

        const result = await pool.query(
            "UPDATE users SET name = $1, phone = $2 WHERE id = $3 RETURNING id, name, email, role, phone",
            [name, phone || null, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to update profile"
        });
    }
}

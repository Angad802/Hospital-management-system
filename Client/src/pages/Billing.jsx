import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://humorous-heart-production-1e51.up.railway.app";

function Billing() {
    const [bills, setBills] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [editingBillId, setEditingBillId] = useState(null);

    const [formData, setFormData] = useState({
        patient_name: "",
        treatment: "",
        amount: "",
        bill_date: "",
        status: "Pending"
    });

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    async function handleSaveBill(e) {
        e.preventDefault();

        try {
            const token = sessionStorage.getItem("token");

            if (editingBillId) {
                await axios.put(
                    `${API_URL}/api/billing/${editingBillId}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                alert("Bill updated successfully");
            } else {
                await axios.post(
                    `${API_URL}/api/billing`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                alert("Bill created successfully");
            }

            setShowForm(false);
            setEditingBillId(null);
            setFormData({
                patient_name: "",
                treatment: "",
                amount: "",
                bill_date: "",
                status: "Pending"
            });

            fetchBills();

        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Failed to save bill");
        }
    }

    async function handleDeleteBill(id) {
        if (!window.confirm("Are you sure you want to delete this bill?")) return;

        try {
            const token = sessionStorage.getItem("token");

            await axios.delete(`${API_URL}/api/billing/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert("Bill deleted successfully");
            fetchBills();

        } catch (error) {
            console.log(error);
            alert("Failed to delete bill");
        }
    }

    function handleStartEdit(bill) {
        setEditingBillId(bill.id);
        setFormData({
            patient_name: bill.patient_name,
            treatment: bill.treatment,
            amount: bill.amount,
            bill_date: bill.bill_date,
            status: bill.status
        });
        setShowForm(true);
    }

    function handleCancel() {
        setShowForm(false);
        setEditingBillId(null);
        setFormData({
            patient_name: "",
            treatment: "",
            amount: "",
            bill_date: "",
            status: "Pending"
        });
    }

    async function fetchBills() {
        try {
            const token = sessionStorage.getItem("token");

            const response = await axios.get(
                `${API_URL}/api/billing`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setBills(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchBills();
    }, []);

    function getPaymentStatusClass(status) {
        const lower = (status || "").toLowerCase();
        if (lower === "paid") return "payment-status paid";
        if (lower === "pending") return "payment-status pending";
        return "payment-status unpaid";
    }

    return (
        <main className="billing">
            <div className="page-header">
                <div>
                    <h1>Billing & Invoices</h1>
                    <p>Manage patient hospital charges, treatments and payments</p>
                </div>

                <button className="add-bill-btn" onClick={() => {
                    setEditingBillId(null);
                    setFormData({ patient_name: "", treatment: "", amount: "", bill_date: "", status: "Pending" });
                    setShowForm(true);
                }}>
                    + Create Bill
                </button>
            </div>

            {showForm && (
                <div className="billing-form">
                    <h2>{editingBillId ? "Edit Bill Details" : "Create New Invoice"}</h2>

                    <div className="form-grid">
                        <input
                            type="text"
                            name="patient_name"
                            placeholder="Patient Full Name"
                            value={formData.patient_name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="treatment"
                            placeholder="Treatment / Service Description"
                            value={formData.treatment}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="number"
                            name="amount"
                            placeholder="Amount (₹)"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="date"
                            name="bill_date"
                            value={formData.bill_date}
                            onChange={handleChange}
                            required
                        />

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                            <option value="Unpaid">Unpaid</option>
                        </select>
                    </div>

                    <div className="form-buttons">
                        <button type="button" className="btn-primary" onClick={handleSaveBill}>
                            {editingBillId ? "Update Bill" : "Save Invoice"}
                        </button>

                        <button type="button" className="btn-secondary" onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="billing-search">
                <input
                    type="text"
                    placeholder="Search bills by patient name or treatment..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="billing-table">
                <table>
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Treatment / Service</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {bills
                            .filter((bill) =>
                                (bill.patient_name || "").toLowerCase().includes(search.toLowerCase()) ||
                                (bill.treatment || "").toLowerCase().includes(search.toLowerCase())
                            )
                            .map((bill) => (
                                <tr key={bill.id}>
                                    <td>
                                        <strong>{bill.patient_name}</strong>
                                    </td>
                                    <td>{bill.treatment}</td>
                                    <td className="amount-cell">₹{Number(bill.amount).toLocaleString()}</td>
                                    <td>{bill.bill_date}</td>
                                    <td>
                                        <span className={getPaymentStatusClass(bill.status)}>
                                            {bill.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="edit-btn" onClick={() => handleStartEdit(bill)}>
                                            Edit
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDeleteBill(bill.id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        {bills.length === 0 && (
                            <tr>
                                <td colSpan="6" className="empty-state">No bills or invoices found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

export default Billing;
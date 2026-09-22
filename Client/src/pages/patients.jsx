import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://hms-backend-api-qhcq.onrender.com";

function Patients() {

    const [patients, setPatients] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "",
        phone: ""
    });

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })

    }

    async function handleAddPatient(e) {
        e.preventDefault();

        try {
            const token = sessionStorage.getItem("token");

            await axios.post(
                `${API_URL}/api/patients`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Patient added successfully");

            setShowForm(false);
            setFormData({
                name: "",
                age: "",
                gender: "",
                phone: ""
            });

            fetchPatients();

        } catch (error) {
            console.log(error);
            alert("Failed to add patient");
        }
    }


    async function handleDeletePatient(id) {
        try {
            const token = sessionStorage.getItem("token");

            await axios.delete(`${API_URL}/api/patients/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert("Patient deleted successfully");

            fetchPatients();

        } catch (error) {
            console.log(error);
            alert("Failed to delete patient");
        }
    }


    async function handleEditPatient(patient) {
        const name = prompt("Enter patient name", patient.name);
        const age = prompt("Enter patient age", patient.age);
        const gender = prompt("Enter gender", patient.gender);
        const phone = prompt("Enter phone", patient.phone);

        if (!name || !age || !gender || !phone) {
            return;
        }

        try {
            const token = sessionStorage.getItem("token");

            await axios.put(
                `${API_URL}/api/patients/${patient.id}`,
                {
                    name,
                    age,
                    gender,
                    phone
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Patient updated successfully");

            fetchPatients();

        } catch (error) {
            console.log(error);
            alert("Failed to update patient");
        }
    }

    async function fetchPatients() {
        try {
            const token = sessionStorage.getItem("token");

            const response = await axios.get(
                `${API_URL}/api/patients`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setPatients(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchPatients();
    }, []);

    return (
        <div className="patients">

            <div className="page-header">
                <div>
                    <h1>Patients</h1>
                    <p>Manage hospital patients</p>
                </div>

                <button className="add-patient-btn" onClick={() => setShowForm(true)}>
                    + Add Patient
                </button>
            </div>
            {showForm && (
                <div className="patient-form">

                    <h2>Add New Patient</h2>

                    <input
                        type="text"
                        name="name"
                        placeholder="Patient Name"
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        value={formData.age}
                        onChange={handleChange}
                    />

                    <select name="gender" value={formData.gender}
                        onChange={handleChange}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>

                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />

                    <button onClick={handleAddPatient} >Save Patient</button>

                    <button onClick={() => setShowForm(false)}>
                        Cancel
                    </button>

                </div>
            )}

            <div className="patient-search">
                <input
                    type="text"
                    placeholder="Search patient..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="patient-table">

                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Phone</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        {patients
                            .filter((patient) =>
                                patient.name.toLowerCase().includes(search.toLowerCase())
                            )
                            .map((patient) => (
                                <tr key={patient.id}>

                                    <td>{patient.name}</td>
                                    <td>{patient.age}</td>
                                    <td>{patient.gender}</td>
                                    <td>{patient.phone}</td>

                                    <td>
                                        <button className="edit-btn" onClick={() => handleEditPatient(patient)}>
                                            Edit
                                        </button>

                                        <button className="delete-btn" onClick={() => handleDeletePatient(patient.id)}>
                                            Delete
                                        </button>
                                    </td>

                                </tr>
                            ))}

                    </tbody>
                </table>

            </div>

        </div>
    );
}

export default Patients;
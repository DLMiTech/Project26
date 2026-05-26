import React, {useState} from 'react';
import {Link} from "react-router-dom";
import axios from "axios";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    })
    const [error, setErrors] = useState({})
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const validate = () => {
        let newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone is required";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            }

            const response = await axios.post(
                "http://localhost:5000/auth/register", payload
            );

            console.log(response);

            alert("Registration successful");

        } catch (error) {

            if (error.response) {
                alert(error.response.message);
            } else {
                alert("Server error");
            }

        }
    };

    return (
        <div>
            <h1>Register Page</h1>

            <form action="" onSubmit={handleRegister}>
                <div>
                    <label htmlFor="name">Name:</label><br/>
                    <input type="text" name={`name`} value={formData.name} onChange={handleChange} /><br/>
                    <small className={`text-danger`}>{error.name}</small>
                </div>

                <div>
                    <label htmlFor="email">Email:</label><br/>
                    <input type="email" name={`email`} value={formData.email} onChange={handleChange} /><br/>
                    <small className={`text-danger`}>{error.email}</small>
                </div>

                <div>
                    <label htmlFor="phone">Phone:</label><br/>
                    <input type="number" name={`phone`} value={formData.phone} onChange={handleChange} /><br/>
                    <small className={`text-danger`}>{error.phone}</small>
                </div>

                <div>
                    <label htmlFor="password">Password:</label><br/>
                    <input type="password" name={`password`} value={formData.password} onChange={handleChange} /><br/>
                    <small className={`text-danger`}>{error.password}</small>
                </div>

                <div>
                    <label htmlFor="confirmPassword">Confirm password:</label><br/>
                    <input type="password" name={`confirmPassword`} value={formData.confirmPassword} onChange={handleChange} /><br/>
                    <small className={`text-danger`}>{error.confirmPassword}</small>
                </div>

                <button type="submit">Register</button>
            </form>

            <p>Already have an account? <Link to={`/`}>Login</Link></p>
        </div>
    );
};

export default Register;
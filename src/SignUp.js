import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';  // Assuming the same styles from LoginForm are in App.css

function SignUp() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        profileImage: null,
    });
    const [error, setError] = useState('');  // State to handle errors
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setFormData({ ...formData, profileImage: reader.result.split(',')[1] });
        };
    };

    // Function to handle logout
    const handleSignIn= () => {
        localStorage.removeItem('user');  // Clear user session
        navigate('/login');  // Redirect to login page
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://0gh1gn6av0.execute-api.us-east-1.amazonaws.com/dev/signup', {
                email: formData.email,
                password: formData.password,
                name: formData.name,
                profileImage: formData.profileImage,
            });
            console.log(response.data);
            navigate('/login');  // Redirect to login page on success
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setError('Email is already registered. Please use a different email.');
            } else {
                console.error('Sign Up Error:', error);
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="form-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="file"
                        name="profileImage"
                        onChange={handleFileChange}
                        required
                        className="form-input"
                    />
                </div>
                <button type="submit" className="form-button">Sign Up</button>
            </form>
            <button onClick={handleSignIn}>SignIn</button>  {/* Logout button */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default SignUp;

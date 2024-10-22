import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

function LoginForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();  // Initialize useNavigate hook

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://0gh1gn6av0.execute-api.us-east-1.amazonaws.com/dev/signin', {
                email: formData.email,
                password: formData.password,
            });

            const profileImageUrl = response.data.profileImageUrl;  // Assuming this is in the response
            // Save user data in localStorage (if needed)
            localStorage.setItem('user', JSON.stringify(response.data));

            // Navigate to home page and pass email and profileImageUrl as state
            navigate('/home', { state: { email: formData.email, profileImageUrl } });
        } catch (error) {
            setError('Invalid email or password. Please try again.');
            console.error('Login Error:', error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default LoginForm;

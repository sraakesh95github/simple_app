import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function HomePage() {
    const location = useLocation();
    const navigate = useNavigate();  // Hook to navigate between pages
    const email = location.state?.email || '';  // Retrieve the email passed from LoginForm
    const initialProfileImageUrl = location.state?.profileImageUrl || '';  // Retrieve the profile image URL if available
    const [profileImageUrl, setProfileImageUrl] = useState(initialProfileImageUrl);  // State to handle profile image
    const [file, setFile] = useState(null);  // State to store the selected file

    // Function to handle file input change
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);  // Store the selected file
            const reader = new FileReader();
            reader.onload = () => {
                setProfileImageUrl(reader.result);  // Update profile image to the uploaded file
            };
            reader.readAsDataURL(selectedFile);  // Convert file to a Base64 string
        }
    };

    // Function to trigger file input when image is clicked
    const handleImageClick = () => {
        document.getElementById('fileInput').click();  // Programmatically click the hidden input
    };

    // Function to send email and profile image to the API
    const handleSubmit = async () => {
        if (!file) {
            alert('Please upload an image.');
            return;
        }
        try {
            const reader = new FileReader();
            reader.onload = async () => {
                const base64Image = reader.result.split(',')[1];  // Extract Base64 string
                const response = await axios.post('https://0gh1gn6av0.execute-api.us-east-1.amazonaws.com/dev/uploadimage', {
                    email: email,
                    profileImage: base64Image,  // Base64 string of the uploaded image
                });
                console.log('Upload Success:', response.data);
            };
            reader.readAsDataURL(file);  // Convert file to a Base64 string
        } catch (error) {
            console.error('Upload Error:', error);
        }
    };

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('user');  // Clear user session
        navigate('/login');  // Redirect to login page
    };

    return (
        <div>
            <h2>Welcome to the Home Page</h2>

            {profileImageUrl ? (
                <img
                    src={profileImageUrl}
                    alt="Profile"
                    style={{ width: '150px', height: 'auto', cursor: 'pointer' }}
                    onClick={handleImageClick}  // Trigger file upload when image is clicked
                />
            ) : (
                <p>No profile image available.</p>
            )}

            {/* Hidden file input */}
            <input
                id="fileInput"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}  // Hide the input field
                onChange={handleFileChange}  // Handle the file selection
            />

            <button onClick={handleSubmit}>Submit</button> {/* Submit the image to API */}
            <button onClick={handleLogout}>Logout</button>  {/* Logout button */}
        </div>
    );
}

export default HomePage;

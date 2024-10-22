import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './SignUp';
import LoginForm from './LoginForm';
import HomePage from './HomePage';  // Import the HomePage component

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<SignUp />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/home" element={<HomePage />} />  {/* Add route for HomePage */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;

import React from "react";

export default function Login() {

const fetchLogin = async () => {
    try {
        const response = await fetch('https://photobooth-lx7n9.ondigitalocean.app/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: 'your_username',
                password: 'your_password',
            }),
        });
        const data = await response.json();
        console.log('Login successful:', data);
    } catch (error) {
        console.error('Error during login:', error);
    }
};

return (
<div className="container">
    <div className="inputArea">
        <label htmlFor="username">Username</label>
        <input type="text" placeholder="Username" id="username" required />
    </div>
    <div className="inputArea">
        <label htmlFor="password">Password</label>
        <input type="password" placeholder="Password" id="password" required />
    </div>
    <button onClick={fetchLogin}>Login</button>
</div>
);

}
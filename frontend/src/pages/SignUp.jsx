import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Package, User, Mail, Lock } from "lucide-react";
import "../App.css";

function SignUp() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setMessage("");

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setMessage("Password must be at least 6 characters.");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:5000/api/auth/register",
                {
                    name,
                    email,
                    password
                }
            );

            alert(response.data.message);
            navigate("/");

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to create account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">

                <div className="login-logo">
                    <Package size={45} />
                </div>

                <h1>KPD Company</h1>
                <h2>Create Account</h2>

                <p className="login-subtitle">
                    Register your administrator account
                </p>

                {message && (
                    <p className="error-message">{message}</p>
                )}

                <form onSubmit={handleSignUp}>

                    <label>Full Name</label>
                    <div className="input-group">
                        <User size={18} />
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <label>Email Address</label>
                    <div className="input-group">
                        <Mail size={18} />
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <label>Password</label>
                    <div className="input-group">
                        <Lock size={18} />
                        <input
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <label>Confirm Password</label>
                    <div className="input-group">
                        <Lock size={18} />
                        <input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>

                </form>

                <div className="signup-link">
                    <p>
                        Already have an account?{" "}
                        <Link to="/">Login</Link>
                    </p>
                </div>

                <p className="login-footer">
                    KPD Company Inventory Tracker © 2026
                </p>

            </div>
        </div>
    );
}

export default SignUp;

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Package, Lock, Mail } from "lucide-react";
import "../App.css";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setMessage("");

            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                { email, password }
            );

            localStorage.setItem("token", response.data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            navigate("/dashboard");

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to connect to the server."
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
                <h2>Inventory Tracker</h2>


                {message && (
                    <p className="error-message">{message}</p>
                )}

                <form onSubmit={handleLogin}>

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
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>


                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <div className="signup-link">
                    <p>
                        No account yet?{" "}
                        <Link to="/signup">Sign Up</Link>
                    </p>
                </div>

                <p className="login-footer">
                    KPD Company Inventory Tracker © 2026
                </p>

            </div>
        </div>
    );
}

export default Login;

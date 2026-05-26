// Login.jsx
import AuthLayout from "./AuthLayout.jsx";
import compassLogo from '../../assets/logo/compass-logo.png'
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import {toast} from "react-toastify";

export default function Login() {
    const [step, setStep] = useState('login');
    const [formData01, setFormData01] = useState({email:"", password:""})
    const [formData02, setFormData02] = useState({code:""})
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const validate01 = () => {
        if (formData01.email === "" || formData01.password === ""){
            toast.warn("All fields are required to register");
            return false;
        }
        return true;
    }
    const handleChange01 = (e) => {
        setFormData01({
            ...formData01,
            loginAction: true,
            [e.target.name]: e.target.value});
    }
    const handleSubmitLogin = (e) => {
        e.preventDefault();
        if (!validate01()) return;
        setLoading(true);
        try {
            //Call API
            const res = {
                status: 200,
                message: "Login successfully, please verify your email.",
                data: {
                    id: 1,
                    email: "bob@gmail.com"
                }
            }
            if (res?.status === 200) {
                toast.success(res?.message);
                setUser(res.data);
                setStep('verification');
            }else {
                toast.error(res?.message);
            }
        }catch(err) {
            console.log(err);
        }finally {
            setLoading(false);
        }
    }


    const validate02 = () => {
        if (formData02.code === ""){
            toast.warn("Code field is required");
            return false;
        }
        return true;
    }
    const handleChange02 = (e) => {
        setFormData02({
            ...formData02,
            user_id: user.id,
            email: user.email,
            verifyAccount: true,
            [e.target.name]: e.target.value});
    }
    const handleSubmitVerifyAccount = (e) => {
        e.preventDefault();
        if (!validate02()) return;
        setLoading(true);
        try {
            //Call API
            const res = {
                status: 200,
                message: "Verification successfully, Welcome",
                data: {},
            }
            if (res?.status === 200) {
                toast.success(res?.message);
                setUser({});
                navigate('/dashboard')
            }else {
                toast.error(res?.message);
            }
        }catch(err) {
            console.log(err);
        }finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout>
            {step === "login" && (
                <div className="form-container">

                    <div className={`d-flex align-items-start justify-content-between`}>
                        <div>
                            <h2 className={`header`}>Welcome Back !</h2>
                            <p className="subtitle">
                                Sign in to continue.
                            </p>
                        </div>

                        <img src={compassLogo} alt={compassLogo} className="logo" />
                    </div>

                    <form onSubmit={handleSubmitLogin}>
                        {/* email */}
                        <div className="input-wrapper">
                            <label>Email address</label>
                            <i className="ri-mail-open-line left-icon"></i>
                            <input
                                type="email"
                                className="form-control auth-input"
                                placeholder="Enter email"
                                value={formData01.email}
                                onChange={handleChange01}
                                name="email"
                            />
                        </div>

                        {/* Password */}
                        <div className="input-wrapper">
                            <div className="d-flex justify-content-between align-items-center">
                                <label>Password</label>
                                <a href="/forgot-password" className="forgot-link">
                                    Forgot password?
                                </a>
                            </div>
                            <i className="ri-lock-password-line left-icon"></i>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control auth-input"
                                placeholder="Enter password"
                                value={formData01.password}
                                onChange={handleChange01}
                                name="password"
                            />

                            <i className={`${showPassword?"ri-eye-off-line":"ri-eye-line"} right-icon`} onClick={()=> setShowPassword(!showPassword)}></i>
                        </div>

                        {/* Button */}
                        <button className="btn app-btn secondary">
                            {loading ? "loading ..." : "Login"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="divider">
                        <span>Don’t have an account ?{" "} <Link to="/register" className={`auth-link`}>Signup</Link></span>
                    </div>

                </div>
            )}


            {step === "verification" && (
                <div className="form-container">
                    <div className={`d-flex align-items-start justify-content-between`}>
                        <div>
                            <h2 className={`header`}>Verify Account !</h2>
                            <p className="subtitle">
                                Enter the OTP code sent to your email.
                            </p>
                        </div>

                        <img src={compassLogo} alt={compassLogo} className="logo" />
                    </div>

                    <form onSubmit={handleSubmitVerifyAccount}>
                        {/* email */}
                        <div className="input-wrapper">
                            <label>OTP Code</label>

                            <i className="ri-code-box-line left-icon"></i>

                            <input
                                type="text"
                                className="form-control auth-input"
                                placeholder="Enter verification code"
                                value={formData02.code}
                                onChange={handleChange02}
                                name="code"
                            />
                        </div>

                        {/* Button */}
                        <button className="btn app-btn secondary">
                            {loading ? "loading..." : "Verify"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="divider">
                        <span>Back to login ?{" "} <Link to="/" className={`auth-link`}>Login</Link></span>
                    </div>
                </div>
            )}
        </AuthLayout>
    );
}
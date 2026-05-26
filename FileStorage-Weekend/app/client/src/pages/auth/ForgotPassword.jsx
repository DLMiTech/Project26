// Login.jsx
import AuthLayout from "./AuthLayout.jsx";
import compassLogo from '../../assets/logo/compass-logo.png'
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import {toast} from "react-toastify";

export default function ForgotPassword() {
    const [step, setStep] = useState('forgot-password');
    const [formData01, setFormData01] = useState({email:""})
    const [formData02, setFormData02] = useState({code:""})
    const [formData03, setFormData03] = useState({password:"", confirmPassword:""})
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const validate01 = () => {
        if (formData01.email === ""){
            toast.warn("Please enter email to reset your password");
            return false;
        }
        return true;
    }
    const handleChange01 = (e) => {
        setFormData01({
            ...formData01,
            forgotPassword: true,
            [e.target.name]: e.target.value});
    }
    const handleSubmitForgotPassword = (e) => {
        e.preventDefault();
        if (!validate01()) return;
        setLoading(true);
        try {
            //Call API
            const res = {
                status: 200,
                message: "Verify your account",
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
                message: "Verification successfully, reset your password.",
                data: {
                    id: 1,
                    email: "bob@gmail.com"
                }
            }
            if (res?.status === 200) {
                toast.success(res?.message);
                setUser(res.data);
                setStep('password-reset');
            }else {
                toast.error(res?.message);
            }
        }catch(err) {
            console.log(err);
        }finally {
            setLoading(false);
        }
    }


    const validate03 = () => {
        if (formData03.password === "" || formData03.password === "") {
            toast.warn("Password and password is required");
            return false;
        }
        if (formData03.password.length < 4) {
            toast.warn("Password must be at least 4 characters");
            return false;
        }
        if (formData03.password !== formData03.confirmPassword) {
            toast.warn("Password and confirm password mismatch");
            return false;
        }
        return true;
    }
    const handleChange03 = (e) => {
        setFormData03({
            ...formData03,
            user_id: user.id,
            email: user.email,
            resetPassword: true,
            [e.target.name]: e.target.value});
    }
    const handleSubmitResetPassword = (e) => {
        e.preventDefault();
        if (!validate03()) return;
        setLoading(true);
        try {
            //Call API
            const res = {
                status: 200,
                message: "Password reset successfully, please login.",
            }
            if (res?.status === 200) {
                toast.success(res?.message);
                setUser({});
                navigate("/login");
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
            {step === "forgot-password" && (
                <div className="form-container">
                    <div className={`d-flex align-items-start justify-content-between`}>
                        <div>
                            <h2 className={`header`}>Forgot Password !</h2>
                            <p className="subtitle">
                                Enter your email to reset your password.
                            </p>
                        </div>

                        <img src={compassLogo} alt={compassLogo} className="logo" />
                    </div>

                    <form onSubmit={handleSubmitForgotPassword}>
                        {/* email */}
                        <div className="input-wrapper">
                            <label>Email address</label>

                            <i className="ri-mail-open-line left-icon"></i>

                            <input
                                type="text"
                                className="form-control auth-input"
                                placeholder="Enter email"
                                value={formData01.email}
                                onChange={handleChange01}
                                name="email"
                            />
                        </div>

                        {/* Button */}
                        <button className="btn app-btn secondary">
                            {loading ? "loading..." : "Submit"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="divider">
                        <span>Back to login ?{" "} <Link to="/" className={`auth-link`}>Login</Link></span>
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


            {step === "password-reset" && (
                <div className="form-container">
                    <div className={`d-flex align-items-start justify-content-between`}>
                        <div>
                            <h2 className={`header`}>Reset Password !</h2>
                            <p className="subtitle">
                                Enter password and confirm your password.
                            </p>
                        </div>

                        <img src={compassLogo} alt={compassLogo} className="logo" />
                    </div>

                    <form onSubmit={handleSubmitResetPassword}>
                        {/* email */}
                        <div className="input-wrapper">
                            <label>Password</label>
                            <i className="ri-lock-password-line left-icon"></i>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control auth-input"
                                placeholder="Enter password"
                                value={formData03.password}
                                onChange={handleChange03}
                                name="password"
                            />
                            <i className={`${showPassword?"ri-eye-off-line":"ri-eye-line"} right-icon`} onClick={()=> setShowPassword(!showPassword)}></i>
                        </div>


                        <div className="input-wrapper">
                            <label>Confirm password</label>
                            <i className="ri-lock-password-line left-icon"></i>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control auth-input"
                                placeholder="Enter confirm password"
                                value={formData03.confirmPassword}
                                onChange={handleChange03}
                                name="confirmPassword"
                            />
                            <i className={`${showPassword?"ri-eye-off-line":"ri-eye-line"} right-icon`} onClick={()=> setShowPassword(!showPassword)}></i>
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
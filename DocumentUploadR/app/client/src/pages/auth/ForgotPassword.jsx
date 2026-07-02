import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import AuthLayout from "./AuthLayout.jsx";
import ktuLogo from "../../assets/logo/ktu-logo.png";
import AuthRequest from "../request/auth.jsx";

const ForgotPassword = () => {
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
    const handleSubmitForgotPassword = async (e) => {
        e.preventDefault();
        if (!validate01()) return;
        setLoading(true);
        try {
            //Call API
            const payload = {
                ...formData01
            }
            const res = await AuthRequest.forgot_password(payload);

            if (res?.status === 200) {
                toast.success(res?.message);
                setUser(res.data);
                setStep('verification');
            } else {
                toast.error(res?.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        } finally {
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
    const handleSubmitVerifyAccount = async (e) => {
        e.preventDefault();
        if (!validate02()) return;
        setLoading(true);
        try {
            //Call API

            const payload = {
                email: formData02.email,
                otp: formData02.code,
            }
            const res = await AuthRequest.verify_forgot_password_otp(payload);

            if (res?.status === 200) {
                toast.success(res?.message);
                setUser(res.data);
                setStep('password-reset');
            } else {
                toast.error(res?.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        } finally {
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
    const handleSubmitResetPassword = async (e) => {
        e.preventDefault();
        if (!validate03()) return;
        setLoading(true);
        try {
            //Call API
            const payload = {
                email: formData03.email,
                newPassword: formData03.password,
            }
            const res = await AuthRequest.reset_password(payload);

            if (res?.status === 200) {
                toast.success(res?.message);
                setUser({});
                navigate("/login");
            } else {
                toast.error(res?.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }


    return (
        <AuthLayout>
            {step === "forgot-password" && (
                <div className="auth-form-wrapper">

                    <div className="top-row">
                        <div>
                            <h2 className={`header`}>Forgot password!</h2>
                            <p className={`sub-tittle`}>Enter your email to reset your password.</p>
                        </div>

                        <img src={ktuLogo} alt={ktuLogo} className={`ktu-logo`}/>
                    </div>

                    <form onSubmit={handleSubmitForgotPassword}>
                        {/* Email */}
                        <div className="custom-input">
                            <label>Email Address</label>

                            <div className="input-box">
                                <i className="ri-mail-line left-icon"></i>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter email"
                                    value={formData01.email}
                                    onChange={handleChange01}
                                    name="email"
                                />
                            </div>
                        </div>

                        {/* Login Button */}
                        <button className="login-button">
                            {loading ? "loading..." : "Submit"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="divider">
                        <span>Back to login ?{" "}<Link to="/login" className={`link`}> Login</Link></span>
                    </div>
                </div>
            )}

            {step === "verification" && (
                <div className="auth-form-wrapper">

                    <div className="top-row">
                        <div>
                            <h2 className={`header`}>Verify Account!</h2>
                            <p className={`sub-tittle`}> Enter the OTP code sent to your email.</p>
                        </div>

                        <img src={ktuLogo} alt={ktuLogo} className={`ktu-logo`}/>
                    </div>

                    <form onSubmit={handleSubmitVerifyAccount}>
                        {/* Email */}
                        <div className="custom-input">
                            <label>OTP Code</label>

                            <div className="input-box">
                                <i className="ri-code-box-line left-icon"></i>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter verification code"
                                    value={formData02.code}
                                    onChange={handleChange02}
                                    name="code"
                                />
                            </div>
                        </div>

                        {/* Login Button */}
                        <button className="login-button">
                            {loading ? "loading..." : "Verify"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="divider">
                        <span>Back to login ?{" "}<Link to="/login" className={`link`}> Login</Link></span>
                    </div>
                </div>
            )}


            {step === "password-reset" && (
                <div className="auth-form-wrapper">

                    <div className="top-row">
                        <div>
                            <h2 className={`header`}>Reset Password!</h2>
                            <p className={`sub-tittle`}>Enter password and confirm your password.</p>
                        </div>

                        <img src={ktuLogo} alt={ktuLogo} className={`ktu-logo`}/>
                    </div>

                    <form onSubmit={handleSubmitResetPassword}>
                        {/* Password */}
                        <div className="custom-input">
                            <label>Password</label>

                            <div className="input-box">
                                <i className="ri-lock-password-line left-icon"></i>

                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    placeholder="Enter password"
                                    value={formData03.password}
                                    onChange={handleChange03}
                                    name="password"
                                />

                                <i className={`${showPassword?"ri-eye-off-line":"ri-eye-line"} right-icon`} onClick={()=> setShowPassword(!showPassword)}></i>
                            </div>
                        </div>


                        {/* Password */}
                        <div className="custom-input">
                            <label>Confirm password</label>

                            <div className="input-box">
                                <i className="ri-lock-password-line left-icon"></i>

                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    placeholder="Enter confirm password"
                                    value={formData03.confirmPassword}
                                    onChange={handleChange03}
                                    name="confirmPassword"
                                />

                                <i className={`${showPassword?"ri-eye-off-line":"ri-eye-line"} right-icon`} onClick={()=> setShowPassword(!showPassword)}></i>
                            </div>
                        </div>


                        {/* Login Button */}
                        <button className="login-button">
                            {loading ? "loading..." : "Verify"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="divider">
                        <span>Back to login ?{" "}<Link to="/login" className={`link`}> Login</Link></span>
                    </div>
                </div>
            )}
        </AuthLayout>
    );
};

export default ForgotPassword;
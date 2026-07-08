import React, {useState} from 'react';
import ktuLogo from "../../assets/logo/ktu-logo.png";
import {Link, useNavigate} from "react-router-dom";
import AuthLayout from "./AuthLayout.jsx";
import {toast} from "react-toastify";
import AuthRequest from "../../request/auth.jsx";
import AuthVerify from "../../service/AuthVerify.jsx";

const Register = () => {
    const [step, setStep] = useState('register');
    const [formData01, setFormData01] = useState({email:"", name:"", password:""})
    const [formData02, setFormData02] = useState({code:""})
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const validate01 = () => {
        if (formData01.email === "" || formData01.name === "" || formData01.password === ""){
            toast.warn("All fields are required to register");
            return false;
        }
        if (formData01.password.length < 4) {
            toast.warn("Password must be at least 4 characters");
            return false;
        }
        return true;
    }
    const handleChange01 = (e) => {
        setFormData01({
            ...formData01,
            registerPassword: true,
            [e.target.name]: e.target.value});
    }
    const handleSubmitRegister = async (e) => {
        e.preventDefault();
        if (!validate01()) return;
        setLoading(true);
        try {
            const payload = {
                ...formData01
            }

            const res = await AuthRequest.register(payload);

            if (res?.status === 201) {
                toast.success(res?.message);
                setUser(res.data);
                setStep('verification');
            }else {
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

            const res = await AuthRequest.verify_otp(payload);

            if (res?.status === 200) {
                toast.success(res?.message);
                setUser({});
                AuthVerify.saveToken(res?.token);
                navigate('/dashboard')
            }else {
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
            {step === "register" && (
                <div className="auth-form-wrapper">

                    <div className="top-row">
                        <div>
                            <h2 className={`header`}>Login Now!</h2>
                            <p className={`sub-tittle`}>Welcome back, continue your session</p>
                        </div>

                        <img src={ktuLogo} alt={ktuLogo} className={`ktu-logo`}/>
                    </div>

                    <form onSubmit={handleSubmitRegister}>
                        {/* Email */}
                        <div className="custom-input">
                            <label>Name</label>

                            <div className="input-box">
                                <i className="ri-user-3-line left-icon"></i>

                                <input
                                    type="text"
                                    className="form-control auth-input"
                                    placeholder="Enter fullname"
                                    value={formData01.name}
                                    onChange={handleChange01}
                                    name="name"
                                />
                            </div>
                        </div>


                        {/* Email */}
                        <div className="custom-input">
                            <label>Email Address</label>

                            <div className="input-box">
                                <i className="ri-mail-line left-icon"></i>

                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter email"
                                    value={formData01.email}
                                    onChange={handleChange01}
                                    name="email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="custom-input">
                            <div className="label-flex">
                                <label>Password</label>

                                <Link to="/forgot-password" className={`link`}>Forgot Password?</Link>
                            </div>

                            <div className="input-box">
                                <i className="ri-lock-password-line left-icon"></i>

                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    placeholder="Enter password"
                                    value={formData01.password}
                                    onChange={handleChange01}
                                    name="password"
                                />

                                <i className={`${showPassword?"ri-eye-off-line":"ri-eye-line"} right-icon`} onClick={()=> setShowPassword(!showPassword)}></i>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button className="login-button">
                            {loading ? "loading ..." : "Register"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="divider">
                        <span>Already have an account ?{" "}<Link to="/login" className={`link`}> Login</Link></span>
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
                        <span>Already have an account ?{" "}<Link to="/login" className={`link`}> Login</Link></span>
                    </div>
                </div>
            )}

        </AuthLayout>
    );
};

export default Register;
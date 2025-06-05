import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from '../enums/RoutePath';


const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [otpId, setOtpId] = useState('');
  const [mfaId, setMfaId] = useState('');

  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const { login, verifyOTP, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(RoutePath.HOME);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (mfaRequired && resendTimer > 0) {
      const timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [mfaRequired, resendTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const mfaData = await login(username, password);
      if (mfaData) {
        const [receivedOtpId, receivedMfaId] = mfaData.split('|');
        setOtpId(receivedOtpId);
        setMfaId(receivedMfaId);
        setMfaRequired(true);
        setResendTimer(30);
        setCanResend(false);
      } else {
        navigate(RoutePath.HOME);
      }
    } catch (error) {
      console.error('Login failed', error);
      setErrorMessage('Invalid email or password. Please try again.');
    }

    setIsLoading(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      await verifyOTP(otp, otpId, mfaId);
      navigate(RoutePath.HOME);
    } catch (error) {
      console.error('OTP verification failed', error);
      setErrorMessage('Invalid OTP. Please try again.');
    }

    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      setErrorMessage('');
      setCanResend(false);
      setResendTimer(30);

      const result = await login(username, password);
      if (result) {
        const [newOtpId, newMfaId] = result.split('|');
        setOtpId(newOtpId);
        setMfaId(newMfaId);
      }
    } catch (error) {
      console.error('Failed to resend OTP', error);
      setErrorMessage('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="card w-96 bg-white shadow-xl">
        <div className="card-body">
          <h1 className="text-2xl font-bold text-center">Hatchwise Admin</h1>

          {!mfaRequired ? (
            <form onSubmit={handleSubmit} className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="text"
                placeholder="Email"
                className="input input-bordered"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <h2 className="text-sm text-red-600 mt-4">{errorMessage}</h2>

              {/* <h2 className='cursor-pointer text-black' onClick={() => {navigate(RoutePath.RESET_PASS)}}> Forgot your password?</h2> */}
              <button className="btn btn-neutral mt-4" type="submit">
                {isLoading ? <span className="loading loading-spinner loading-sm"></span> : 'Login'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="form-control">
              <label className="label">
                <span className="label-text">Enter OTP</span>
              </label>
              <input
                type="text"
                placeholder="OTP Code"
                className="input input-bordered"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <h2 className="text-sm text-red-600 mt-4">{errorMessage}</h2>
              <button className="btn btn-neutral mt-4" type="submit">
                {isLoading ? <span className="loading loading-spinner loading-sm"></span> : 'Verify OTP'}
              </button>
              
              {/* Resend OTP button with countdown */}
              <button
                className={`btn btn-outline mt-2 ${!canResend ? 'btn-disabled' : ''}`}
                onClick={handleResendOtp}
                disabled={!canResend}
              >
                {canResend ? 'Resend OTP' : `Resend OTP in ${resendTimer}s`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpenIcon, GoogleIcon, PhoneIcon } from './icons';

const LoginPage: React.FC = () => {
  const { loginWithGoogle, loginWithPhone } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handlePhoneLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      // Mock sending OTP
      console.log(`Sending OTP to ${phone}`);
      setOtpSent(true);
    } else {
      loginWithPhone(phone, otp);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex justify-center mb-6">
            <a href="#" className="flex-shrink-0 flex items-center gap-2">
              <BookOpenIcon className="h-10 w-10 text-indigo-600"/>
              <span className="text-3xl font-bold text-slate-800">CBSE Hub</span>
            </a>
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Welcome Back!</h2>
        <p className="text-center text-slate-500 mb-8">Sign in to continue your learning journey.</p>
        
        <div className="space-y-4">
          <button 
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
          >
            <GoogleIcon className="h-6 w-6" />
            Continue with Google
          </button>

          <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-sm">OR</span>
              <div className="flex-grow border-t border-slate-200"></div>
          </div>
          
          <form onSubmit={handlePhoneLogin} className="space-y-4">
            <div>
              <label htmlFor="phone" className="sr-only">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="tel"
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  required
                  disabled={otpSent}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
                />
              </div>
            </div>
            
            {otpSent && (
              <div>
                <label htmlFor="otp" className="sr-only">OTP</label>
                <input 
                  type="text"
                  id="otp"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
            
            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              {otpSent ? 'Verify OTP & Login' : 'Send OTP'}
            </button>
          </form>
        </div>
      </div>
      <footer className="text-center mt-8 text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} CBSE Hub. All rights reserved.
      </footer>
    </div>
  );
};

export default LoginPage;

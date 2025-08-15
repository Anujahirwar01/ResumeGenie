import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, Zap, Github, Chrome, Apple, AlertCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Move InputField outside the component to prevent re-creation on every render
const InputField = ({ icon: Icon, type, name, placeholder, value, error, showToggle, onToggle, onChange, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full pl-10 pr-${showToggle ? '12' : '4'} py-3 bg-white/10 backdrop-blur-sm border ${
        error ? 'border-red-400' : 'border-white/20'
      } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
      {...props}
    />
    {showToggle && (
      <button
        type="button"
        className="absolute inset-y-0 right-0 pr-3 flex items-center"
        onClick={onToggle}
      >
        {type === 'password' ? (
          <Eye className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
        ) : (
          <EyeOff className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
        )}
      </button>
    )}
    {error && (
      <div className="absolute -bottom-6 left-0 flex items-center text-red-400 text-sm">
        <AlertCircle className="w-4 h-4 mr-1" />
        {error}
      </div>
    )}
  </div>
);

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect path - either from protected route or default to landing page
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Debug: Log form state before validation
    console.log('Current formData state:', formData);
    console.log('Email value:', formData.email);
    console.log('Password value:', formData.password);
    
    if (!validateForm()) {
      console.log('Validation failed, current errors:', errors);
      return;
    }
    
    setIsLoading(true);
    
    // Debug: Log the form data being sent
    console.log('Login data being sent:', {
      email: formData.email,
      password: formData.password
    });
    
    try {
      const response = await axios.post('http://localhost:5000/users/login', {
        email: formData.email,
        password: formData.password
      });

      // Success
      console.log('Login successful:', response.data);
      
      // Use AuthContext to handle login
      login(response.data.token, response.data.user);
      
      // Redirect to the intended page or dashboard
      navigate(from, { replace: true });
      
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response && error.response.data) {
        const data = error.response.data;
        
        if (data.errors) {
          // Handle validation errors
          const newErrors = {};
          data.errors.forEach(error => {
            newErrors[error.path] = error.msg;
          });
          setErrors(newErrors);
        } else {
          alert('Error: ' + (data.error || 'Login failed'));
        }
      } else {
        alert('Network error. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 m-0 p-0 flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-75"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-150"></div>
      </div>

      {/* Back to Home Button */}
      <Link 
        to="/"
        className="absolute top-6 left-6 z-20 flex items-center text-gray-300 hover:text-white transition-colors duration-200 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
        Back to Home
      </Link>

      {/* Login Container */}
      <div className="relative z-10 w-full mt-10 max-w-md mx-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <Zap className="w-8 h-8 text-cyan-400 mr-2" />
            <span className="text-white text-2xl font-bold">ResumeAI</span>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <InputField
                icon={Mail}
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                error={errors.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="relative">
              <InputField
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                error={errors.password}
                showToggle
                onToggle={() => setShowPassword(!showPassword)}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-cyan-600 bg-white/10 border-white/20 rounded focus:ring-cyan-500 focus:ring-2"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-300">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300 underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 px-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Social Login */}
          {/* <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: Github, name: 'GitHub' },
                { icon: Chrome, name: 'Google' },
                { icon: Apple, name: 'Apple' }
              ].map((provider, index) => (
                <button
                  key={provider.name}
                  onClick={() => alert(`${provider.name} login clicked`)}
                  className="w-full inline-flex justify-center py-3 px-4 border border-white/20 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors duration-200"
                >
                  <provider.icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div> */}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Login Benefits */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm mb-10 rounded-2xl p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-4 text-center">Welcome back!</h3>
          <div className="text-center text-gray-300 text-sm">
            <p>Continue building your professional future with ResumeAI's advanced tools and AI-powered insights.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
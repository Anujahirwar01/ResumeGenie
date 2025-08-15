import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Zap, Github, Chrome, Apple, CheckCircle, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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
      <div className="absolute -bottom-6 left-0 text-red-400 text-sm">
        {error}
      </div>
    )}
  </div>
);

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

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
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
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
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to terms';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Debug: Log the form data before sending
    console.log('Form data being sent:', {
      name: formData.name,
      email: formData.email,
      password: formData.password
    });
    
    try {
      const response = await axios.post('http://localhost:5000/users/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      // Success
      console.log('Registration successful:', response.data);
      
      // Use AuthContext to handle login after registration
      login(response.data.token, response.data.user);
      
      // Redirect to landing page for resume upload
      navigate('/', { replace: true });
      
    } catch (error) {
      console.error('Registration error:', error);
      
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
          alert('Error: ' + (data.error || 'Registration failed'));
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

      {/* Signup Container */}
      <div className="relative z-10 w-full mt-10 max-w-md mx-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <Zap className="w-8 h-8 text-cyan-400 mr-2" />
            <span className="text-white text-2xl font-bold">ResumeAI</span>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400">Join thousands of professionals building better resumes</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <InputField
                icon={User}
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                error={errors.name}
                onChange={handleInputChange}
                required
              />
            </div>

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

            <div className="relative">
              <InputField
                icon={Lock}
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                error={errors.confirmPassword}
                showToggle
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-cyan-600 bg-white/10 border-white/20 rounded focus:ring-cyan-500 focus:ring-2"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeTerms" className="text-gray-300">
                  I agree to the{' '}
                  <a href="#" className="text-cyan-400 hover:text-cyan-300 underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-cyan-400 hover:text-cyan-300 underline">
                    Privacy Policy
                  </a>
                </label>
                {errors.agreeTerms && (
                  <div className="flex items-center text-red-400 text-sm mt-1">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.agreeTerms}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 px-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
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
                  onClick={() => alert(`${provider.name} signup clicked`)}
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
              Already have an account?{' '}
              <a href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold underline">
                Sign in
              </a>
            </p>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl mb-10 p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-4 text-center">What you'll get:</h3>
          <div className="space-y-3">
            {[
              'AI-powered resume optimization',
              'Professional portfolio generator',
              'ATS-friendly formatting',
              'Real-time improvement suggestions',
              'Multiple template options'
            ].map((feature, index) => (
              <div key={index} className="flex items-center text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
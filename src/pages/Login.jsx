import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login as apiLogin, register as apiRegister } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import landing from '../assets/landing.png'
import logo from '../assets/logo.svg'
import { motion } from 'motion/react';
import { Link } from 'react-router-dom'
import { DarkHeader } from '../components/DarkHeader'
import { GradientCard } from '../components/GradientCard';
import { SectionHeading } from '../components/SectionHeading';
import { BarChart3, Users, FileText, PieChart, Mail, Calendar, FileIcon, Folder, MessageSquare, ArrowRight } from 'lucide-react';

const features = [
  {
    name: 'Lead Information',
    description: 'Collect and organize detailed information about your leads efficiently.',
    icon: Users,
  },
  {
    name: 'Add to Your Site',
    description: 'Embed with html, react and other frameworks in the near future.',
    icon: BarChart3,
  },
  {
    name: 'Api Endpoint or Netlify Forms',
    description: 'Adjust where your forms get sent.',
    icon: PieChart,
  },
  {
    name: 'Builder dashboard',
    description: 'Access all of your forms in one easy place.',
    icon: FileText,
  },
  {
    name: 'Customized Styling',
    description: 'Streamline the design of your form with our easy to use UI.',
    icon: Calendar,
  },
  {
    name: 'Preview Forms',
    description: 'Preview your forms before you embed them.',
    icon: Mail,
  },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState('register');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activeTab === 'register') {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          setIsLoading(false);
          return;
        }
        const { token } = await apiRegister(formData.email, formData.password);
        login(token);
        toast.success('Registration successful');
      } else {
        const { token } = await apiLogin(formData.email, formData.password);
        login(token);
        toast.success('Login successful');
      }
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(activeTab === 'login' ? 'Login failed' : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
        <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <DarkHeader />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
              >
                Create and Customize Multi-Step Forms with Ease
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-6 text-lg leading-8 text-gray-400"
              >
                We’re excited to have you join our community of creators who are taking control of their form-building needs. With WizardFormz, you can design seamless, multi-step forms tailored to your needs—all for free.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-10 flex items-center justify-center gap-4"
              >
                
                
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-16"
            >
             
              <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    
                    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 shadow p-6 mb-6">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            
            <button
              className={`flex-1 py-2 px-4 text-center ${
                activeTab === 'register'
                  ? 'border-b-2 border-purple-400 text-purple-500 font-medium'
                  : 'text-gray-300 hover:text-gray-500'
              }`}
              onClick={() => setActiveTab('register')}
            >
              Sign Up
            </button>
            <button
              className={`flex-1 py-2 px-4 text-center ${
                activeTab === 'login'
                  ? 'border-b-2 border-purple-400 text-purple-500 font-medium'
                  : 'text-gray-300 hover:text-gray-500'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={activeTab === 'register' ? 'Create a password' : 'Enter your password'}
                />
              </div>
            </div>

            {activeTab === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? (activeTab === 'login' ? 'Signing in...' : 'Creating account...')
                  : (activeTab === 'login' ? 'Sign in' : 'Create account')}
              </button>
            </div>
          </form>
        </div>
      </div>
                </div>
                
              
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeading
              title="Powerful features to help you manage all your leads"
              subtitle="Everything you need to collect, organize, and analyze your leads efficiently."
            />

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GradientCard className="h-full">
                    <feature.icon className="h-8 w-8 text-purple-500" />
                    <h3 className="mt-4 text-xl font-semibold text-white">{feature.name}</h3>
                    <p className="mt-2 text-gray-400">{feature.description}</p>
                  </GradientCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

       
        {/* CTA Section */}
        <section className="mt-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <GradientCard className="relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Join the community</h2>
                <p className="mt-4 mb-5 text-lg text-gray-400">
                  Connect with other developers and share your experience building forms and managing leads.
                </p>
                
                <Link 
                    to="/dashboard" 
                    className="mt-8 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
                    >
                    Get Started Now
                </Link>
              </div>
              <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-20" />
            </GradientCard>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-32 border-t border-gray-800 bg-gray-950 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-8 ">
              <div>
                <div className="flex items-center gap-2">
                  {/* <div className="h-8 w-8 rounded-lg bg-purple-600" /> */}
                  <img src={logo} className='h-8 w-8' alt="logo" />
                  <span className="text-xl font-bold text-white">WizardFormz</span>
                </div>
                <p className="mt-4 text-sm text-gray-400">
                  Build and manage forms easily. Create embeddable HTML forms.
                </p>
              </div>
             
            </div>
            <div className="mt-16 flex flex-col items-center justify-between gap-8 border-t border-gray-800 pt-8 sm:flex-row">
              <p className="text-sm text-gray-400">© 2024 WizardFormz. All rights reserved.</p>
              <div className="flex gap-8">
               
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>

    
    
  );
}

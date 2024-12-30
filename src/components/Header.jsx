import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.svg"
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/dashboard"
            className='flex gap-2'>
          <img src={logo} className='h-8 w-8' alt="logo" />
          <h1 className="text-xl font-bold text-white">WizardFormz</h1>
          </Link>
          
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-300"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

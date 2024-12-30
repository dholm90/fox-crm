import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.svg"
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export function DarkHeader() {
    return (
        
          
        <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">

            <Link
                to="/"
                className='flex items-center gap-2'
            >
                <img src={logo} className='h-8 w-8' alt="logo" />
                <span className="text-xl font-bold text-white">WizardFormz</span>
            </Link>

            <div className="hidden gap-8 md:flex">
            
            </div>
            
            <Link 
            to="/dashboard" 
            className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
            >
            Get Started
        </Link>
        </nav>
        </header>
    
    )
}

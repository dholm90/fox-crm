import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logo from '../assets/logo.png'
import Footer from './Footer'

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/events', label: 'Events' },
    { to: '/menu', label: 'Menu' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="fixed w-full bg-gray-900/95 backdrop-blur-sm z-50">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="">
              <img
                          src= {logo}
                          alt="logo"
                          className="h-20 "
                        />
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden justify-self md:flex items-center space-x-8">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    isActive ? 'active-nav-link' : 'nav-link'
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-300 hover:text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden mt-4 space-y-4">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `block ${isActive ? 'active-nav-link' : 'nav-link'}`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          )}
        </nav>
      </header>

      <main className="pt-16">
        <Outlet />
      </main>

      <Footer 
        logo={logo}
        companyName="The Rabbid Fox"
      />
    </div>
  )
}

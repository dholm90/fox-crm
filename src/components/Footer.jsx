import React from 'react'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'
import PropTypes from 'prop-types'

const Footer = ({ logo, companyName }) => {
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'Menu', href: '/menu' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ]

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt={companyName} className="h-24" />
        </div>

        {/* Navigation */}
        <nav className="flex justify-center mb-12">
          <ul className="flex flex-wrap justify-center gap-8">
            {navigation.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="hover:text-white transition-colors"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © Copyright {new Date().getFullYear()} - {companyName}
            </div>

            <div className="flex gap-4 text-sm">
              <a href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <span className="text-gray-600">|</span>
              <a href="/terms" className="hover:text-white transition-colors">
                Terms of Use
              </a>
            </div>

            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="hover:text-white transition-colors"
                    aria-label={social.name}
                  >
                    <Icon size={20} />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

Footer.propTypes = {
  logo: PropTypes.string.isRequired,
  companyName: PropTypes.string.isRequired,
}

export default Footer


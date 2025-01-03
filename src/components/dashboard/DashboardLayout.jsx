import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  CalendarDays, 
  UtensilsCrossed, 
  Tags, 
  List,
  Image,
  ArrowDownNarrowWide,
  LogOut 
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const navLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/dashboard/events', icon: CalendarDays, label: 'Events' },
    { to: '/dashboard/menus', icon: List, label: 'Menus' },
    { to: '/dashboard/menu-items', icon: UtensilsCrossed, label: 'Menu Items' },
    { to: '/dashboard/categories', icon: ArrowDownNarrowWide, label: 'Categories' },
    { to: '/dashboard/tags', icon: Tags, label: 'Tags' },
    { to: '/dashboard/gallery', icon: Image, label: 'Gallery' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-800">
          <div className="flex items-center justify-between mb-6 px-3">
            <span className="text-2xl font-bold">Dashboard</span>
            <button
              className="md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                      isActive ? 'bg-orange-600 text-white' : 'text-gray-300'
                    }`
                  }
                >
                  <link.icon size={20} className="mr-3" />
                  <span>{link.label}</span>
                </NavLink>
              </li>
            ))}

            <li>
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-3 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <LogOut size={20} className="mr-3" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden bg-gray-800 p-4 flex items-center justify-between">
        <span className="text-xl font-bold">Dashboard</span>
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-gray-300 hover:text-white"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Main content */}
      <div className="p-4 md:ml-64 mt-14 md:mt-0">
        {children}
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { 
  CalendarDays, 
  UtensilsCrossed, 
  Tags, 
  List,
  TrendingUp,
  Users 
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/dashboard/DashboardLayout'

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    events: 0,
    menuItems: 0,
    categories: 0,
    menus: 0
  })

  const statCards = [
    {
      title: 'Total Events',
      value: stats.events,
      icon: CalendarDays,
      color: 'bg-blue-500'
    },
    {
      title: 'Menu Items',
      value: stats.menuItems,
      icon: UtensilsCrossed,
      color: 'bg-green-500'
    },
    {
      title: 'Categories',
      value: stats.categories,
      icon: Tags,
      color: 'bg-purple-500'
    },
    {
      title: 'Menus',
      value: stats.menus,
      icon: List,
      color: 'bg-orange-500'
    }
  ]

  const quickActions = [
    {
      title: 'Add Menu Item',
      icon: UtensilsCrossed,
      action: () => navigate('/dashboard/menu-items', { state: { openModal: true } })
    },
    {
      title: 'Create Event',
      icon: CalendarDays,
      action: () => navigate('/dashboard/events', { state: { openModal: true } })
    },
    {
      title: 'New Menu',
      icon: List,
      action: () => navigate('/dashboard/menus', { state: { openModal: true } })
    },
    {
      title: 'Add Category',
      icon: Tags,
      action: () => navigate('/dashboard/categories', { state: { openModal: true } })
    }
  ]

 

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome to your restaurant dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <div
              key={stat.title}
              className="bg-gray-800 p-6 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-1 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  onClick={action.action}
                  className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-center"
                >
                  <action.icon size={24} className="mx-auto mb-2" />
                  {action.title}
                </button>
              ))}
            </div>
          </div>

          
        </div>

        
      </div>
    </DashboardLayout>
  )
}

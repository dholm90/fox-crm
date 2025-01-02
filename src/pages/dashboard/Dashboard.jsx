import { useState, useEffect } from 'react'
import { 
  CalendarDays, 
  UtensilsCrossed, 
  Tags, 
  List,
  TrendingUp,
  Users 
} from 'lucide-react'
import DashboardLayout from '../../components/dashboard/DashboardLayout'

export default function Dashboard() {
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

  const recentActivity = [
    {
      id: 1,
      action: 'New event created',
      title: 'Wine Tasting Evening',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      action: 'Menu item updated',
      title: 'Grilled Salmon',
      timestamp: '4 hours ago'
    },
    {
      id: 3,
      action: 'Category added',
      title: 'Desserts',
      timestamp: '1 day ago'
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
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-center">
                <UtensilsCrossed size={24} className="mx-auto mb-2" />
                Add Menu Item
              </button>
              <button className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-center">
                <CalendarDays size={24} className="mx-auto mb-2" />
                Create Event
              </button>
              <button className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-center">
                <List size={24} className="mx-auto mb-2" />
                New Menu
              </button>
              <button className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-center">
                <Tags size={24} className="mx-auto mb-2" />
                Add Category
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-400">{activity.title}</p>
                  </div>
                  <span className="text-sm text-gray-400">{activity.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Performance Overview</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center p-4 bg-gray-700 rounded-lg">
              <TrendingUp size={24} className="text-green-500 mr-4" />
              <div>
                <p className="text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-700 rounded-lg">
              <Users size={24} className="text-blue-500 mr-4" />
              <div>
                <p className="text-gray-400">Total Customers</p>
                <p className="text-2xl font-bold">847</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-700 rounded-lg">
              <TrendingUp size={24} className="text-orange-500 mr-4" />
              <div>
                <p className="text-gray-400">Revenue</p>
                <p className="text-2xl font-bold">$12,847</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

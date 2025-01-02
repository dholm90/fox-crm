import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Events from './pages/Events'
import Menu from './pages/Menu'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/dashboard/Dashboard'
import DashboardEvents from './pages/dashboard/Events'
import DashboardMenuItems from './pages/dashboard/MenuItems'
import DashboardCategories from './pages/dashboard/Categories'
import DashboardTags from './pages/dashboard/Tags'
import DashboardMenus from './pages/dashboard/Menus'
import DashboardGallery from './pages/dashboard/Gallery'
import ProtectedRoute from './components/ProtectedRoute'
import EventDetails from './pages/EventDetails'
import MenuItemDetails from './pages/MenuItemDetails'
import NotFound from './pages/NotFound' // Create this component


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="events" element={<Events />} />
        <Route path="menu" element={<Menu />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="events/:slug" element={<EventDetails />} />
        <Route path="menu-items/:slug" element={<MenuItemDetails />} />
      </Route>
      
      <Route path="/dashboard" element={<ProtectedRoute />}>
        <Route index element={<Dashboard />} />
        <Route path="events" element={<DashboardEvents />} />
        <Route path="menu-items" element={<DashboardMenuItems />} />
        <Route path="categories" element={<DashboardCategories />} />
        <Route path="tags" element={<DashboardTags />} />
        <Route path="menus" element={<DashboardMenus />} />
        <Route path="gallery" element={<DashboardGallery />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App

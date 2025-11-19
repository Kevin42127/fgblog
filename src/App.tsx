import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LenisProvider } from './components/LenisProvider'
import Layout from './components/Layout'
import Home from './pages/Home'
import BlogPost from './pages/BlogPost'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/Dashboard'
import AdminPosts from './pages/admin/Posts'
import AdminPostEditor from './pages/admin/PostEditor'
import AdminCategories from './pages/admin/Categories'
import AdminContacts from './pages/admin/Contacts'
import AdminAnnouncements from './pages/admin/Announcements'
import Login from './pages/admin/Login'
import { NotificationProvider } from './contexts/NotificationContext'
import { AuthProvider } from './contexts/AuthContext'
import { BlogProvider } from './contexts/BlogContext'
import { ConfirmProvider } from './contexts/ConfirmContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <LenisProvider>
      <AuthProvider>
        <BlogProvider>
          <NotificationProvider>
            <ConfirmProvider>
              <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="post/:id" element={<BlogPost />} />
                <Route path="contact" element={<Contact />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="/admin/login" element={<Login />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="posts" element={<AdminPosts />} />
                <Route path="posts/new" element={<AdminPostEditor />} />
                <Route path="posts/edit/:id" element={<AdminPostEditor />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="contacts" element={<AdminContacts />} />
                <Route path="announcements" element={<AdminAnnouncements />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
            </ConfirmProvider>
        </NotificationProvider>
        </BlogProvider>
      </AuthProvider>
    </LenisProvider>
  )
}

export default App


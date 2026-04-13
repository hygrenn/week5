import { Link, useNavigate } from 'react-router-dom'
import { Brain, LogOut } from 'lucide-react'
import useAuthStore from '../../store/authStore'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 font-bold text-xl text-indigo-600">
          <Brain size={24} />
          딥러닝 Week 5
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">대시보드</Link>
              <Link to="/pricing" className="text-sm text-gray-600 hover:text-gray-900">구독</Link>
              <div className="flex items-center gap-3">
                {user?.avatar_url && (
                  <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full" />
                )}
                <span className="text-sm text-gray-700">{user?.name}</span>
                <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/pricing" className="text-sm text-gray-600 hover:text-gray-900">요금제</Link>
              <a href="/api/auth/google" className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                시작하기
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

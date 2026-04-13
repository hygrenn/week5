import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Crown } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ModuleCard from '../components/learn/ModuleCard'
import useAuthStore from '../store/authStore'
import { MODULES } from '../lib/constants'
import api from '../lib/api'

export default function Dashboard() {
  const { user } = useAuthStore()
  const [progress, setProgress] = useState({})
  const isPremium = user?.subscription?.plan === 'premium' && user?.subscription?.status === 'active'

  useEffect(() => {
    api.get('/users/me/progress').then(({ data }) => {
      const map = {}
      data.progress.forEach((p) => { map[p.module_id] = p.completed })
      setProgress(map)
    }).catch(() => {})
  }, [])

  const completedCount = Object.values(progress).filter(Boolean).length

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
        {/* 환영 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                안녕하세요, {user?.name?.split(' ')[0]}님! 👋
              </h1>
              <p className="text-gray-500 mt-1">Week 5 딥러닝 핵심 개념을 학습해보세요.</p>
            </div>
            <div className="flex items-center gap-3">
              {isPremium ? (
                <span className="flex items-center gap-1.5 bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  <Crown size={14} /> 프리미엄
                </span>
              ) : (
                <Link to="/pricing" className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                  프리미엄 업그레이드
                </Link>
              )}
            </div>
          </div>

          {/* 진도 바 */}
          <div className="mt-6 bg-white rounded-2xl border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">전체 진도</span>
              <span className="text-sm text-gray-500">{completedCount} / {MODULES.length} 완료</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${(completedCount / MODULES.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 모듈 그리드 */}
        <h2 className="text-lg font-semibold text-gray-700 mb-4">학습 모듈</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MODULES.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              isPremium={isPremium}
              isCompleted={progress[module.id]}
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

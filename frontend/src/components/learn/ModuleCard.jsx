import { Link } from 'react-router-dom'
import { Lock, CheckCircle, ChevronRight } from 'lucide-react'

export default function ModuleCard({ module, isPremium, isCompleted }) {
  const isLocked = module.isPremium && !isPremium

  return (
    <div className={`bg-white rounded-2xl border p-6 transition-all ${isLocked ? 'opacity-70' : 'hover:shadow-md hover:border-indigo-200'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{module.emoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-800">{module.title}</h3>
              {module.isPremium && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">프리미엄</span>
              )}
              {!module.isPremium && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">무료</span>
              )}
            </div>
          </div>
        </div>
        {isCompleted && <CheckCircle size={20} className="text-green-500 shrink-0" />}
      </div>
      <p className="text-gray-500 text-sm mb-4">{module.description}</p>
      {isLocked ? (
        <div className="flex items-center gap-1 text-sm text-gray-400">
          <Lock size={14} />
          <span>프리미엄 전용</span>
        </div>
      ) : (
        <Link
          to={module.path}
          className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          학습하기 <ChevronRight size={16} />
        </Link>
      )}
    </div>
  )
}

import { Lock } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function LockOverlay() {
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-10">
      <div className="bg-indigo-100 p-4 rounded-full mb-4">
        <Lock size={28} className="text-indigo-600" />
      </div>
      <h3 className="font-bold text-lg text-gray-800 mb-2">프리미엄 콘텐츠</h3>
      <p className="text-gray-500 text-sm mb-4 text-center px-4">이 모듈은 프리미엄 구독자만 이용할 수 있습니다.</p>
      <Link
        to="/pricing"
        className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
      >
        구독하기
      </Link>
    </div>
  )
}

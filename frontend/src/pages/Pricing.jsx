import { Check } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import useAuthStore from '../store/authStore'
import api from '../lib/api'

const plans = [
  {
    name: '무료',
    price: '₩0',
    period: '영구 무료',
    description: '핵심 개념 2개 모듈을 무료로 학습하세요.',
    features: ['Regularization 모듈', 'Overfitting vs Underfitting 모듈', '코드 예시 확인', '차트 시각화'],
    cta: '무료로 시작',
    isPremium: false,
    highlighted: false,
  },
  {
    name: '프리미엄',
    price: '$9.99',
    period: '/월',
    description: '5개 모듈 전체에 접근하고 심화 학습을 완성하세요.',
    features: ['무료 플랜의 모든 혜택', 'Data Augmentation 모듈', 'Transfer Learning 모듈', 'MNIST CNN 실습 모듈', '학습 진도 관리'],
    cta: '프리미엄 시작',
    isPremium: true,
    highlighted: true,
  },
]

export default function Pricing() {
  const { isAuthenticated } = useAuthStore()

  const handlePremium = async () => {
    if (!isAuthenticated) {
      window.location.href = '/api/auth/google'
      return
    }
    try {
      const { data } = await api.post('/checkout')
      window.location.href = data.checkout_url
    } catch {
      alert('결제 페이지 연결에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">요금제</h1>
          <p className="text-gray-500 text-lg">필요에 맞는 플랜을 선택하세요.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 border-2 ${plan.highlighted ? 'border-indigo-500 bg-indigo-50 relative' : 'border-gray-200 bg-white'}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-4 py-1 rounded-full font-medium">
                  추천
                </div>
              )}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-1">{plan.name}</h2>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-400 pb-1">{plan.period}</span>
                </div>
                <p className="text-gray-500 text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check size={16} className="text-indigo-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {plan.isPremium ? (
                <button
                  onClick={handlePremium}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
                >
                  {plan.cta}
                </button>
              ) : (
                <a
                  href={isAuthenticated ? '/dashboard' : '/api/auth/google'}
                  className="w-full block text-center bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:border-indigo-300 transition"
                >
                  {plan.cta}
                </a>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

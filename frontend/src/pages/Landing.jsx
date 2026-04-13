import { Link } from 'react-router-dom'
import { Brain, ShieldCheck, BarChart2, Layers } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import useAuthStore from '../store/authStore'

const features = [
  { icon: <ShieldCheck size={24} className="text-indigo-500" />, title: '규제 기법', desc: 'L1/L2, Dropout, Batch Normalization으로 과적합을 방지하는 방법을 배웁니다.' },
  { icon: <BarChart2 size={24} className="text-indigo-500" />, title: '시각적 학습', desc: '실험 결과를 차트와 그래프로 직관적으로 확인합니다.' },
  { icon: <Layers size={24} className="text-indigo-500" />, title: '5개 모듈', desc: 'Regularization부터 CNN 실습까지 체계적인 커리큘럼을 제공합니다.' },
]

export default function Landing() {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="flex-1 bg-gradient-to-br from-indigo-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm px-4 py-1.5 rounded-full mb-6 font-medium">
            <Brain size={16} />
            Week 5 · 딥러닝 핵심 개념
          </div>
          <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
            딥러닝 모델 성능을<br />
            <span className="text-indigo-600">시각적으로 이해하세요</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Regularization, Overfitting, Data Augmentation, Transfer Learning, CNN까지.<br />
            이론과 실험 결과를 함께 학습하는 인터랙티브 플랫폼입니다.
          </p>
          <div className="flex items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition text-lg">
                학습 시작하기
              </Link>
            ) : (
              <a href="/api/auth/google" className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition text-lg flex items-center gap-3">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Google로 무료 시작하기
              </a>
            )}
            <Link to="/pricing" className="text-indigo-600 font-semibold hover:underline text-lg">
              요금제 보기 →
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">무료 가입 · 신용카드 불필요</p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">이런 것들을 배웁니다</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6">
                <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">지금 바로 시작하세요</h2>
          <p className="text-indigo-200 mb-8">Google 계정으로 무료 가입하고 2개 모듈을 바로 시작할 수 있습니다.</p>
          <a href="/api/auth/google" className="bg-white text-indigo-600 px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-50 transition inline-block">
            무료로 시작하기
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}

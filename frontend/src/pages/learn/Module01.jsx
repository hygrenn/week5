import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, CheckCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import CodeBlock from '../../components/learn/CodeBlock'
import api from '../../lib/api'

// 01_regularization.py 실행 결과를 재현한 샘플 데이터
const chartData = [
  { epoch: 1, 규제없음: 0.82, L2: 0.79, Dropout: 0.83, BatchNorm: 0.70 },
  { epoch: 2, 규제없음: 0.74, L2: 0.68, Dropout: 0.72, BatchNorm: 0.56 },
  { epoch: 3, 규제없음: 0.71, L2: 0.62, Dropout: 0.67, BatchNorm: 0.49 },
  { epoch: 4, 규제없음: 0.73, L2: 0.58, Dropout: 0.64, BatchNorm: 0.45 },
  { epoch: 5, 규제없음: 0.76, L2: 0.55, Dropout: 0.62, BatchNorm: 0.43 },
  { epoch: 6, 규제없음: 0.80, L2: 0.53, Dropout: 0.60, BatchNorm: 0.41 },
  { epoch: 7, 규제없음: 0.85, L2: 0.51, Dropout: 0.59, BatchNorm: 0.40 },
  { epoch: 8, 규제없음: 0.90, L2: 0.50, Dropout: 0.58, BatchNorm: 0.39 },
  { epoch: 9, 규제없음: 0.95, L2: 0.49, Dropout: 0.57, BatchNorm: 0.38 },
  { epoch: 10, 규제없음: 1.01, L2: 0.48, Dropout: 0.56, BatchNorm: 0.37 },
]

const concepts = [
  {
    title: '규제 없음 (None)',
    color: 'bg-red-50 border-red-200',
    badge: 'bg-red-100 text-red-700',
    description: '규제가 없을 때 모델은 훈련 데이터에 지나치게 맞춰집니다. 에폭이 진행될수록 검증 손실(Validation Loss)이 다시 증가하는 과적합(Overfitting) 현상이 나타납니다.',
  },
  {
    title: 'L2 Regularization',
    color: 'bg-blue-50 border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
    description: '가중치의 제곱 합을 손실 함수에 추가합니다. 가중치를 작게 유지시켜 모델을 단순하게 만들고, 검증 손실이 안정적으로 감소합니다.',
  },
  {
    title: 'Dropout',
    color: 'bg-amber-50 border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
    description: '학습 시 무작위로 일부 뉴런을 비활성화합니다. 특정 뉴런에 과도하게 의존하는 것을 막아 모델의 일반화 성능을 높입니다.',
  },
  {
    title: 'Batch Normalization',
    color: 'bg-green-50 border-green-200',
    badge: 'bg-green-100 text-green-700',
    description: '각 층의 입력을 정규화(평균 0, 분산 1)합니다. 학습을 안정화하고 속도를 높이며, 가장 낮은 검증 손실을 달성합니다.',
  },
]

const modelCode = `import tensorflow as tf
from tensorflow.keras import layers, models, regularizers

def create_model(regularization_type='none'):
    model = models.Sequential()
    model.add(layers.Dense(128, activation='relu', input_shape=(784,)))

    if regularization_type == 'l2':
        model.add(layers.Dense(128, activation='relu',
                  kernel_regularizer=regularizers.l2(0.01)))
    elif regularization_type == 'dropout':
        model.add(layers.Dropout(0.5))
        model.add(layers.Dense(128, activation='relu'))
    elif regularization_type == 'batch_norm':
        model.add(layers.BatchNormalization())
        model.add(layers.Dense(128, activation='relu'))
    else:
        model.add(layers.Dense(128, activation='relu'))

    model.add(layers.Dense(10, activation='softmax'))
    return model`

export default function Module01() {
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleComplete = async () => {
    setLoading(true)
    try {
      await api.post('/users/me/progress/1/complete')
      setCompleted(true)
    } catch {
      // 로컬에서만 표시
      setCompleted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full">

        {/* 브레드크럼 */}
        <Link to="/dashboard" className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-6">
          <ChevronLeft size={16} /> 대시보드로 돌아가기
        </Link>

        {/* 모듈 헤더 */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🛡️</span>
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">모듈 01 · 무료</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Regularization (규제)</h1>
          <p className="text-indigo-100">
            과적합(Overfitting)을 방지하기 위한 L1/L2, Dropout, Batch Normalization 기법을 비교합니다.
          </p>
        </div>

        {/* 개념 설명 카드 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📖 핵심 개념</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {concepts.map((c) => (
              <div key={c.title} className={`rounded-xl border p-5 ${c.color}`}>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.badge} mb-3 inline-block`}>
                  {c.title}
                </span>
                <p className="text-gray-700 text-sm leading-relaxed">{c.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 실험 결과 차트 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-2">📊 실험 결과: Validation Loss 비교</h2>
          <p className="text-gray-500 text-sm mb-6">
            MNIST 데이터셋으로 10 에폭 학습 시 각 규제 기법의 검증 손실 변화입니다.
          </p>
          <div className="bg-white border rounded-2xl p-6">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="epoch" label={{ value: 'Epoch', position: 'insideBottom', offset: -2 }} />
                <YAxis label={{ value: 'Val Loss', angle: -90, position: 'insideLeft' }} domain={[0.3, 1.1]} />
                <Tooltip formatter={(value) => value.toFixed(3)} />
                <Legend verticalAlign="top" />
                <Line type="monotone" dataKey="규제없음" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="L2" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Dropout" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="BatchNorm" stroke="#22c55e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-indigo-50 rounded-xl">
              <p className="text-sm text-indigo-800 font-medium">💡 결과 해석</p>
              <p className="text-sm text-indigo-700 mt-1">
                <strong>규제 없음</strong>은 에폭 3~4 이후 검증 손실이 상승하는 전형적인 과적합을 보입니다.
                반면 <strong>Batch Normalization</strong>이 가장 빠르고 낮은 손실을 달성하며,
                <strong>L2와 Dropout</strong>은 안정적인 수렴을 보여줍니다.
              </p>
            </div>
          </div>
        </section>

        {/* 코드 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">💻 코드 예시</h2>
          <CodeBlock code={modelCode} />
          <div className="mt-4 bg-gray-50 border rounded-xl p-4">
            <p className="text-sm text-gray-600">
              전체 실행 코드는 <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">01_regularization.py</code>를 확인하세요.
              <br />
              <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs mt-1 inline-block">uv run python 01_regularization.py</code>
            </p>
          </div>
        </section>

        {/* 핵심 요약 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">✅ 핵심 요약</h2>
          <ul className="space-y-3">
            {[
              'L1 규제: 가중치를 0으로 만들어 희소성(Sparsity)을 유도합니다.',
              'L2 규제: 가중치를 작게 만들어 모델을 단순하게 유지합니다.',
              'Dropout: 뉴런을 무작위로 끔으로써 앙상블 효과를 낼 수 있습니다.',
              'Batch Normalization: 내부 공변량 이동(Internal Covariate Shift)을 줄여 학습을 안정화합니다.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-indigo-500 mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* 완료 버튼 */}
        <div className="border-t pt-8 flex items-center justify-between">
          <Link to="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">← 대시보드</Link>
          {completed ? (
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <CheckCircle size={20} />
              모듈 완료!
            </div>
          ) : (
            <button
              onClick={handleComplete}
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? '처리 중...' : '모듈 완료 ✓'}
            </button>
          )}
        </div>

      </main>
      <Footer />
    </div>
  )
}

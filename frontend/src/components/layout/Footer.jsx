import { Brain } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-500">
          <Brain size={18} />
          <span className="text-sm">딥러닝 학습 플랫폼 · Week 5</span>
        </div>
        <p className="text-xs text-gray-400">© 2026 AI & ML Course</p>
      </div>
    </footer>
  )
}

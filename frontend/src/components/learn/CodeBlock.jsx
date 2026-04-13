import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function CodeBlock({ code, language = 'python' }) {
  return (
    <div className="rounded-xl overflow-hidden text-sm">
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{ margin: 0, borderRadius: '0.75rem', padding: '1.5rem' }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

"use client"

import { useEffect, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"

// Note: In a real implementation, you'd install prismjs
// npm install prismjs

interface PrismEditorProps {
  code: string
  language: string
  onChange: (code: string) => void
  isDarkMode: boolean
}

export function PrismEditor({ code, language, onChange, isDarkMode }: PrismEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const highlightRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    // Simulated Prism highlighting - in real app, use Prism.highlight()
    if (highlightRef.current) {
      const highlighted = simulatePrismHighlight(code, language)
      highlightRef.current.innerHTML = highlighted
    }
  }, [code, language])

  const simulatePrismHighlight = (text: string, lang: string) => {
    const patterns = {
      javascript: [
        {
          pattern: /\b(function|const|let|var|if|else|for|while|return|class|import|export|async|await)\b/g,
          class: "token keyword",
        },
        { pattern: /\b(console|document|window|Array|Object|String|Number|Boolean)\b/g, class: "token builtin" },
        { pattern: /"(?:[^"\\]|\\.)*"/g, class: "token string" },
        { pattern: /'(?:[^'\\]|\\.)*'/g, class: "token string" },
        { pattern: /`(?:[^`\\]|\\.)*`/g, class: "token template-string" },
        { pattern: /\/\/.*$/gm, class: "token comment" },
        { pattern: /\/\*[\s\S]*?\*\//g, class: "token comment" },
        { pattern: /\b\d+\.?\d*\b/g, class: "token number" },
      ],
      python: [
        {
          pattern: /\b(def|class|if|else|elif|for|while|return|import|from|as|try|except|with|lambda|yield)\b/g,
          class: "token keyword",
        },
        {
          pattern: /\b(print|len|range|str|int|float|list|dict|tuple|set|bool|None|True|False)\b/g,
          class: "token builtin",
        },
        { pattern: /"(?:[^"\\]|\\.)*"/g, class: "token string" },
        { pattern: /'(?:[^'\\]|\\.)*'/g, class: "token string" },
        { pattern: /#.*$/gm, class: "token comment" },
        { pattern: /\b\d+\.?\d*\b/g, class: "token number" },
      ],
    }

    let highlighted = text
    const langPatterns = patterns[lang as keyof typeof patterns] || []

    langPatterns.forEach(({ pattern, class: className }) => {
      highlighted = highlighted.replace(pattern, `<span class="${className}">$&</span>`)
    })

    return highlighted
  }

  return (
    <div className="relative font-mono text-sm">
      <style jsx>{`
        .token.keyword { color: ${isDarkMode ? "#ff79c6" : "#d73a49"}; font-weight: bold; }
        .token.builtin { color: ${isDarkMode ? "#8be9fd" : "#005cc5"}; }
        .token.string { color: ${isDarkMode ? "#f1fa8c" : "#032f62"}; }
        .token.template-string { color: ${isDarkMode ? "#f1fa8c" : "#032f62"}; }
        .token.comment { color: ${isDarkMode ? "#6272a4" : "#6a737d"}; font-style: italic; }
        .token.number { color: ${isDarkMode ? "#bd93f9" : "#005cc5"}; }
      `}</style>

      <pre
        ref={highlightRef}
        className={`absolute inset-0 p-3 pointer-events-none overflow-hidden whitespace-pre-wrap ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
        aria-hidden="true"
      />

      <Textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="relative bg-transparent resize-none border-0 outline-none font-mono text-transparent caret-white"
        style={{ caretColor: isDarkMode ? "white" : "black" }}
        spellCheck={false}
      />
    </div>
  )
}

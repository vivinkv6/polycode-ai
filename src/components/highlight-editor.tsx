"use client"

import { useEffect, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"

// Note: In a real implementation, you'd install highlight.js
// npm install highlight.js

interface HighlightEditorProps {
  code: string
  language: string
  onChange: (code: string) => void
  isDarkMode: boolean
}

export function HighlightEditor({ code, language, onChange, isDarkMode }: HighlightEditorProps) {
  const highlightRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Simulated highlight.js usage
    // In real implementation:
    /*
    import hljs from 'highlight.js'
    import 'highlight.js/styles/github-dark.css' // or github.css for light mode
    
    if (highlightRef.current) {
      highlightRef.current.textContent = code
      hljs.highlightElement(highlightRef.current)
    }
    */

    if (highlightRef.current) {
      highlightRef.current.innerHTML = simulateHighlightJs(code, language)
    }
  }, [code, language])

  const simulateHighlightJs = (text: string, lang: string) => {
    const patterns = {
      javascript: [
        { pattern: /\b(function|const|let|var|if|else|for|while|return|class)\b/g, class: "hljs-keyword" },
        { pattern: /\b(console|document|window)\b/g, class: "hljs-built_in" },
        { pattern: /"[^"]*"/g, class: "hljs-string" },
        { pattern: /\/\/.*$/gm, class: "hljs-comment" },
        { pattern: /\b\d+\b/g, class: "hljs-number" },
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
        .hljs-keyword { color: ${isDarkMode ? "#ff79c6" : "#d73a49"}; font-weight: bold; }
        .hljs-built_in { color: ${isDarkMode ? "#8be9fd" : "#005cc5"}; }
        .hljs-string { color: ${isDarkMode ? "#f1fa8c" : "#032f62"}; }
        .hljs-comment { color: ${isDarkMode ? "#6272a4" : "#6a737d"}; font-style: italic; }
        .hljs-number { color: ${isDarkMode ? "#bd93f9" : "#005cc5"}; }
      `}</style>

      <code
        ref={highlightRef}
        className={`absolute inset-0 p-3 pointer-events-none overflow-hidden whitespace-pre-wrap ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      />

      <Textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="relative bg-transparent resize-none border-0 outline-none font-mono text-transparent"
        style={{ caretColor: isDarkMode ? "white" : "black" }}
        spellCheck={false}
      />
    </div>
  )
}

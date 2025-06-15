"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Textarea } from "@/components/ui/textarea"

interface CodeMirrorEditorProps {
  code: string
  language: string
  onChange: (code: string) => void
  isDarkMode: boolean
}

// Enhanced syntax highlighting patterns with proper styling
const syntaxPatterns = {
  javascript: [
    {
      pattern:
        /\b(function|const|let|var|if|else|for|while|return|class|import|export|async|await|try|catch|finally|throw|new|this|super|extends|static|public|private|protected)\b/g,
      style: { color: "#569cd6", fontWeight: "bold" }, // Blue keywords
    },
    {
      pattern:
        /\b(console|document|window|Array|Object|String|Number|Boolean|Date|Math|JSON|Promise|setTimeout|setInterval)\b/g,
      style: { color: "#4ec9b0" }, // Teal built-ins
    },
    { pattern: /"(?:[^"\\]|\\.)*"/g, style: { color: "#ce9178" } }, // Orange strings
    { pattern: /'(?:[^'\\]|\\.)*'/g, style: { color: "#ce9178" } }, // Orange strings
    { pattern: /`(?:[^`\\]|\\.)*`/g, style: { color: "#ce9178" } }, // Orange template strings
    { pattern: /\/\/.*$/gm, style: { color: "#6a9955", fontStyle: "italic" } }, // Green comments
    { pattern: /\/\*[\s\S]*?\*\//g, style: { color: "#6a9955", fontStyle: "italic" } }, // Green comments
    { pattern: /\b\d+\.?\d*\b/g, style: { color: "#b5cea8" } }, // Light green numbers
    { pattern: /\b(true|false|null|undefined)\b/g, style: { color: "#569cd6" } }, // Blue literals
  ],
  python: [
    {
      pattern:
        /\b(def|class|if|else|elif|for|while|return|import|from|as|try|except|with|lambda|yield|pass|break|continue|global|nonlocal|assert|del|raise|finally)\b/g,
      style: { color: "#569cd6", fontWeight: "bold" },
    },
    {
      pattern:
        /\b(print|len|range|str|int|float|list|dict|tuple|set|bool|type|isinstance|hasattr|getattr|setattr|enumerate|zip|map|filter|sorted|reversed|sum|min|max|abs|round)\b/g,
      style: { color: "#4ec9b0" },
    },
    { pattern: /"(?:[^"\\]|\\.)*"/g, style: { color: "#ce9178" } },
    { pattern: /'(?:[^'\\]|\\.)*'/g, style: { color: "#ce9178" } },
    { pattern: /f"(?:[^"\\]|\\.)*"/g, style: { color: "#ce9178" } },
    { pattern: /f'(?:[^'\\]|\\.)*'/g, style: { color: "#ce9178" } },
    { pattern: /#.*$/gm, style: { color: "#6a9955", fontStyle: "italic" } },
    { pattern: /\b\d+\.?\d*\b/g, style: { color: "#b5cea8" } },
    { pattern: /\b(True|False|None)\b/g, style: { color: "#569cd6" } },
  ],
  java: [
    {
      pattern:
        /\b(public|private|protected|static|final|abstract|class|interface|extends|implements|if|else|for|while|do|switch|case|default|return|break|continue|try|catch|finally|throw|throws|new|this|super|package|import|synchronized|volatile|transient|native|strictfp)\b/g,
      style: { color: "#569cd6", fontWeight: "bold" },
    },
    {
      pattern:
        /\b(System|String|int|double|float|boolean|char|byte|short|long|void|Object|ArrayList|HashMap|Scanner|Math|Integer|Double|Boolean|Character)\b/g,
      style: { color: "#4ec9b0" },
    },
    { pattern: /"(?:[^"\\]|\\.)*"/g, style: { color: "#ce9178" } },
    { pattern: /\/\/.*$/gm, style: { color: "#6a9955", fontStyle: "italic" } },
    { pattern: /\/\*[\s\S]*?\*\//g, style: { color: "#6a9955", fontStyle: "italic" } },
    { pattern: /\b\d+\.?\d*[fFdDlL]?\b/g, style: { color: "#b5cea8" } },
    { pattern: /\b(true|false|null)\b/g, style: { color: "#569cd6" } },
  ],
  cpp: [
    {
      pattern:
        /\b(#include|#define|#ifdef|#ifndef|#endif|using|namespace|int|double|float|char|bool|void|const|static|public|private|protected|class|struct|enum|if|else|for|while|do|switch|case|default|return|break|continue|try|catch|throw|new|delete|this|virtual|override|template|typename)\b/g,
      style: { color: "#569cd6", fontWeight: "bold" },
    },
    {
      pattern:
        /\b(cout|cin|endl|std|string|vector|map|set|list|queue|stack|pair|make_pair|sort|find|begin|end|size|push_back|pop_back|front|back|empty|clear|transform|back_inserter)\b/g,
      style: { color: "#4ec9b0" },
    },
    { pattern: /"(?:[^"\\]|\\.)*"/g, style: { color: "#ce9178" } },
    { pattern: /'(?:[^'\\]|\\.)*'/g, style: { color: "#ce9178" } },
    { pattern: /\/\/.*$/gm, style: { color: "#6a9955", fontStyle: "italic" } },
    { pattern: /\/\*[\s\S]*?\*\//g, style: { color: "#6a9955", fontStyle: "italic" } },
    { pattern: /\b\d+\.?\d*[fFlL]?\b/g, style: { color: "#b5cea8" } },
    { pattern: /\b(true|false|nullptr|NULL)\b/g, style: { color: "#569cd6" } },
    // Lambda expressions
    { pattern: /\[.*?\]/g, style: { color: "#dcdcaa" } },
    // Operators
    { pattern: /[+\-*/%=<>!&|^~?:]/g, style: { color: "#d4d4d4" } },
  ],
  c: [
    {
      pattern:
        /\b(#include|#define|#ifdef|#ifndef|#endif|int|double|float|char|void|const|static|struct|enum|union|typedef|if|else|for|while|do|switch|case|default|return|break|continue|goto|sizeof|extern|register|auto|volatile|signed|unsigned|short|long)\b/g,
      style: { color: "#569cd6", fontWeight: "bold" },
    },
    {
      pattern:
        /\b(printf|scanf|malloc|calloc|realloc|free|strlen|strcpy|strcat|strcmp|strncmp|memcpy|memset|fopen|fclose|fread|fwrite|fprintf|fscanf|getchar|putchar|puts|gets|atoi|atof|exit)\b/g,
      style: { color: "#4ec9b0" },
    },
    { pattern: /"(?:[^"\\]|\\.)*"/g, style: { color: "#ce9178" } },
    { pattern: /'(?:[^'\\]|\\.)*'/g, style: { color: "#ce9178" } },
    { pattern: /\/\/.*$/gm, style: { color: "#6a9955", fontStyle: "italic" } },
    { pattern: /\/\*[\s\S]*?\*\//g, style: { color: "#6a9955", fontStyle: "italic" } },
    { pattern: /\b\d+\.?\d*[fFlL]?\b/g, style: { color: "#b5cea8" } },
    { pattern: /\b(NULL)\b/g, style: { color: "#569cd6" } },
  ],
  rust: [
    {
      pattern:
        /\b(fn|let|mut|const|static|if|else|match|loop|while|for|in|break|continue|return|struct|enum|impl|trait|type|where|use|mod|pub|crate|super|self|Self|async|await|move|ref|dyn|unsafe|extern)\b/g,
      style: { color: "#569cd6", fontWeight: "bold" },
    },
    {
      pattern:
        /\b(println!|print!|vec!|format!|panic!|assert!|assert_eq!|debug_assert!|Option|Some|None|Result|Ok|Err|Vec|HashMap|String|str|i32|i64|u32|u64|f32|f64|bool|char|usize|isize)\b/g,
      style: { color: "#4ec9b0" },
    },
    { pattern: /"(?:[^"\\]|\\.)*"/g, style: { color: "#ce9178" } },
    { pattern: /'(?:[^'\\]|\\.)*'/g, style: { color: "#ce9178" } },
    { pattern: /\/\/.*$/gm, style: { color: "#6a9955", fontStyle: "italic" } },
    { pattern: /\/\*[\s\S]*?\*\//g, style: { color: "#6a9955", fontStyle: "italic" } },
    { pattern: /\b\d+\.?\d*\b/g, style: { color: "#b5cea8" } },
    { pattern: /\b(true|false)\b/g, style: { color: "#569cd6" } },
    // Macros
    { pattern: /\w+!/g, style: { color: "#dcdcaa" } },
    // Lifetimes
    { pattern: /'[a-zA-Z_][a-zA-Z0-9_]*\b/g, style: { color: "#c586c0" } },
  ],
  dart: [
    {
      pattern:
        /\b(void|int|double|String|bool|List|Map|Set|var|final|const|if|else|for|while|do|switch|case|default|break|continue|return|try|catch|finally|throw|class|extends|implements|abstract|static|async|await|yield|import|export|library|part|show|hide|as|deferred)\b/g,
      style: { color: "#569cd6", fontWeight: "bold" },
    },
    {
      pattern:
        /\b(print|toString|length|isEmpty|isNotEmpty|add|remove|contains|indexOf|map|where|reduce|fold|forEach|any|every|first|last|single|take|skip|toList|toSet|Future|Stream|Duration|DateTime|RegExp)\b/g,
      style: { color: "#4ec9b0" },
    },
    { pattern: /"(?:[^"\\]|\\.)*"/g, style: { color: "#ce9178" } },
    { pattern: /'(?:[^'\\]|\\.)*'/g, style: { color: "#ce9178" } },
    { pattern: /\/\/.*$/gm, style: { color: "#6a9955", fontStyle: "italic" } },
    { pattern: /\/\*[\s\S]*?\*\//g, style: { color: "#6a9955", fontStyle: "italic" } },
    { pattern: /\b\d+\.?\d*\b/g, style: { color: "#b5cea8" } },
    { pattern: /\b(true|false|null)\b/g, style: { color: "#569cd6" } },
    // String interpolation
    { pattern: /\$\{[^}]*\}/g, style: { color: "#dcdcaa" } },
    { pattern: /\$\w+/g, style: { color: "#dcdcaa" } },
  ],
}

// Light mode color scheme
const lightModePatterns = {
  javascript: [
    {
      pattern:
        /\b(function|const|let|var|if|else|for|while|return|class|import|export|async|await|try|catch|finally|throw|new|this|super|extends|static|public|private|protected)\b/g,
      style: { color: "#0000ff", fontWeight: "bold" },
    },
    {
      pattern:
        /\b(console|document|window|Array|Object|String|Number|Boolean|Date|Math|JSON|Promise|setTimeout|setInterval)\b/g,
      style: { color: "#267f99" },
    },
    { pattern: /"(?:[^"\\]|\\.)*"/g, style: { color: "#a31515" } },
    { pattern: /'(?:[^'\\]|\\.)*'/g, style: { color: "#a31515" } },
    { pattern: /`(?:[^`\\]|\\.)*`/g, style: { color: "#a31515" } },
    { pattern: /\/\/.*$/gm, style: { color: "#008000", fontStyle: "italic" } },
    { pattern: /\/\*[\s\S]*?\*\//g, style: { color: "#008000", fontStyle: "italic" } },
    { pattern: /\b\d+\.?\d*\b/g, style: { color: "#098658" } },
    { pattern: /\b(true|false|null|undefined)\b/g, style: { color: "#0000ff" } },
  ],
  python: [
    {
      pattern:
        /\b(def|class|if|else|elif|for|while|return|import|from|as|try|except|with|lambda|yield|pass|break|continue|global|nonlocal|assert|del|raise|finally)\b/g,
      style: { color: "#0000ff", fontWeight: "bold" },
    },
    {
      pattern:
        /\b(print|len|range|str|int|float|list|dict|tuple|set|bool|type|isinstance|hasattr|getattr|setattr|enumerate|zip|map|filter|sorted|reversed|sum|min|max|abs|round)\b/g,
      style: { color: "#267f99" },
    },
    { pattern: /"(?:[^"\\]|\\.)*"/g, style: { color: "#a31515" } },
    { pattern: /'(?:[^'\\]|\\.)*'/g, style: { color: "#a31515" } },
    { pattern: /f"(?:[^"\\]|\\.)*"/g, style: { color: "#a31515" } },
    { pattern: /f'(?:[^'\\]|\\.)*'/g, style: { color: "#a31515" } },
    { pattern: /#.*$/gm, style: { color: "#008000", fontStyle: "italic" } },
    { pattern: /\b\d+\.?\d*\b/g, style: { color: "#098658" } },
    { pattern: /\b(True|False|None)\b/g, style: { color: "#0000ff" } },
  ],
  java: [
    {
      pattern:
        /\b(public|private|protected|static|final|abstract|class|interface|extends|implements|if|else|for|while|do|switch|case|default|return|break|continue|try|catch|finally|throw|throws|new|this|super|package|import|synchronized|volatile|transient|native|strictfp)\b/g,
      style: { color: "#0000ff", fontWeight: "bold" },
    },
    {
      pattern:
        /\b(System|String|int|double|float|boolean|char|byte|short|long|void|Object|ArrayList|HashMap|Scanner|Math|Integer|Double|Boolean|Character)\b/g,
      style: { color: "#267f99" },
    },
    { pattern: /"(?:[^"\\]|\\.)*"/g, style: { color: "#a31515" } },
    { pattern: /\/\/.*$/gm, style: { color: "#008000", fontStyle: "italic" } },
    { pattern: /\/\*[\s\S]*?\*\//g, style: { color: "#008000", fontStyle: "italic" } },
    { pattern: /\b\d+\.?\d*[fFdDlL]?\b/g, style: { color: "#098658" } },
    { pattern: /\b(true|false|null)\b/g, style: { color: "#0000ff" } },
  ],
  cpp: [
    {
      pattern:
        /\b(#include|#define|#ifdef|#ifndef|#endif|using|namespace|int|double|float|char|bool|void|const|static|public|private|protected|class|struct|enum|if|else|for|while|do|switch|case|default|return|break|continue|try|catch|throw|new|delete|this|virtual|override|template|typename)\b/g,
      style: { color: "#0000ff", fontWeight: "bold" },
    },
    {
      pattern:
        /\b(cout|cin|endl|std|string|vector|map|set|list|queue|stack|pair|make_pair|sort|find|begin|end|size|push_back|pop_back|front|back|empty|clear|transform|back_inserter)\b/g,
      style: { color: "#267f99" },
    },
    { pattern: /"(?:[^"\\]|\\.)*"/g, style: { color: "#a31515" } },
    { pattern: /'(?:[^'\\]|\\.)*'/g, style: { color: "#a31515" } },
    { pattern: /\/\/.*$/gm, style: { color: "#008000", fontStyle: "italic" } },
    { pattern: /\/\*[\s\S]*?\*\//g, style: { color: "#008000", fontStyle: "italic" } },
    { pattern: /\b\d+\.?\d*[fFlL]?\b/g, style: { color: "#098658" } },
    { pattern: /\b(true|false|nullptr|NULL)\b/g, style: { color: "#0000ff" } },
    { pattern: /\[.*?\]/g, style: { color: "#795e26" } },
    { pattern: /[+\-*/%=<>!&|^~?:]/g, style: { color: "#000000" } },
  ],
  c: [
    {
      pattern:
        /\b(#include|#define|#ifdef|#ifndef|#endif|int|double|float|char|void|const|static|struct|enum|union|typedef|if|else|for|while|do|switch|case|default|return|break|continue|goto|sizeof|extern|register|auto|volatile|signed|unsigned|short|long)\b/g,
      style: { color: "#0000ff", fontWeight: "bold" },
    },
    {
      pattern:
        /\b(printf|scanf|malloc|calloc|realloc|free|strlen|strcpy|strcat|strcmp|strncmp|memcpy|memset|fopen|fclose|fread|fwrite|fprintf|fscanf|getchar|putchar|puts|gets|atoi|atof|exit)\b/g,
      style: { color: "#267f99" },
    },
    { pattern: /"(?:[^"\\]|\\.)*"/g, style: { color: "#a31515" } },
    { pattern: /'(?:[^'\\]|\\.)*'/g, style: { color: "#a31515" } },
    { pattern: /\/\/.*$/gm, style: { color: "#008000", fontStyle: "italic" } },
    { pattern: /\/\*[\s\S]*?\*\//g, style: { color: "#008000", fontStyle: "italic" } },
    { pattern: /\b\d+\.?\d*[fFlL]?\b/g, style: { color: "#098658" } },
    { pattern: /\b(NULL)\b/g, style: { color: "#0000ff" } },
  ],
  rust: [
    {
      pattern:
        /\b(fn|let|mut|const|static|if|else|match|loop|while|for|in|break|continue|return|struct|enum|impl|trait|type|where|use|mod|pub|crate|super|self|Self|async|await|move|ref|dyn|unsafe|extern)\b/g,
      style: { color: "#0000ff", fontWeight: "bold" },
    },
    {
      pattern:
        /\b(println!|print!|vec!|format!|panic!|assert!|assert_eq!|debug_assert!|Option|Some|None|Result|Ok|Err|Vec|HashMap|String|str|i32|i64|u32|u64|f32|f64|bool|char|usize|isize)\b/g,
      style: { color: "#267f99" },
    },
    { pattern: /"(?:[^"\\]|\\.)*"/g, style: { color: "#a31515" } },
    { pattern: /'(?:[^'\\]|\\.)*'/g, style: { color: "#a31515" } },
    { pattern: /\/\/.*$/gm, style: { color: "#008000", fontStyle: "italic" } },
    { pattern: /\/\*[\s\S]*?\*\//g, style: { color: "#008000", fontStyle: "italic" } },
    { pattern: /\b\d+\.?\d*\b/g, style: { color: "#098658" } },
    { pattern: /\b(true|false)\b/g, style: { color: "#0000ff" } },
    { pattern: /\w+!/g, style: { color: "#795e26" } },
    { pattern: /'[a-zA-Z_][a-zA-Z0-9_]*\b/g, style: { color: "#800080" } },
  ],
  dart: [
    {
      pattern:
        /\b(void|int|double|String|bool|List|Map|Set|var|final|const|if|else|for|while|do|switch|case|default|break|continue|return|try|catch|finally|throw|class|extends|implements|abstract|static|async|await|yield|import|export|library|part|show|hide|as|deferred)\b/g,
      style: { color: "#0000ff", fontWeight: "bold" },
    },
    {
      pattern:
        /\b(print|toString|length|isEmpty|isNotEmpty|add|remove|contains|indexOf|map|where|reduce|fold|forEach|any|every|first|last|single|take|skip|toList|toSet|Future|Stream|Duration|DateTime|RegExp)\b/g,
      style: { color: "#267f99" },
    },
    { pattern: /"(?:[^"\\]|\\.)*"/g, style: { color: "#a31515" } },
    { pattern: /'(?:[^'\\]|\\.)*'/g, style: { color: "#a31515" } },
    { pattern: /\/\/.*$/gm, style: { color: "#008000", fontStyle: "italic" } },
    { pattern: /\/\*[\s\S]*?\*\//g, style: { color: "#008000", fontStyle: "italic" } },
    { pattern: /\b\d+\.?\d*\b/g, style: { color: "#098658" } },
    { pattern: /\b(true|false|null)\b/g, style: { color: "#0000ff" } },
    { pattern: /\$\{[^}]*\}/g, style: { color: "#795e26" } },
    { pattern: /\$\w+/g, style: { color: "#795e26" } },
  ],
}

export function CodeMirrorEditor({ code, language, onChange, isDarkMode }: CodeMirrorEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)
  const [highlightedElements, setHighlightedElements] = useState<React.ReactNode[]>([])

  const applySyntaxHighlighting = (text: string, lang: string) => {
    const patterns = isDarkMode
      ? syntaxPatterns[lang as keyof typeof syntaxPatterns] || []
      : lightModePatterns[lang as keyof typeof lightModePatterns] || []

    if (patterns.length === 0) {
      return [<span key="default">{text}</span>]
    }

    const elements: React.ReactNode[] = []
    let lastIndex = 0
    const matches: Array<{ start: number; end: number; style: React.CSSProperties }> = []

    // Find all matches
    patterns.forEach(({ pattern, style }) => {
      let match
      const regex = new RegExp(pattern.source, pattern.flags)
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          style,
        })
        if (!pattern.global) break
      }
    })

    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start)

    // Remove overlapping matches (keep the first one)
    const filteredMatches = matches.filter((match, index) => {
      for (let i = 0; i < index; i++) {
        const prevMatch = matches[i]
        if (match.start < prevMatch.end && match.end > prevMatch.start) {
          return false
        }
      }
      return true
    })

    // Build the highlighted elements
    filteredMatches.forEach((match, index) => {
      // Add text before the match
      if (match.start > lastIndex) {
        elements.push(<span key={`text-${index}`}>{text.slice(lastIndex, match.start)}</span>)
      }

      // Add the highlighted match
      elements.push(
        <span key={`highlight-${index}`} style={match.style}>
          {text.slice(match.start, match.end)}
        </span>,
      )

      lastIndex = match.end
    })

    // Add remaining text
    if (lastIndex < text.length) {
      elements.push(<span key="remaining">{text.slice(lastIndex)}</span>)
    }

    return elements.length > 0 ? elements : [<span key="default">{text}</span>]
  }

  useEffect(() => {
    const lines = code.split("\n")
    const highlightedLines = lines.map((line, lineIndex) => {
      const highlightedElements = applySyntaxHighlighting(line, language)
      return (
        <div key={lineIndex} className="leading-6">
          {highlightedElements}
          {line === "" && <br />}
        </div>
      )
    })
    setHighlightedElements(highlightedLines)
  }, [code, language, isDarkMode, applySyntaxHighlighting])

  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      const newValue = code.substring(0, start) + "  " + code.substring(end)
      onChange(newValue)

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      }, 0)
    }
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Syntax highlighted background */}
      <div
        ref={highlightRef}
        className={`absolute inset-0 p-4 pl-14 font-mono text-sm pointer-events-none overflow-auto whitespace-pre-wrap break-words ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
        style={{
          tabSize: 2,
          fontFamily: "JetBrains Mono, Consolas, Monaco, 'Courier New', monospace",
        }}
      >
        {highlightedElements}
      </div>

      {/* Transparent textarea overlay */}
      <Textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        className={`absolute inset-0 p-4 pl-14 font-mono text-sm leading-6 resize-none border-0 outline-none bg-transparent text-transparent selection:bg-blue-500/30 ${
          isDarkMode ? "caret-white" : "caret-black"
        }`}
        style={{
          tabSize: 2,
          fontFamily: "JetBrains Mono, Consolas, Monaco, 'Courier New', monospace",
          caretColor: isDarkMode ? "white" : "black",
        }}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        data-gramm="false"
      />

      {/* Line numbers */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-12 flex flex-col items-end pr-2 pt-4 font-mono text-xs leading-6 pointer-events-none select-none ${
          isDarkMode
            ? "bg-gray-800 text-gray-500 border-r border-gray-700"
            : "bg-gray-50 text-gray-400 border-r border-gray-200"
        }`}
      >
        {code.split("\n").map((_, index) => (
          <div key={index} className="h-6 flex items-center">
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  )
}

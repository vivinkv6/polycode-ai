"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const libraries = [
  {
    name: "Monaco Editor",
    description: "VS Code's editor - Full IDE experience",
    pros: ["IntelliSense", "Error detection", "Multiple cursors", "Minimap"],
    cons: ["Large bundle size", "Complex setup"],
    install: "npm install @monaco-editor/react",
    bestFor: "Full-featured code editors",
    bundle: "~2MB",
    difficulty: "Hard",
  },
  {
    name: "CodeMirror 6",
    description: "Modern, extensible code editor",
    pros: ["Lightweight", "Highly customizable", "Great performance", "Mobile support"],
    cons: ["Learning curve", "Manual language setup"],
    install: "npm install codemirror @codemirror/lang-javascript",
    bestFor: "Custom code editors",
    bundle: "~200KB",
    difficulty: "Medium",
  },
  {
    name: "Prism.js",
    description: "Lightweight syntax highlighter",
    pros: ["Very lightweight", "Many themes", "Easy setup", "Good language support"],
    cons: ["Read-only highlighting", "Manual editor overlay needed"],
    install: "npm install prismjs",
    bestFor: "Code display with editing overlay",
    bundle: "~50KB",
    difficulty: "Easy",
  },
  {
    name: "Highlight.js",
    description: "Syntax highlighting for the web",
    pros: ["Auto language detection", "Many themes", "Simple API"],
    cons: ["Read-only", "Larger than Prism"],
    install: "npm install highlight.js",
    bestFor: "Code display only",
    bundle: "~100KB",
    difficulty: "Easy",
  },
  {
    name: "React Syntax Highlighter",
    description: "React wrapper for Prism/Highlight.js",
    pros: ["React-friendly", "Easy to use", "Multiple engines"],
    cons: ["Bundle size", "Limited editing"],
    install: "npm install react-syntax-highlighter",
    bestFor: "React apps with code display",
    bundle: "~300KB",
    difficulty: "Easy",
  },
]

export default function SyntaxComparison() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {libraries.map((lib) => (
        <Card key={lib.name} className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{lib.name}</CardTitle>
              <Badge
                variant={
                  lib.difficulty === "Easy" ? "default" : lib.difficulty === "Medium" ? "secondary" : "destructive"
                }
              >
                {lib.difficulty}
              </Badge>
            </div>
            <CardDescription>{lib.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-green-600 mb-2">Pros:</h4>
              <ul className="text-sm space-y-1">
                {lib.pros.map((pro, i) => (
                  <li key={i} className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-red-600 mb-2">Cons:</h4>
              <ul className="text-sm space-y-1">
                {lib.cons.map((con, i) => (
                  <li key={i} className="flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t space-y-2">
              <div className="text-sm">
                <strong>Bundle:</strong> {lib.bundle}
              </div>
              <div className="text-sm">
                <strong>Best for:</strong> {lib.bestFor}
              </div>
              <code className="text-xs bg-gray-100 p-2 rounded block">{lib.install}</code>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

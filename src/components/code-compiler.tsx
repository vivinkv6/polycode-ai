"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Moon,
  Sun,
  Play,
  GripVertical,
  Code2,
  Terminal,
  Download,
  Maximize2,
  Copy,
  Check,
} from "lucide-react";
import { CodeMirrorEditor } from "./codemirror-editor";
import { AI } from "@/config/gemini.config";
import JS from "../data/language/js.svg";
import Cpp from "../data/language/cpp.svg";
import Rust from "../data/language/rust.svg";
import Java from "../data/language/java.svg";
import Dart from "../data/language/dart.svg";
import Python from "../data/language/python.svg";
import C from "../data/language/c.svg";

import Logo from "../../public/logo.png";

const languages = [
  {
    value: "javascript",
    label: "JavaScript",
    icon: JS,
    defaultCode: `console.log("Hello, World!");`,
  },
  {
    value: "python",
    label: "Python",
    icon: Python,
    defaultCode: `print("Hello, World!")`,
  },
  {
    value: "java",
    label: "Java",
    icon: Java,
    defaultCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  },
  {
    value: "cpp",
    label: "C++",
    icon: Cpp,
    defaultCode: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
  },
  {
    value: "c",
    label: "C",
    icon: C,
    defaultCode: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
  },
  {
    value: "rust",
    label: "Rust",
    icon: Rust,
    defaultCode: `fn main() {
    println!("Hello, World!");
}`,
  },
  {
    value: "dart",
    label: "Dart",
    icon: Dart,
    defaultCode: `void main() {
    print('Hello, World!');
}`,
  },
];

export default function CodeCompiler() {
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [code, setCode] = useState(
    languages.find((lang) => lang.value === "cpp")?.defaultCode || ""
  );
  const [output, setOutput] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [leftWidth, setLeftWidth] = useState(70);
  const [isResizing, setIsResizing] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(70);
  const resizeTimeoutRef = useRef<NodeJS.Timeout>(null);

  // Handle window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add resize listener with debounce
    const debouncedCheck = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(checkMobile, 100);
    };

    window.addEventListener("resize", debouncedCheck);

    // Cleanup
    return () => {
      window.removeEventListener("resize", debouncedCheck);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const selectedLang = languages.find(
      (lang) => lang.value === selectedLanguage
    );
    if (selectedLang) {
      setCode(selectedLang.defaultCode);
    }
  }, [selectedLanguage]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
      startXRef.current = e.clientX;
      startWidthRef.current = leftWidth;
    },
    [leftWidth]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const deltaX = e.clientX - startXRef.current;
      const containerWidth = containerRect.width;
      const deltaPercent = (deltaX / containerWidth) * 100;
      const newWidth = Math.max(
        20,
        Math.min(80, startWidthRef.current + deltaPercent)
      );

      // Use requestAnimationFrame for smooth updates
      requestAnimationFrame(() => {
        setLeftWidth(newWidth);
      });
    },
    [isResizing]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Cleanup resize event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const executeCode = async () => {
    setIsExecuting(true);
    setOutput("🚀 Compiling and executing code...\n");

    try {
      const response = await AI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Act as a compiler for ${selectedLanguage}. Execute this code and return output in JSON format:
        ${code}`,
        config: {
          systemInstruction: `You are a code compiler that executes ${selectedLanguage} code and returns the output in structured JSON format. Response format:
          {
            output: 'output value',
            message: 'Compilation status'
          } OR {
            error: 'error message',
            message: 'Compilation failed'
          }`,
        },
      });

      const cleanedJsonString = response.text?.replace(
        /^```json\n|\n```$/g,
        ""
      );
      const result = JSON.parse(cleanedJsonString || "{}");

      if (result.error) {
        setOutput(
          `❌ Compilation Failed:\n\n\n${result.error}\n\n${result.message}`
        );
      } else {
        setOutput(
          `✅ Code Execution Results:\n\n\n${result.output}\n\n${result.message}`
        );
      }
    } catch (error) {
      setOutput(
        `❌ Error: ${
          error instanceof Error ? error.message : "Failed to execute code"
        }`
      );
    } finally {
      setIsExecuting(false);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const downloadCode = () => {
    const extension = {
      javascript: "js",
      python: "py",
      java: "java",
      cpp: "cpp",
      c: "c",
      rust: "rs",
      dart: "dart",
    }[selectedLanguage];

    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `main.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const themeClasses = isDarkMode
    ? "bg-gray-900 text-white"
    : "bg-white text-gray-900";

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${themeClasses} ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      {/* Header */}
      <div
        className={`border-b p-4 flex items-center justify-between ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img 
              src={Logo.src} 
              alt="PolyCode Logo" 
              className="h-12 w-20 object-contain" 
              style={{ filter: isDarkMode ? 'invert(1)' : 'none' }}
            />
            <h1 className="text-xl md:text-2xl font-bold">PolyCode AI</h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
            <Terminal className="h-4 w-4" />
            <span>Professional Syntax Highlighting</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={copyCode}
            title="Copy Code"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={downloadCode}
            title="Download Code"
          >
            <Download className="h-4 w-4" />
          </Button>
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="Toggle Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </Button> */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Toggle Theme"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div
        ref={containerRef}
        className="flex flex-col md:flex-row h-[calc(100vh-73px)]"
      >
        {/* Left Section - Code Editor */}
        <div
          className="flex flex-col h-[70vh] md:h-full"
          style={{
            width: isMobile ? "100%" : `${leftWidth}%`,
            transition: isResizing ? "none" : "width 0.1s ease-in-out",
          }}
        >
          {/* Editor Header */}
          <div
            className={`p-4 border-b flex items-center gap-4 ${
              isDarkMode
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <Select
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
            >
              <SelectTrigger
                className={`w-48 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent
                className={
                  isDarkMode
                    ? "bg-gray-800 border-gray-600"
                    : "bg-white border-gray-300"
                }
              >
                {languages.map((lang) => (
                  <SelectItem
                    key={lang.value}
                    value={lang.value}
                    className={
                      isDarkMode
                        ? "text-white hover:bg-gray-700 focus:bg-gray-700"
                        : "text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                    }
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={lang.icon.src}
                        alt={lang.label}
                        className="w-4 h-4"
                      />
                      <span>{lang.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={executeCode}
              disabled={isExecuting}
              className={`ml-auto ${
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <Play className="h-4 w-4 mr-2" />
              {isExecuting ? "Compiling..." : "Run Code"}
            </Button>
          </div>

          {/* Code Editor */}
          <div className="flex-1">
            <CodeMirrorEditor
              code={code}
              language={selectedLanguage}
              onChange={setCode}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        {/* Resizer (Desktop only) */}
        <div
          className={`hidden md:flex items-center justify-center w-2 cursor-col-resize transition-colors ${
            isResizing ? "bg-blue-500" : "hover:bg-blue-500"
          }`}
          onMouseDown={handleMouseDown}
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>

        {/* Right Section - Output */}
        <div
          className="flex flex-col h-[30vh] md:h-full"
          style={{
            width: isMobile ? "100%" : `${100 - leftWidth}%`,
            transition: isResizing ? "none" : "width 0.1s ease-in-out",
          }}
        >
          {/* Output Header */}
          <div
            className={`p-4 border-b ${
              isDarkMode
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 h-[35px]">
                <Terminal className="h-4 w-4" />
                <h3 className="font-semibold">Output</h3>
              </div>
              {isExecuting && (
                <div className="flex items-center gap-2 text-sm text-blue-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  Compiling...
                </div>
              )}
            </div>
          </div>

          {/* Output Content */}
          <div className="flex-1 p-4">
            <Card
              className={`h-full p-4 ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <pre
                className={`font-mono text-sm whitespace-pre-wrap h-full overflow-auto ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}
              >
                {output ||
                  `🚀 Click "Run Code" to compile and execute your ${selectedLanguage} program...`}
              </pre>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

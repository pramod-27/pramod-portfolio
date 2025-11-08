import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CommandOutput {
  command: string;
  output: string;
  timestamp: number;
}

interface Theme {
  name: string;
  bg: string;
  text: string;
  prompt: string;
  command: string;
  output: string;
  error: string;
  border: string;
  tip: string;
}

const DEFAULT_THEMES: Theme[] = [
  {
    name: "classic",
    bg: "bg-black",
    text: "text-green-400",
    prompt: "text-green-500",
    command: "text-green-400",
    output: "text-green-300",
    error: "text-red-400",
    border: "border-green-900",
    tip: "text-green-700",
  },
  {
    name: "light",
    bg: "bg-white",
    text: "text-black",
    prompt: "text-gray-600",
    command: "text-black",
    output: "text-gray-700",
    error: "text-red-500",
    border: "border-gray-300",
    tip: "text-gray-500",
  },
  {
    name: "blue",
    bg: "bg-slate-900",
    text: "text-blue-400",
    prompt: "text-blue-500",
    command: "text-blue-400",
    output: "text-blue-300",
    error: "text-red-400",
    border: "border-blue-900",
    tip: "text-blue-700",
  },
  {
    name: "purple",
    bg: "bg-gray-900",
    text: "text-purple-400",
    prompt: "text-purple-500",
    command: "text-purple-400",
    output: "text-purple-300",
    error: "text-red-400",
    border: "border-purple-900",
    tip: "text-purple-700",
  },
];

const COMMANDS = {
  help: `Available commands:
  help - Show this help message
  about - Professional summary
  skills - Technical skills and tools
  projects - Featured projects
  experience - Work experience and internships
  education - Academic background
  contact - Contact information
  awards - Honors and achievements
  interests - Personal interests
  theme - Switch or list terminal themes (use 'theme color' for custom)
  clear - Clear terminal history`,
  about: `PRAMOD KUMAR MARRI
AI/ML Engineer
Enthusiastic AI/ML Engineer skilled in building LLM and multimodal AI
applications using Python, FastAPI, and LangChain, with hands-on experience
in prompt engineering and retrieval-augmented generation (RAG).
Recently completed B.Tech in Artificial Intelligence & Machine Learning at
Sagi Rama Krishnam Raju Engineering College (CGPA: 8.4/10.0)`,
  skills: `TECHNICAL SKILLS
Programming Languages:
  • C, Java, Python, Go
Frameworks & Libraries:
  • FastAPI, LangChain, TensorFlow, Keras, Scikit-learn
Web Technologies:
  • HTML, CSS, JavaScript
Databases:
  • MySQL, Vector Databases (ChromaDB)
Tools & Platforms:
  • VS Code, Google Colab, Git, GitHub
AI Tools:
  • OpenAI API, Hugging Face, Gemini API
Data & Visualization:
  • Pandas, NumPy, Matplotlib, Seaborn, Tableau`,
  projects: `FEATURED PROJECTS
1. DOC Chat AI - Intelligent Document Assistant (RAG, LangChain, FastAPI) :LINK - https://doc-chat-murex.vercel.app/  
    • Architected production-grade RAG pipeline for semantic document search, processing pdf/doc with 
      token chunking and achieving efficient context retrieval.
    • Built full-stack AI document chat application with real-time multi-format document processing
      and implemented speech-to-text integration.

2. Video Insight Mapping Application (LLMs, Full Stack & AI Integration)
   • Built video analysis app using OpenAI Whisper for transcription
   • Integrated FastAPI backend with React frontend
   • Added keypoint summarization using Gemini API with context-aware prompts

3. Robust Classification Model (Machine Learning)
   • Built Random Forest model improving F1 score by 14% over baseline
   • Conducted comprehensive EDA and feature engineering
   • Performed thorough performance evaluation and optimization`,
  experience: `WORK EXPERIENCE
EduSkills Foundation | Intern
Jan 2025 - Feb 2025
  • Built and optimized CNN models for image classification and object detection
  • Developed preprocessing pipelines (data cleaning, augmentation, normalization)
  • Completed hands-on labs on CNNs, model evaluation, and error analysis

Blackbucks Engineers | AI/ML Intern
July 2024 - Sep 2024
  • Developed CNN classifier on CIFAR-10 achieving 83% accuracy
  • Applied hyperparameter tuning, dropout, and batch normalization
  • Collaborated in 4-member team, streamlining preprocessing workflow

Henotic Technologies Pvt. Ltd. | Machine Learning Intern
June 2023 - Sep 2023
  • Built supervised ML models for classification & regression (50k+ entries)
  • Conducted EDA and feature engineering, reducing error rates by 18%
  • Contributed to predictive analytics solutions for client datasets`,
  education: `EDUCATION
Sagi Rama Krishnam Raju Engineering College, Bhimavaram, India
Bachelor of Technology
Artificial Intelligence & Machine Learning
Aug 2021 – May 2025 | CGPA: 8.4/10.0
Key Courses:
  • Data Structures & Algorithms
  • Machine Learning
  • Deep Learning
  • Natural Language Processing

CERTIFICATIONS:
  • Prompt Engineering - Columbia Plus (Aug 2025)
  • Databases for Developers Foundations - Oracle Dev Gym (Jan 2025)`,
  contact: `CONTACT INFORMATION
Email: pramodkumarmarri711@gmail.com
Mobile: +91-7842322116
LinkedIn: https://linkedin.com/in/pramod-kumar-marri-a1936225a/
GitHub: https://github.com/pramod-27/
Feel free to reach out for collaboration, opportunities, or just to connect!`,
  awards: `HONORS AND ACHIEVEMENTS
🏆 4th Prize - Hackoverflow Hackathon
   SRKREC | October 2023
  
   Demonstrated problem-solving and technical skills in competitive
   hackathon environment.`,
  interests: `PERSONAL INTERESTS
• Team Leadership - Leading and collaborating with diverse teams
• Problem Solving - Tackling complex challenges with creative solutions
• Basketball - Active player and sports enthusiast
• Music - Enjoying and exploring various genres
• Reading - Continuous learning through books and articles`,
  "theme add": `Custom theme support:
  To add a custom theme, type: theme add [name] [bg] [text] [prompt] [command] [output] [error] [border] [tip]
  Example: theme add mytheme bg-red-900 text-yellow-400 text-yellow-500 text-yellow-400 text-yellow-300 text-red-400 border-red-900 text-red-700
  Use valid Tailwind classes (e.g., bg-blue-800, text-cyan-300).
  Custom themes are saved locally and persist across sessions.`,
};

const commandKeys = Object.keys(COMMANDS);

const RenderOutput = ({ text, theme }: { text: string; theme: Theme }) => {
  const emailRegex = /\S+@\S+\.\S+/g;
  const urlRegex = /https?:\/\/\S+/g;
  const phoneRegex = /\+?\d[\d\s\-]{10,}/g;
  const parts = text.split(/(\S+@\S+\.\S+)|(https?:\/\/\S+)|(\+?\d[\d\s\-]{10,})/g).filter(Boolean);
  return (
    <div className={`whitespace-pre-wrap ${theme.output}`}>
      {parts.map((part, index) => {
        if (emailRegex.test(part)) {
          return (
            <a
              key={index}
              href={`mailto:${part}`}
              className="underline hover:text-blue-300"
            >
              {part}
            </a>
          );
        }
        if (urlRegex.test(part)) {
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-300"
            >
              {part}
            </a>
          );
        }
        if (phoneRegex.test(part)) {
          const cleanPhone = part.replace(/[\s\-]/g, '');
          return (
            <a
              key={index}
              href={`tel:${cleanPhone}`}
              className="underline hover:text-blue-300"
            >
              {part}
            </a>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
};

export default function Terminal() {
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      command: "",
      output: `Type 'help' to see available commands.`,
      timestamp: Date.now(),
    },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [themes, setThemes] = useState<Theme[]>(DEFAULT_THEMES);
  const [currentTheme, setCurrentTheme] = useState<Theme>(DEFAULT_THEMES[0]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load custom themes from localStorage on mount
    const savedThemes = localStorage.getItem("customThemes");
    if (savedThemes) {
      try {
        const custom: Theme[] = JSON.parse(savedThemes);
        setThemes([...DEFAULT_THEMES, ...custom]);
        // Set to first custom if exists, else default
        const savedCurrent = localStorage.getItem("currentTheme");
        if (savedCurrent) {
          const themeName = JSON.parse(savedCurrent);
          const foundTheme = [...DEFAULT_THEMES, ...custom].find(t => t.name === themeName);
          if (foundTheme) {
            setCurrentTheme(foundTheme);
          }
        }
      } catch (e) {
        console.error("Failed to load themes:", e);
      }
    }
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [history]);

  const saveCurrentTheme = (themeName: string) => {
    localStorage.setItem("currentTheme", JSON.stringify(themeName));
  };

  const saveCustomThemes = (customThemes: Theme[]) => {
    localStorage.setItem("customThemes", JSON.stringify(customThemes));
  };

  const typeOutput = (output: string, callback: () => void) => {
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < output.length) {
        setHistory((prev) => {
          const last = prev[prev.length - 1];
          return [
            ...prev.slice(0, -1),
            {
              ...last,
              output: output.slice(0, i + 1),
            },
          ];
        });
        i++;
      } else {
        clearInterval(interval);
        typingIntervalRef.current = null;
        setIsTyping(false);
        callback();
      }
    }, 20);
    typingIntervalRef.current = interval;
  };

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const parts = cmd.trim().split(/\s+/);
   
    if (trimmedCmd === "clear") {
      setHistory([]);
      setCommandHistory([]);
      setHistoryIndex(-1);
      return;
    }
    if (parts[0] === "theme") {
      if (parts[1] === "add") {
        // Custom theme addition: theme add [name] [bg] [text] [prompt] [command] [output] [error] [border] [tip]
        if (parts.length < 10) {
          const output = COMMANDS["theme add" as keyof typeof COMMANDS];
          setHistory((prev) => [
            ...prev,
            {
              command: cmd,
              output: "",
              timestamp: Date.now(),
            },
          ]);
          setTimeout(() => {
            typeOutput(output, () => {});
          }, 100);
          return;
        }
        const [, name, bg, text, prompt, command, output, error, border, tip] = parts;
        const newTheme: Theme = {
          name,
          bg,
          text,
          prompt,
          command,
          output,
          error,
          border,
          tip,
        };
        const customThemes = themes.filter(t => !DEFAULT_THEMES.some(d => d.name === t.name));
        const updatedCustom = [...customThemes, newTheme];
        const updatedThemes = [...DEFAULT_THEMES, ...updatedCustom];
        setThemes(updatedThemes);
        saveCustomThemes(updatedCustom);
        const successOutput = `Custom theme '${name}' added successfully! Use 'theme ${name}' to switch.`;
        setHistory((prev) => [
          ...prev,
          {
            command: cmd,
            output: "",
            timestamp: Date.now(),
          },
        ]);
        setTimeout(() => {
          typeOutput(successOutput, () => {});
        }, 100);
        return;
      }
      if (!parts[1]) {
        // List themes
        const allThemes = themes.map(t => ` ${t.name}`).join("\n");
        const output = `Current theme: ${currentTheme.name}\n\n${allThemes}`;
        setHistory((prev) => [
          ...prev,
          {
            command: cmd,
            output: "",
            timestamp: Date.now(),
          },
        ]);
        setTimeout(() => {
          typeOutput(output, () => {});
        }, 100);
        return;
      } else {
        const themeName = parts[1].toLowerCase();
        const theme = themes.find(t => t.name === themeName);
        if (theme) {
          setCurrentTheme(theme);
          saveCurrentTheme(theme.name);
          const output = `Theme switched to: ${theme.name}`;
          setHistory((prev) => [
            ...prev,
            {
              command: cmd,
              output: "",
              timestamp: Date.now(),
            },
          ]);
          setTimeout(() => {
            typeOutput(output, () => {});
          }, 100);
          return;
        } else {
          const output = `Unknown theme: ${themeName}\nType 'theme' for available themes.`;
          setHistory((prev) => [
            ...prev,
            {
              command: cmd,
              output: "",
              timestamp: Date.now(),
            },
          ]);
          setTimeout(() => {
            typeOutput(output, () => {});
          }, 100);
          return;
        }
      }
    }
    let fullOutput = "";
    if (trimmedCmd === "") {
      fullOutput = "";
    } else if (trimmedCmd in COMMANDS) {
      fullOutput = COMMANDS[trimmedCmd as keyof typeof COMMANDS];
    } else {
      fullOutput = `Command not found: ${trimmedCmd}
Available commands: help, about, skills, projects, experience, education, contact, awards, interests, theme, clear`;
    }
    setHistory((prev) => [
      ...prev,
      {
        command: cmd,
        output: "",
        timestamp: Date.now(),
      },
    ]);
    setTimeout(() => {
      typeOutput(fullOutput, () => {});
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim() && !isTyping) {
      const inputToSubmit = currentInput;
      handleCommand(inputToSubmit);
      setCommandHistory((prev) => [...prev, inputToSubmit]);
      setCurrentInput("");
      setHistoryIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isTyping) return;
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      if (historyIndex === -1) {
        setHistoryIndex(commandHistory.length - 1);
        setCurrentInput(commandHistory[commandHistory.length - 1]);
      } else if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      if (historyIndex === -1) {
        // Already at end, do nothing
      } else if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      } else {
        setHistoryIndex(-1);
        setCurrentInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const input = currentInput.trim().toLowerCase();
      if (input === "") return;
      const matches = commandKeys.filter((cmd) => cmd.startsWith(input));
      if (matches.length === 0) return;
      if (matches.length === 1) {
        setCurrentInput(matches[0] + " ");
      } else {
        // Find common prefix
        let commonPrefix = matches[0];
        for (let i = 1; i < matches.length; i++) {
          while (!matches[i].startsWith(commonPrefix)) {
            commonPrefix = commonPrefix.slice(0, -1);
            if (commonPrefix === "") break;
          }
        }
        setCurrentInput(commonPrefix + " ");
      }
    }
  };

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col min-h-screen w-full ${currentTheme.bg} ${currentTheme.text} font-mono p-2 sm:p-4 md:p-8`}
      onClick={handleTerminalClick}
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col flex-1">
        {/* Header */}
        <div className="mb-2 sm:mb-4 text-xs sm:text-sm">
          <div className={currentTheme.prompt}>Pramod Kumar Marri - Portfolio v1.0.0</div>
          <div className={currentTheme.prompt}>System: Linux portfolio 5.15.0</div>
          <div className={`border-b ${currentTheme.border} my-1 sm:my-2`}></div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 min-h-0 pr-2 sm:pr-4" ref={scrollRef}>
          <div className="pb-4">
            {history.map((entry, index) => (
              <div key={entry.timestamp + index} className="mb-2 sm:mb-4">
                {entry.command && (
                  <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                    <span className="text-blue-400">guest@portfolio</span>
                    <span className="text-white">:</span>
                    <span className="text-purple-400">~</span>
                    <span className="text-white">$</span>
                    <span className={currentTheme.command}>{entry.command}</span>
                  </div>
                )}
                {entry.output && (
                  <div className="mt-1 sm:mt-2 text-xs sm:text-sm leading-relaxed">
                    <RenderOutput text={entry.output} theme={currentTheme} />
                  </div>
                )}
              </div>
            ))}
            <form onSubmit={handleSubmit} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <span className="text-blue-400 min-w-0 flex-shrink-0">guest@portfolio</span>
              <span className="text-white">:</span>
              <span className="text-purple-400 min-w-0 flex-shrink-0">~</span>
              <span className="text-white">$</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`flex-1 bg-transparent outline-none ${currentTheme.command} caret-green-400 min-w-0`}
                autoComplete="off"
                spellCheck={false}
                disabled={isTyping}
              />
              <span className="animate-pulse flex-shrink-0">▊</span>
            </form>
            <div ref={endRef} />
          </div>
        </ScrollArea>

        {/* Footer Tip */}
        <div className={`mt-2 sm:mt-4 text-xs ${currentTheme.tip} border-t ${currentTheme.border} pt-1 sm:pt-2`}>
          <div>Tip: Press Tab for command autocompletion</div>
          <div>Use arrow keys to navigate command history</div>
        </div>
      </div>
    </motion.div>
  );
}

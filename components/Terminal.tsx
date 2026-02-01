
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { streamGeminiResponse } from '../services/gemini';

interface TerminalProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

const Terminal: React.FC<TerminalProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden shadow-2xl">
      {/* Terminal Header */}
      <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
        </div>
        <div className="text-xs text-zinc-500 font-medium uppercase tracking-widest">
          Aria-5.0 Terminal Session
        </div>
        <div className="w-12"></div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 mono text-sm scrollbar-thin">
        <div className="text-emerald-500 mb-6 border-b border-emerald-500/20 pb-4">
          <pre className="whitespace-pre-wrap leading-tight text-[10px] md:text-xs">
{` █████  ██████  ██ █████      ███████     ██████  
██   ██ ██   ██ ██ ██   ██     ██         ██  ████ 
███████ ██████  ██ ███████     ███████    ██ ██ ██ 
██   ██ ██   ██ ██ ██   ██          ██    ████  ██ 
██   ██ ██   ██ ██ ██   ██     ███████     ██████  `}
          </pre>
          <div className="mt-2 text-emerald-400 font-bold">CORE INTELLIGENCE INITIALIZED...</div>
          <div className="text-zinc-500">System Link: JDK 21 | Aria-5.0 Cluster Active</div>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`${msg.role === 'user' ? 'text-blue-400' : 'text-zinc-300'}`}>
            <span className="font-bold mr-2">
              {msg.role === 'user' ? '>' : '[ARIA]:'}
            </span>
            <span className="whitespace-pre-wrap">{msg.content}</span>
          </div>
        ))}
        {isLoading && (
          <div className="text-zinc-500 animate-pulse">
            <span className="font-bold mr-2">[ARIA]:</span> Processing kernel request...
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 bg-zinc-900/50 border-t border-zinc-800">
        <div className="flex items-center space-x-3">
          <span className="text-emerald-500 font-bold shrink-0">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Type a command or ask Aria..."
            className="flex-1 bg-transparent border-none outline-none text-zinc-300 mono text-sm placeholder:text-zinc-700 focus:ring-0"
            autoFocus
          />
        </div>
      </form>
    </div>
  );
};

export default Terminal;


import React, { useState, useEffect } from 'react';
import Terminal from './components/Terminal';
import AriaStatus from './components/AriaStatus';
import { Message } from './types';
import { streamGeminiResponse } from './services/gemini';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    
    let assistantResponse = '';
    const assistantId = (Date.now() + 1).toString();

    // Add placeholder for streaming response
    setMessages(prev => [...prev, {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    }]);

    try {
      await streamGeminiResponse(content, history, (chunk) => {
        assistantResponse += chunk;
        setMessages(prev => prev.map(m => 
          m.id === assistantId ? { ...m, content: assistantResponse } : m
        ));
      });
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages(prev => prev.map(m => 
        m.id === assistantId ? { ...m, content: 'Error: Kernel communication interrupted.' } : m
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row p-4 md:p-8 gap-6 max-w-[1600px] mx-auto">
      {/* Sidebar: Status & Info */}
      <aside className="w-full md:w-80 flex flex-col space-y-6">
        <header>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">ARIA 5.0</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Cognitive Interface</p>
            </div>
          </div>
        </header>

        <AriaStatus />
        
        <nav className="flex-1">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-3 px-2">Navigation</div>
          <ul className="space-y-1">
            <li>
              <button className="w-full text-left px-3 py-2 rounded-md bg-zinc-900 text-sm text-zinc-300 font-medium hover:bg-zinc-800 transition-colors flex items-center space-x-3">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Console</span>
              </button>
            </li>
            <li>
              <button className="w-full text-left px-3 py-2 rounded-md text-sm text-zinc-500 font-medium hover:bg-zinc-900 hover:text-zinc-300 transition-colors flex items-center space-x-3">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span>Source Analysis</span>
              </button>
            </li>
            <li>
              <button className="w-full text-left px-3 py-2 rounded-md text-sm text-zinc-500 font-medium hover:bg-zinc-900 hover:text-zinc-300 transition-colors flex items-center space-x-3">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span>JVM Parameters</span>
              </button>
            </li>
          </ul>
        </nav>

        <footer className="pt-4 border-t border-zinc-800">
          <div className="flex items-center space-x-2 text-[10px] text-zinc-600">
            <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full"></span>
            <span>Kernel: Aria-v5.0.1-stable</span>
          </div>
        </footer>
      </aside>

      {/* Main Terminal Area */}
      <main className="flex-1 flex flex-col min-h-[500px] h-[calc(100vh-4rem)] md:h-auto">
        <Terminal 
          messages={messages} 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading} 
        />
      </main>
    </div>
  );
};

export default App;

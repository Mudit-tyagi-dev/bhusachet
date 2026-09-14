import React, { useState } from 'react';
import { Bot, Send, X, Sparkles } from 'lucide-react';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Namaste! I am the **BhuSachet AI Intelligence Assistant**. Ask me about active landslide risk zones, road blockages on NH-10 or NH-6, weather radar forecasts, or citizen report verifications.',
      timestamp: 'Just now',
    },
  ]);

  const quickPrompts = [
    'Is NH-10 open to Gangtok?',
    'What is the rainfall alert for Sohra?',
    'Show pending citizen reports',
    'List critical risk zones in Sikkim',
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // Simulate smart contextual disaster response
    setTimeout(() => {
      let botResponse = 'Analyzing real-time sensor streams and satellite fusion model...';
      const q = query.toLowerCase();

      if (q.includes('nh-10') || q.includes('gangtok') || q.includes('road')) {
        botResponse = '🚨 **NH-10 Alert**: Blockage reported at 29th Mile / Setijhora section due to heavy mudflow. BRO Project Swastik machinery is deployed. Alternate single-lane detour active via Lava - Pedong.';
      } else if (q.includes('sohra') || q.includes('rain') || q.includes('cherrapunji')) {
        botResponse = '🌧️ **Sohra (Meghalaya) Telemetry**: Cloudburst cell recorded 310.2mm in 24 hours. Slope saturation is at 94%. Red Warning issued for Mawkdok Gorge section.';
      } else if (q.includes('report') || q.includes('citizen') || q.includes('pending')) {
        botResponse = '📋 **Crowd Sourced Reports**: 2 reports currently pending admin verification (Near Singhik Viewpoint, Mangan & Wahkaba Falls, Sohra).';
      } else if (q.includes('sikkim') || q.includes('critical')) {
        botResponse = '⛰️ **Sikkim Hotspots**: 2 Critical Risk Zones identified: Chungthang-Lachen Axis (92% probability) and Ranipool-9th Mile NH-10 (88% probability).';
      } else {
        botResponse = `Understood: "${query}". BhuSachet multi-modal risk engine is monitoring Sikkim and Meghalaya pilot zones with live radar and seismic/tilt sensors.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: botResponse,
          timestamp: 'Just now',
        },
      ]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1200]">
      {/* Slide-up Chat Window */}
      {isOpen && (
        <div className="mb-3 w-84 sm:w-96 h-[480px] rounded-2xl glass-panel bg-white/95 dark:bg-slate-950/95 border border-slate-200 dark:border-slate-700/80 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-amber-500/15 via-slate-100 dark:via-slate-900 to-indigo-500/15 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  BhuSachet AI Assistant
                  <Sparkles className="w-3 h-3 text-amber-500" />
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Landslide Intelligence Query Engine</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-700 dark:text-amber-300 font-bold">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-2.5 rounded-xl max-w-[82%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                  }`}
                >
                  <p className="text-xs whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick prompt suggestions */}
          <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-2 py-1 bg-white dark:bg-slate-800/90 hover:bg-amber-500/20 hover:text-amber-700 dark:hover:text-amber-300 border border-slate-200 dark:border-slate-700/80 rounded-full text-[10px] text-slate-700 dark:text-slate-300 transition-colors shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask AI about road blockages, rain..."
              className="flex-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-transform active:scale-95 shadow-md shadow-amber-500/20"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-2xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all duration-200 border border-amber-400/50"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-slate-950 stroke-[2.2]" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-slate-950"></span>
        </div>
        <span className="hidden sm:inline font-extrabold tracking-wide">AI Disaster Assistant</span>
        <Sparkles className="w-3.5 h-3.5 text-slate-900 animate-spin" style={{ animationDuration: '6s' }} />
      </button>
    </div>
  );
}

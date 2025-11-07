import React, { useEffect, useMemo, useState } from 'react';
import HeroSpline from './components/HeroSpline';
import ChatWindow from './components/ChatWindow';
import Dashboard from './components/Dashboard';
import SettingsPanel from './components/SettingsPanel';

function App() {
  const [theme, setTheme] = useState('dark');
  const [openSettings, setOpenSettings] = useState(false);
  const [data, setData] = useState({ tasks: [], notes: [], ideas: [] });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const cached = localStorage.getItem('rabbit_cache');
    if (cached) setData(JSON.parse(cached));
    // initial fetch
    fetch(`${import.meta.env.VITE_BACKEND_URL}/summary-data`).then(r => r.json()).then((d) => {
      setData(d);
      localStorage.setItem('rabbit_cache', JSON.stringify(d));
    }).catch(() => {});
  }, []);

  const handleExport = (format, content) => {
    const blob = new Blob([content], { type: format === 'md' ? 'text/markdown' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rabbit-chat.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full bg-[#0F172A] text-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-6 md:space-y-10">
        <HeroSpline />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2">
            <ChatWindow
              onOpenSettings={() => setOpenSettings(true)}
              onExport={handleExport}
              theme={theme}
              onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            />
          </div>
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gradient-to-br from-[#7C3AED]/20 to-transparent border border-[#7C3AED]/30 rounded-3xl p-4">
              <h3 className="text-lg font-semibold">Your Desk</h3>
              <p className="text-white/70 text-sm">Rabbit keeps your tasks, notes, and ideas tidy. Use commands like /add task, /note, /idea, /summary.</p>
            </div>
            <Dashboard data={data} />
          </div>
        </div>
      </div>

      <SettingsPanel open={openSettings} onClose={() => setOpenSettings(false)} onSaved={() => {}} />
    </div>
  );
}

export default App;

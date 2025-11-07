import React, { useEffect, useState } from 'react';
import { KeyRound, Save, X } from 'lucide-react';

const providers = [
  { id: 'openai', name: 'OpenAI' },
  { id: 'gemini', name: 'Google Gemini' },
  { id: 'anthropic', name: 'Anthropic' },
  { id: 'mistral', name: 'Mistral' },
  { id: 'custom', name: 'Custom Endpoint' },
];

const SettingsPanel = ({ open, onClose, onSaved }) => {
  const [active, setActive] = useState('openai');
  const [keys, setKeys] = useState({});
  const [endpoint, setEndpoint] = useState('');
  const [customPrompt, setCustomPrompt] = useState('You are Rabbit AI, a calm, witty, emotionally aware assistant. Be bilingual (EN/ID).');

  useEffect(() => {
    const stored = localStorage.getItem('rabbit_settings');
    if (stored) {
      const parsed = JSON.parse(stored);
      setActive(parsed.active || 'openai');
      setKeys(parsed.keys || {});
      setEndpoint(parsed.endpoint || '');
      setCustomPrompt(parsed.customPrompt || customPrompt);
    }
  }, []);

  const save = () => {
    const data = { active, keys, endpoint, customPrompt };
    localStorage.setItem('rabbit_settings', JSON.stringify(data));
    if (onSaved) onSaved(data);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end md:items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl bg-[#0F172A] border border-white/10 rounded-3xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="text-white font-medium">Settings</h3>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/5 text-white/70 border border-white/10"><X className="w-4 h-4"/></button>
        </div>
        <div className="p-4 space-y-6">
          <div>
            <label className="block text-sm text-white/70 mb-2">Active Provider</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {providers.map((p) => (
                <button key={p.id} onClick={() => setActive(p.id)} className={`px-3 py-2 rounded-xl border ${active === p.id ? 'bg-[#7C3AED] border-[#7C3AED] text-white' : 'bg-white/5 border-white/10 text-white/80'}`}>{p.name}</button>
              ))}
            </div>
          </div>

          {active !== 'custom' ? (
            <div>
              <label className="block text-sm text-white/70 mb-2">API Key for {providers.find(x => x.id === active)?.name}</label>
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-white/50"/>
                <input
                  type="password"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
                  placeholder="sk-..."
                  value={keys[active] || ''}
                  onChange={(e) => setKeys({ ...keys, [active]: e.target.value })}
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm text-white/70 mb-2">Custom API Endpoint</label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
                placeholder="https://your-endpoint/v1/chat"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-white/70 mb-2">Custom Prompt (Personality Trainer)</label>
            <textarea
              className="w-full min-h-[120px] bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
            />
          </div>
        </div>
        <div className="p-4 border-t border-white/10 flex justify-end">
          <button onClick={save} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7C3AED] text-white"><Save className="w-4 h-4"/> Save</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;

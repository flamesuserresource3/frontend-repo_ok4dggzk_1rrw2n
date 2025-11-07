import React from 'react';
import { Lightbulb, NotebookPen, ListTodo } from 'lucide-react';

const Section = ({ title, items, empty }) => (
  <div className="bg-white/5 border border-white/10 rounded-3xl p-4 md:p-6">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-white/90 font-medium">{title}</h3>
      <span className="text-xs text-white/50">{items.length} items</span>
    </div>
    {items.length === 0 ? (
      <p className="text-white/50 text-sm">{empty}</p>
    ) : (
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it._id || it.ts} className="flex items-start gap-2 text-white/80">
            <span className="text-white/40 text-xs mt-1">•</span>
            <div>
              {it.title ? <p className="font-medium">{it.title}</p> : null}
              <p className="text-sm whitespace-pre-wrap">{it.body || it.summary || it.title}</p>
              <p className="text-xs text-white/40 mt-1">{new Date(it.ts).toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const Dashboard = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <Section title={<span className="inline-flex items-center gap-2"><ListTodo className="w-4 h-4"/> Tasks</span>} items={data.tasks || []} empty="No tasks yet. Use /add task ..." />
      <Section title={<span className="inline-flex items-center gap-2"><NotebookPen className="w-4 h-4"/> Notes</span>} items={data.notes || []} empty="No notes yet. Type /note ..." />
      <Section title={<span className="inline-flex items-center gap-2"><Lightbulb className="w-4 h-4"/> Ideas</span>} items={data.ideas || []} empty="No ideas yet. Try /idea ..." />
    </div>
  );
};

export default Dashboard;

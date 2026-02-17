
import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { Activity, TrendingUp, Target, Zap, Clock, History, Loader2 } from 'lucide-react';
import { HistoryItem } from '../types';

const Statistics: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const historyRef = collection(db, 'users', auth.currentUser.uid, 'history');
    const q = query(historyRef, orderBy('timestamp', 'desc'), limit(50));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      // Correct sorting for charts (chronological)
      setHistory(items.reverse());
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const avgWpm = history.length ? Math.round(history.reduce((acc, curr) => acc + curr.wpm, 0) / history.length) : 0;
  const bestWpm = history.length ? Math.max(...history.map(h => h.wpm)) : 0;
  const avgAccuracy = history.length ? Math.round(history.reduce((acc, curr) => acc + curr.accuracy, 0) / history.length) : 0;

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 text-[var(--muted)]">
        <Loader2 className="animate-spin" size={24} />
        <span className="text-[10px] uppercase tracking-widest">Synchronizing_Telemetry...</span>
      </div>
    );
  }

  if (!auth.currentUser) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 technical-border p-12 bg-[var(--surface)]">
        <Clock size={32} className="text-[var(--muted)] mb-2" />
        <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--fg)]">Access Restricted</h2>
        <p className="text-[10px] text-[var(--muted)] uppercase tracking-widest text-center max-w-xs">Authentication required to access cloud-synced telemetry logs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <h1 className="text-3xl font-dos mb-4 manual-heading">Telemetry Logs</h1>
        <p className="text-xs text-[var(--muted)] uppercase tracking-widest">Performance analysis for operator: {auth.currentUser.email}</p>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg Velocity', value: `${avgWpm} WPM`, icon: <Activity size={12} className="text-[var(--accent)]" /> },
          { label: 'Peak Velocity', value: `${bestWpm} WPM`, icon: <Zap size={12} className="text-emerald-500" /> },
          { label: 'Avg Accuracy', value: `${avgAccuracy}%`, icon: <Target size={12} className="text-blue-400" /> },
          { label: 'Sessions', value: history.length, icon: <Clock size={12} className="text-[var(--muted)]" /> },
        ].map((item, i) => (
          <div key={i} className="technical-border p-4 bg-[var(--surface)] float-shadow">
            <div className="flex items-center space-x-2 mb-2">
              {item.icon}
              <span className="text-[9px] uppercase tracking-widest text-[var(--muted)]">{item.label}</span>
            </div>
            <div className="text-2xl font-bold font-dos">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="technical-border p-8 bg-[var(--surface)] float-shadow h-80">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <TrendingUp size={16} className="text-[var(--accent)]" />
            <h2 className="text-xs font-bold uppercase tracking-widest">Input Velocity Trend [WPM]</h2>
          </div>
          <div className="text-[10px] text-[var(--muted)] uppercase tracking-tighter">Samples_N: {history.length}</div>
        </div>
        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" hide />
              <YAxis domain={['dataMin - 10', 'dataMax + 10']} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted)' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', fontSize: '10px', borderRadius: '0' }}
                itemStyle={{ color: 'var(--accent)' }}
              />
              <Area 
                type="monotone" 
                dataKey="wpm" 
                stroke="var(--accent)" 
                fillOpacity={1} 
                fill="url(#colorWpm)" 
                strokeWidth={2}
                dot={{ fill: 'var(--accent)', r: 3 }}
                activeDot={{ r: 5, stroke: 'var(--bg)', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="technical-border overflow-hidden float-shadow">
        <div className="p-4 bg-[var(--surface)] border-b border-[var(--border)] flex items-center space-x-2">
          <History size={16} className="text-[var(--muted)]" />
          <h2 className="text-xs font-bold uppercase tracking-widest">Recent Mission Logs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] uppercase tracking-tighter">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface)]/50">
                <th className="p-4 font-bold text-[var(--muted)]">Timestamp</th>
                <th className="p-4 font-bold text-[var(--muted)]">Protocol</th>
                <th className="p-4 font-bold text-[var(--muted)]">Velocity</th>
                <th className="p-4 font-bold text-[var(--muted)]">Accuracy</th>
                <th className="p-4 font-bold text-[var(--muted)]">Duration</th>
              </tr>
            </thead>
            <tbody>
              {history.slice().reverse().map((item) => (
                <tr key={item.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                  <td className="p-4 font-mono">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="p-4 font-bold text-[var(--accent)]">{item.category}</td>
                  <td className="p-4">{item.wpm} WPM</td>
                  <td className="p-4">{item.accuracy}%</td>
                  <td className="p-4">{item.timeTaken}S</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statistics;

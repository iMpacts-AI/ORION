import React, { useState, useEffect } from 'react';
import { MemoryItem } from '../../shared/types';
import { Database, Plus, Trash2, ShieldCheck } from 'lucide-react';

export const MemoryScreen: React.FC = () => {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [category, setCategory] = useState<MemoryItem['category']>('PREFERENCE');

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    const api = window.orionApi || window.arvisApi;
    if (api) {
      const data = await api.getMemories();
      setMemories(data);
    }
  };

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;

    const api = window.orionApi || window.arvisApi;
    if (api) {
      await api.saveMemory({
        category,
        key: newKey,
        value: newValue,
        source: 'USER_EXPLICIT'
      });
      setNewKey('');
      setNewValue('');
      loadMemories();
    }
  };

  const handleDelete = async (id: string) => {
    const api = window.orionApi || window.arvisApi;
    if (api) {
      await api.deleteMemory(id);
      loadMemories();
    }
  };

  return (
    <div className="h-full p-6 space-y-6 bg-arvis-card border border-arvis-border overflow-y-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-arvis-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-arvis-accent" />
            <h2 className="text-lg font-bold text-arvis-text tracking-widest">USER-CONTROLLED MEMORY BANK</h2>
          </div>
          <p className="text-xs text-arvis-dim mt-1">
            ORION memory is completely explicit, transparent, and user-inspectable. No hidden data collection.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-black/50 p-2 border border-arvis-border text-xs text-arvis-dim">
          <ShieldCheck className="w-4 h-4 text-green-400" />
          <span>PRIVACY STATUS: ZERO STEALTH STORAGE</span>
        </div>
      </div>

      {/* Add Memory Form */}
      <form onSubmit={handleAddMemory} className="p-4 bg-black/40 border border-arvis-border space-y-3">
        <div className="text-xs font-semibold text-arvis-cyan uppercase">ADD EXPLICIT MEMORY ENTRY</div>
        <div className="grid grid-cols-4 gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as MemoryItem['category'])}
            className="bg-black border border-arvis-border p-2 text-xs text-arvis-text focus:border-arvis-cyan outline-none"
          >
            <option value="PREFERENCE">PREFERENCE</option>
            <option value="FACT">FACT</option>
            <option value="AUTOMATION">AUTOMATION</option>
            <option value="WORKFLOW">WORKFLOW</option>
            <option value="SYSTEM_NOTE">SYSTEM_NOTE</option>
          </select>

          <input
            type="text"
            placeholder="Key (e.g., preferred_theme)"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="bg-black border border-arvis-border p-2 text-xs text-arvis-text focus:border-arvis-cyan outline-none"
          />

          <input
            type="text"
            placeholder="Value (e.g., Cyberpunk Dark HUD)"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="bg-black border border-arvis-border p-2 text-xs text-arvis-text focus:border-arvis-cyan outline-none"
          />

          <button
            type="submit"
            className="flex items-center justify-center space-x-2 bg-arvis-cyan/20 border border-arvis-cyan text-arvis-cyan hover:bg-arvis-cyan/30 text-xs font-bold transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>SAVE MEMORY</span>
          </button>
        </div>
      </form>

      {/* Memory Table / List */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-arvis-dim uppercase">INSPECTABLE MEMORIES ({memories.length})</div>
        <div className="space-y-2">
          {memories.map((mem) => (
            <div key={mem.id} className="p-3 bg-black/30 border border-arvis-border/70 flex justify-between items-center">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 text-[9px] bg-arvis-accent/20 border border-arvis-accent/40 text-arvis-accent font-bold">
                    {mem.category}
                  </span>
                  <span className="font-mono text-xs font-bold text-arvis-cyan">{mem.key}</span>
                  <span className="text-[10px] text-arvis-dim">({mem.source})</span>
                </div>
                <div className="text-xs text-arvis-text font-mono pl-1">{mem.value}</div>
              </div>

              <button
                onClick={() => handleDelete(mem.id)}
                className="p-2 text-arvis-dim hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-colors"
                title="Delete memory"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

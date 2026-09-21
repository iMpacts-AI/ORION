import React, { useState, useEffect } from 'react';
import { ProviderStatusDTO } from '../vite-env';
import { Cpu, ShieldCheck, Zap, RefreshCw, Activity, Layers, Key, Check, Save, Play } from 'lucide-react';

export const ProviderNetworkScreen: React.FC = () => {
  const [providers, setProviders] = useState<ProviderStatusDTO[]>([]);
  const [activeStrategy, setActiveStrategy] = useState<string>('SPEED_FIRST');
  const [showKeyForm, setShowKeyForm] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<Record<string, any> | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [keyInput, setKeyInput] = useState<Record<string, string>>({
    OPENROUTER_API_KEY: '',
    GROQ_API_KEY: '',
    GEMINI_API_KEY: '',
    GITHUB_TOKEN: '',
    CEREBRAS_API_KEY: '',
    MISTRAL_API_KEY: '',
    NVIDIA_API_KEY: '',
    DEEPSEEK_API_KEY: '',
    CLOUDFLARE_API_TOKEN: '',
    CLOUDFLARE_ACCOUNT_ID: ''
  });
  const [saveStatus, setSaveStatus] = useState<string>('');

  useEffect(() => {
    loadStatuses();
    const interval = setInterval(loadStatuses, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadStatuses = async () => {
    const api = window.orionApi || window.arvisApi;
    if (api && api.getAllProviderStatuses) {
      try {
        const statuses = await api.getAllProviderStatuses();
        setProviders(statuses);
      } catch (e) {
        // Ignore
      }
    }
  };

  const handleStrategyChange = async (strategy: string) => {
    setActiveStrategy(strategy);
    const api = window.orionApi || window.arvisApi;
    if (api && api.setAIRoutingStrategy) {
      await api.setAIRoutingStrategy(strategy);
      loadStatuses();
    }
  };

  const handleRunQualification = async () => {
    const api = window.orionApi || window.arvisApi;
    if (api && api.runLiveQualificationTest) {
      setIsTesting(true);
      try {
        const res = await api.runLiveQualificationTest();
        setTestResults(res);
        loadStatuses();
      } catch (e) {
        // Ignore
      } finally {
        setIsTesting(false);
      }
    }
  };

  const handleSaveKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    const api = window.orionApi || window.arvisApi;
    if (api && api.saveProviderKeys) {
      setSaveStatus('SAVING CREDENTIALS TO SECURE ELECTRON MAIN...');
      const success = await api.saveProviderKeys(keyInput);
      if (success) {
        setSaveStatus('SUCCESSFULLY ACTIVATED PROVIDER KEYS!');
        setTimeout(() => setSaveStatus(''), 3000);
        setShowKeyForm(false);
        loadStatuses();
      } else {
        setSaveStatus('ERROR SAVING KEYS TO .ENV');
      }
    }
  };

  return (
    <div className="h-full p-6 space-y-6 bg-arvis-card border border-arvis-border overflow-y-auto font-mono text-xs">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-arvis-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-arvis-cyan" />
            <h2 className="text-lg font-bold text-arvis-text tracking-widest uppercase">ORION OMNI-BRAIN CLOUD AI FABRIC</h2>
          </div>
          <p className="text-xs text-arvis-dim mt-1">
            Zero-cost, ultra-responsive cloud AI failover router. API credentials safely preserved in Main process.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRunQualification}
            disabled={isTesting}
            className="flex items-center space-x-1.5 px-3 py-1.5 border border-green-500 bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all font-bold disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            <span>{isTesting ? 'QUALIFYING...' : 'RUN LIVE QUALIFICATION TEST'}</span>
          </button>

          <button
            onClick={() => setShowKeyForm(!showKeyForm)}
            className="flex items-center space-x-1.5 px-3 py-1.5 border border-arvis-cyan bg-arvis-cyan/10 text-arvis-cyan hover:bg-arvis-cyan/20 transition-all font-bold"
          >
            <Key className="w-4 h-4" />
            <span>{showKeyForm ? 'HIDE KEY INPUT' : 'CONFIGURE PROVIDER KEYS'}</span>
          </button>

          <div className="flex items-center space-x-2 bg-black/50 p-2 border border-arvis-border text-xs text-arvis-dim">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span>MAIN PROCESS ISOLATION</span>
          </div>
        </div>
      </div>

      {/* Key Input Drawer Form */}
      {showKeyForm && (
        <form onSubmit={handleSaveKeys} className="p-4 bg-black/70 border border-arvis-cyan/60 space-y-4">
          <div className="flex justify-between items-center border-b border-arvis-border pb-2">
            <span className="font-bold text-arvis-cyan uppercase">SECURE MAIN-PROCESS CREDENTIAL MANAGER (.ENV)</span>
            <span className="text-[10px] text-arvis-dim">Keys are saved locally to .env and never sent to DOM or external telemetry</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-arvis-cyan font-bold text-[10px] block mb-1">OPENROUTER API KEY (OPENROUTER_API_KEY)</label>
              <input
                type="password"
                placeholder="Key..."
                value={keyInput.OPENROUTER_API_KEY}
                onChange={e => setKeyInput({ ...keyInput, OPENROUTER_API_KEY: e.target.value })}
                className="w-full bg-black border border-arvis-cyan/80 p-1.5 text-arvis-text font-mono text-xs focus:border-arvis-accent outline-none"
              />
            </div>
            <div>
              <label className="text-arvis-dim text-[10px] block mb-1">GROQ API KEY (GROQ_API_KEY)</label>
              <input
                type="password"
                placeholder="gsk_..."
                value={keyInput.GROQ_API_KEY}
                onChange={e => setKeyInput({ ...keyInput, GROQ_API_KEY: e.target.value })}
                className="w-full bg-black border border-arvis-border p-1.5 text-arvis-text font-mono text-xs focus:border-arvis-cyan outline-none"
              />
            </div>
            <div>
              <label className="text-arvis-dim text-[10px] block mb-1">GEMINI API KEY (GEMINI_API_KEY)</label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={keyInput.GEMINI_API_KEY}
                onChange={e => setKeyInput({ ...keyInput, GEMINI_API_KEY: e.target.value })}
                className="w-full bg-black border border-arvis-border p-1.5 text-arvis-text font-mono text-xs focus:border-arvis-cyan outline-none"
              />
            </div>
            <div>
              <label className="text-arvis-dim text-[10px] block mb-1">GITHUB TOKEN (GITHUB_TOKEN)</label>
              <input
                type="password"
                placeholder="ghp_..."
                value={keyInput.GITHUB_TOKEN}
                onChange={e => setKeyInput({ ...keyInput, GITHUB_TOKEN: e.target.value })}
                className="w-full bg-black border border-arvis-border p-1.5 text-arvis-text font-mono text-xs focus:border-arvis-cyan outline-none"
              />
            </div>
            <div>
              <label className="text-arvis-dim text-[10px] block mb-1">CEREBRAS API KEY (CEREBRAS_API_KEY)</label>
              <input
                type="password"
                placeholder="csk_..."
                value={keyInput.CEREBRAS_API_KEY}
                onChange={e => setKeyInput({ ...keyInput, CEREBRAS_API_KEY: e.target.value })}
                className="w-full bg-black border border-arvis-border p-1.5 text-arvis-text font-mono text-xs focus:border-arvis-cyan outline-none"
              />
            </div>
            <div>
              <label className="text-arvis-dim text-[10px] block mb-1">MISTRAL API KEY (MISTRAL_API_KEY)</label>
              <input
                type="password"
                placeholder="Key..."
                value={keyInput.MISTRAL_API_KEY}
                onChange={e => setKeyInput({ ...keyInput, MISTRAL_API_KEY: e.target.value })}
                className="w-full bg-black border border-arvis-border p-1.5 text-arvis-text font-mono text-xs focus:border-arvis-cyan outline-none"
              />
            </div>
            <div>
              <label className="text-arvis-dim text-[10px] block mb-1">DEEPSEEK API KEY (DEEPSEEK_API_KEY)</label>
              <input
                type="password"
                placeholder="sk-..."
                value={keyInput.DEEPSEEK_API_KEY}
                onChange={e => setKeyInput({ ...keyInput, DEEPSEEK_API_KEY: e.target.value })}
                className="w-full bg-black border border-arvis-border p-1.5 text-arvis-text font-mono text-xs focus:border-arvis-cyan outline-none"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-arvis-cyan font-bold text-[10px]">{saveStatus}</span>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 border border-arvis-accent bg-arvis-accent/20 text-arvis-accent font-bold hover:bg-arvis-accent/30 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>SAVE & ACTIVATE CLOUD PROVIDERS</span>
            </button>
          </div>
        </form>
      )}

      {/* Live Qualification Results Display */}
      {testResults && (
        <div className="p-4 bg-black/60 border border-green-500/60 space-y-2">
          <span className="font-bold text-green-400 uppercase text-xs">LIVE QUALIFICATION RESULTS REPORT</span>
          <div className="grid grid-cols-4 gap-2 text-[10px]">
            {Object.entries(testResults).map(([id, res]) => (
              <div key={id} className="p-2 border border-arvis-border bg-black/40">
                <div className="font-bold text-arvis-text uppercase">{id}</div>
                <div className={res.status === 'READY' ? 'text-green-400 font-bold' : 'text-arvis-dim'}>
                  STATUS: {res.status}
                </div>
                <div>LATENCY: {res.latencyMs} ms</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Routing Strategy Selector */}
      <div className="p-4 bg-black/40 border border-arvis-border space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-bold text-arvis-cyan uppercase text-xs">ROUTING STRATEGY SELECTOR</span>
          <span className="text-[10px] text-arvis-dim">ACTIVE: [{activeStrategy}]</span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {['SPEED_FIRST', 'BALANCED', 'QUALITY_FIRST', 'VISION', 'CODING'].map((strat) => (
            <button
              key={strat}
              onClick={() => handleStrategyChange(strat)}
              className={`p-2 border text-center transition-all text-xs font-bold ${
                activeStrategy === strat
                  ? 'border-arvis-accent bg-arvis-accent/20 text-arvis-accent shadow-[0_0_10px_rgba(255,42,95,0.3)]'
                  : 'border-arvis-border/60 bg-black/30 text-arvis-dim hover:text-arvis-text hover:border-arvis-border'
              }`}
            >
              {strat}
            </button>
          ))}
        </div>
      </div>

      {/* Provider Matrix Grid */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-semibold text-arvis-dim uppercase">
          <span>CONFIGURED PROVIDER MATRIX ({providers.filter(p => p.isConfigured).length} / {providers.length})</span>
          <button onClick={loadStatuses} className="flex items-center space-x-1 text-arvis-cyan hover:underline">
            <RefreshCw className="w-3 h-3" />
            <span>REFRESH MATRIX</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {providers.map((p) => (
            <div
              key={p.id}
              className={`p-3 border space-y-2 relative ${
                !p.isConfigured
                  ? 'border-arvis-border/40 bg-black/20 opacity-60'
                  : p.isHealthy
                  ? 'border-arvis-cyan/60 bg-black/50'
                  : 'border-arvis-amber/60 bg-arvis-amber/10'
              }`}
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-arvis-border/60 pb-1.5">
                <span className="font-bold text-arvis-text text-xs">{p.displayName}</span>
                <span
                  className={`px-1.5 py-0.2 text-[9px] font-bold border ${
                    !p.isConfigured
                      ? 'border-arvis-border bg-black/40 text-arvis-dim'
                      : p.isHealthy
                      ? 'border-green-500/40 bg-green-500/20 text-green-400'
                      : 'border-arvis-amber/40 bg-arvis-amber/20 text-arvis-amber animate-pulse'
                  }`}
                >
                  {!p.isConfigured ? 'NOT CONFIGURED' : p.isHealthy ? 'HEALTHY' : 'COOLDOWN / 429'}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="text-arvis-dim">MODEL:</span>
                  <div className="text-arvis-cyan truncate">{p.currentModel}</div>
                </div>
                <div>
                  <span className="text-arvis-dim">LATENCY (TTFT):</span>
                  <div className="text-arvis-text">
                    {p.lastObservedLatencyMs > 0 ? `${p.lastObservedLatencyMs} ms` : 'N/A'}
                    {p.lastObservedTtftMs ? ` (${p.lastObservedTtftMs}ms TTFT)` : ''}
                  </div>
                </div>
              </div>

              {/* Capabilities */}
              <div className="flex space-x-1.5 pt-1 text-[8px]">
                <span className={`px-1 border ${p.capabilities.supportsTools ? 'border-arvis-cyan text-arvis-cyan' : 'border-arvis-border text-arvis-dim'}`}>
                  TOOLS: {p.capabilities.supportsTools ? 'YES' : 'NO'}
                </span>
                <span className={`px-1 border ${p.capabilities.supportsVision ? 'border-arvis-accent text-arvis-accent' : 'border-arvis-border text-arvis-dim'}`}>
                  VISION: {p.capabilities.supportsVision ? 'YES' : 'NO'}
                </span>
                <span className={`px-1 border ${p.capabilities.supportsStreaming ? 'border-green-400 text-green-400' : 'border-arvis-border text-arvis-dim'}`}>
                  STREAM: {p.capabilities.supportsStreaming ? 'YES' : 'NO'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

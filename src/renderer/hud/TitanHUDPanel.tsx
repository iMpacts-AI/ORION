import React, { useState, useEffect } from 'react';
import { TitanPipelineRunResult, TitanPipelineState } from '../../main/services/titan/TitanClosedLoopPipeline';
import { OrionOperatorStatus, SystemSnapshot, TitanBatchResult, TitanBatchTarget } from '../../shared/types';
import { Play, ShieldAlert, CheckCircle, XCircle, AlertCircle, FileText, Activity, RotateCcw, Cpu, Film, Layers, CheckSquare, Square } from 'lucide-react';

export const TitanHUDPanel: React.FC = () => {
  // Mode selection: Single Target vs Batch Production
  const [productionMode, setProductionMode] = useState<'SINGLE' | 'BATCH'>('SINGLE');

  // Single Target State
  const [target, setTarget] = useState<TitanBatchTarget>('Video_001');
  const [hasApproval, setHasApproval] = useState<boolean>(false);
  const [pipelineResult, setPipelineResult] = useState<TitanPipelineRunResult | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  // Batch State
  const [selectedBatchTargets, setSelectedBatchTargets] = useState<TitanBatchTarget[]>(['Video_001', 'Video_002', 'Video_003']);
  const [batchResult, setBatchResult] = useState<TitanBatchResult | null>(null);

  // Telemetry & Preview
  const [snapshot, setSnapshot] = useState<SystemSnapshot | null>(null);
  const [releaseStatus, setReleaseStatus] = useState<{ success: boolean; message: string; canonicalHash?: string } | null>(null);
  const [outputPreview, setOutputPreview] = useState<{
    exists: boolean;
    target: string;
    filename: string;
    filePath: string;
    sizeBytes: number;
    sizeMB: string;
    modifiedAt?: number;
    message?: string;
  } | null>(null);

  const fetchTelemetryAndPreview = async () => {
    const api = window.orionApi || window.arvisApi;
    if (!api) return;

    try {
      const snap = await api.getSystemSnapshot();
      setSnapshot(snap);

      if (api.getTitanOutputPreview) {
        const previewTarget = productionMode === 'SINGLE' ? target : (batchResult?.progress?.currentTarget || 'Video_001');
        const prev = await api.getTitanOutputPreview({ target: previewTarget });
        setOutputPreview(prev);
      }
    } catch (err) {
      console.error('Error fetching telemetry/preview:', err);
    }
  };

  useEffect(() => {
    const api = window.orionApi || window.arvisApi;
    if (!api) return;

    // Fetch initial status
    api.getTitanPipelineStatus?.().then((res: TitanPipelineRunResult | null) => {
      if (res) setPipelineResult(res);
    });

    api.getTitanBatchStatus?.().then((res: TitanBatchResult | null) => {
      if (res) setBatchResult(res);
    });

    fetchTelemetryAndPreview();
    const interval = setInterval(fetchTelemetryAndPreview, 3000);

    // Subscribe to real-time single pipeline updates
    const unsubscribePipeline = api.onTitanPipelineUpdated?.((res: TitanPipelineRunResult) => {
      setPipelineResult(res);
      if (res.state !== 'INSPECTING' && res.state !== 'PLANNING' && res.state !== 'VOICE_READY' && res.state !== 'RENDERING' && res.state !== 'QA_ANALYSIS') {
        setIsExecuting(false);
      }
      fetchTelemetryAndPreview();
    });

    // Subscribe to real-time batch updates
    const unsubscribeBatch = api.onTitanBatchUpdated?.((res: TitanBatchResult) => {
      setBatchResult(res);
      if (res.state !== 'RUNNING_TARGET' && res.state !== 'TARGET_QA' && res.state !== 'VALIDATING_TARGETS') {
        setIsExecuting(false);
      }
      fetchTelemetryAndPreview();
    });

    return () => {
      clearInterval(interval);
      if (unsubscribePipeline) unsubscribePipeline();
      if (unsubscribeBatch) unsubscribeBatch();
    };
  }, [target, productionMode]);

  // Single Target Handlers
  const handleStartSinglePipeline = async () => {
    const api = window.orionApi || window.arvisApi;
    if (!api) return;

    setIsExecuting(true);
    try {
      if (api.runTitanPipeline) {
        const res = await api.runTitanPipeline({
          target,
          hasExplicitRenderApproval: hasApproval
        });
        setPipelineResult(res);
      }
    } catch (err: any) {
      console.error('Titan Pipeline IPC error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleApproveSingleRender = async () => {
    const api = window.orionApi || window.arvisApi;
    if (!api) return;

    setHasApproval(true);
    setIsExecuting(true);
    try {
      if (api.approveTitanRender) {
        const res = await api.approveTitanRender({ target });
        setPipelineResult(res);
      }
    } catch (err: any) {
      console.error('Titan Render Approval IPC error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleResetSinglePipeline = async () => {
    const api = window.orionApi || window.arvisApi;
    if (!api) return;

    try {
      if (api.resetTitanPipeline) {
        const res = await api.resetTitanPipeline();
        setPipelineResult(res);
        setHasApproval(false);
      }
    } catch (err: any) {
      console.error('Titan Reset IPC error:', err);
    }
  };

  // Batch Handlers
  const toggleBatchTarget = (t: TitanBatchTarget) => {
    if (isExecuting) return;
    if (selectedBatchTargets.includes(t)) {
      if (selectedBatchTargets.length > 1) {
        setSelectedBatchTargets(selectedBatchTargets.filter(item => item !== t));
      }
    } else {
      setSelectedBatchTargets([...selectedBatchTargets, t]);
    }
  };

  const handleStartBatch = async () => {
    const api = window.orionApi || window.arvisApi;
    if (!api || selectedBatchTargets.length === 0) return;

    setIsExecuting(true);
    try {
      if (api.runTitanBatch) {
        const res = await api.runTitanBatch({
          targets: selectedBatchTargets,
          hasExplicitRenderApproval: hasApproval
        });
        setBatchResult(res);
      }
    } catch (err: any) {
      console.error('Titan Batch IPC error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleApproveBatchTarget = async () => {
    const api = window.orionApi || window.arvisApi;
    if (!api) return;

    setHasApproval(true);
    setIsExecuting(true);
    try {
      if (api.approveTitanBatchTarget) {
        const res = await api.approveTitanBatchTarget();
        setBatchResult(res);
      }
    } catch (err: any) {
      console.error('Titan Batch Approval IPC error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleResetBatch = async () => {
    const api = window.orionApi || window.arvisApi;
    if (!api) return;

    try {
      if (api.resetTitanBatch) {
        const res = await api.resetTitanBatch();
        setBatchResult(res);
        setHasApproval(false);
      }
    } catch (err: any) {
      console.error('Titan Batch Reset IPC error:', err);
    }
  };

  // Phase 7B Release Handlers
  const handlePackageRelease = async () => {
    const api = window.orionApi || window.arvisApi;
    if (!api) return;

    setIsExecuting(true);
    setReleaseStatus(null);
    try {
      if (api.packageTitanRelease) {
        const res = await api.packageTitanRelease({ target, forceOverwrite: true });
        if (res.success) {
          setReleaseStatus({
            success: true,
            message: `RELEASE PACKAGED: ${target} bundle created & verified.`,
            canonicalHash: res.data?.canonicalHash
          });
        } else {
          setReleaseStatus({
            success: false,
            message: `PACKAGING ERROR: ${res.error || 'Unknown error'}`
          });
        }
      }
    } catch (err: any) {
      setReleaseStatus({ success: false, message: `IPC ERROR: ${err.message}` });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleValidateRelease = async () => {
    const api = window.orionApi || window.arvisApi;
    if (!api) return;

    setIsExecuting(true);
    setReleaseStatus(null);
    try {
      if (api.validateTitanRelease) {
        const res = await api.validateTitanRelease({ target });
        if (res.success) {
          setReleaseStatus({
            success: true,
            message: `AUDIT PASSED: 5/5 artifacts verified. Canonical hash valid.`,
            canonicalHash: res.data?.canonicalHash
          });
        } else {
          setReleaseStatus({
            success: false,
            message: `AUDIT FAILED: ${res.error || 'Validation error'}`
          });
        }
      }
    } catch (err: any) {
      setReleaseStatus({ success: false, message: `AUDIT IPC ERROR: ${err.message}` });
    } finally {
      setIsExecuting(false);
    }
  };

  const singleState: TitanPipelineState = pipelineResult?.state || 'IDLE';
  const batchState = batchResult?.state || 'IDLE';

  // Map to unified operator status model
  const getOperatorStatus = (): OrionOperatorStatus => {
    if (productionMode === 'BATCH') {
      switch (batchState) {
        case 'RUNNING_TARGET': return 'TITAN RENDERING';
        case 'AWAITING_TARGET_APPROVAL': return 'TITAN AWAITING APPROVAL';
        case 'TARGET_QA': return 'TITAN QA ANALYSIS';
        case 'BATCH_COMPLETED': return 'TITAN GATE PASSED';
        case 'BATCH_FAILED': return 'TITAN GATE FAILED';
        case 'ERROR': return 'SYSTEM ERROR';
        default: return 'TITAN IDLE';
      }
    }

    switch (singleState) {
      case 'INSPECTING': return 'TITAN INSPECTING';
      case 'PLANNING': return 'TITAN PLANNING';
      case 'VOICE_READY': return 'TITAN VOICE READY';
      case 'AWAITING_RENDER_APPROVAL': return 'TITAN AWAITING APPROVAL';
      case 'RENDERING': return 'TITAN RENDERING';
      case 'QA_ANALYSIS': return 'TITAN QA ANALYSIS';
      case 'GATE_PASSED': return 'TITAN GATE PASSED';
      case 'GATE_FAILED': return 'TITAN GATE FAILED';
      case 'ERROR': return 'SYSTEM ERROR';
      default: return 'TITAN IDLE';
    }
  };

  const availableRamMB = snapshot ? ((snapshot.memory.freeBytes || 0) / (1024 * 1024)).toFixed(0) : 'N/A';
  const totalRamGB = snapshot ? ((snapshot.memory.totalBytes || 0) / (1024 * 1024 * 1024)).toFixed(1) : 'N/A';
  const cpuUsagePct = snapshot ? `${snapshot.cpu.usagePercent.toFixed(1)}%` : '0.0%';

  return (
    <div className="h-full grid grid-cols-12 gap-4 p-4 bg-arvis-card border border-arvis-border overflow-hidden font-mono text-xs text-arvis-text">
      
      {/* Left Control & Live System Telemetry Column */}
      <div className="col-span-4 flex flex-col justify-between space-y-3 bg-black/40 border border-arvis-border p-3 overflow-y-auto">
        <div className="space-y-3">
          
          {/* Header & Mode Switcher */}
          <div className="flex items-center justify-between border-b border-arvis-border pb-2">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-arvis-cyan" />
              <span className="font-extrabold text-xs tracking-widest text-arvis-text">TITAN // OPERATOR COMMAND</span>
            </div>
            <div className="flex space-x-1 bg-black border border-arvis-border p-0.5">
              <button
                onClick={() => setProductionMode('SINGLE')}
                className={`px-2 py-0.5 text-[9px] font-bold transition-all ${
                  productionMode === 'SINGLE' ? 'bg-arvis-cyan/30 text-arvis-cyan' : 'text-arvis-dim hover:text-arvis-text'
                }`}
              >
                SINGLE
              </button>
              <button
                onClick={() => setProductionMode('BATCH')}
                className={`px-2 py-0.5 text-[9px] font-bold transition-all ${
                  productionMode === 'BATCH' ? 'bg-arvis-cyan/30 text-arvis-cyan' : 'text-arvis-dim hover:text-arvis-text'
                }`}
              >
                BATCH
              </button>
            </div>
          </div>

          {/* Unified Operator Status Badge */}
          <div className="bg-black/60 border border-arvis-border p-2 space-y-1">
            <div className="text-[9px] text-arvis-dim tracking-wider">UNIFIED OPERATOR STATUS</div>
            <div className="text-xs font-bold text-arvis-cyan tracking-wider flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-arvis-cyan animate-ping" />
              <span>{getOperatorStatus()}</span>
            </div>
          </div>

          {/* Real-time System Telemetry */}
          <div className="bg-black/60 border border-arvis-border p-2 space-y-1.5 text-[10px]">
            <div className="text-arvis-dim font-bold border-b border-arvis-border pb-1 flex items-center justify-between">
              <span className="flex items-center space-x-1"><Cpu className="w-3 h-3 text-arvis-cyan" /><span>SYSTEM TELEMETRY</span></span>
              <span className="text-green-400">ONLINE</span>
            </div>
            <div className="flex justify-between"><span>CPU USAGE:</span><span className="text-arvis-cyan font-bold">{cpuUsagePct}</span></div>
            <div className="flex justify-between"><span>RAM AVAILABLE:</span><span className="text-green-400 font-bold">{availableRamMB} MB / {totalRamGB} GB</span></div>
            <div className="flex justify-between"><span>MODE:</span><span className="text-arvis-cyan font-bold">{productionMode} PRODUCTION</span></div>
            {productionMode === 'SINGLE' ? (
              <>
                <div className="flex justify-between"><span>TARGET:</span><span className="text-arvis-cyan font-bold">{target}</span></div>
                <div className="flex justify-between"><span>RENDER ATTEMPTS:</span><span>{pipelineResult?.renderAttempts || 0} / 1</span></div>
              </>
            ) : (
              <>
                <div className="flex justify-between"><span>BATCH TARGETS:</span><span className="text-arvis-cyan font-bold">{selectedBatchTargets.length} TARGETS</span></div>
                <div className="flex justify-between"><span>COMPLETED / TOTAL:</span><span>{batchResult?.progress?.completedTargets || 0} / {selectedBatchTargets.length}</span></div>
              </>
            )}
            <div className="flex justify-between"><span>APPROVAL STATUS:</span><span className={hasApproval ? 'text-green-400 font-bold' : 'text-amber-400'}>{hasApproval ? 'AUTHORIZED' : 'APPROVAL REQUIRED'}</span></div>
          </div>

          {/* Target Selector (Single Mode vs Batch Mode) */}
          {productionMode === 'SINGLE' ? (
            <div className="space-y-1">
              <label className="text-[9px] text-arvis-dim tracking-wider uppercase block">SELECT TARGET PROJECT</label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value as any)}
                disabled={isExecuting}
                className="w-full bg-black border border-arvis-border text-arvis-cyan p-1.5 font-mono outline-none focus:border-arvis-cyan text-xs"
              >
                <option value="Video_001">Video_001 (Nvidia $3T Moat)</option>
                <option value="Video_002">Video_002 ($1M AI Agency)</option>
                <option value="Video_003">Video_003 (Gigafactory Automation)</option>
              </select>
            </div>
          ) : (
            <div className="space-y-1.5 bg-black/60 border border-arvis-border p-2">
              <label className="text-[9px] text-arvis-dim tracking-wider uppercase block">BATCH TARGET SELECTOR (SEQUENTIAL)</label>
              <div className="space-y-1">
                {(['Video_001', 'Video_002', 'Video_003'] as TitanBatchTarget[]).map((t) => (
                  <div
                    key={t}
                    onClick={() => toggleBatchTarget(t)}
                    className="flex items-center space-x-2 cursor-pointer hover:text-arvis-cyan select-none"
                  >
                    {selectedBatchTargets.includes(t) ? (
                      <CheckSquare className="w-3.5 h-3.5 text-arvis-cyan" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-arvis-dim" />
                    )}
                    <span className="text-[11px]">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Trigger Buttons */}
          <div className="space-y-2">
            {productionMode === 'SINGLE' ? (
              <button
                onClick={handleStartSinglePipeline}
                disabled={isExecuting}
                className={`w-full p-2.5 font-bold border transition-all flex items-center justify-center space-x-2 text-xs ${
                  isExecuting
                    ? 'border-arvis-dim bg-white/5 text-arvis-dim cursor-not-allowed'
                    : 'border-arvis-cyan bg-arvis-cyan/20 text-arvis-cyan hover:bg-arvis-cyan/30'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isExecuting ? 'PIPELINE EXECUTING...' : 'RUN TITAN PIPELINE'}</span>
              </button>
            ) : (
              <button
                onClick={handleStartBatch}
                disabled={isExecuting || selectedBatchTargets.length === 0}
                className={`w-full p-2.5 font-bold border transition-all flex items-center justify-center space-x-2 text-xs ${
                  isExecuting || selectedBatchTargets.length === 0
                    ? 'border-arvis-dim bg-white/5 text-arvis-dim cursor-not-allowed'
                    : 'border-arvis-cyan bg-arvis-cyan/20 text-arvis-cyan hover:bg-arvis-cyan/30'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isExecuting ? 'BATCH EXECUTING...' : `START BATCH (${selectedBatchTargets.length} TARGETS)`}</span>
              </button>
            )}

            <button
              onClick={productionMode === 'SINGLE' ? handleResetSinglePipeline : handleResetBatch}
              disabled={isExecuting}
              className="w-full p-1.5 border border-arvis-border hover:border-arvis-cyan text-[10px] text-arvis-dim hover:text-arvis-cyan transition-all flex items-center justify-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{productionMode === 'SINGLE' ? 'RESET PIPELINE' : 'RESET BATCH'}</span>
            </button>
          </div>
        </div>

        {/* Read-Only Output Preview Card */}
        <div className="bg-black/60 border border-arvis-border p-2 space-y-1 text-[10px]">
          <div className="text-arvis-dim font-bold border-b border-arvis-border pb-1 flex items-center space-x-1">
            <Film className="w-3 h-3 text-arvis-cyan" />
            <span>OUTPUT PREVIEW (READ-ONLY)</span>
          </div>
          {outputPreview?.exists ? (
            <div className="space-y-0.5 text-green-300">
              <div className="font-bold text-xs text-arvis-cyan flex items-center space-x-1">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span>{outputPreview.filename}</span>
              </div>
              <div className="text-arvis-dim">SIZE: {outputPreview.sizeMB} MB ({outputPreview.sizeBytes.toLocaleString()} bytes)</div>
              <div className="text-[9px] text-arvis-dim truncate">PATH: {outputPreview.filePath}</div>
            </div>
          ) : (
            <div className="text-arvis-dim italic text-[9px] py-1">{outputPreview?.message || 'No experimental output rendered.'}</div>
          )}
        </div>

        {/* Phase 7B Safe Release Packaging & Verification Controls */}
        <div className="bg-black/60 border border-arvis-border p-2 space-y-2 text-[10px]">
          <div className="text-arvis-dim font-bold border-b border-arvis-border pb-1 flex items-center justify-between">
            <span className="flex items-center space-x-1"><ShieldAlert className="w-3 h-3 text-amber-400" /><span>PHASE 7B RELEASE CONTROLS</span></span>
            <span className="text-amber-400 text-[8px] border border-amber-500/30 px-1 bg-amber-500/10">LOCAL ONLY</span>
          </div>

          <div className="flex space-x-1.5">
            <button
              onClick={handlePackageRelease}
              disabled={isExecuting}
              className="flex-1 p-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-bold text-[9px] transition-all"
            >
              [ PACKAGE RELEASE ]
            </button>
            <button
              onClick={handleValidateRelease}
              disabled={isExecuting}
              className="flex-1 p-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-arvis-cyan font-bold text-[9px] transition-all"
            >
              [ AUDIT RELEASE ]
            </button>
          </div>

          {releaseStatus && (
            <div className={`p-1.5 border text-[9px] leading-tight ${releaseStatus.success ? 'bg-green-500/10 border-green-500/30 text-green-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
              <div className="font-bold">{releaseStatus.message}</div>
              {releaseStatus.canonicalHash && (
                <div className="text-[8px] text-arvis-dim truncate mt-0.5">HASH: {releaseStatus.canonicalHash}</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Center Column: Batch / Single Visual Progress & Approval Banner */}
      <div className="col-span-5 flex flex-col space-y-3 justify-between bg-black/40 border border-arvis-border p-3 overflow-y-auto">
        
        {/* Batch vs Single Stage Tracker */}
        {productionMode === 'BATCH' ? (
          <div>
            <div className="text-[10px] text-arvis-dim border-b border-arvis-border pb-1.5 mb-2 flex justify-between">
              <span>SEQUENTIAL BATCH PROGRESSION</span>
              <span>STATE: [{batchState}]</span>
            </div>
            <div className="space-y-2 font-mono text-xs">
              {selectedBatchTargets.map((t, idx) => {
                const targetRes = batchResult?.targetResults?.[t];
                const isCurrent = batchResult?.progress?.currentTarget === t;
                const isPassed = targetRes?.gatePassed;
                const isFailed = targetRes && !targetRes.gatePassed && targetRes.state !== 'AWAITING_APPROVAL';

                return (
                  <div key={t} className="flex items-center justify-between p-2 bg-black/60 border border-arvis-border">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-arvis-dim">#{idx + 1}</span>
                      <span className={isCurrent ? 'text-arvis-cyan font-bold' : 'text-arvis-text'}>{t}</span>
                    </div>
                    <div>
                      {isPassed && <span className="text-green-400 font-bold text-[10px]">[ GATE PASSED - {targetRes.qaScore}/100 ]</span>}
                      {isFailed && <span className="text-red-400 font-bold text-[10px]">[ FAILED - {targetRes.qaScore || 0}/100 ]</span>}
                      {isCurrent && <span className="text-arvis-cyan font-bold text-[10px] animate-pulse">◉ EXECUTING</span>}
                      {!targetRes && !isCurrent && <span className="text-arvis-dim text-[10px]">○ QUEUED</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-[10px] text-arvis-dim border-b border-arvis-border pb-1.5 mb-2">PIPELINE EXECUTION STAGES</div>
            <div className="space-y-2 font-mono text-xs">
              {['INSPECTING', 'PLANNING', 'VOICE_READY', 'RENDERING', 'QA_ANALYSIS'].map((st) => (
                <div key={st} className="flex items-center space-x-3">
                  <span className={singleState === st ? 'text-arvis-cyan font-bold animate-pulse' : 'text-arvis-dim'}>
                    {singleState === st ? '◉' : '○'}
                  </span>
                  <span className={singleState === st ? 'text-arvis-cyan font-bold' : 'text-arvis-text'}>{st}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROMINENT HARDENED RENDER APPROVAL BANNER (Single or Batch Target) */}
        {(singleState === 'AWAITING_RENDER_APPROVAL' || batchState === 'AWAITING_TARGET_APPROVAL') && (
          <div className="bg-amber-500/10 border-2 border-amber-500 p-3 space-y-2 animate-pulse">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>RENDER APPROVAL REQUIRED</span>
            </div>
            <div className="bg-black/60 border border-amber-500/30 p-2 space-y-1 text-[10px] text-amber-200">
              <div>• <strong>TARGET:</strong> <code className="text-arvis-cyan">{productionMode === 'SINGLE' ? target : (batchResult?.progress?.pendingApprovalTarget || target)}</code> {productionMode === 'BATCH' && `(TARGET ${batchResult?.progress?.currentTargetIndex || 1} / ${selectedBatchTargets.length})`}</div>
              <div>• <strong>ACTION:</strong> Invoke <code className="text-arvis-cyan">master_documentary_compiler.py</code></div>
              <div>• <strong>RISK LEVEL:</strong> <span className="text-red-400 font-bold">HIGH (MUTATING / DANGEROUS)</span></div>
              <div>• <strong>OUTPUT PATH:</strong> <code className="text-arvis-cyan">07_Video_Projects/Experimental/</code></div>
              <div>• <strong>QA GATE REQUIREMENT:</strong> Score &gt;= 90.0 / 100</div>
              <div>• <strong>AVAILABLE RAM:</strong> <span className="text-green-400 font-bold">{availableRamMB} MB free</span> (Precondition &gt;= 512MB)</div>
            </div>
            <div className="flex items-center space-x-2 pt-1">
              <button
                onClick={productionMode === 'SINGLE' ? handleApproveSingleRender : handleApproveBatchTarget}
                disabled={isExecuting}
                className="flex-1 p-2 bg-amber-500 text-black font-extrabold hover:bg-amber-400 transition-all text-xs tracking-wider"
              >
                [ APPROVE RENDER ]
              </button>
              <button
                onClick={productionMode === 'SINGLE' ? handleResetSinglePipeline : handleResetBatch}
                disabled={isExecuting}
                className="px-3 p-2 bg-black border border-amber-500/50 text-amber-400 hover:bg-white/5 text-xs font-bold"
              >
                [ CANCEL ]
              </button>
            </div>
          </div>
        )}

        {/* Production Packaging Summary (Post Batch Completion) */}
        {productionMode === 'BATCH' && batchState === 'BATCH_COMPLETED' && batchResult && (
          <div className="bg-green-500/10 border-2 border-green-500 p-3 space-y-2">
            <div className="flex items-center space-x-2 text-green-400 font-bold text-xs tracking-wider">
              <CheckCircle className="w-4 h-4" />
              <span>BATCH PRODUCTION COMPLETED</span>
            </div>
            <div className="bg-black/60 border border-green-500/30 p-2 space-y-1 text-[10px] text-green-200">
              <div>• <strong>TOTAL TARGETS:</strong> {batchResult.totalTargets}</div>
              <div>• <strong>PASSED:</strong> {batchResult.passedTargets} / {batchResult.totalTargets}</div>
              <div>• <strong>FAILED:</strong> {batchResult.failedTargets}</div>
              <div>• <strong>QA GATE STATUS:</strong> ALL TARGETS PASSED (&gt;= 90/100)</div>
              <div>• <strong>PROTECTED MASTERS:</strong> UNCHANGED &amp; INTACT</div>
            </div>
          </div>
        )}


        {/* QA Score Display (Single Target Mode) */}
        {productionMode === 'SINGLE' && (
          <div className="bg-black/60 border border-arvis-border p-3 space-y-2">
            <div className="text-[10px] text-arvis-dim">RETENTION QA GATE EVALUATION</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-extrabold tracking-wider text-arvis-text">
                  {pipelineResult?.qaScore !== undefined ? `${pipelineResult.qaScore} / 100` : '-- / 100'}
                </div>
                <div className="text-[9px] text-arvis-dim">DETERMINISTIC GATE THRESHOLD: 90.0 / 100</div>
              </div>

              {singleState === 'GATE_PASSED' && (
                <div className="flex items-center space-x-1 px-2.5 py-1 bg-green-500/20 border border-green-500 text-green-400 font-bold text-xs">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>[ GATE PASSED ]</span>
                </div>
              )}

              {singleState === 'GATE_FAILED' && (
                <div className="flex items-center space-x-1 px-2.5 py-1 bg-red-500/20 border border-red-500 text-red-400 font-bold text-xs">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>[ GATE FAILED ]</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Chronological Event Stream with Severity Levels */}
      <div className="col-span-3 flex flex-col bg-black/40 border border-arvis-border p-3 overflow-hidden">
        <div className="text-[10px] text-arvis-dim border-b border-arvis-border pb-1.5 mb-2 flex items-center justify-between">
          <span className="flex items-center space-x-1.5">
            <FileText className="w-3.5 h-3.5 text-arvis-cyan" />
            <span>EVENT STREAM</span>
          </span>
          <span className="text-[9px] text-arvis-dim">
            {productionMode === 'SINGLE' ? (pipelineResult?.auditTrail?.length || 0) : (batchResult?.events?.length || 0)} EVENTS
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5 text-[10px] pr-1">
          {productionMode === 'SINGLE' ? (
            pipelineResult?.auditTrail && pipelineResult.auditTrail.length > 0 ? (
              pipelineResult.auditTrail.map((item, idx) => {
                const dateStr = new Date(item.timestamp).toLocaleTimeString();
                const severityColor =
                  item.severity === 'SUCCESS' ? 'text-green-400 font-bold' :
                  item.severity === 'WARNING' ? 'text-amber-400 font-bold' :
                  item.severity === 'ERROR' ? 'text-red-400 font-bold' : 'text-arvis-cyan font-bold';

                const severityBadge =
                  item.severity === 'SUCCESS' ? 'bg-green-500/10 border-green-500/30' :
                  item.severity === 'WARNING' ? 'bg-amber-500/10 border-amber-500/30' :
                  item.severity === 'ERROR' ? 'bg-red-500/10 border-red-500/30' : 'bg-cyan-500/10 border-cyan-500/30';

                return (
                  <div key={idx} className="border-b border-arvis-border/40 pb-1">
                    <div className="flex justify-between text-arvis-dim text-[9px]">
                      <span>{dateStr}</span>
                      <span className={`px-1 border text-[8px] ${severityBadge} ${severityColor}`}>{item.stage}</span>
                    </div>
                    <div className="text-arvis-text leading-tight mt-0.5 text-[9px]">{item.message}</div>
                  </div>
                );
              })
            ) : (
              <div className="text-arvis-dim text-center mt-12">No active pipeline events</div>
            )
          ) : (
            batchResult?.events && batchResult.events.length > 0 ? (
              batchResult.events.map((evt, idx) => {
                const dateStr = new Date(evt.timestamp).toLocaleTimeString();
                const severityColor =
                  evt.severity === 'SUCCESS' ? 'text-green-400 font-bold' :
                  evt.severity === 'WARNING' ? 'text-amber-400 font-bold' :
                  evt.severity === 'ERROR' ? 'text-red-400 font-bold' : 'text-arvis-cyan font-bold';

                const severityBadge =
                  evt.severity === 'SUCCESS' ? 'bg-green-500/10 border-green-500/30' :
                  evt.severity === 'WARNING' ? 'bg-amber-500/10 border-amber-500/30' :
                  evt.severity === 'ERROR' ? 'bg-red-500/10 border-red-500/30' : 'bg-cyan-500/10 border-cyan-500/30';

                return (
                  <div key={idx} className="border-b border-arvis-border/40 pb-1">
                    <div className="flex justify-between text-arvis-dim text-[9px]">
                      <span>{dateStr}</span>
                      <span className={`px-1 border text-[8px] ${severityBadge} ${severityColor}`}>{evt.target || evt.state}</span>
                    </div>
                    <div className="text-arvis-text leading-tight mt-0.5 text-[9px]">{evt.message}</div>
                  </div>
                );
              })
            ) : (
              <div className="text-arvis-dim text-center mt-12">No active batch events</div>
            )
          )}
        </div>
      </div>

    </div>
  );
};

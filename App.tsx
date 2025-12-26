
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import BackupModal from './components/BackupModal';
import { FlowConfig, BackupSnapshot, FlowNode } from './types';
import { saveBackup } from './services/backupService';
import { BACKUP_INTERVAL_MS, Icons } from './constants';

const INITIAL_NODES: FlowNode[] = [
  { id: '1', type: '数据源', label: 'DataSource - AR_03', position: { x: 50, y: 100 }, status: 'success' },
  { id: '2', type: '转换器', label: 'Join_Transform', position: { x: 300, y: 150 }, status: 'running' },
  { id: '3', type: '输出目标', label: 'DeepModel_Report', position: { x: 550, y: 100 }, status: 'success' },
];

const App: React.FC = () => {
  const [config, setConfig] = useState<FlowConfig>({
    nodes: INITIAL_NODES,
    selectedNodeId: '2',
    lastModified: Date.now(),
  });
  
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<number | null>(null);
  const [timeToNextSave, setTimeToNextSave] = useState(BACKUP_INTERVAL_MS);

  // Auto-backup interval management
  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeToNextSave(prev => {
        if (prev <= 1000) {
          // Trigger save
          const snapshot = saveBackup(config);
          setLastSavedTime(snapshot.timestamp);
          return BACKUP_INTERVAL_MS;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [config]);

  const handleRestore = useCallback((snapshot: BackupSnapshot) => {
    setConfig(snapshot.data);
    setIsBackupModalOpen(false);
    setLastSavedTime(Date.now());
    setTimeToNextSave(BACKUP_INTERVAL_MS);
    // Simple notification instead of blocking alert for better UX
  }, []);

  const formatCountdown = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans text-gray-900 bg-[#f8f9fa]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <header className="h-14 border-b bg-white flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="hover:text-blue-600 cursor-pointer">项目</span>
                <span>/</span>
                <span className="font-semibold text-gray-800">2-12 对账流 vs 订单数据</span>
                <span className="bg-blue-100 text-blue-600 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">测试版</span>
             </div>
             <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-100">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-medium uppercase tracking-wider">运行中</span>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex flex-col items-end mr-4">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">自动备份</span>
                <span className="text-xs font-mono text-gray-600 flex items-center gap-1.5">
                  下次备份倒计时 <span className="font-bold text-blue-600">{formatCountdown(timeToNextSave)}</span>
                </span>
             </div>
             <button 
               onClick={() => setIsBackupModalOpen(true)}
               className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
             >
               <Icons.History />
               <span>备份历史</span>
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
               <Icons.Play />
               <span>发布流</span>
             </button>
          </div>
        </header>

        {/* Main Workspace Area */}
        <main className="flex-1 flex flex-col bg-[#f0f2f5] overflow-hidden p-4">
          <div className="flex-1 grid grid-cols-12 gap-4">
            {/* Left Flow Canvas (Visualization) */}
            <div className="col-span-8 bg-white border rounded-lg shadow-sm relative overflow-hidden flex flex-col">
              <div className="p-3 border-b flex justify-between items-center bg-gray-50/50">
                 <h3 className="text-sm font-bold text-gray-600 uppercase tracking-tight">逻辑拓扑图</h3>
                 <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-gray-200 rounded text-gray-400"><Icons.Cloud /></button>
                 </div>
              </div>
              <div className="flex-1 relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]">
                {/* Simulated Nodes */}
                {config.nodes.map(node => (
                   <div 
                    key={node.id}
                    style={{ left: node.position.x, top: node.position.y }}
                    className={`absolute w-48 p-3 rounded-lg border-2 shadow-sm cursor-move bg-white group transition-all ${config.selectedNodeId === node.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setConfig({...config, selectedNodeId: node.id})}
                   >
                     <div className="flex items-center justify-between mb-2">
                        <div className={`w-2 h-2 rounded-full ${node.status === 'success' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{node.type}</span>
                     </div>
                     <div className="text-xs font-bold text-gray-700 truncate">{node.label}</div>
                     <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white group-hover:scale-125 transition-transform"></div>
                     <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-300 rounded-full border-2 border-white group-hover:scale-125 transition-transform"></div>
                   </div>
                ))}
              </div>
            </div>

            {/* Right Property Inspector */}
            <div className="col-span-4 bg-white border rounded-lg shadow-sm flex flex-col">
              <div className="flex items-center border-b">
                <div className="flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider text-blue-600 border-b-2 border-blue-600 text-center">节点配置</div>
                <div className="flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-gray-600 cursor-pointer text-center">高级选项</div>
              </div>
              <div className="p-4 space-y-6 overflow-y-auto">
                 <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">数据源表</label>
                    <select className="w-full text-sm border rounded p-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100">
                      <option>ReconReport_Master (主表)</option>
                      <option>AuditLogs_2025 (审计日志)</option>
                    </select>
                 </div>
                 
                 <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">字段映射关系</label>
                    <div className="border rounded divide-y text-xs">
                       {[
                         {f: 'recon_id', v: 'r_id'},
                         {f: 'recon_reason', v: 'r_reason'},
                         {f: 'sale_account', v: 'acc_id'},
                         {f: 'listing_sku', v: 'sku_val'},
                       ].map((m, i) => (
                         <div key={i} className="flex items-center p-2 hover:bg-blue-50/50">
                            <span className="flex-1 text-gray-500">{m.f}</span>
                            <Icons.ChevronRight />
                            <span className="flex-1 text-right font-medium text-blue-600">{m.v}</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="pt-4 border-t">
                    <button className="w-full py-2.5 bg-gray-800 text-white rounded text-sm font-bold shadow hover:bg-black transition-colors">
                      运行单步测试
                    </button>
                 </div>
              </div>
            </div>
          </div>

          {/* Bottom Data Preview (Table) */}
          <div className="h-64 mt-4 bg-white border rounded-lg shadow-sm flex flex-col overflow-hidden">
             <div className="px-4 py-2 border-b bg-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                   <div className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                      <Icons.Database />
                      数据预览 <span className="text-gray-300 font-normal">(共 2,299 条记录)</span>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-gray-400 uppercase font-bold">上次运行时间: {new Date(config.lastModified).toLocaleTimeString('zh-CN')}</span>
                  <button className="text-gray-400 hover:text-blue-600"><Icons.Cloud /></button>
                </div>
             </div>
             <div className="flex-1 overflow-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-gray-50 sticky top-0 border-b text-gray-500 font-medium">
                    <tr>
                      <th className="px-4 py-2 border-r w-12 text-center italic">序</th>
                      {['对账规则', '判定结果', '差异原因', '标识符', '左侧账户', '右侧账户', '状态'].map(h => (
                        <th key={h} className="px-4 py-2 border-r uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y text-gray-700 font-mono">
                    {Array.from({length: 10}).map((_, i) => (
                      <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                         <td className="px-4 py-2 border-r bg-gray-50/50 text-center text-gray-400">{i+1}</td>
                         <td className="px-4 py-2 border-r whitespace-nowrap">Common_Rule_0{i%3 + 1}</td>
                         <td className="px-4 py-2 border-r whitespace-nowrap">
                            <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">不匹配</span>
                         </td>
                         <td className="px-4 py-2 border-r text-gray-400 whitespace-nowrap">仅右侧存在</td>
                         <td className="px-4 py-2 border-r font-medium whitespace-nowrap">recon_1137{i}</td>
                         <td className="px-4 py-2 border-r italic text-gray-300 whitespace-nowrap">空值 (NULL)</td>
                         <td className="px-4 py-2 border-r text-gray-400 whitespace-nowrap truncate max-w-[120px]">US2025060...</td>
                         <td className="px-4 py-2 border-r">
                           <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                         </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        </main>
      </div>

      <BackupModal 
        isOpen={isBackupModalOpen} 
        onClose={() => setIsBackupModalOpen(false)} 
        onRestore={handleRestore}
      />

      {/* Floating Save Success Notification */}
      {lastSavedTime && (Date.now() - lastSavedTime < 4000) && (
        <div className="fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3.5 bg-gray-900 text-white rounded-lg shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-green-500 p-1 rounded-full">
             <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold">自动备份已完成</span>
            <span className="text-[10px] text-gray-400">系统已安全保存当前所有配置变更</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

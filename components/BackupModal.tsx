
import React, { useEffect, useState } from 'react';
import { getBackups } from '../services/backupService';
import { BackupSnapshot } from '../types';
import { Icons } from '../constants';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestore: (snapshot: BackupSnapshot) => void;
}

const BackupModal: React.FC<BackupModalProps> = ({ isOpen, onClose, onRestore }) => {
  const [backups, setBackups] = useState<BackupSnapshot[]>([]);

  useEffect(() => {
    if (isOpen) {
      setBackups(getBackups());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl flex flex-col max-h-[80vh]">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
          <div className="flex items-center gap-2">
            <Icons.History />
            <h2 className="text-lg font-bold text-gray-800">备份历史记录</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {backups.length === 0 ? (
            <div className="text-center py-12 text-gray-500 italic">
              暂无备份。系统每 10 分钟会自动触发一次存档。
            </div>
          ) : (
            backups.map((b) => (
              <div key={b.id} className="group border rounded-lg p-4 flex justify-between items-center hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-700">{b.label}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(b.timestamp).toLocaleString('zh-CN')} • 包含 {b.data.nodes.length} 个节点
                  </span>
                </div>
                <button
                  onClick={() => onRestore(b)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                >
                  恢复此快照
                </button>
              </div>
            ))
          )}
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 text-xs text-gray-400 rounded-b-lg">
          提示：恢复快照将覆盖当前的配置状态。建议在操作前确认当前工作已保存。
        </div>
      </div>
    </div>
  );
};

export default BackupModal;

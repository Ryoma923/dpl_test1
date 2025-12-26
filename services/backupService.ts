
import { BackupSnapshot, FlowConfig } from '../types';
import { STORAGE_KEY } from '../constants';

export const saveBackup = (data: FlowConfig, label?: string): BackupSnapshot => {
  const snapshots: BackupSnapshot[] = getBackups();
  const newSnapshot: BackupSnapshot = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    data,
    label: label || `自动保存 ${new Date().toLocaleTimeString('zh-CN')}`,
  };
  
  // Keep last 50 backups
  const updated = [newSnapshot, ...snapshots].slice(0, 50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newSnapshot;
};

export const getBackups = (): BackupSnapshot[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export const clearBackups = () => {
  localStorage.removeItem(STORAGE_KEY);
};

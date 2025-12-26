
export interface FlowNode {
  id: string;
  type: string;
  label: string;
  status?: 'success' | 'warning' | 'error' | 'running';
  position: { x: number; y: number };
}

export interface FlowConfig {
  nodes: FlowNode[];
  selectedNodeId: string | null;
  lastModified: number;
}

export interface BackupSnapshot {
  id: string;
  timestamp: number;
  data: FlowConfig;
  label: string;
}

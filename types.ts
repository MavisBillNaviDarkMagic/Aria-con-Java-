
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface SystemState {
  jdkVersion: string;
  status: 'online' | 'optimizing' | 'offline';
  memoryUsage: number;
  cpuLoad: number;
  activeThreads: number;
}

export enum CommandType {
  ANALYZE = 'analyze',
  COMPILE = 'compile',
  STATUS = 'status',
  HELP = 'help'
}

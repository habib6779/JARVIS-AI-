import React from 'react';
import { TerminalLog } from './TerminalLog';
import { StructuredLogItem } from '../types/terminal';

interface TerminalConsoleProps {
  logs: StructuredLogItem[];
  isProcessing?: boolean;
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = (props) => {
  return <TerminalLog {...props} />;
};

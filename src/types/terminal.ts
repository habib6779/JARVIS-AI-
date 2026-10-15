export type MessageSource = 'SYSTEM' | 'USER' | 'JARVIS';

export interface HistoryItem {
  id: string;
  source: MessageSource;
  text: string;
  timestamp?: string;
}

export type StructuredLogItem = HistoryItem;

export type InputCategory = 'COMMAND' | 'QUESTION' | 'CONVERSATION' | 'UNKNOWN';

export type ActionStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'FAILED'
  | 'AWAITING EXECUTION'
  | 'AWAITING AI RESPONSE'
  | 'ACKNOWLEDGED';

export interface ClassifiedResult {
  category: InputCategory;
  initialStatus: ActionStatus;
  proposedAction?: string;
  confidence: number;
}

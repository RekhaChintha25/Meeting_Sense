
export enum AnalysisStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  TRANSCRIBING = 'TRANSCRIBING',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface MeetingAnalysisResult {
  rawMarkdown: string;
}

export interface MeetingActionItem {
  id: string;
  task: string;
  owner: string;
  deadline: string;
  context: string;
}

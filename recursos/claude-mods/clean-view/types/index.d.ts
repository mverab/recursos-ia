export type CleanViewPhase = 'idle' | 'working' | 'needs-you' | 'complete' | 'error' | 'refusal' | 'stopped';
export type CleanViewStep = { id: string; name: string; status: 'active' | 'done' | 'failed' | 'denied' };
export type CleanViewState = { enabled: boolean; turnId: string | null; phase: CleanViewPhase; steps: CleanViewStep[] };

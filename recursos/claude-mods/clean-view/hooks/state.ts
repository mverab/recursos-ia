import type { CleanViewState } from '../types';
export function createState(): CleanViewState { return { enabled: false, turnId: null, phase: 'idle', steps: [] }; }
export function command(s: CleanViewState, args: string) {
  const arg = args.trim();
  if (arg !== '' && arg !== 'on' && arg !== 'off') return 'Usage: /simple on|off';
  s.enabled = arg === '' ? !s.enabled : arg === 'on';
  return `Clean View: ${s.enabled ? 'ON' : 'OFF'} · /simple off restores full details`;
}
export function counts(s: CleanViewState): string {
  const count = (status: string) => s.steps.filter(step => step.status === status).length;
  return `${count('done')} succeeded · ${count('failed')} failed · ${count('denied')} denied · ${count('active')} running`;
}

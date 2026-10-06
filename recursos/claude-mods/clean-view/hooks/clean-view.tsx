import type { On } from 'claude-code';
import { createState, command, counts } from './state';
const labels: Record<string, string> = {Read:'Read information',Grep:'Search information',Glob:'Find files',LS:'List files',Bash:'Run a command',Write:'Write a file',Edit:'Update a file',AskUserQuestion:'Answer needed'};
export function registerCleanView(on: On) {
  const state = createState();
  // Only calls observed settling successfully may be hidden. No inference from a drawing.
  const quiet = new Set<string>();
  const safeTools = new Set(['Read', 'Grep', 'Glob', 'LS']);
  const unsafe = (output: unknown): boolean => {
    if (output === undefined) return true;
    try { return /error|fail|denied|refus|interrupt|warning|stderr/i.test(JSON.stringify(output)); }
    catch { return true; }
  };
  const canHide = (row: {tool: string; tool_use_id?: string; isErrored: boolean; isRunning?: boolean; isInterrupted?: boolean; output?: unknown}) =>
    !!row.tool_use_id && quiet.has(row.tool_use_id) && safeTools.has(row.tool) && !row.isRunning && !row.isErrored && !row.isInterrupted && !unsafe(row.output);
  on('session.start', async ($, e, next) => {
    await $.command.register({name: 'simple', description: 'Toggle reversible Clean View', argumentHint: 'on|off', immediate: true});
    return next(e);
  });
  on('command.run', async ($, e, next) => {
    if (e.command !== 'simple') return next(e);
    const text = command(state, e.args);
    try { $.ui.invalidate('ui.render'); } catch { /* Visual failure must never gate execution. */ }
    return {text};
  });
  on('classic.Notification', async ($, e, next) => {
    if (state.enabled && !e.agent_id && e.notification_type === 'permission_prompt') {
      state.phase = 'needs-you';
      try { $.ui.invalidate('ui.render'); } catch { /* Visual failure must never gate execution. */ }
    }
    return next(e);
  });
  on('turn.start', async ($, e, next) => {
    if (state.enabled && !e.text.trim().startsWith('/')) {
      state.turnId = e.turnId; state.phase = 'working'; state.steps = []; quiet.clear();
      try { $.ui.invalidate('ui.render'); } catch { /* Visual failure must never gate execution. */ }
    }
    return next(e);
  });
  on('tool.call', async ($, e, next) => {
    if (!state.enabled || e.agentId || !state.turnId || state.phase === 'complete') return next(e);
    const turnId = state.turnId;
    const step = {id:e.tool_use_id, name:labels[e.tool] ?? 'Use a tool', status:'active' as 'active'|'done'|'failed'|'denied'};
    state.steps.push(step); state.phase = step.name === 'Answer needed' ? 'needs-you' : 'working';
    try { $.ui.invalidate('ui.render'); } catch { /* Visual failure must never gate execution. */ }
    let result;
    try { result = await next(e); }
    catch (error) {
      if (turnId === state.turnId) {
        step.status = 'failed'; state.phase = 'error';
        try { $.ui.invalidate('ui.render'); } catch { /* Visual failure must never gate execution. */ }
      }
      throw error;
    }
    if (turnId === state.turnId) {
      step.status = result.deny ? 'denied' : result.isError ? 'failed' : 'done';
      if (state.phase === 'needs-you' && !state.steps.some(s => s.name === 'Answer needed' && s.status === 'active')) state.phase = 'working';
      if (step.status === 'done' && safeTools.has(e.tool) && !unsafe(result.result) && !unsafe(result.text)) quiet.add(e.tool_use_id);
      try { $.ui.invalidate('ui.render'); } catch { /* Visual failure must never gate execution. */ }
    }
    return result;
  });
  on('turn.complete', async ($, e, next) => {
    const result = await next(e);
    if (e.agentId || e.turnId !== state.turnId) return result;
    state.phase = e.reason === 'answer' ? 'complete' : e.reason === 'aborted' ? 'stopped' : e.reason;
    if (state.enabled) {
      try { await $.ui.log(`${state.phase === 'complete' ? 'Turn complete' : state.phase} · ${counts(state)}`); }
      catch { /* The original response and errors remain authoritative. */ }
    }
    try { $.ui.invalidate('ui.render'); } catch { /* Visual failure must never gate execution. */ }
    return result;
  });
  on('ui.render', async ($, e, next) => {
    // AbovePrompt is terminal-only in these official types. Other surfaces stay
    // fully visible: do not hide anything without a mounted reversal control.
    if (e.surface === 'terminal' && state.enabled) {
      if ((e.component === 'ToolUse' || e.component === 'ToolResult') && canHide(e.props)) return $.ui.resolve(e).Box({children:[]});
      if (e.component === 'ToolGroup' && !e.props.isActive && e.props.calls.length > 0 && e.props.calls.every(canHide)) return $.ui.resolve(e).Box({children:[]});
    }
    if (e.component !== 'AbovePrompt' || e.props.hasSurvey) return next(e);
    const { Box, Button, Text } = $.ui.resolve(e);
    const panel = state.enabled ? [Text({children:`${state.phase === 'complete' ? 'Turn complete' : state.phase === 'working' ? 'Working' : state.phase === 'needs-you' ? 'Needs you' : state.phase} · ${counts(state)}`}),
      ...state.steps.slice(-6).map(step => Text({children:`${step.status === 'done' ? '✓' : step.status === 'active' ? '▶' : '⚠'} ${step.name} · ${step.status}`,wrap:'truncate'}))] : [];
    return Box({flexDirection:'column', children:[await next(e), Button({key:'clean-view-toggle', label:`Clean View: ${state.enabled ? 'ON' : 'OFF'}`, onPress:async()=>{
      const text = command(state, '');
      try { $.ui.invalidate('ui.render'); } catch { /* Visual failure must never gate execution. */ }
      try { await $.ui.log(text); } catch { /* Toggle still took effect. */ }
    }}), ...panel]});
  });
}

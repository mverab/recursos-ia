import { describe, expect, mock, test, tier } from 'claude-code/testing';
import type { Engine, } from 'claude-code/testing';
import type { On } from 'claude-code';
tier('user');
function world(on: On, originalRows = false) {
  mock.clock(on);
  on('session.start', ($, e) => ({cwd:e.cwd}));
  on('command.register', ($, e) => ({value:{command:e.name}}));
  on('ui.log', () => ({value:undefined}));
  on('ui.render', ($, e) => originalRows ? $.ui.resolve(e).Text({children:'native original row'}) : $.ui.resolve(e).Box({children:[]}));
  on('turn.start', ($, e) => ({turnId:e.turnId}));
  on('turn.complete', ($, e) => ({text:e.answer}));
}
const props = {hasSurvey:false,isWorking:false,maxRows:10,bodyColumns:80,scroll:{offset:0,bodyRows:10},view:{}};
const simple = ($:Engine, args:string) => $.command.run({command:'simple',args,origin:{kind:'composer'},presentation:{isFullscreen:false,columns:80}});
describe('register',()=>{
 test('native terminal button starts OFF, opts in and reverses',async($,on)=>{
  world(on);
  await $.session.start({surface:'terminal',isInteractive:true,cwd:'/work'});
  const ui=await $.ui.mount({plugin:'clean-view',surface:'terminal',component:'AbovePrompt',requestId:'band',props});
  expect((await ui.find({key:'clean-view-toggle'}))?.text).toContain('OFF');
  await ui.press({key:'clean-view-toggle'});
  expect((await ui.find({key:'clean-view-toggle'}))?.text).toContain('ON');
  expect((await simple($,'off')).text).toContain('OFF');
  expect((await ui.find({key:'clean-view-toggle'}))?.text).toContain('OFF');
 });
 test('observed successful read is quiet on terminal, visible on desktop, restored OFF',async($,on)=>{
  world(on, true);on('tool.call',()=>({result:{content:'ok'},text:'ok'}));
  await simple($,'on');await $.turn.start({text:'Check',turnId:'t'});
  await $.tool.call({tool:'Read',file_path:'/work/a',tool_use_id:'r'});
  const row={tool:'Read',tool_use_id:'r',input:{file_path:'/work/a'},isRunning:false,isErrored:false,isInterrupted:false,output:{content:'ok'}};
  // A visible marker from below distinguishes pass-through from an empty Box.
  const terminal=await $.ui.mount({plugin:'clean-view',surface:'terminal',component:'ToolUse',requestId:'r',props:row});
  expect(await terminal.find({text:'native original row'})).toBeUndefined();
  const desktop=await $.ui.mount({plugin:'clean-view',surface:'desktop',component:'ToolUse',requestId:'r',props:row});
  expect(await desktop.find({text:'native original row'})).toBeDefined();
  await simple($,'off');expect(await terminal.find({text:'native original row'})).toBeDefined();
 });
 test('completion uses actual counts and keeps original answer',async($,on)=>{
  world(on);on('tool.call',()=>({deny:'Owner denied'}));
  await simple($,'on');await $.turn.start({text:'Check',turnId:'t'});
  await $.tool.call({tool:'Read',file_path:'/work/a',tool_use_id:'r'});
  const result=await $.turn.complete({turnId:'t',reason:'answer',answer:'Original',durationMs:1200,isAborted:false});
  expect(result.text).toBe('Original');
  const ui=await $.ui.mount({plugin:'clean-view',surface:'terminal',component:'AbovePrompt',props});
  expect(await ui.find({text:/Turn complete.*1 denied/})).toBeDefined();
 });
 test('permissions and survey yield intact; errors, refusal and interruption are not completion',async($,on)=>{
  world(on);
  on('classic.Notification',()=>({}));
  await simple($,'on');await $.turn.start({text:'Check',turnId:'t'});
  // 2.1.289 testing runtime exposes classic, but its Engine declaration omits it.
  const classic = $ as unknown as {classic:{Notification:(input: import('claude-code').Args<'classic.Notification'>)=>Promise<unknown>}};
  await classic.classic.Notification({hook_event_name:'Notification',notification_type:'permission_prompt',message:'Please approve',session_id:'s',transcript_path:'/work/audit.jsonl',cwd:'/work'});
  const ui=await $.ui.mount({plugin:'clean-view',surface:'terminal',component:'AbovePrompt',props});
  expect(await ui.find({text:'Needs you'})).toBeDefined();
  const survey=await $.ui.mount({plugin:'clean-view',surface:'terminal',component:'AbovePrompt',props:{...props,hasSurvey:true}});
  expect(await survey.find({key:'clean-view-toggle'})).toBeUndefined();
  for(const reason of ['error','aborted','refusal'] as const) {
    const t='turn-'+reason;await $.turn.start({text:'Again',turnId:t});
    const end={turnId:t,answer:'Original details',durationMs:100,isAborted:reason==='aborted'};
    await $.turn.complete(reason==='refusal'?{...end,reason,refusal:{category:null,explanation:'Original refusal'}}:{...end,reason});
    expect(await ui.find({text:'Turn complete'})).toBeUndefined();
    expect(await ui.find({text:reason==='aborted'?'stopped':reason})).toBeDefined();
  }
 });
 test('failed read rows and assistant text remain visible, not filtered',async($,on)=>{
  world(on,true);on('tool.call',()=>({result:'failed',text:'failed',isError:true}));
  await simple($,'on');await $.turn.start({text:'Check',turnId:'t'});
  await $.tool.call({tool:'Read',file_path:'/work/a',tool_use_id:'r'});
  const row={tool:'Read',tool_use_id:'r',input:{},isRunning:false,isErrored:true,isInterrupted:false,output:'Original error'};
  const ui=await $.ui.mount({plugin:'clean-view',surface:'terminal',component:'ToolUse',requestId:'r',props:row});
  expect(await ui.find({text:'native original row'})).toBeDefined();
  const reply=await $.ui.mount({plugin:'clean-view',surface:'terminal',component:'AssistantMessage',props:{text:'Original refusal',isFirstOfReply:true}});
  expect(await reply.find({text:'native original row'})).toBeDefined();
 });
});

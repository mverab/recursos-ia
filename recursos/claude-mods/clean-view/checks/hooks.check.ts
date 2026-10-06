import { test } from 'node:test';
import assert from 'node:assert/strict';
import { register } from '../hooks/register.tsx';
import type { On } from 'claude-code';
// Local hook-contract harness, NOT the Claude engine or a rendered UI.
function harness() {
 const hooks = new Map<string, Function[]>(); const calls: string[] = []; let button: any; const faults={invalidate:false,log:false};
 const on = ((name: string, fn: Function) => hooks.set(name, [...(hooks.get(name) ?? []), fn])) as unknown as On;
 const $ = {command:{register:async (x:any)=>{calls.push(x.name);return {command:x.name}}},
 ui:{invalidate:()=>{if(faults.invalidate)throw new Error('UI unavailable');calls.push('invalidate')},log:async(t:string)=>{if(faults.log)throw new Error('UI log unavailable');calls.push(t)},
 resolve:()=>({Box:(p:any)=>({type:'Box',props:p}),Text:(p:any)=>({type:'Text',props:p}),Button:(p:any)=>{button=p;return {type:'Button',props:p}}})}};
 register(on);
 async function dispatch(name:string,e:any,bottom=async (_e:any):Promise<any>=>({type:'engine',ref:0})) {
  const handlers = hooks.get(name) ?? [];
  const at = (i:number,arg:any):Promise<any> => i===handlers.length ? bottom(arg) : Promise.resolve(handlers[i]!($,arg,(n:any)=>at(i+1,n)));
  return at(0,e);
 }
 return {dispatch,calls,faults,get button(){return button}};
}
const band = {surface:'terminal',component:'AbovePrompt',requestId:'band',props:{hasSurvey:false,bodyColumns:60,maxRows:10}};
const strings=(x:unknown):string=>JSON.stringify(x);
test('registers immediate /simple, native opt-in button, reversible switch; survey is preserved',async()=>{
 const h=harness();await h.dispatch('session.start',{});assert.ok(h.calls.includes('simple'));
 let tree=await h.dispatch('ui.render',band);assert.match(strings(tree),/Clean View: OFF/);
 await h.button.onPress();tree=await h.dispatch('ui.render',band);assert.match(strings(tree),/Clean View: ON/);
 assert.match((await h.dispatch('command.run',{command:'simple',args:'off'})).text,/OFF/);
 tree=await h.dispatch('ui.render',band);assert.match(strings(tree),/Clean View: OFF/);
 const marker={type:'engine',ref:42};assert.equal(await h.dispatch('ui.render',{...band,props:{...band.props,hasSurvey:true}},async()=>marker),marker);
 assert.equal(await h.dispatch('command.run',{command:'other',args:''},async()=>marker),marker);
});
export {harness,band,strings};
test('real events produce counted steps and a completion summary; stale/subagent completion cannot finish the main turn',async()=>{
 const h=harness();await h.dispatch('command.run',{command:'simple',args:'on'});
 await h.dispatch('turn.start',{text:'Build something',turnId:'main'},async e=>({turnId:e.turnId}));
 let tree=await h.dispatch('ui.render',band);assert.match(strings(tree),/Working/);
 const e={tool:'Read',tool_use_id:'read-1',file_path:'/work/example'};
 const pending=h.dispatch('tool.call',e,async()=>({result:{content:'ok'},text:'ok'}));
 await pending;
 tree=await h.dispatch('ui.render',band);assert.match(strings(tree),/1 succeeded/);assert.match(strings(tree),/Read information/);assert.doesNotMatch(strings(tree),/%|\/work\/example/);
 const end={turnId:'main',reason:'answer',answer:'Finished',durationMs:1200,isAborted:false};
 await h.dispatch('turn.complete',{...end,agentId:'worker'},async()=>({text:'worker'}));
 assert.match(strings(await h.dispatch('ui.render',band)),/Working/);
 await h.dispatch('turn.complete',{...end,turnId:'stale'},async()=>({text:'stale'}));
 assert.match(strings(await h.dispatch('ui.render',band)),/Working/);
 const result=await h.dispatch('turn.complete',end,async()=>({text:'Finished'}));assert.equal(result.text,'Finished');
 assert.match(strings(await h.dispatch('ui.render',band)),/Turn complete/);assert.ok(h.calls.some(x=>x.includes('Turn complete')&&x.includes('1 succeeded')));
});
test('hides only observed successful safe rows; pending, failures, unknown IDs, mixed groups and audit stay untouched',async()=>{
 const h=harness();await h.dispatch('command.run',{command:'simple',args:'on'});
 await h.dispatch('turn.start',{text:'Check',turnId:'t'},async()=>({turnId:'t'}));
 const marker={type:'engine',ref:7};
 const call={tool:'Read',tool_use_id:'r',file_path:'a'};
 const row={surface:'terminal',requestId:'r',component:'ToolUse',props:{...call,input:{},isRunning:false,isErrored:false,isInterrupted:false,output:{content:'ok'}}};
 assert.equal(await h.dispatch('ui.render',row,async()=>marker),marker);
 const raw={result:{content:'ok'},text:'ok',ref:9};
 assert.equal(await h.dispatch('tool.call',call,async()=>raw),raw);
 assert.notEqual(await h.dispatch('ui.render',row,async()=>marker),marker);
 for(const props of [{...row.props,isRunning:true},{...row.props,isErrored:true},{...row.props,isInterrupted:true},{...row.props,tool:'AskUserQuestion'},{...row.props,tool_use_id:'unknown'},{...row.props,output:{error:'failed'}}]) {
  assert.equal(await h.dispatch('ui.render',{...row,props},async()=>marker),marker);
 }
 const resultRow={...row,component:'ToolResult'};
 assert.notEqual(await h.dispatch('ui.render',resultRow,async()=>marker),marker);
 const group={...row,component:'ToolGroup',props:{calls:[row.props],isActive:false,isExpanded:false}};
 assert.notEqual(await h.dispatch('ui.render',group,async()=>marker),marker);
 assert.equal(await h.dispatch('ui.render',{...group,props:{...group.props,calls:[row.props,{...row.props,isErrored:true}]}},async()=>marker),marker);
 const desktopRow={...row,surface:'desktop'};assert.equal(await h.dispatch('ui.render',desktopRow,async()=>marker),marker);
 await h.dispatch('command.run',{command:'simple',args:'off'});assert.equal(await h.dispatch('ui.render',row,async()=>marker),marker);
 assert.deepEqual(raw,{result:{content:'ok'},text:'ok',ref:9}); // original result/transcript handles unchanged
});
test('permission/question, rejection, thrown tool errors and terminal errors remain visible with honest states',async()=>{
 const h=harness();await h.dispatch('command.run',{command:'simple',args:'on'});
 await h.dispatch('turn.start',{text:'Check',turnId:'t'},async()=>({turnId:'t'}));
 const marker={type:'engine',ref:3};
 const permission={agent_id:undefined,notification_type:'permission_prompt',message:'Permission needed'};
 assert.equal(await h.dispatch('classic.Notification',permission,async()=>marker),marker);
 assert.match(strings(await h.dispatch('ui.render',band)),/Needs you/);
 for(const component of ['PermissionDialog','AskUserQuestion','AssistantMessage','ToolProgress','APIError']) assert.equal(await h.dispatch('ui.render',{surface:'terminal',component,props:{},requestId:'s'},async()=>marker),marker);
 const denied={deny:'Owner declined'};assert.equal(await h.dispatch('tool.call',{tool:'Read',tool_use_id:'denied'},async()=>denied),denied);
 assert.match(strings(await h.dispatch('ui.render',band)),/1 denied/);
 const failure=new Error('tool crashed');await assert.rejects(h.dispatch('tool.call',{tool:'Read',tool_use_id:'crash'},async()=>{throw failure}),e=>e===failure);
 assert.match(strings(await h.dispatch('ui.render',band)),/1 failed/);
 for(const reason of ['error','refusal','aborted']) {
  const t='turn-'+reason;await h.dispatch('turn.start',{text:'Again',turnId:t},async()=>({turnId:t}));
  const raw={text:'Original error/refusal details'};assert.equal(await h.dispatch('turn.complete',{turnId:t,reason,answer:'details',isAborted:reason==='aborted',durationMs:1},async()=>raw),raw);
  const tree=strings(await h.dispatch('ui.render',band));assert.doesNotMatch(tree,/Turn complete/);assert.match(tree,reason==='aborted'?/stopped/:new RegExp(reason));
 }
});
test('an actual pending question shows Needs you until answered; pending counts are not estimates',async()=>{
 const h=harness();await h.dispatch('command.run',{command:'simple',args:'on'});
 await h.dispatch('turn.start',{text:'Check',turnId:'t'},async()=>({turnId:'t'}));
 let answer!:()=>void;let started!:()=>void;
 const entered=new Promise<void>(r=>started=r);const waiting=new Promise<void>(r=>answer=r);
 const pending=h.dispatch('tool.call',{tool:'AskUserQuestion',tool_use_id:'q'},async()=>{started();await waiting;return {result:{answers:{Choice:'Yes'}},text:'Yes'}});
 await entered;
 const tree=strings(await h.dispatch('ui.render',band));assert.match(tree,/Needs you/);assert.match(tree,/1 running/);
 answer();await pending;assert.match(strings(await h.dispatch('ui.render',band)),/Working/);
});
test('UI refresh or summary failures never block tools or replace original completion/error',async()=>{
 const h=harness();await h.dispatch('command.run',{command:'simple',args:'on'});
 h.faults.invalidate=true;
 await h.dispatch('turn.start',{text:'Check',turnId:'t'},async()=>({turnId:'t'}));
 const raw={result:{content:'ok'},text:'ok'};assert.equal(await h.dispatch('tool.call',{tool:'Read',tool_use_id:'r'},async()=>raw),raw);
 h.faults.log=true;
 const end={text:'Original answer'};assert.equal(await h.dispatch('turn.complete',{turnId:'t',reason:'answer'},async()=>end),end);
});

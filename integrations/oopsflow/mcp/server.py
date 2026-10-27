#!/usr/bin/env python3
"""OopsFlow 3.2 local MCP runtime: portable workflows + first-class pipelines."""
from __future__ import annotations
import json, os, sys, time, uuid
from pathlib import Path
from typing import Any
APP="OopsFlow"; VERSION="3.2.0"; UI_URI="ui://oops-flow/canvas-v2.html"
NODE_TYPES={"trigger","action","ai","condition","transform","loop","parallel","wait","approval","verify","subworkflow"}; PIPELINE_STATES={"DRAFT","VALIDATED","TESTED","APPROVED","PUBLISHED","ACTIVE","RETIRED"}
class Store:
    def __init__(self,root:Path): self.root=root; root.mkdir(parents=True,exist_ok=True); self.workflows=root/"workflows.json"; self.pipelines=root/"pipelines.json"; self.executions=root/"executions.jsonl"; self.audit=root/"audit.jsonl"
    def load(self,p):
        try:return json.loads(p.read_text()) if p.exists() else {}
        except Exception as e: raise RuntimeError(f"store unreadable: {e}")
    def save(self,p,v): t=p.with_suffix('.tmp'); t.write_text(json.dumps(v,indent=2)); t.replace(p)
    def append(self,p,v):
        with p.open('a') as f:f.write(json.dumps(v,default=str)+"\n")
    def recent(self,n=20):
        if not self.executions.exists():return []
        return [json.loads(x) for x in self.executions.read_text().splitlines()[-max(1,min(int(n),200)):]]
    def execution(self,i):
        if not self.executions.exists():return None
        for x in reversed(self.executions.read_text().splitlines()):
            o=json.loads(x)
            if o.get('id')==i:return o
def root():
    x=os.getenv('OOPS_FLOW_HOME')
    if x:return Path(x).expanduser()
    if sys.platform=='win32':return Path(os.getenv('LOCALAPPDATA',Path.home()/'AppData/Local'))/'OopsFlow'
    if sys.platform=='darwin':return Path.home()/'Library/Application Support/OopsFlow'
    return Path(os.getenv('XDG_DATA_HOME',Path.home()/'.local/share'))/'oops-flow'
class Audit:
    def __init__(self,s):self.s=s
    def log(self,event,**kw):self.s.append(self.s.audit,{"ts":time.time(),"event":event,**kw})
class Validator:
    def workflow(self,w):
        e=[]
        for k in ('id','name','nodes','edges'):
            if k not in w:e.append('missing '+k)
        ids=set()
        for n in w.get('nodes',[]):
            if not n.get('id'):e.append('node missing id');continue
            if n['id'] in ids:e.append('duplicate node id: '+n['id'])
            ids.add(n['id'])
            if n.get('type') not in NODE_TYPES:e.append('invalid node type: '+str(n.get('type')))
        for x in w.get('edges',[]):
            if x.get('from') not in ids:e.append('edge from unknown node: '+str(x.get('from')))
            if x.get('to') not in ids:e.append('edge to unknown node: '+str(x.get('to')))
        return e
    def pipeline(self,p,workflows):
        e=[]
        for k in ('id','name','version','stages','policy'):
            if k not in p:e.append('missing '+k)
        ids=set()
        for s in p.get('stages',[]):
            sid=s.get('id')
            if not sid:e.append('stage missing id');continue
            if sid in ids:e.append('duplicate stage id: '+sid)
            ids.add(sid)
            if s.get('workflow') and s['workflow'] not in workflows:e.append(f"stage {sid}: workflow not found: {s['workflow']}")
            if s.get('mode') not in (None,'native','desktop','mcp','auto'):e.append(f"stage {sid}: invalid mode")
        for d in p.get('dependencies',[]):
            if d.get('from') not in ids or d.get('to') not in ids:e.append('dependency references unknown stage')
        return e
class WorkflowEngine:
    def __init__(self,s,a,v):self.s=s;self.a=a;self.v=v
    def run(self,w,dry=False):
        e=self.v.workflow(w)
        if e:return {'ok':False,'errors':e}
        x={'id':'EX-'+time.strftime('%Y%m%d-%H%M%S')+'-'+uuid.uuid4().hex[:8],'workflow_id':w['id'],'status':'running','started_at':time.time(),'steps':[]}
        for n in w.get('nodes',[]):
            if n.get('type')=='approval' and not dry:x['status']='waiting';x['waiting_node']=n['id'];x['steps'].append({'node':n['id'],'status':'waiting'});break
            x['steps'].append({'node':n['id'],'status':'preview' if dry else 'success','output':n.get('output',n.get('input',{}))})
        if x['status']=='running':x['status']='success'
        x['finished_at']=time.time();self.s.append(self.s.executions,x);self.a.log('execution.finished',execution_id=x['id'],workflow_id=w['id'],status=x['status']);return x
class PipelineEngine:
    def __init__(self,s,a,v,w):self.s=s;self.a=a;self.v=v;self.w=w
    def run(self,pid,dry=False):
        ps=self.s.load(self.s.pipelines); ws=self.s.load(self.s.workflows); p=ps.get(pid)
        if not p:return {'ok':False,'error':'pipeline not found'}
        if p.get('state') not in ('PUBLISHED','ACTIVE') and not dry:return {'ok':False,'error':'pipeline must be PUBLISHED or ACTIVE'}
        e=self.v.pipeline(p,ws)
        if e:return {'ok':False,'errors':e}
        x={'id':'PX-'+time.strftime('%Y%m%d-%H%M%S')+'-'+uuid.uuid4().hex[:8],'pipeline_id':pid,'status':'running','started_at':time.time(),'stages':[]}; done=set()
        for st in p.get('stages',[]):
            deps=[d['from'] for d in p.get('dependencies',[]) if d.get('to')==st['id']]
            if any(d not in done for d in deps):x['status']='failed';x['error']='stage dependency order invalid';break
            if st.get('workflow'):r=self.w.run(ws[st['workflow']],dry); ok=r.get('status') in ('success','preview') or r.get('ok')
            else:r={'status':'success' if not dry else 'preview'};ok=True
            x['stages'].append({'id':st['id'],'name':st.get('name',st['id']),'workflow':st.get('workflow'),'result':r})
            if not ok and p.get('policy',{}).get('on_failure','stop')=='stop':x['status']='failed';break
            done.add(st['id'])
        if x['status']=='running':x['status']='preview' if dry else 'success'
        x['finished_at']=time.time();self.s.append(self.s.executions,x);self.a.log('pipeline.finished',execution_id=x['id'],pipeline_id=pid,status=x['status']);return x
class Service:
    def __init__(self,s,a,v):self.s=s;self.a=a;self.v=v;self.w=WorkflowEngine(s,a,v);self.p=PipelineEngine(s,a,v,self.w)
    def call(self,n,a):
        ws=self.s.load(self.s.workflows); ps=self.s.load(self.s.pipelines)
        if n=='workflow.create':
            w=a['workflow'];e=self.v.workflow(w)
            if e:return {'ok':False,'errors':e}
            ws[w['id']]=w;self.s.save(self.s.workflows,ws);return {'ok':True,'workflow':w}
        if n=='workflow.list':return list(ws.values())
        if n=='workflow.get':return ws.get(a['id'],{'error':'not found'})
        if n=='workflow.validate':
            w=a.get('workflow') or ws.get(a.get('id'),{});e=self.v.workflow(w);return {'valid':not e,'errors':e}
        if n=='workflow.run':return self.w.run(ws[a['id']],bool(a.get('dry_run'))) if a['id'] in ws else {'ok':False,'error':'not found'}
        if n=='workflow.delete':ws.pop(a['id'],None);self.s.save(self.s.workflows,ws);return {'ok':True}
        if n=='pipeline.create':
            p=a['pipeline'];p.setdefault('state','DRAFT');e=self.v.pipeline(p,ws)
            if e:return {'ok':False,'errors':e}
            ps[p['id']]=p;self.s.save(self.s.pipelines,ps);return {'ok':True,'pipeline':p}
        if n=='pipeline.get':return ps.get(a['id'],{'error':'not found'})
        if n=='pipeline.list':return list(ps.values())
        if n=='pipeline.validate':
            p=a.get('pipeline') or ps.get(a.get('id'),{});e=self.v.pipeline(p,ws);return {'valid':not e,'errors':e,'state':p.get('state')}
        if n=='pipeline.transition':
            p=ps.get(a['id']);
            if not p:return {'ok':False,'error':'not found'}
            target=a['state'];order=list(PIPELINE_STATES);cur=order.index(p.get('state','DRAFT'));tar=order.index(target)
            if target not in PIPELINE_STATES:return {'ok':False,'error':'invalid state'}
            if target not in ('DRAFT','RETIRED') and self.v.pipeline(p,ws):return {'ok':False,'error':'pipeline validation failed'}
            if tar>cur+1 and target not in ('PUBLISHED','ACTIVE'):return {'ok':False,'error':'invalid lifecycle transition'}
            p['state']=target;ps[p['id']]=p;self.s.save(self.s.pipelines,ps);return {'ok':True,'pipeline':p}
        if n=='pipeline.run':return self.p.run(a['id'],bool(a.get('dry_run')))
        if n=='pipeline.export':return ps.get(a['id'],{'error':'not found'})
        if n=='pipeline.import':
            p=a['pipeline'];p['state']='DRAFT';e=self.v.pipeline(p,ws)
            if e:return {'ok':False,'errors':e}
            ps[p['id']]=p;self.s.save(self.s.pipelines,ps);return {'ok':True,'pipeline':p}
        if n=='execution.recent':return self.s.recent(a.get('limit',20))
        if n=='execution.resume':
            x=self.s.execution(a['execution_id']);
            if not x:return {'ok':False,'error':'execution not found'}
            if x.get('status')!='waiting':return {'ok':False,'error':'execution not waiting'}
            x['status']='approved' if a['approve'] else 'rejected';self.s.append(self.s.executions,x);return {'ok':True,'execution':x}
        raise KeyError(n)
TOOLS={'workflow.create':('Create a workflow.',{}),'workflow.get':('Get a workflow.',{}),'workflow.list':('List workflows.',{}),'workflow.validate':('Validate a workflow.',{}),'workflow.run':('Run or preview a workflow.',{}),'workflow.delete':('Delete a workflow.',{}),'pipeline.create':('Create a pipeline.',{}),'pipeline.get':('Get a pipeline.',{}),'pipeline.list':('List pipelines.',{}),'pipeline.validate':('Validate a pipeline.',{}),'pipeline.transition':('Move a pipeline through its lifecycle.',{}),'pipeline.run':('Run or preview an active/published pipeline.',{}),'pipeline.export':('Export a pipeline.',{}),'pipeline.import':('Import a pipeline as DRAFT.',{}),'execution.recent':('Recent executions.',{}),'execution.resume':('Approve or reject a waiting execution.',{})}
def main():
    s=Store(root());a=Audit(s);v=Validator();svc=Service(s,a,v)
    def emit(i,r=None,e=None):
        o={'jsonrpc':'2.0','id':i};o['error']=e;o['result']=None if e else r;sys.stdout.write(json.dumps(o,separators=(',',':'))+'\n');sys.stdout.flush()
    for line in sys.stdin:
        try:
            q=json.loads(line);m=q.get('method');i=q.get('id')
            if m=='initialize':emit(i,{'protocolVersion':'2024-11-05','capabilities':{'tools':{},'resources':{}},'serverInfo':{'name':'oops-flow','version':VERSION}})
            elif m=='ping':emit(i,{})
            elif m=='tools/list':emit(i,{'tools':[{'name':n,'description':d,'inputSchema':sc} for n,(d,sc) in TOOLS.items()]})
            elif m=='tools/call':
                p=q['params'];r=svc.call(p['name'],p.get('arguments',{}));emit(i,{'content':[{'type':'text','text':json.dumps(r,indent=2)}]})
            elif m in ('notifications/initialized','notifications/cancelled'):continue
            else:emit(i,e={'code':-32601,'message':'method not found'})
        except Exception as ex:emit(q.get('id') if 'q' in locals() else None,e={'code':-32000,'message':str(ex)})
if __name__=='__main__':main()
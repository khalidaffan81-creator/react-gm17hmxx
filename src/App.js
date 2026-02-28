import React, { useState, useRef } from "react";
import { Zap, TrendingUp, AlertTriangle, CheckCircle2, Clock, Target, Download, Upload, Calendar, X, RefreshCw, Star, Plus } from "lucide-react";

const T = {
  bg0:"#070B14",bg1:"#0D1526",bg2:"#121C32",bg3:"#192541",
  border:"#1E2D4A",borderHi:"#2A3F6A",
  text:"#E2EAF8",textMuted:"#6B7FA3",textDim:"#3A4D70",
  amber:"#F5A623",amberDim:"#7A5312",
  red:"#F04B6A",redDim:"#5C1C2B",
  green:"#10D98A",greenDim:"#0A3D25",
  blue:"#4A9EFF",blueDim:"#152E5A",
  purple:"#A855F7",purpleDim:"#3B1C6A",
  q1:"#F04B6A",q2:"#F5A623",q3:"#4A9EFF",q4:"#10D98A",
};

const INIT_CHAPTERS = [
  {id:"bio1",name:"Cell Structure & Function",subject:"Biology",weight:3,accuracy:48,errors:12,pyqs:38,group:"Q1"},
  {id:"bio2",name:"Genetics & Heredity",subject:"Biology",weight:3,accuracy:82,errors:3,pyqs:45,group:"Q2"},
  {id:"bio3",name:"Human Physiology",subject:"Biology",weight:3,accuracy:55,errors:9,pyqs:52,group:"Q1"},
  {id:"bio4",name:"Plant Kingdom",subject:"Biology",weight:2,accuracy:71,errors:4,pyqs:22,group:"Q2"},
  {id:"bio5",name:"Ecology & Environment",subject:"Biology",weight:2,accuracy:38,errors:14,pyqs:28,group:"Q3"},
  {id:"bio6",name:"Biological Classification",subject:"Biology",weight:1,accuracy:78,errors:2,pyqs:12,group:"Q4"},
  {id:"bio7",name:"Body Fluids & Circulation",subject:"Biology",weight:2,accuracy:45,errors:11,pyqs:30,group:"Q1"},
  {id:"bio8",name:"Reproduction",subject:"Biology",weight:3,accuracy:60,errors:7,pyqs:40,group:"Q1"},
  {id:"chem1",name:"Organic Nomenclature",subject:"Chemistry",weight:2,accuracy:55,errors:8,pyqs:20,group:"Q3"},
  {id:"chem2",name:"Chemical Bonding",subject:"Chemistry",weight:3,accuracy:52,errors:10,pyqs:35,group:"Q1"},
  {id:"chem3",name:"Periodic Trends",subject:"Chemistry",weight:1,accuracy:40,errors:10,pyqs:18,group:"Q3"},
  {id:"chem4",name:"Electrochemistry",subject:"Chemistry",weight:2,accuracy:35,errors:15,pyqs:25,group:"Q3"},
  {id:"chem5",name:"Thermodynamics",subject:"Chemistry",weight:2,accuracy:68,errors:5,pyqs:22,group:"Q2"},
  {id:"chem6",name:"Alcohols & Ethers",subject:"Chemistry",weight:2,accuracy:72,errors:4,pyqs:19,group:"Q2"},
  {id:"chem7",name:"Coordination Compounds",subject:"Chemistry",weight:2,accuracy:44,errors:12,pyqs:28,group:"Q3"},
  {id:"phys1",name:"Mechanics",subject:"Physics",weight:3,accuracy:62,errors:6,pyqs:48,group:"Q1"},
  {id:"phys2",name:"Electrostatics",subject:"Physics",weight:3,accuracy:41,errors:13,pyqs:42,group:"Q1"},
  {id:"phys3",name:"Optics",subject:"Physics",weight:2,accuracy:57,errors:8,pyqs:30,group:"Q3"},
  {id:"phys4",name:"Modern Physics",subject:"Physics",weight:3,accuracy:78,errors:3,pyqs:35,group:"Q2"},
  {id:"phys5",name:"Current Electricity",subject:"Physics",weight:2,accuracy:48,errors:11,pyqs:32,group:"Q3"},
  {id:"phys6",name:"Waves & Sound",subject:"Physics",weight:1,accuracy:85,errors:1,pyqs:14,group:"Q4"},
  {id:"phys7",name:"Thermodynamics (Phys)",subject:"Physics",weight:2,accuracy:33,errors:16,pyqs:24,group:"Q3"},
];

const priorityScore = c => c.weight * (4 - c.accuracy / 25);
const getGroupColor = g => ({Q1:T.q1,Q2:T.q2,Q3:T.q3,Q4:T.q4}[g]||T.blue);
const getGroupBg = g => ({Q1:T.redDim,Q2:T.amberDim,Q3:T.blueDim,Q4:T.greenDim}[g]||T.blueDim);
const SUBJECT_COLORS = {Biology:T.green,Chemistry:T.amber,Physics:T.blue};
const WEEKS = ["W19","W20","W21","W22","W23","W24","W25","W26"];

function seedRand(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => { s = s * 16807 % 2147483647; return (s - 1) / 2147483646; };
}
function getHistory(ch) {
  const rand = seedRand(ch.id.charCodeAt(0) * 31 + ch.accuracy);
  return WEEKS.map((w,i) => ({
    week: w,
    accuracy: Math.max(20, Math.min(95, Math.round(ch.accuracy - 15 + i*2 + rand()*8))),
    errors: Math.max(0, Math.round(ch.errors - i*0.5 + rand()*3)),
  }));
}

// ── PURE SVG LINE CHART ──────────────────────────────────────────────────────
function LineChartSVG({ series, width=400, height=130, yMin=20, yMax=100 }) {
  const PAD = { top:10, right:10, bottom:22, left:30 };
  const W = width - PAD.left - PAD.right;
  const H = height - PAD.top - PAD.bottom;
  const toX = i => PAD.left + (i / (WEEKS.length-1)) * W;
  const toY = v => PAD.top + H - ((v - yMin) / (yMax - yMin)) * H;
  const [tip, setTip] = useState(null);

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{overflow:"visible"}}>
      {/* Grid lines */}
      {[20,40,60,80,100].map(v => (
        <line key={v} x1={PAD.left} x2={PAD.left+W} y1={toY(v)} y2={toY(v)}
          stroke={T.border} strokeWidth="1" strokeDasharray="3,3"/>
      ))}
      {/* Y labels */}
      {[20,50,80,100].map(v => (
        <text key={v} x={PAD.left-4} y={toY(v)+3} fill={T.textDim} fontSize="8" textAnchor="end">{v}</text>
      ))}
      {/* X labels */}
      {WEEKS.map((w,i) => (
        <text key={w} x={toX(i)} y={height-4} fill={T.textDim} fontSize="8" textAnchor="middle">{w}</text>
      ))}
      {/* Target line */}
      <line x1={PAD.left} x2={PAD.left+W} y1={toY(70)} y2={toY(70)}
        stroke={T.green} strokeWidth="1" strokeDasharray="5,4" strokeOpacity="0.5"/>
      <text x={PAD.left+W+2} y={toY(70)+3} fill={T.green} fontSize="7" fillOpacity="0.7">70%</text>

      {/* Series */}
      {series.map((s,si) => {
        const pts = s.data.map((d,i) => `${toX(i)},${toY(d.accuracy)}`).join(" ");
        return (
          <g key={s.id}>
            <polyline points={pts} fill="none" stroke={s.color} strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"/>
            {s.data.map((d,i) => (
              <circle key={i} cx={toX(i)} cy={toY(d.accuracy)} r="3.5"
                fill={s.color} stroke={T.bg1} strokeWidth="1.5"
                style={{cursor:"pointer"}}
                onMouseEnter={() => setTip({x:toX(i),y:toY(d.accuracy),d,name:s.name,color:s.color})}
                onMouseLeave={() => setTip(null)}/>
            ))}
          </g>
        );
      })}

      {/* Tooltip */}
      {tip && (
        <g>
          <rect x={Math.min(tip.x+8, width-90)} y={tip.y-36} width="84" height="34" rx="4"
            fill={T.bg1} stroke={tip.color} strokeWidth="1" strokeOpacity="0.8"/>
          <text x={Math.min(tip.x+14,width-84)} y={tip.y-22} fill={T.text} fontSize="9" fontWeight="700">{tip.name}</text>
          <text x={Math.min(tip.x+14,width-84)} y={tip.y-10} fill={tip.color} fontSize="9">{tip.d.week}: {tip.d.accuracy}%</text>
        </g>
      )}
    </svg>
  );
}

// ── PURE SVG BAR CHART (horizontal) ─────────────────────────────────────────
function BarChartSVG({ chapters }) {
  const H_ROW = 28, PAD_L = 110, PAD_R = 50, W = 400;
  const maxScore = 12;
  const height = chapters.length * H_ROW + 20;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${height}`} style={{overflow:"visible"}}>
      {chapters.map((ch,i) => {
        const score = priorityScore(ch);
        const barW = Math.max(4, (score/maxScore)*(W-PAD_L-PAD_R));
        const color = getGroupColor(ch.group);
        const y = i * H_ROW + 10;
        return (
          <g key={ch.id}>
            <text x={PAD_L-6} y={y+13} fill={T.textMuted} fontSize="9" textAnchor="end">
              {ch.name.length>16?ch.name.slice(0,16)+"…":ch.name}
            </text>
            <rect x={PAD_L} y={y+2} width={barW} height={H_ROW-6} rx="3"
              fill={color} fillOpacity="0.25"/>
            <rect x={PAD_L} y={y+2} width={Math.min(barW,4)} height={H_ROW-6} rx="3"
              fill={color} fillOpacity="0.9"/>
            <text x={PAD_L+barW+5} y={y+13} fill={color} fontSize="9" fontWeight="700">{score.toFixed(1)}</text>
            <text x={PAD_L+barW+5} y={y+22} fill={T.textDim} fontSize="7">{ch.accuracy}% acc</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── SPARKLINE ────────────────────────────────────────────────────────────────
function Spark({data,color}) {
  const vals = data.map(d=>d.accuracy);
  const mn=Math.min(...vals), mx=Math.max(...vals);
  const W=52, H=16;
  const pts = vals.map((v,i)=>`${(i/(vals.length-1))*W},${H-((v-mn)/(mx-mn||1))*H}`).join(" ");
  const last = pts.split(" ").at(-1).split(",");
  return (
    <svg width={W} height={H} style={{overflow:"visible"}}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={last[0]} cy={last[1]} r="2.5" fill={color}/>
    </svg>
  );
}

// ── PRIORITY MATRIX ──────────────────────────────────────────────────────────
function PriorityMatrix({ chapters, onSelect, selected, subject }) {
  const [tooltip, setTooltip] = useState(null);
  const W=400, H=330, PAD=42;
  const IW=W-PAD*2, IH=H-PAD*2;
  const filtered = subject==="All" ? chapters : chapters.filter(c=>c.subject===subject);
  const cx = acc => PAD + (acc/100)*IW;
  const cy = wt => PAD + IH - ((wt-1)/2)*IH;
  const quads = [
    {x:PAD,y:PAD,w:IW/2,h:IH/2,color:T.q2,label:"MAINTENANCE",lx:PAD+8,ly:PAD+14,anchor:"start"},
    {x:PAD+IW/2,y:PAD,w:IW/2,h:IH/2,color:T.q4,label:"MINIMAL",lx:PAD+IW-8,ly:PAD+14,anchor:"end"},
    {x:PAD,y:PAD+IH/2,w:IW/2,h:IH/2,color:T.q1,label:"DANGER",lx:PAD+8,ly:PAD+IH-6,anchor:"start"},
    {x:PAD+IW/2,y:PAD+IH/2,w:IW/2,h:IH/2,color:T.q3,label:"LOW EXPOSURE",lx:PAD+IW-8,ly:PAD+IH-6,anchor:"end"},
  ];

  return (
    <div style={{position:"relative"}}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",overflow:"visible",cursor:"crosshair"}}
        onMouseLeave={()=>setTooltip(null)}>
        <defs>
          {quads.map((q,i)=>(
            <radialGradient key={i} id={`qg${i}`} cx="50%" cy="50%">
              <stop offset="0%" stopColor={q.color} stopOpacity="0.12"/>
              <stop offset="100%" stopColor={q.color} stopOpacity="0.02"/>
            </radialGradient>
          ))}
        </defs>
        {quads.map((q,i)=>(
          <g key={i}>
            <rect x={q.x} y={q.y} width={q.w} height={q.h}
              fill={`url(#qg${i})`} stroke={q.color} strokeOpacity="0.2" strokeWidth="1"/>
            <text x={q.lx} y={q.ly} fill={q.color} fillOpacity="0.4" fontSize="8"
              textAnchor={q.anchor} fontWeight="800" letterSpacing="1.5">{q.label}</text>
          </g>
        ))}
        <line x1={PAD} y1={PAD} x2={PAD} y2={PAD+IH} stroke={T.border} strokeWidth="1"/>
        <line x1={PAD} y1={PAD+IH} x2={PAD+IW} y2={PAD+IH} stroke={T.border} strokeWidth="1"/>
        <line x1={PAD+IW/2} y1={PAD} x2={PAD+IW/2} y2={PAD+IH} stroke={T.borderHi} strokeWidth="1" strokeDasharray="4,3"/>
        <line x1={PAD} y1={PAD+IH/2} x2={PAD+IW} y2={PAD+IH/2} stroke={T.borderHi} strokeWidth="1" strokeDasharray="4,3"/>
        <text x={PAD+IW/2} y={H-3} fill={T.textMuted} fontSize="8" textAnchor="middle">← WEAK · ACCURACY · STRONG →</text>
        <text x={9} y={PAD+IH/2} fill={T.textMuted} fontSize="8" textAnchor="middle" transform={`rotate(-90,9,${PAD+IH/2})`}>WEIGHTAGE</text>
        {[0,25,50,75,100].map(v=>(
          <text key={v} x={cx(v)} y={PAD+IH+11} fill={T.textDim} fontSize="7" textAnchor="middle">{v}%</text>
        ))}
        {[1,2,3].map(v=>(
          <text key={v} x={PAD-5} y={cy(v)+3} fill={T.textDim} fontSize="7" textAnchor="end">{v}</text>
        ))}
        {filtered.map(ch=>{
          const x=cx(ch.accuracy), y=cy(ch.weight);
          const r=5+ch.errors*0.5;
          const color=getGroupColor(ch.group);
          const isSel=selected?.id===ch.id;
          return (
            <g key={ch.id} onClick={()=>onSelect(ch)} style={{cursor:"pointer"}}
              onMouseEnter={()=>setTooltip({ch,x,y})} onMouseLeave={()=>setTooltip(null)}>
              <circle cx={x} cy={y} r={r+6} fill={color} fillOpacity="0.07"/>
              <circle cx={x} cy={y} r={r} fill={color} fillOpacity={isSel?1:0.65}
                stroke={isSel?"#fff":color} strokeWidth={isSel?2:0.5}/>
              {isSel&&<circle cx={x} cy={y} r={r+8} fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.45" strokeDasharray="3,3"/>}
              <circle cx={x} cy={y} r={2} fill={SUBJECT_COLORS[ch.subject]} fillOpacity="0.95"/>
            </g>
          );
        })}
        {tooltip&&(()=>{
          const {ch,x,y}=tooltip;
          const tx=Math.min(x+12,W-148), ty=Math.max(y-60,PAD);
          const col=getGroupColor(ch.group);
          const labels={"Q1":"⚡ Danger","Q2":"🔄 Maintain","Q3":"📉 Low","Q4":"✅ Minimal"};
          return (
            <g>
              <rect x={tx} y={ty} width="142" height="58" rx="5"
                fill={T.bg1} stroke={col} strokeWidth="1" strokeOpacity="0.9"/>
              <text x={tx+10} y={ty+15} fill={T.text} fontSize="10" fontWeight="700">
                {ch.name.length>20?ch.name.slice(0,20)+"…":ch.name}
              </text>
              <text x={tx+10} y={ty+29} fill={T.textMuted} fontSize="8">
                {`Acc: ${ch.accuracy}%  Wt: ${ch.weight}  Err: ${ch.errors}`}
              </text>
              <text x={tx+10} y={ty+43} fill={col} fontSize="8" fontWeight="600">{labels[ch.group]}</text>
              <text x={tx+10} y={ty+54} fill={T.textDim} fontSize="7">Priority: {priorityScore(ch).toFixed(1)}</text>
            </g>
          );
        })()}
      </svg>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:6}}>
        {["Biology","Chemistry","Physics"].map(s=>(
          <div key={s} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:T.textMuted}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:SUBJECT_COLORS[s]}}/>
            {s}
          </div>
        ))}
        <span style={{fontSize:11,color:T.textDim}}>● size = errors</span>
      </div>
    </div>
  );
}

// ── EVOLUTION CHART ──────────────────────────────────────────────────────────
function Evolution({ chapters }) {
  const [sel, setSel] = useState([chapters[0]?.id, chapters[1]?.id].filter(Boolean));
  const colors = [T.amber, T.blue, T.purple];
  const selCh = chapters.filter(c => sel.includes(c.id));

  const series = selCh.map((ch,i) => ({
    id: ch.id,
    name: ch.name.split(" ")[0],
    color: colors[i],
    data: getHistory(ch),
  }));

  return (
    <div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
        {chapters.slice(0,7).map(ch => {
          const on = sel.includes(ch.id);
          return (
            <button key={ch.id} onClick={()=>{
              if(on) setSel(s=>s.filter(x=>x!==ch.id));
              else if(sel.length<3) setSel(s=>[...s,ch.id]);
            }} style={{
              fontSize:10,padding:"3px 8px",borderRadius:4,border:"none",
              background:on?getGroupBg(ch.group):`${T.bg2}`,
              color:on?getGroupColor(ch.group):T.textMuted,
              outline:on?`1px solid ${getGroupColor(ch.group)}`:`1px solid ${T.border}`,
              cursor:"pointer",transition:"all 0.15s",
            }}>{ch.name.split(" ")[0]}</button>
          );
        })}
        <span style={{fontSize:10,color:T.textDim,alignSelf:"center"}}>max 3</span>
      </div>
      <LineChartSVG series={series} width={500} height={138}/>
      <div style={{display:"flex",gap:12,marginTop:6}}>
        {selCh.map((ch,i)=>(
          <div key={ch.id} style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:T.textMuted}}>
            <div style={{width:16,height:2,background:colors[i],borderRadius:1}}/>
            {ch.name.split(" ")[0]}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TOP-10 ROW ───────────────────────────────────────────────────────────────
function Top10Row({ ch, rank, onSelect, selected }) {
  const isSel = selected?.id===ch.id;
  const score = priorityScore(ch);
  const pct = Math.min(100, (score/12)*100);
  const color = getGroupColor(ch.group);
  return (
    <div onClick={()=>onSelect(ch)} style={{
      display:"flex",alignItems:"center",gap:10,padding:"9px 12px",
      background:isSel?`${getGroupBg(ch.group)}99`:"transparent",
      border:`1px solid ${isSel?color:T.border}`,
      borderRadius:8,cursor:"pointer",transition:"all 0.15s",marginBottom:5,
      position:"relative",overflow:"hidden",
    }}>
      <div style={{position:"absolute",left:0,top:0,bottom:0,width:`${pct}%`,
        background:`linear-gradient(90deg,${color}1A,${color}05)`,transition:"width 0.4s"}}/>
      <div style={{width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",
        justifyContent:"center",background:rank<=3?color:T.bg3,
        color:rank<=3?"#000":T.textMuted,fontSize:11,fontWeight:700,flexShrink:0,zIndex:1}}>
        {rank}
      </div>
      <div style={{flex:1,minWidth:0,zIndex:1}}>
        <div style={{fontSize:12,fontWeight:600,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ch.name}</div>
        <div style={{display:"flex",alignItems:"center",gap:7,marginTop:2}}>
          <span style={{fontSize:10,color:SUBJECT_COLORS[ch.subject]}}>{ch.subject}</span>
          <span style={{fontSize:10,color:T.textMuted}}>{ch.accuracy}% acc</span>
          <span style={{fontSize:9,padding:"1px 5px",borderRadius:3,background:getGroupBg(ch.group),color}}>{ch.errors} err</span>
        </div>
      </div>
      <Spark data={getHistory(ch)} color={color}/>
      <div style={{flexShrink:0,textAlign:"right",zIndex:1}}>
        <div style={{fontSize:14,fontWeight:700,color}}>{score.toFixed(1)}</div>
        <div style={{fontSize:9,color:T.textDim}}>score</div>
      </div>
    </div>
  );
}

// ── DETAIL PANEL ─────────────────────────────────────────────────────────────
function Detail({ ch, onClose }) {
  const [tab, setTab] = useState("plan");
  const color = getGroupColor(ch.group);
  const score = priorityScore(ch);
  const hist = getHistory(ch);
  const plans = {
    Q1:{label:"Daily Microcycles",desc:"PYQs daily + mixed mock every 3 days. Triple revision cycle.",freq:"Daily",target:"≥75%"},
    Q2:{label:"Weekly Maintenance",desc:"One full test per week. Review errors on weekend.",freq:"Weekly",target:"≥80%"},
    Q3:{label:"Corrective Cycle",desc:"One focused session, then deprioritize until score >70%.",freq:"Fortnightly",target:"≥70%"},
    Q4:{label:"Glance Mode",desc:"10-min review every 2–3 weeks. Only PYQ spot-checks.",freq:"Monthly",target:"Maintain"},
  };
  const plan = plans[ch.group];

  return (
    <div style={{background:T.bg1,border:`1px solid ${color}44`,borderRadius:12,overflow:"hidden"}}>
      {/* Header */}
      <div style={{padding:"13px 16px",borderBottom:`1px solid ${T.border}`,
        background:`linear-gradient(135deg,${getGroupBg(ch.group)}66,transparent)`,
        display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}>
            <span style={{fontSize:10,padding:"2px 7px",borderRadius:3,background:getGroupBg(ch.group),color,fontWeight:600}}>{ch.group}</span>
            <span style={{fontSize:10,color:SUBJECT_COLORS[ch.subject]}}>{ch.subject}</span>
          </div>
          <div style={{fontSize:14,fontWeight:700,color:T.text}}>{ch.name}</div>
        </div>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:T.textMuted,padding:2}}>
          <X size={14}/>
        </button>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",borderBottom:`1px solid ${T.border}`}}>
        {[
          {l:"Accuracy",v:`${ch.accuracy}%`,c:ch.accuracy>70?T.green:ch.accuracy>55?T.amber:T.red},
          {l:"Weight",v:`${ch.weight}/3`,c:[T.green,T.amber,T.red][ch.weight-1]},
          {l:"PYQs",v:ch.pyqs,c:T.blue},
          {l:"Score",v:score.toFixed(1),c:color},
        ].map(s=>(
          <div key={s.l} style={{padding:"10px 6px",borderRight:`1px solid ${T.border}`,textAlign:"center"}}>
            <div style={{fontSize:16,fontWeight:700,color:s.c}}>{s.v}</div>
            <div style={{fontSize:10,color:T.textMuted,marginTop:1}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{display:"flex",borderBottom:`1px solid ${T.border}`}}>
        {["plan","history","notes"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{
            flex:1,padding:"9px",border:"none",
            borderBottom:`2px solid ${tab===t?color:"transparent"}`,
            background:"transparent",color:tab===t?color:T.textMuted,
            fontSize:11,cursor:"pointer",textTransform:"uppercase",letterSpacing:1,transition:"all 0.15s"
          }}>{t}</button>
        ))}
      </div>

      <div style={{padding:"14px 16px"}}>
        {tab==="plan"&&(
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,padding:11,
              background:`${getGroupBg(ch.group)}66`,borderRadius:8,border:`1px solid ${color}33`}}>
              <Calendar size={20} color={color}/>
              <div>
                <div style={{fontSize:13,fontWeight:700,color}}>{plan.label}</div>
                <div style={{fontSize:11,color:T.textMuted,marginTop:2}}>{plan.desc}</div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:12}}>
              {[
                {icon:<Clock size={12}/>,l:"Frequency",v:plan.freq},
                {icon:<Star size={12}/>,l:"PYQ Count",v:`${ch.pyqs} questions`},
                {icon:<Target size={12}/>,l:"Target",v:plan.target},
                {icon:<TrendingUp size={12}/>,l:"Trend",v:"↑ improving"},
              ].map(s=>(
                <div key={s.l} style={{padding:10,background:T.bg2,borderRadius:6,border:`1px solid ${T.border}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:5,color:T.textMuted,fontSize:10,marginBottom:3}}>{s.icon} {s.l}</div>
                  <div style={{fontSize:13,fontWeight:600,color:T.text}}>{s.v}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:7}}>
              <button style={{flex:1,padding:"9px",borderRadius:6,border:"none",background:color,color:"#000",fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                <Calendar size={12}/> Schedule
              </button>
              <button style={{flex:1,padding:"9px",borderRadius:6,border:`1px solid ${T.border}`,background:"transparent",color:T.text,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                <Plus size={12}/> Add to Mock
              </button>
              <button style={{padding:"9px 11px",borderRadius:6,border:`1px solid ${T.green}44`,background:`${T.green}18`,color:T.green,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
                <CheckCircle2 size={12}/> Done
              </button>
            </div>
          </div>
        )}
        {tab==="history"&&(
          <div>
            <LineChartSVG series={[{id:ch.id,name:ch.name.split(" ")[0],color,data:hist}]} width={380} height={110}/>
            <div style={{display:"flex",flexDirection:"column",gap:5,marginTop:10}}>
              {hist.slice(-4).map((h,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 10px",
                  background:T.bg2,borderRadius:6,border:`1px solid ${T.border}`}}>
                  <div style={{width:6,height:6,borderRadius:"50%",flexShrink:0,
                    background:h.accuracy>65?T.green:h.accuracy>50?T.amber:T.red}}/>
                  <span style={{fontSize:11,color:T.textMuted,width:36}}>{h.week}</span>
                  <span style={{flex:1,fontSize:11,color:T.textDim}}>Mock result</span>
                  <span style={{fontSize:13,fontWeight:700,
                    color:h.accuracy>65?T.green:h.accuracy>50?T.amber:T.red}}>{h.accuracy}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab==="notes"&&(
          <div>
            <textarea placeholder="Add notes, mnemonics, key formulas, error patterns..."
              style={{width:"100%",minHeight:90,background:T.bg2,border:`1px solid ${T.border}`,
                borderRadius:8,padding:10,color:T.text,fontSize:12,resize:"vertical",
                fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/>
            <div style={{display:"flex",gap:8,marginTop:8}}>
              <button style={{padding:"8px 16px",borderRadius:6,border:"none",background:color,color:"#000",fontSize:12,fontWeight:700,cursor:"pointer"}}>Save</button>
              <button style={{padding:"8px 12px",borderRadius:6,border:`1px solid ${T.border}`,background:"transparent",color:T.textMuted,fontSize:12,cursor:"pointer"}}>Clear</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [chapters, setChapters] = useState(INIT_CHAPTERS);
  const [subject, setSubject] = useState("All");
  const [selected, setSelected] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [importMsg, setImportMsg] = useState("");

  const top10 = [...chapters].sort((a,b)=>priorityScore(b)-priorityScore(a)).slice(0,10);
  const danger = chapters.filter(c=>c.group==="Q1").length;
  const avgAcc = Math.round(chapters.reduce((s,c)=>s+c.accuracy,0)/chapters.length);

  function handleImport() {
    try {
      const data = JSON.parse(importText);
      if (data.chapters) {
        setChapters(data.chapters);
        setImportMsg("✅ Chapters imported successfully!");
      } else if (data.mocks) {
        // aggregate mocks into accuracy updates
        const counts = {}, correct = {};
        data.mocks.forEach(m => {
          counts[m.chapterId] = (counts[m.chapterId]||0) + 1;
          correct[m.chapterId] = (correct[m.chapterId]||0) + (m.correct||0);
        });
        setChapters(prev => prev.map(c => {
          if (counts[c.id]) {
            const newAcc = Math.round(correct[c.id]/counts[c.id]*100);
            const newErrors = counts[c.id] - (correct[c.id]||0);
            const g = c.weight>=2 && newAcc<65 ? "Q1" : c.weight>=2 && newAcc>=65 ? "Q2" : newAcc<65 ? "Q3" : "Q4";
            return {...c, accuracy:newAcc, errors:newErrors, group:g};
          }
          return c;
        }));
        setImportMsg(`✅ Updated ${Object.keys(counts).length} chapters from mock data!`);
      }
      setTimeout(() => { setImportOpen(false); setImportMsg(""); setImportText(""); }, 1800);
    } catch(e) {
      setImportMsg("❌ Invalid JSON. Check the format below.");
    }
  }

  return (
    <div style={{minHeight:"100vh",background:T.bg0,color:T.text,fontSize:13,
      backgroundImage:"radial-gradient(ellipse at 5% 0%,#0F2040,transparent 50%),radial-gradient(ellipse at 95% 100%,#1A0820,transparent 50%)"}}>

      {/* HEADER */}
      <div style={{padding:"0 20px",borderBottom:`1px solid ${T.border}`,
        background:`${T.bg1}DD`,backdropFilter:"blur(12px)",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:12,height:54,maxWidth:1300,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:30,height:30,borderRadius:7,
              background:`linear-gradient(135deg,${T.red},${T.amber})`,
              display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Zap size={16} color="#000"/>
            </div>
            <div>
              <div style={{fontSize:13,fontWeight:700,letterSpacing:0.5}}>NEET MISSION</div>
              <div style={{fontSize:9,color:T.textMuted,letterSpacing:2}}>REVISION COMMAND</div>
            </div>
          </div>
          <div style={{flex:1}}/>
          <div style={{display:"flex",gap:4}}>
            {["All","Biology","Chemistry","Physics"].map(s=>(
              <button key={s} onClick={()=>setSubject(s)} style={{
                padding:"5px 11px",borderRadius:6,border:"none",
                outline:`1px solid ${subject===s?(SUBJECT_COLORS[s]||T.amber):T.border}`,
                background:subject===s?`${(SUBJECT_COLORS[s]||T.amber)}22`:"transparent",
                color:subject===s?(SUBJECT_COLORS[s]||T.amber):T.textMuted,
                fontSize:11,cursor:"pointer",transition:"all 0.15s"
              }}>{s}</button>
            ))}
          </div>
          <button onClick={()=>setImportOpen(true)} style={{
            padding:"6px 11px",borderRadius:6,border:"none",
            outline:`1px solid ${T.amber}55`,background:`${T.amber}18`,
            color:T.amber,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",gap:5
          }}><Upload size={12}/> Import</button>
          <button style={{padding:"6px 11px",borderRadius:6,border:"none",
            outline:`1px solid ${T.border}`,background:"transparent",
            color:T.textMuted,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
            <Download size={12}/> Export
          </button>
        </div>
      </div>

      {/* STATS BAR */}
      <div style={{maxWidth:1300,margin:"0 auto",padding:"12px 20px 0",display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
        {[
          {icon:<AlertTriangle size={14}/>,l:"Danger Chapters",v:danger,c:T.red},
          {icon:<Target size={14}/>,l:"Avg Accuracy",v:`${avgAcc}%`,c:T.amber},
          {icon:<Zap size={14}/>,l:"Total Chapters",v:chapters.length,c:T.blue},
        ].map(s=>(
          <div key={s.l} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 14px",
            background:T.bg1,borderRadius:8,border:`1px solid ${T.border}`}}>
            <span style={{color:s.c}}>{s.icon}</span>
            <span style={{fontSize:15,fontWeight:700,color:s.c}}>{s.v}</span>
            <span style={{fontSize:10,color:T.textMuted}}>{s.l}</span>
          </div>
        ))}
        <div style={{flex:1}}/>
        <div style={{fontSize:11,color:T.textDim}}>
          Week 26 · NEET 2026 · <span style={{color:T.amber}}>87 days left</span>
        </div>
      </div>

      {/* MAIN GRID */}
      <div style={{maxWidth:1300,margin:"0 auto",padding:"14px 20px 30px",
        display:"grid",gridTemplateColumns:"minmax(320px,42%) 1fr",gap:14}}>

        {/* LEFT: Matrix + Detail */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:12,padding:16}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:T.text}}>Priority Matrix</div>
                <div style={{fontSize:10,color:T.textMuted,marginTop:1}}>Hover = tooltip · Click dot = detail · Dot size = errors</div>
              </div>
              <div style={{display:"flex",gap:5}}>
                {["Q1","Q2","Q3","Q4"].map(q=>(
                  <div key={q} style={{width:7,height:7,borderRadius:2,background:getGroupColor(q)}}/>
                ))}
              </div>
            </div>
            <PriorityMatrix chapters={chapters} onSelect={c=>setSelected(s=>s?.id===c.id?null:c)} selected={selected} subject={subject}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:12}}>
              {[["Q1","Danger · Triple cycle"],["Q2","Maintain · Double cycle"],["Q3","Deprioritise soon"],["Q4","Glance only"]].map(([q,l])=>(
                <div key={q} style={{padding:"7px 10px",background:getGroupBg(q),borderRadius:6,
                  border:`1px solid ${getGroupColor(q)}30`,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:14,fontWeight:700,color:getGroupColor(q),width:22}}>
                    {chapters.filter(c=>c.group===q).length}
                  </span>
                  <span style={{fontSize:10,color:T.textMuted}}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          {selected && <Detail ch={selected} onClose={()=>setSelected(null)}/>}
        </div>

        {/* RIGHT: Evolution + Top-10 */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:12,padding:16}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:T.text}}>Accuracy Evolution</div>
                <div style={{fontSize:10,color:T.textMuted}}>8-week rolling · compare up to 3 chapters</div>
              </div>
              <TrendingUp size={15} color={T.blue}/>
            </div>
            <Evolution chapters={top10}/>
          </div>

          <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:12,padding:16,flex:1}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:T.text}}>Rolling Top-10</div>
                <div style={{fontSize:10,color:T.textMuted}}>score = weight × (4 − accuracy/25)</div>
              </div>
              <button style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:6,
                padding:"5px 7px",cursor:"pointer",color:T.textMuted,display:"flex",alignItems:"center"}}>
                <RefreshCw size={11}/>
              </button>
            </div>
            {top10.map((ch,i)=>(
              <Top10Row key={ch.id} ch={ch} rank={i+1}
                onSelect={c=>setSelected(s=>s?.id===c.id?null:c)} selected={selected}/>
            ))}
            <div style={{display:"flex",gap:8,marginTop:12,paddingTop:12,borderTop:`1px solid ${T.border}`}}>
              {[["CSV",T.textMuted,T.border,"transparent"],["PDF",T.textMuted,T.border,"transparent"],["Google Cal",T.blue,`${T.blue}44`,`${T.blue}15`]].map(([l,c,b,bg])=>(
                <button key={l} style={{flex:1,padding:"8px",borderRadius:6,border:`1px solid ${b}`,
                  background:bg,color:c,fontSize:11,cursor:"pointer",
                  display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                  {l==="Google Cal"?<Calendar size={12}/>:<Download size={12}/>} {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* IMPORT MODAL */}
      {importOpen&&(
        <div style={{position:"fixed",inset:0,background:"#000000AA",zIndex:200,
          display:"flex",alignItems:"center",justifyContent:"center",padding:20}}
          onClick={()=>setImportOpen(false)}>
          <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,
            padding:24,width:"100%",maxWidth:480,boxShadow:"0 24px 60px #000D"}}
            onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <div style={{fontSize:15,fontWeight:700}}>Import Mock Results</div>
              <button onClick={()=>setImportOpen(false)} style={{background:"none",border:"none",cursor:"pointer",color:T.textMuted}}><X size={16}/></button>
            </div>
            <div style={{fontSize:11,color:T.textMuted,marginBottom:8}}>Paste your JSON data:</div>
            <textarea
              value={importText}
              onChange={e=>setImportText(e.target.value)}
              placeholder={`Paste JSON here, e.g.:\n{\n  "mocks": [\n    {"week":"2026-03-01","chapterId":"bio1","correct":1,"time_sec":70}\n  ]\n}`}
              style={{width:"100%",height:140,background:T.bg2,border:`1px solid ${T.border}`,
                borderRadius:8,padding:12,color:T.text,fontSize:11,resize:"vertical",
                fontFamily:"monospace",boxSizing:"border-box",outline:"none",marginBottom:12}}/>
            {importMsg&&<div style={{padding:"8px 12px",borderRadius:6,marginBottom:12,fontSize:12,
              background:importMsg.startsWith("✅")?T.greenDim:T.redDim,
              color:importMsg.startsWith("✅")?T.green:T.red}}>{importMsg}</div>}
            <div style={{fontSize:10,color:T.textDim,marginBottom:12}}>
              Supports: full chapter array, or mock results array (auto-updates accuracy + quadrant)
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={handleImport} style={{flex:1,padding:"10px",borderRadius:8,border:"none",
                background:T.amber,color:"#000",fontWeight:700,fontSize:13,cursor:"pointer"}}>
                Import & Refresh
              </button>
              <button onClick={()=>setImportOpen(false)} style={{padding:"10px 14px",borderRadius:8,
                border:`1px solid ${T.border}`,background:"transparent",color:T.textMuted,cursor:"pointer"}}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:${T.bg1}}
        ::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}
        @media(max-width:700px){
          .main-grid{grid-template-columns:1fr!important}
        }
      `}</style>
    </div>
  );
}
import React, { useState, useEffect, useRef } from "react";
import { Zap, TrendingUp, AlertTriangle, CheckCircle2, Clock, Target, Download, Upload, Calendar, X, RefreshCw, Star, Plus, Edit3, Save, Search, ChevronDown, ChevronUp } from "lucide-react";
import { SpeedInsights } from '@vercel/speed-insights/react';

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

// ── AUTO QUADRANT CALCULATOR ─────────────────────────────────────────────────
function calcGroup(weight, accuracy) {
  if (weight >= 2 && accuracy < 65) return "Q1";
  if (weight >= 2 && accuracy >= 65) return "Q2";
  if (weight < 2 && accuracy < 65) return "Q3";
  return "Q4";
}

// ── REAL NEET CHAPTERS (Full syllabus) ──────────────────────────────────────
// weight: 3=high (5+ Qs most years), 2=medium (2-4 Qs), 1=low (0-2 Qs)
// pyqs: approximate questions from last 20 years of NEET/AIPMT
const DEFAULT_CHAPTERS = [
  // ── BIOLOGY: BOTANY ──────────────────────────────────────────────────────
  {id:"bot1", name:"The Living World", subject:"Biology", topic:"Botany", weight:1, accuracy:70, errors:2, pyqs:6},
  {id:"bot2", name:"Biological Classification", subject:"Biology", topic:"Botany", weight:2, accuracy:60, errors:5, pyqs:18},
  {id:"bot3", name:"Plant Kingdom", subject:"Biology", topic:"Botany", weight:2, accuracy:55, errors:7, pyqs:22},
  {id:"bot4", name:"Morphology of Flowering Plants", subject:"Biology", topic:"Botany", weight:2, accuracy:60, errors:6, pyqs:20},
  {id:"bot5", name:"Anatomy of Flowering Plants", subject:"Biology", topic:"Botany", weight:2, accuracy:60, errors:5, pyqs:16},
  {id:"bot6", name:"Cell: The Unit of Life", subject:"Biology", topic:"Botany", weight:3, accuracy:50, errors:10, pyqs:32},
  {id:"bot7", name:"Cell Cycle & Cell Division", subject:"Biology", topic:"Botany", weight:3, accuracy:50, errors:10, pyqs:28},
  {id:"bot8", name:"Biomolecules", subject:"Biology", topic:"Botany", weight:2, accuracy:55, errors:7, pyqs:20},
  {id:"bot9", name:"Photosynthesis in Higher Plants", subject:"Biology", topic:"Botany", weight:3, accuracy:55, errors:8, pyqs:26},
  {id:"bot10", name:"Respiration in Plants", subject:"Biology", topic:"Botany", weight:2, accuracy:55, errors:6, pyqs:18},
  {id:"bot11", name:"Plant Growth & Development", subject:"Biology", topic:"Botany", weight:2, accuracy:60, errors:5, pyqs:14},
  {id:"bot12", name:"Mineral Nutrition", subject:"Biology", topic:"Botany", weight:1, accuracy:65, errors:3, pyqs:10},
  {id:"bot13", name:"Transport in Plants", subject:"Biology", topic:"Botany", weight:2, accuracy:60, errors:5, pyqs:16},
  {id:"bot14", name:"Sexual Reproduction in Flowering Plants", subject:"Biology", topic:"Botany", weight:3, accuracy:50, errors:9, pyqs:30},
  {id:"bot15", name:"Strategies for Enhancement in Food Production", subject:"Biology", topic:"Botany", weight:1, accuracy:65, errors:3, pyqs:8},
  {id:"bot16", name:"Microbes in Human Welfare", subject:"Biology", topic:"Botany", weight:1, accuracy:65, errors:3, pyqs:8},
  {id:"bot17", name:"Biotechnology: Principles & Processes", subject:"Biology", topic:"Botany", weight:2, accuracy:50, errors:9, pyqs:18},
  {id:"bot18", name:"Biotechnology & Its Applications", subject:"Biology", topic:"Botany", weight:2, accuracy:50, errors:9, pyqs:16},
  {id:"bot19", name:"Organisms & Populations", subject:"Biology", topic:"Botany", weight:2, accuracy:55, errors:7, pyqs:20},
  {id:"bot20", name:"Ecosystem", subject:"Biology", topic:"Botany", weight:2, accuracy:55, errors:7, pyqs:18},
  {id:"bot21", name:"Biodiversity & Conservation", subject:"Biology", topic:"Botany", weight:2, accuracy:60, errors:5, pyqs:16},
  {id:"bot22", name:"Environmental Issues", subject:"Biology", topic:"Botany", weight:1, accuracy:65, errors:3, pyqs:8},

  // ── BIOLOGY: ZOOLOGY ─────────────────────────────────────────────────────
  {id:"zoo1", name:"Animal Kingdom", subject:"Biology", topic:"Zoology", weight:3, accuracy:50, errors:10, pyqs:28},
  {id:"zoo2", name:"Structural Organisation in Animals", subject:"Biology", topic:"Zoology", weight:1, accuracy:65, errors:3, pyqs:8},
  {id:"zoo3", name:"Digestion & Absorption", subject:"Biology", topic:"Zoology", weight:2, accuracy:55, errors:7, pyqs:18},
  {id:"zoo4", name:"Breathing & Exchange of Gases", subject:"Biology", topic:"Zoology", weight:2, accuracy:55, errors:7, pyqs:14},
  {id:"zoo5", name:"Body Fluids & Circulation", subject:"Biology", topic:"Zoology", weight:2, accuracy:50, errors:9, pyqs:20},
  {id:"zoo6", name:"Excretory Products & Elimination", subject:"Biology", topic:"Zoology", weight:2, accuracy:50, errors:9, pyqs:18},
  {id:"zoo7", name:"Locomotion & Movement", subject:"Biology", topic:"Zoology", weight:2, accuracy:60, errors:5, pyqs:14},
  {id:"zoo8", name:"Neural Control & Coordination", subject:"Biology", topic:"Zoology", weight:3, accuracy:45, errors:12, pyqs:24},
  {id:"zoo9", name:"Chemical Coordination & Integration", subject:"Biology", topic:"Zoology", weight:3, accuracy:45, errors:12, pyqs:26},
  {id:"zoo10", name:"Human Reproduction", subject:"Biology", topic:"Zoology", weight:2, accuracy:55, errors:7, pyqs:20},
  {id:"zoo11", name:"Reproductive Health", subject:"Biology", topic:"Zoology", weight:1, accuracy:65, errors:3, pyqs:10},
  {id:"zoo12", name:"Principles of Inheritance & Variation", subject:"Biology", topic:"Zoology", weight:3, accuracy:45, errors:12, pyqs:34},
  {id:"zoo13", name:"Molecular Basis of Inheritance", subject:"Biology", topic:"Zoology", weight:3, accuracy:45, errors:12, pyqs:32},
  {id:"zoo14", name:"Evolution", subject:"Biology", topic:"Zoology", weight:2, accuracy:60, errors:5, pyqs:16},
  {id:"zoo15", name:"Human Health & Disease", subject:"Biology", topic:"Zoology", weight:2, accuracy:60, errors:5, pyqs:20},

  // ── CHEMISTRY ────────────────────────────────────────────────────────────
  {id:"ch1", name:"Some Basic Concepts of Chemistry", subject:"Chemistry", topic:"Physical", weight:1, accuracy:65, errors:3, pyqs:8},
  {id:"ch2", name:"Structure of Atom", subject:"Chemistry", topic:"Physical", weight:2, accuracy:55, errors:7, pyqs:18},
  {id:"ch3", name:"Classification of Elements & Periodicity", subject:"Chemistry", topic:"Inorganic", weight:2, accuracy:55, errors:7, pyqs:18},
  {id:"ch4", name:"Chemical Bonding & Molecular Structure", subject:"Chemistry", topic:"Physical", weight:3, accuracy:45, errors:12, pyqs:30},
  {id:"ch5", name:"States of Matter", subject:"Chemistry", topic:"Physical", weight:1, accuracy:65, errors:3, pyqs:10},
  {id:"ch6", name:"Thermodynamics", subject:"Chemistry", topic:"Physical", weight:2, accuracy:50, errors:9, pyqs:20},
  {id:"ch7", name:"Equilibrium", subject:"Chemistry", topic:"Physical", weight:2, accuracy:50, errors:9, pyqs:22},
  {id:"ch8", name:"Redox Reactions", subject:"Chemistry", topic:"Physical", weight:1, accuracy:65, errors:3, pyqs:8},
  {id:"ch9", name:"Hydrogen & s-Block Elements", subject:"Chemistry", topic:"Inorganic", weight:1, accuracy:65, errors:3, pyqs:10},
  {id:"ch10", name:"p-Block Elements (Groups 13-14)", subject:"Chemistry", topic:"Inorganic", weight:2, accuracy:50, errors:9, pyqs:18},
  {id:"ch11", name:"p-Block Elements (Groups 15-18)", subject:"Chemistry", topic:"Inorganic", weight:3, accuracy:45, errors:12, pyqs:28},
  {id:"ch12", name:"d & f Block Elements", subject:"Chemistry", topic:"Inorganic", weight:2, accuracy:50, errors:9, pyqs:20},
  {id:"ch13", name:"Coordination Compounds", subject:"Chemistry", topic:"Inorganic", weight:2, accuracy:45, errors:11, pyqs:22},
  {id:"ch14", name:"Solutions", subject:"Chemistry", topic:"Physical", weight:2, accuracy:55, errors:7, pyqs:18},
  {id:"ch15", name:"Electrochemistry", subject:"Chemistry", topic:"Physical", weight:2, accuracy:50, errors:9, pyqs:20},
  {id:"ch16", name:"Chemical Kinetics", subject:"Chemistry", topic:"Physical", weight:2, accuracy:55, errors:7, pyqs:18},
  {id:"ch17", name:"Surface Chemistry", subject:"Chemistry", topic:"Physical", weight:1, accuracy:65, errors:3, pyqs:8},
  {id:"ch18", name:"GOC & IUPAC Nomenclature", subject:"Chemistry", topic:"Organic", weight:3, accuracy:45, errors:12, pyqs:26},
  {id:"ch19", name:"Hydrocarbons", subject:"Chemistry", topic:"Organic", weight:2, accuracy:55, errors:7, pyqs:18},
  {id:"ch20", name:"Haloalkanes & Haloarenes", subject:"Chemistry", topic:"Organic", weight:2, accuracy:50, errors:9, pyqs:18},
  {id:"ch21", name:"Alcohols, Phenols & Ethers", subject:"Chemistry", topic:"Organic", weight:2, accuracy:50, errors:9, pyqs:20},
  {id:"ch22", name:"Aldehydes, Ketones & Carboxylic Acids", subject:"Chemistry", topic:"Organic", weight:3, accuracy:45, errors:12, pyqs:28},
  {id:"ch23", name:"Organic Compounds with Nitrogen (Amines)", subject:"Chemistry", topic:"Organic", weight:1, accuracy:60, errors:5, pyqs:12},
  {id:"ch24", name:"Biomolecules", subject:"Chemistry", topic:"Organic", weight:2, accuracy:55, errors:7, pyqs:16},
  {id:"ch25", name:"Polymers", subject:"Chemistry", topic:"Organic", weight:1, accuracy:70, errors:2, pyqs:8},
  {id:"ch26", name:"Chemistry in Everyday Life", subject:"Chemistry", topic:"Organic", weight:1, accuracy:70, errors:2, pyqs:6},
  {id:"ch27", name:"Environmental Chemistry", subject:"Chemistry", topic:"Physical", weight:1, accuracy:70, errors:2, pyqs:6},

  // ── PHYSICS ──────────────────────────────────────────────────────────────
  {id:"ph1", name:"Physical World & Units", subject:"Physics", topic:"Mechanics", weight:1, accuracy:70, errors:2, pyqs:5},
  {id:"ph2", name:"Kinematics (Motion in Straight Line & Plane)", subject:"Physics", topic:"Mechanics", weight:2, accuracy:55, errors:7, pyqs:22},
  {id:"ph3", name:"Laws of Motion", subject:"Physics", topic:"Mechanics", weight:3, accuracy:50, errors:10, pyqs:28},
  {id:"ph4", name:"Work, Energy & Power", subject:"Physics", topic:"Mechanics", weight:2, accuracy:55, errors:7, pyqs:20},
  {id:"ph5", name:"System of Particles & Rotational Motion", subject:"Physics", topic:"Mechanics", weight:2, accuracy:45, errors:11, pyqs:20},
  {id:"ph6", name:"Gravitation", subject:"Physics", topic:"Mechanics", weight:2, accuracy:60, errors:5, pyqs:16},
  {id:"ph7", name:"Mechanical Properties of Solids & Fluids", subject:"Physics", topic:"Mechanics", weight:1, accuracy:60, errors:4, pyqs:12},
  {id:"ph8", name:"Thermal Properties & Thermodynamics", subject:"Physics", topic:"Mechanics", weight:2, accuracy:50, errors:9, pyqs:20},
  {id:"ph9", name:"Kinetic Theory of Gases", subject:"Physics", topic:"Mechanics", weight:1, accuracy:60, errors:4, pyqs:10},
  {id:"ph10", name:"Oscillations (SHM)", subject:"Physics", topic:"Mechanics", weight:2, accuracy:55, errors:7, pyqs:18},
  {id:"ph11", name:"Waves", subject:"Physics", topic:"Mechanics", weight:2, accuracy:55, errors:7, pyqs:16},
  {id:"ph12", name:"Electrostatics", subject:"Physics", topic:"Electricity", weight:3, accuracy:40, errors:14, pyqs:32},
  {id:"ph13", name:"Current Electricity", subject:"Physics", topic:"Electricity", weight:3, accuracy:40, errors:14, pyqs:30},
  {id:"ph14", name:"Moving Charges & Magnetism", subject:"Physics", topic:"Electricity", weight:2, accuracy:50, errors:9, pyqs:20},
  {id:"ph15", name:"Magnetism & Matter", subject:"Physics", topic:"Electricity", weight:1, accuracy:60, errors:4, pyqs:10},
  {id:"ph16", name:"Electromagnetic Induction", subject:"Physics", topic:"Electricity", weight:2, accuracy:50, errors:9, pyqs:18},
  {id:"ph17", name:"Alternating Current", subject:"Physics", topic:"Electricity", weight:2, accuracy:50, errors:9, pyqs:16},
  {id:"ph18", name:"Electromagnetic Waves", subject:"Physics", topic:"Electricity", weight:1, accuracy:65, errors:3, pyqs:8},
  {id:"ph19", name:"Ray Optics & Optical Instruments", subject:"Physics", topic:"Optics", weight:3, accuracy:45, errors:12, pyqs:28},
  {id:"ph20", name:"Wave Optics", subject:"Physics", topic:"Optics", weight:2, accuracy:50, errors:9, pyqs:18},
  {id:"ph21", name:"Dual Nature of Radiation & Matter", subject:"Physics", topic:"Modern", weight:2, accuracy:55, errors:7, pyqs:16},
  {id:"ph22", name:"Atoms", subject:"Physics", topic:"Modern", weight:2, accuracy:55, errors:7, pyqs:14},
  {id:"ph23", name:"Nuclei", subject:"Physics", topic:"Modern", weight:2, accuracy:55, errors:7, pyqs:14},
  {id:"ph24", name:"Semiconductor Devices & Logic Gates", subject:"Physics", topic:"Modern", weight:2, accuracy:50, errors:8, pyqs:16},
];

// Apply group calculation to default data
const INIT_CHAPTERS = DEFAULT_CHAPTERS.map(c => ({
  ...c,
  group: calcGroup(c.weight, c.accuracy),
}));

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

// ── SVG LINE CHART ───────────────────────────────────────────────────────────
function LineChartSVG({ series, width=400, height=130, yMin=20, yMax=100 }) {
  const PAD = { top:10, right:10, bottom:22, left:30 };
  const W = width - PAD.left - PAD.right;
  const H = height - PAD.top - PAD.bottom;
  const toX = i => PAD.left + (i / (WEEKS.length-1)) * W;
  const toY = v => PAD.top + H - ((v - yMin) / (yMax - yMin)) * H;
  const [tip, setTip] = useState(null);
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{overflow:"visible"}}>
      {[20,40,60,80,100].map(v => (
        <line key={v} x1={PAD.left} x2={PAD.left+W} y1={toY(v)} y2={toY(v)} stroke={T.border} strokeWidth="1" strokeDasharray="3,3"/>
      ))}
      {[20,50,80,100].map(v => (
        <text key={v} x={PAD.left-4} y={toY(v)+3} fill={T.textDim} fontSize="8" textAnchor="end">{v}</text>
      ))}
      {WEEKS.map((w,i) => (
        <text key={w} x={toX(i)} y={height-4} fill={T.textDim} fontSize="8" textAnchor="middle">{w}</text>
      ))}
      <line x1={PAD.left} x2={PAD.left+W} y1={toY(70)} y2={toY(70)} stroke={T.green} strokeWidth="1" strokeDasharray="5,4" strokeOpacity="0.5"/>
      <text x={PAD.left+W+2} y={toY(70)+3} fill={T.green} fontSize="7" fillOpacity="0.7">70%</text>
      {series.map((s,si) => {
        const pts = s.data.map((d,i) => `${toX(i)},${toY(d.accuracy)}`).join(" ");
        return (
          <g key={s.id}>
            <polyline points={pts} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {s.data.map((d,i) => (
              <circle key={i} cx={toX(i)} cy={toY(d.accuracy)} r="3.5" fill={s.color} stroke={T.bg1} strokeWidth="1.5" style={{cursor:"pointer"}}
                onMouseEnter={() => setTip({x:toX(i),y:toY(d.accuracy),d,name:s.name,color:s.color})}
                onMouseLeave={() => setTip(null)}/>
            ))}
          </g>
        );
      })}
      {tip && (
        <g>
          <rect x={Math.min(tip.x+8,width-90)} y={tip.y-36} width="84" height="34" rx="4" fill={T.bg1} stroke={tip.color} strokeWidth="1" strokeOpacity="0.8"/>
          <text x={Math.min(tip.x+14,width-84)} y={tip.y-22} fill={T.text} fontSize="9" fontWeight="700">{tip.name}</text>
          <text x={Math.min(tip.x+14,width-84)} y={tip.y-10} fill={tip.color} fontSize="9">{tip.d.week}: {tip.d.accuracy}%</text>
        </g>
      )}
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
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",overflow:"visible",cursor:"crosshair"}} onMouseLeave={()=>setTooltip(null)}>
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
            <rect x={q.x} y={q.y} width={q.w} height={q.h} fill={`url(#qg${i})`} stroke={q.color} strokeOpacity="0.2" strokeWidth="1"/>
            <text x={q.lx} y={q.ly} fill={q.color} fillOpacity="0.4" fontSize="8" textAnchor={q.anchor} fontWeight="800" letterSpacing="1.5">{q.label}</text>
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
          const r=5+ch.errors*0.35;
          const color=getGroupColor(ch.group);
          const isSel=selected?.id===ch.id;
          return (
            <g key={ch.id} onClick={()=>onSelect(ch)} style={{cursor:"pointer"}}
              onMouseEnter={()=>setTooltip({ch,x,y})} onMouseLeave={()=>setTooltip(null)}>
              <circle cx={x} cy={y} r={r+6} fill={color} fillOpacity="0.07"/>
              <circle cx={x} cy={y} r={r} fill={color} fillOpacity={isSel?1:0.65} stroke={isSel?"#fff":color} strokeWidth={isSel?2:0.5}/>
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
              <rect x={tx} y={ty} width="142" height="58" rx="5" fill={T.bg1} stroke={col} strokeWidth="1" strokeOpacity="0.9"/>
              <text x={tx+10} y={ty+15} fill={T.text} fontSize="10" fontWeight="700">{ch.name.length>22?ch.name.slice(0,22)+"…":ch.name}</text>
              <text x={tx+10} y={ty+29} fill={T.textMuted} fontSize="8">{`Acc: ${ch.accuracy}%  Wt: ${ch.weight}  Err: ${ch.errors}`}</text>
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
        {chapters.slice(0,8).map(ch => {
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
      <div style={{position:"absolute",left:0,top:0,bottom:0,width:`${pct}%`,background:`linear-gradient(90deg,${color}1A,${color}05)`,transition:"width 0.4s"}}/>
      <div style={{width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:rank<=3?color:T.bg3,color:rank<=3?"#000":T.textMuted,fontSize:11,fontWeight:700,flexShrink:0,zIndex:1}}>
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
function Detail({ ch, onClose, onUpdate }) {
  const [tab, setTab] = useState("plan");
  const [editing, setEditing] = useState(false);
  const [editAcc, setEditAcc] = useState(ch.accuracy);
  const [editErr, setEditErr] = useState(ch.errors);
  const color = getGroupColor(ch.group);
  const score = priorityScore(ch);
  const hist = getHistory(ch);

  function saveEdit() {
    const newGroup = calcGroup(ch.weight, editAcc);
    onUpdate({...ch, accuracy: editAcc, errors: editErr, group: newGroup});
    setEditing(false);
  }

  const plans = {
    Q1:{label:"Daily Microcycles",desc:"PYQs daily + mixed mock every 3 days. Triple revision cycle.",freq:"Daily",target:"≥75%"},
    Q2:{label:"Weekly Maintenance",desc:"One full test per week. Review errors on weekend.",freq:"Weekly",target:"≥80%"},
    Q3:{label:"Corrective Cycle",desc:"One focused session, then deprioritize until score >70%.",freq:"Fortnightly",target:"≥70%"},
    Q4:{label:"Glance Mode",desc:"10-min review every 2–3 weeks. Only PYQ spot-checks.",freq:"Monthly",target:"Maintain"},
  };
  const plan = plans[ch.group];

  return (
    <div style={{background:T.bg1,border:`1px solid ${color}44`,borderRadius:12,overflow:"hidden"}}>
      <div style={{padding:"13px 16px",borderBottom:`1px solid ${T.border}`,background:`linear-gradient(135deg,${getGroupBg(ch.group)}66,transparent)`,display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}>
            <span style={{fontSize:10,padding:"2px 7px",borderRadius:3,background:getGroupBg(ch.group),color,fontWeight:600}}>{ch.group}</span>
            <span style={{fontSize:10,color:SUBJECT_COLORS[ch.subject]}}>{ch.subject}</span>
            {ch.topic && <span style={{fontSize:10,color:T.textDim}}>· {ch.topic}</span>}
          </div>
          <div style={{fontSize:13,fontWeight:700,color:T.text}}>{ch.name}</div>
        </div>
        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>setEditing(e=>!e)} style={{background:editing?`${color}33`:"none",border:`1px solid ${editing?color:T.border}`,cursor:"pointer",color:editing?color:T.textMuted,padding:"4px 8px",borderRadius:6,fontSize:11,display:"flex",alignItems:"center",gap:4}}>
            <Edit3 size={11}/> {editing?"Cancel":"Edit"}
          </button>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:T.textMuted,padding:2}}>
            <X size={14}/>
          </button>
        </div>
      </div>

      {/* Quick inline edit */}
      {editing && (
        <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.border}`,background:`${T.bg2}`,display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
          <div style={{flex:2,minWidth:160}}>
            <div style={{fontSize:10,color:T.textMuted,marginBottom:4}}>Accuracy: <span style={{color,fontWeight:700}}>{editAcc}%</span></div>
            <input type="range" min="0" max="100" value={editAcc} onChange={e=>setEditAcc(Number(e.target.value))}
              style={{width:"100%",accentColor:color}}/>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{fontSize:10,color:T.textMuted}}>Errors:</div>
            <button onClick={()=>setEditErr(e=>Math.max(0,e-1))} style={{width:24,height:24,borderRadius:4,border:`1px solid ${T.border}`,background:T.bg3,color:T.text,cursor:"pointer",fontSize:14}}>−</button>
            <span style={{fontSize:14,fontWeight:700,color:T.red,minWidth:20,textAlign:"center"}}>{editErr}</span>
            <button onClick={()=>setEditErr(e=>e+1)} style={{width:24,height:24,borderRadius:4,border:`1px solid ${T.border}`,background:T.bg3,color:T.text,cursor:"pointer",fontSize:14}}>+</button>
          </div>
          <button onClick={saveEdit} style={{padding:"7px 14px",borderRadius:6,border:"none",background:T.green,color:"#000",fontWeight:700,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
            <Save size={12}/> Save
          </button>
          <div style={{fontSize:10,color:T.textDim}}>New quadrant: <span style={{color:getGroupColor(calcGroup(ch.weight,editAcc)),fontWeight:700}}>{calcGroup(ch.weight,editAcc)}</span></div>
        </div>
      )}

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
          <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"9px",border:"none",borderBottom:`2px solid ${tab===t?color:"transparent"}`,background:"transparent",color:tab===t?color:T.textMuted,fontSize:11,cursor:"pointer",textTransform:"uppercase",letterSpacing:1,transition:"all 0.15s"}}>{t}</button>
        ))}
      </div>

      <div style={{padding:"14px 16px"}}>
        {tab==="plan"&&(
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,padding:11,background:`${getGroupBg(ch.group)}66`,borderRadius:8,border:`1px solid ${color}33`}}>
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
          </div>
        )}
        {tab==="history"&&(
          <div>
            <LineChartSVG series={[{id:ch.id,name:ch.name.split(" ")[0],color,data:hist}]} width={380} height={110}/>
            <div style={{display:"flex",flexDirection:"column",gap:5,marginTop:10}}>
              {hist.slice(-4).map((h,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 10px",background:T.bg2,borderRadius:6,border:`1px solid ${T.border}`}}>
                  <div style={{width:6,height:6,borderRadius:"50%",flexShrink:0,background:h.accuracy>65?T.green:h.accuracy>50?T.amber:T.red}}/>
                  <span style={{fontSize:11,color:T.textMuted,width:36}}>{h.week}</span>
                  <span style={{flex:1,fontSize:11,color:T.textDim}}>Mock result</span>
                  <span style={{fontSize:13,fontWeight:700,color:h.accuracy>65?T.green:h.accuracy>50?T.amber:T.red}}>{h.accuracy}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab==="notes"&&(
          <div>
            <textarea placeholder="Add notes, mnemonics, key formulas, error patterns..."
              style={{width:"100%",minHeight:90,background:T.bg2,border:`1px solid ${T.border}`,borderRadius:8,padding:10,color:T.text,fontSize:12,resize:"vertical",fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/>
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

// ── QUICK LOG MODAL (the main new feature) ───────────────────────────────────
function QuickLog({ chapters, onUpdate, onClose }) {
  const [subject, setSubject] = useState("All");
  const [search, setSearch] = useState("");
  const [showOnly, setShowOnly] = useState("all"); // all | danger | changed
  // local edits: { chapterId: { accuracy, errors } }
  const [edits, setEdits] = useState(
    Object.fromEntries(chapters.map(c => [c.id, { accuracy: c.accuracy, errors: c.errors }]))
  );
  const changedIds = new Set(
    chapters.filter(c => edits[c.id].accuracy !== c.accuracy || edits[c.id].errors !== c.errors).map(c=>c.id)
  );

  const filtered = chapters.filter(c => {
    if (subject !== "All" && c.subject !== subject) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.topic?.toLowerCase().includes(search.toLowerCase())) return false;
    if (showOnly === "danger" && c.group !== "Q1") return false;
    if (showOnly === "changed" && !changedIds.has(c.id)) return false;
    return true;
  }).sort((a,b) => priorityScore(b)-priorityScore(a));

  function setAcc(id, val) { setEdits(e => ({...e, [id]: {...e[id], accuracy: Number(val)}})); }
  function setErr(id, delta) { setEdits(e => ({...e, [id]: {...e[id], errors: Math.max(0, e[id].errors+delta)}})); }

  function handleSave() {
    const updated = chapters.map(c => {
      const {accuracy, errors} = edits[c.id];
      return {...c, accuracy, errors, group: calcGroup(c.weight, accuracy)};
    });
    onUpdate(updated);
    onClose();
  }

  const subjColors = {All:T.blue,Biology:T.green,Chemistry:T.amber,Physics:T.blue};

  return (
    <div style={{position:"fixed",inset:0,background:"#000000BB",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}}
      onClick={onClose}>
      <div style={{background:T.bg1,border:`1px solid ${T.borderHi}`,borderRadius:16,width:"100%",maxWidth:680,maxHeight:"90vh",display:"flex",flexDirection:"column",boxShadow:"0 32px 80px #000E"}}
        onClick={e=>e.stopPropagation()}>

        {/* Header */}
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
          <div style={{width:34,height:34,borderRadius:8,background:`linear-gradient(135deg,${T.amber},${T.red})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Edit3 size={16} color="#000"/>
          </div>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:T.text}}>Quick Log</div>
            <div style={{fontSize:11,color:T.textMuted}}>Update accuracy & errors after each mock/practice</div>
          </div>
          <div style={{flex:1}}/>
          {changedIds.size > 0 && (
            <div style={{fontSize:12,color:T.amber,background:T.amberDim,padding:"4px 10px",borderRadius:6}}>
              {changedIds.size} changed
            </div>
          )}
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:T.textMuted}}><X size={18}/></button>
        </div>

        {/* Filters */}
        <div style={{padding:"12px 20px",borderBottom:`1px solid ${T.border}`,display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",flexShrink:0}}>
          {/* Subject tabs */}
          <div style={{display:"flex",gap:4}}>
            {["All","Biology","Chemistry","Physics"].map(s=>(
              <button key={s} onClick={()=>setSubject(s)} style={{
                padding:"5px 10px",borderRadius:6,border:"none",fontSize:11,cursor:"pointer",
                background:subject===s?`${(SUBJECT_COLORS[s]||T.blue)}22`:"transparent",
                color:subject===s?(SUBJECT_COLORS[s]||T.blue):T.textMuted,
                outline:`1px solid ${subject===s?(SUBJECT_COLORS[s]||T.blue):T.border}`,
              }}>{s}</button>
            ))}
          </div>
          {/* Show filter */}
          <div style={{display:"flex",gap:4}}>
            {[["all","All"],["danger","⚡ Danger"],["changed","✏️ Changed"]].map(([v,l])=>(
              <button key={v} onClick={()=>setShowOnly(v)} style={{
                padding:"5px 10px",borderRadius:6,border:"none",fontSize:11,cursor:"pointer",
                background:showOnly===v?`${T.red}22`:"transparent",
                color:showOnly===v?T.red:T.textMuted,
                outline:`1px solid ${showOnly===v?T.red:T.border}`,
              }}>{l}</button>
            ))}
          </div>
          {/* Search */}
          <div style={{flex:1,minWidth:120,display:"flex",alignItems:"center",gap:7,background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"5px 10px"}}>
            <Search size={12} color={T.textDim}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search chapter..."
              style={{background:"none",border:"none",outline:"none",color:T.text,fontSize:12,width:"100%"}}/>
          </div>
          <span style={{fontSize:11,color:T.textDim}}>{filtered.length} chapters</span>
        </div>

        {/* Chapter list */}
        <div style={{flex:1,overflowY:"auto",padding:"8px 20px"}}>
          {filtered.map(ch => {
            const ed = edits[ch.id];
            const color = getGroupColor(calcGroup(ch.weight, ed.accuracy));
            const changed = changedIds.has(ch.id);
            return (
              <div key={ch.id} style={{
                display:"flex",alignItems:"center",gap:12,padding:"10px 12px",
                marginBottom:5,borderRadius:8,
                border:`1px solid ${changed?color+"44":T.border}`,
                background:changed?`${getGroupBg(calcGroup(ch.weight,ed.accuracy))}55`:T.bg2,
                transition:"all 0.2s",
              }}>
                {/* Chapter info */}
                <div style={{width:190,flexShrink:0}}>
                  <div style={{fontSize:12,fontWeight:600,color:T.text,lineHeight:1.2,marginBottom:2}}>
                    {ch.name.length>28?ch.name.slice(0,28)+"…":ch.name}
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <span style={{fontSize:10,color:SUBJECT_COLORS[ch.subject]}}>{ch.topic||ch.subject}</span>
                    <span style={{fontSize:9,padding:"1px 5px",borderRadius:3,background:getGroupBg(calcGroup(ch.weight,ed.accuracy)),color,fontWeight:600}}>{calcGroup(ch.weight,ed.accuracy)}</span>
                  </div>
                </div>

                {/* Accuracy slider */}
                <div style={{flex:1,minWidth:120}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:10,color:T.textMuted}}>Accuracy</span>
                    <span style={{fontSize:12,fontWeight:700,color,minWidth:36,textAlign:"right"}}>{ed.accuracy}%</span>
                  </div>
                  <input type="range" min="0" max="100" step="1" value={ed.accuracy}
                    onChange={e=>setAcc(ch.id, e.target.value)}
                    style={{width:"100%",accentColor:color,cursor:"pointer"}}/>
                </div>

                {/* Errors counter */}
                <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                  <span style={{fontSize:10,color:T.textMuted,width:32}}>Err:</span>
                  <button onClick={()=>setErr(ch.id,-1)} style={{width:22,height:22,borderRadius:4,border:`1px solid ${T.border}`,background:T.bg3,color:T.text,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>−</button>
                  <span style={{fontSize:14,fontWeight:700,color:T.red,minWidth:22,textAlign:"center"}}>{ed.errors}</span>
                  <button onClick={()=>setErr(ch.id,+1)} style={{width:22,height:22,borderRadius:4,border:`1px solid ${T.border}`,background:T.bg3,color:T.text,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>+</button>
                </div>

                {/* Reset button if changed */}
                {changed && (
                  <button onClick={()=>setEdits(e=>({...e,[ch.id]:{accuracy:ch.accuracy,errors:ch.errors}}))}
                    style={{background:"none",border:`1px solid ${T.border}`,borderRadius:4,cursor:"pointer",color:T.textDim,padding:"3px 5px"}}>
                    <RefreshCw size={10}/>
                  </button>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{textAlign:"center",padding:"40px 20px",color:T.textDim}}>No chapters match the filter</div>
          )}
        </div>

        {/* Footer */}
        <div style={{padding:"12px 20px",borderTop:`1px solid ${T.border}`,display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
          <div style={{flex:1,fontSize:11,color:T.textMuted}}>
            {changedIds.size > 0 ? `${changedIds.size} chapter(s) updated · quadrants auto-recalculated` : "Adjust sliders to log your latest scores"}
          </div>
          <button onClick={onClose} style={{padding:"9px 16px",borderRadius:8,border:`1px solid ${T.border}`,background:"transparent",color:T.textMuted,fontSize:12,cursor:"pointer"}}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={changedIds.size===0} style={{
            padding:"9px 20px",borderRadius:8,border:"none",
            background:changedIds.size>0?T.amber:"transparent",
            color:changedIds.size>0?"#000":T.textDim,
            fontWeight:700,fontSize:13,cursor:changedIds.size>0?"pointer":"not-allowed",
            outline:changedIds.size===0?`1px solid ${T.border}`:"none",
            transition:"all 0.2s",
          }}>
            Save {changedIds.size > 0 ? `(${changedIds.size})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── IMPORT MODAL ─────────────────────────────────────────────────────────────
function ImportModal({ onImport, onClose }) {
  const [importText, setImportText] = useState("");
  const [importMsg, setImportMsg] = useState("");
  return (
    <div style={{position:"fixed",inset:0,background:"#000000AA",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}
      onClick={onClose}>
      <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:24,width:"100%",maxWidth:480,boxShadow:"0 24px 60px #000D"}}
        onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <div style={{fontSize:15,fontWeight:700}}>Import Mock Results (JSON)</div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:T.textMuted}}><X size={16}/></button>
        </div>
        <div style={{fontSize:11,color:T.textMuted,marginBottom:8}}>Paste JSON:</div>
        <textarea value={importText} onChange={e=>setImportText(e.target.value)}
          placeholder={`{"mocks":[{"chapterId":"ph12","correct":7,"total":10}]}`}
          style={{width:"100%",height:120,background:T.bg2,border:`1px solid ${T.border}`,borderRadius:8,padding:12,color:T.text,fontSize:11,resize:"vertical",fontFamily:"monospace",boxSizing:"border-box",outline:"none",marginBottom:12}}/>
        {importMsg&&<div style={{padding:"8px 12px",borderRadius:6,marginBottom:12,fontSize:12,background:importMsg.startsWith("✅")?T.greenDim:T.redDim,color:importMsg.startsWith("✅")?T.green:T.red}}>{importMsg}</div>}
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>onImport(importText, setImportMsg)} style={{flex:1,padding:"10px",borderRadius:8,border:"none",background:T.amber,color:"#000",fontWeight:700,fontSize:13,cursor:"pointer"}}>Import & Refresh</button>
          <button onClick={onClose} style={{padding:"10px 14px",borderRadius:8,border:`1px solid ${T.border}`,background:"transparent",color:T.textMuted,cursor:"pointer"}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────
const STORAGE_KEY = "neet_mission_chapters_v2";
const EXAM_DATE_KEY = "neet_mission_exam_date";

function calcDaysLeft(dateStr) {
  if (!dateStr) return null;
  const exam = new Date(dateStr);
  exam.setHours(0,0,0,0);
  const today = new Date();
  today.setHours(0,0,0,0);
  const diff = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
  return diff;
}

function getUrgencyColor(days) {
  if (days === null) return T.textDim;
  if (days <= 30) return T.red;
  if (days <= 60) return T.amber;
  return T.green;
}

// ── EXAM DATE PICKER MODAL ───────────────────────────────────────────────────
function ExamDateModal({ current, onSave, onClose }) {
  const [val, setVal] = useState(current || "");
  return (
    <div style={{position:"fixed",inset:0,background:"#000000BB",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}
      onClick={onClose}>
      <div style={{background:T.bg1,border:`1px solid ${T.borderHi}`,borderRadius:16,padding:28,width:"100%",maxWidth:380,boxShadow:"0 32px 80px #000E"}}
        onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
          <div style={{width:36,height:36,borderRadius:9,background:`linear-gradient(135deg,${T.amber},${T.red})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Calendar size={18} color="#000"/>
          </div>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:T.text}}>Set NEET Exam Date</div>
            <div style={{fontSize:11,color:T.textMuted}}>Countdown updates automatically every day</div>
          </div>
        </div>

        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,color:T.textMuted,marginBottom:8}}>Select your exam date:</div>
          <input
            type="date"
            value={val}
            min={new Date().toISOString().split("T")[0]}
            onChange={e=>setVal(e.target.value)}
            style={{
              width:"100%",padding:"12px 14px",borderRadius:8,
              border:`1px solid ${val?T.amber:T.border}`,
              background:T.bg2,color:T.text,fontSize:15,
              outline:"none",cursor:"pointer",
              colorScheme:"dark",
            }}
          />
        </div>

        {val && (()=>{
          const days = calcDaysLeft(val);
          const col = getUrgencyColor(days);
          const msg = days < 0 ? "Exam date has passed!" :
                      days === 0 ? "🎯 Exam is TODAY!" :
                      days <= 30 ? "⚡ Final sprint! Push hard every day." :
                      days <= 60 ? "🔥 Two months left. Stay consistent." :
                      "📅 Good — use this time strategically.";
          return (
            <div style={{padding:"12px 16px",borderRadius:8,background:getGroupBg("Q1"),border:`1px solid ${col}44`,marginBottom:16,textAlign:"center"}}>
              <div style={{fontSize:32,fontWeight:800,color:col,letterSpacing:-1}}>{days < 0 ? "—" : days}</div>
              <div style={{fontSize:12,color:T.textMuted}}>days remaining</div>
              <div style={{fontSize:11,color:col,marginTop:6}}>{msg}</div>
            </div>
          );
        })()}

        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>{onSave(val);onClose();}} disabled={!val} style={{
            flex:1,padding:"11px",borderRadius:8,border:"none",
            background:val?T.amber:"transparent",
            color:val?"#000":T.textDim,
            fontWeight:700,fontSize:13,cursor:val?"pointer":"not-allowed",
            outline:!val?`1px solid ${T.border}`:"none",
          }}>Set Date</button>
          <button onClick={onClose} style={{padding:"11px 16px",borderRadius:8,border:`1px solid ${T.border}`,background:"transparent",color:T.textMuted,cursor:"pointer"}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // Load from localStorage on first render
  const [chapters, setChapters] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch(e) {}
    return INIT_CHAPTERS;
  });

  // Save to localStorage whenever chapters change
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(chapters)); } catch(e) {}
  }, [chapters]);

  // Exam date — persisted in localStorage
  const [examDate, setExamDate] = useState(() => {
    try { return localStorage.getItem(EXAM_DATE_KEY) || ""; } catch(e) { return ""; }
  });
  const [examDateOpen, setExamDateOpen] = useState(false);

  function saveExamDate(d) {
    setExamDate(d);
    try { localStorage.setItem(EXAM_DATE_KEY, d); } catch(e) {}
  }

  const daysLeft = calcDaysLeft(examDate);
  const urgencyColor = getUrgencyColor(daysLeft);

  const [subject, setSubject] = useState("All");
  const [selected, setSelected] = useState(null);
  const [quickLogOpen, setQuickLogOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const top10 = [...chapters].sort((a,b)=>priorityScore(b)-priorityScore(a)).slice(0,10);
  const danger = chapters.filter(c=>c.group==="Q1").length;
  const avgAcc = Math.round(chapters.reduce((s,c)=>s+c.accuracy,0)/chapters.length);

  function updateChapter(updated) {
    setChapters(prev => prev.map(c => c.id===updated.id ? updated : c));
    setSelected(updated);
  }

  function handleImport(text, setMsg) {
    try {
      const data = JSON.parse(text);
      if (data.chapters) {
        const withGroups = data.chapters.map(c=>({...c, group:calcGroup(c.weight,c.accuracy)}));
        setChapters(withGroups);
        setMsg("✅ Chapters imported!");
      } else if (data.mocks) {
        setChapters(prev => prev.map(c => {
          const m = data.mocks.find(x=>x.chapterId===c.id);
          if (!m) return c;
          const accuracy = m.total ? Math.round((m.correct/m.total)*100) : m.accuracy ?? c.accuracy;
          const errors = m.total ? (m.total - m.correct) : m.errors ?? c.errors;
          return {...c, accuracy, errors, group: calcGroup(c.weight, accuracy)};
        }));
        setMsg(`✅ Updated ${data.mocks.length} chapters from mock!`);
      }
      setTimeout(() => { setImportOpen(false); }, 1800);
    } catch(e) { setMsg("❌ Invalid JSON."); }
  }

  function resetToDefault() {
    if (window.confirm("Reset all data to defaults? This cannot be undone.")) {
      setChapters(INIT_CHAPTERS);
      setSelected(null);
    }
  }

  return (
    <div style={{minHeight:"100vh",background:T.bg0,color:T.text,fontSize:13,
      backgroundImage:"radial-gradient(ellipse at 5% 0%,#0F2040,transparent 50%),radial-gradient(ellipse at 95% 100%,#1A0820,transparent 50%)"}}>

      {/* HEADER */}
      <div style={{padding:"0 20px",borderBottom:`1px solid ${T.border}`,background:`${T.bg1}DD`,backdropFilter:"blur(12px)",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:10,height:54,maxWidth:1300,margin:"0 auto",flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:30,height:30,borderRadius:7,background:`linear-gradient(135deg,${T.red},${T.amber})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
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
                fontSize:11,cursor:"pointer",transition:"all 0.15s",
              }}>{s}</button>
            ))}
          </div>

          {/* ⚡ QUICK LOG BUTTON — the main new feature */}
          <button onClick={()=>setQuickLogOpen(true)} style={{
            padding:"6px 14px",borderRadius:6,border:"none",
            background:`linear-gradient(135deg,${T.amber},${T.red})`,
            color:"#000",fontSize:12,fontWeight:700,cursor:"pointer",
            display:"flex",alignItems:"center",gap:6,
          }}>
            <Edit3 size={13}/> Quick Log
          </button>

          <button onClick={()=>setImportOpen(true)} style={{padding:"6px 11px",borderRadius:6,border:"none",outline:`1px solid ${T.border}`,background:"transparent",color:T.textMuted,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
            <Upload size={12}/> Import
          </button>
          <button onClick={resetToDefault} title="Reset all data" style={{padding:"6px 9px",borderRadius:6,border:"none",outline:`1px solid ${T.border}`,background:"transparent",color:T.textMuted,fontSize:11,cursor:"pointer"}}>
            <RefreshCw size={12}/>
          </button>
        </div>
      </div>

      {/* STATS BAR */}
      <div style={{maxWidth:1300,margin:"0 auto",padding:"12px 20px 0",display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
        {[
          {icon:<AlertTriangle size={14}/>,l:"Danger Chapters",v:danger,c:T.red},
          {icon:<Target size={14}/>,l:"Avg Accuracy",v:`${avgAcc}%`,c:T.amber},
          {icon:<Zap size={14}/>,l:"Total Chapters",v:chapters.length,c:T.blue},
          {icon:<CheckCircle2 size={14}/>,l:"Strong (Q4)",v:chapters.filter(c=>c.group==="Q4").length,c:T.green},
        ].map(s=>(
          <div key={s.l} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 14px",background:T.bg1,borderRadius:8,border:`1px solid ${T.border}`}}>
            <span style={{color:s.c}}>{s.icon}</span>
            <span style={{fontSize:15,fontWeight:700,color:s.c}}>{s.v}</span>
            <span style={{fontSize:10,color:T.textMuted}}>{s.l}</span>
          </div>
        ))}
        <div style={{flex:1}}/>
        {/* Exam date countdown button */}
        <button onClick={()=>setExamDateOpen(true)} style={{
          display:"flex",alignItems:"center",gap:10,padding:"7px 14px",
          background:T.bg1,borderRadius:8,border:`1px solid ${daysLeft!==null?urgencyColor+"55":T.border}`,
          cursor:"pointer",transition:"all 0.2s",
        }}>
          <Calendar size={14} color={urgencyColor}/>
          {daysLeft === null ? (
            <span style={{fontSize:11,color:T.textDim}}>📅 Set exam date →</span>
          ) : daysLeft < 0 ? (
            <span style={{fontSize:11,color:T.red}}>Exam passed — update?</span>
          ) : (
            <>
              <span style={{fontSize:20,fontWeight:800,color:urgencyColor,lineHeight:1}}>{daysLeft}</span>
              <div style={{textAlign:"left"}}>
                <div style={{fontSize:10,color:T.textMuted,lineHeight:1.3}}>days to NEET</div>
                <div style={{fontSize:9,color:T.textDim,lineHeight:1.3}}>
                  {new Date(examDate+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
                </div>
              </div>
            </>
          )}
        </button>
      </div>

      {/* MAIN GRID */}
      <div style={{maxWidth:1300,margin:"0 auto",padding:"14px 20px 30px",display:"grid",gridTemplateColumns:"minmax(320px,42%) 1fr",gap:14}}>

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
              {[["Q1","⚡ Danger · Daily cycle"],["Q2","🔄 Maintain · Weekly"],["Q3","📉 Deprioritise"],["Q4","✅ Glance only"]].map(([q,l])=>(
                <div key={q} style={{padding:"7px 10px",background:getGroupBg(q),borderRadius:6,border:`1px solid ${getGroupColor(q)}30`,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:14,fontWeight:700,color:getGroupColor(q),width:22}}>{chapters.filter(c=>c.group===q).length}</span>
                  <span style={{fontSize:10,color:T.textMuted}}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          {selected && <Detail ch={selected} onClose={()=>setSelected(null)} onUpdate={updateChapter}/>}
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
                <div style={{fontSize:13,fontWeight:700,color:T.text}}>Rolling Top-10 Priority</div>
                <div style={{fontSize:10,color:T.textMuted}}>score = weight × (4 − accuracy/25)</div>
              </div>
            </div>
            {top10.map((ch,i)=>(
              <Top10Row key={ch.id} ch={ch} rank={i+1} onSelect={c=>setSelected(s=>s?.id===c.id?null:c)} selected={selected}/>
            ))}
          </div>
        </div>
      </div>

      {/* EXAM DATE MODAL */}
      {examDateOpen && (
        <ExamDateModal current={examDate} onSave={saveExamDate} onClose={()=>setExamDateOpen(false)}/>
      )}

      {/* QUICK LOG MODAL */}
      {quickLogOpen && (
        <QuickLog chapters={chapters} onUpdate={setChapters} onClose={()=>setQuickLogOpen(false)}/>
      )}

      {/* IMPORT MODAL */}
      {importOpen && (
        <ImportModal onImport={handleImport} onClose={()=>setImportOpen(false)}/>
      )}

      <style>{`
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:${T.bg1}}
        ::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}
        input[type=range]{height:4px;border-radius:2px}
        @media(max-width:700px){
          div[style*="grid-template-columns: minmax(320px"]{grid-template-columns:1fr!important}
        }
      `}</style>
      <SpeedInsights />
    </div>
  );
}

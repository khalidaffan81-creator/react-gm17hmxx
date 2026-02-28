import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";
import { Zap, TrendingUp, AlertTriangle, CheckCircle2, Clock, Target, Upload, Calendar, X, RefreshCw, Star, Edit3, Save, Search, LogOut, Shield, Users, Activity, ChevronRight, BarChart2, Home, BookOpen, PenLine, User, ChevronLeft, Flame } from "lucide-react";

// ── DETECT MOBILE ─────────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return isMobile;
}

// ── YOUR ADMIN EMAIL (change this to your Gmail) ─────────────────────────────
const ADMIN_EMAIL = "YOUR_GMAIL_HERE@gmail.com";

// ── ACCESS CODE — share this with your 50 friends ────────────────────────────
// Change this to any word/code you want, e.g. "neet2026" or "mission50"
const ACCESS_CODE = "neetMAK";
const ACCESS_KEY  = "neet_mission_access_v1";

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

function calcGroup(weight, accuracy) {
  if (weight >= 2 && accuracy < 65) return "Q1";
  if (weight >= 2 && accuracy >= 65) return "Q2";
  if (weight < 2 && accuracy < 65) return "Q3";
  return "Q4";
}

const DEFAULT_CHAPTERS = [
  {id:"bot1",name:"The Living World",subject:"Biology",topic:"Botany",weight:1,accuracy:70,errors:2,pyqs:6},
  {id:"bot2",name:"Biological Classification",subject:"Biology",topic:"Botany",weight:2,accuracy:60,errors:5,pyqs:18},
  {id:"bot3",name:"Plant Kingdom",subject:"Biology",topic:"Botany",weight:2,accuracy:55,errors:7,pyqs:22},
  {id:"bot4",name:"Morphology of Flowering Plants",subject:"Biology",topic:"Botany",weight:2,accuracy:60,errors:6,pyqs:20},
  {id:"bot5",name:"Anatomy of Flowering Plants",subject:"Biology",topic:"Botany",weight:2,accuracy:60,errors:5,pyqs:16},
  {id:"bot6",name:"Cell: The Unit of Life",subject:"Biology",topic:"Botany",weight:3,accuracy:50,errors:10,pyqs:32},
  {id:"bot7",name:"Cell Cycle & Cell Division",subject:"Biology",topic:"Botany",weight:3,accuracy:50,errors:10,pyqs:28},
  {id:"bot8",name:"Biomolecules",subject:"Biology",topic:"Botany",weight:2,accuracy:55,errors:7,pyqs:20},
  {id:"bot9",name:"Photosynthesis in Higher Plants",subject:"Biology",topic:"Botany",weight:3,accuracy:55,errors:8,pyqs:26},
  {id:"bot10",name:"Respiration in Plants",subject:"Biology",topic:"Botany",weight:2,accuracy:55,errors:6,pyqs:18},
  {id:"bot11",name:"Plant Growth & Development",subject:"Biology",topic:"Botany",weight:2,accuracy:60,errors:5,pyqs:14},
  {id:"bot12",name:"Mineral Nutrition",subject:"Biology",topic:"Botany",weight:1,accuracy:65,errors:3,pyqs:10},
  {id:"bot13",name:"Transport in Plants",subject:"Biology",topic:"Botany",weight:2,accuracy:60,errors:5,pyqs:16},
  {id:"bot14",name:"Sexual Reproduction in Flowering Plants",subject:"Biology",topic:"Botany",weight:3,accuracy:50,errors:9,pyqs:30},
  {id:"bot15",name:"Strategies for Enhancement in Food Production",subject:"Biology",topic:"Botany",weight:1,accuracy:65,errors:3,pyqs:8},
  {id:"bot16",name:"Microbes in Human Welfare",subject:"Biology",topic:"Botany",weight:1,accuracy:65,errors:3,pyqs:8},
  {id:"bot17",name:"Biotechnology: Principles & Processes",subject:"Biology",topic:"Botany",weight:2,accuracy:50,errors:9,pyqs:18},
  {id:"bot18",name:"Biotechnology & Its Applications",subject:"Biology",topic:"Botany",weight:2,accuracy:50,errors:9,pyqs:16},
  {id:"bot19",name:"Organisms & Populations",subject:"Biology",topic:"Botany",weight:2,accuracy:55,errors:7,pyqs:20},
  {id:"bot20",name:"Ecosystem",subject:"Biology",topic:"Botany",weight:2,accuracy:55,errors:7,pyqs:18},
  {id:"bot21",name:"Biodiversity & Conservation",subject:"Biology",topic:"Botany",weight:2,accuracy:60,errors:5,pyqs:16},
  {id:"bot22",name:"Environmental Issues",subject:"Biology",topic:"Botany",weight:1,accuracy:65,errors:3,pyqs:8},
  {id:"zoo1",name:"Animal Kingdom",subject:"Biology",topic:"Zoology",weight:3,accuracy:50,errors:10,pyqs:28},
  {id:"zoo2",name:"Structural Organisation in Animals",subject:"Biology",topic:"Zoology",weight:1,accuracy:65,errors:3,pyqs:8},
  {id:"zoo3",name:"Digestion & Absorption",subject:"Biology",topic:"Zoology",weight:2,accuracy:55,errors:7,pyqs:18},
  {id:"zoo4",name:"Breathing & Exchange of Gases",subject:"Biology",topic:"Zoology",weight:2,accuracy:55,errors:7,pyqs:14},
  {id:"zoo5",name:"Body Fluids & Circulation",subject:"Biology",topic:"Zoology",weight:2,accuracy:50,errors:9,pyqs:20},
  {id:"zoo6",name:"Excretory Products & Elimination",subject:"Biology",topic:"Zoology",weight:2,accuracy:50,errors:9,pyqs:18},
  {id:"zoo7",name:"Locomotion & Movement",subject:"Biology",topic:"Zoology",weight:2,accuracy:60,errors:5,pyqs:14},
  {id:"zoo8",name:"Neural Control & Coordination",subject:"Biology",topic:"Zoology",weight:3,accuracy:45,errors:12,pyqs:24},
  {id:"zoo9",name:"Chemical Coordination & Integration",subject:"Biology",topic:"Zoology",weight:3,accuracy:45,errors:12,pyqs:26},
  {id:"zoo10",name:"Human Reproduction",subject:"Biology",topic:"Zoology",weight:2,accuracy:55,errors:7,pyqs:20},
  {id:"zoo11",name:"Reproductive Health",subject:"Biology",topic:"Zoology",weight:1,accuracy:65,errors:3,pyqs:10},
  {id:"zoo12",name:"Principles of Inheritance & Variation",subject:"Biology",topic:"Zoology",weight:3,accuracy:45,errors:12,pyqs:34},
  {id:"zoo13",name:"Molecular Basis of Inheritance",subject:"Biology",topic:"Zoology",weight:3,accuracy:45,errors:12,pyqs:32},
  {id:"zoo14",name:"Evolution",subject:"Biology",topic:"Zoology",weight:2,accuracy:60,errors:5,pyqs:16},
  {id:"zoo15",name:"Human Health & Disease",subject:"Biology",topic:"Zoology",weight:2,accuracy:60,errors:5,pyqs:20},
  {id:"ch1",name:"Some Basic Concepts of Chemistry",subject:"Chemistry",topic:"Physical",weight:1,accuracy:65,errors:3,pyqs:8},
  {id:"ch2",name:"Structure of Atom",subject:"Chemistry",topic:"Physical",weight:2,accuracy:55,errors:7,pyqs:18},
  {id:"ch3",name:"Classification of Elements & Periodicity",subject:"Chemistry",topic:"Inorganic",weight:2,accuracy:55,errors:7,pyqs:18},
  {id:"ch4",name:"Chemical Bonding & Molecular Structure",subject:"Chemistry",topic:"Physical",weight:3,accuracy:45,errors:12,pyqs:30},
  {id:"ch5",name:"States of Matter",subject:"Chemistry",topic:"Physical",weight:1,accuracy:65,errors:3,pyqs:10},
  {id:"ch6",name:"Thermodynamics",subject:"Chemistry",topic:"Physical",weight:2,accuracy:50,errors:9,pyqs:20},
  {id:"ch7",name:"Equilibrium",subject:"Chemistry",topic:"Physical",weight:2,accuracy:50,errors:9,pyqs:22},
  {id:"ch8",name:"Redox Reactions",subject:"Chemistry",topic:"Physical",weight:1,accuracy:65,errors:3,pyqs:8},
  {id:"ch9",name:"Hydrogen & s-Block Elements",subject:"Chemistry",topic:"Inorganic",weight:1,accuracy:65,errors:3,pyqs:10},
  {id:"ch10",name:"p-Block Elements (Groups 13-14)",subject:"Chemistry",topic:"Inorganic",weight:2,accuracy:50,errors:9,pyqs:18},
  {id:"ch11",name:"p-Block Elements (Groups 15-18)",subject:"Chemistry",topic:"Inorganic",weight:3,accuracy:45,errors:12,pyqs:28},
  {id:"ch12",name:"d & f Block Elements",subject:"Chemistry",topic:"Inorganic",weight:2,accuracy:50,errors:9,pyqs:20},
  {id:"ch13",name:"Coordination Compounds",subject:"Chemistry",topic:"Inorganic",weight:2,accuracy:45,errors:11,pyqs:22},
  {id:"ch14",name:"Solutions",subject:"Chemistry",topic:"Physical",weight:2,accuracy:55,errors:7,pyqs:18},
  {id:"ch15",name:"Electrochemistry",subject:"Chemistry",topic:"Physical",weight:2,accuracy:50,errors:9,pyqs:20},
  {id:"ch16",name:"Chemical Kinetics",subject:"Chemistry",topic:"Physical",weight:2,accuracy:55,errors:7,pyqs:18},
  {id:"ch17",name:"Surface Chemistry",subject:"Chemistry",topic:"Physical",weight:1,accuracy:65,errors:3,pyqs:8},
  {id:"ch18",name:"GOC & IUPAC Nomenclature",subject:"Chemistry",topic:"Organic",weight:3,accuracy:45,errors:12,pyqs:26},
  {id:"ch19",name:"Hydrocarbons",subject:"Chemistry",topic:"Organic",weight:2,accuracy:55,errors:7,pyqs:18},
  {id:"ch20",name:"Haloalkanes & Haloarenes",subject:"Chemistry",topic:"Organic",weight:2,accuracy:50,errors:9,pyqs:18},
  {id:"ch21",name:"Alcohols, Phenols & Ethers",subject:"Chemistry",topic:"Organic",weight:2,accuracy:50,errors:9,pyqs:20},
  {id:"ch22",name:"Aldehydes, Ketones & Carboxylic Acids",subject:"Chemistry",topic:"Organic",weight:3,accuracy:45,errors:12,pyqs:28},
  {id:"ch23",name:"Amines",subject:"Chemistry",topic:"Organic",weight:1,accuracy:60,errors:5,pyqs:12},
  {id:"ch24",name:"Biomolecules",subject:"Chemistry",topic:"Organic",weight:2,accuracy:55,errors:7,pyqs:16},
  {id:"ch25",name:"Polymers",subject:"Chemistry",topic:"Organic",weight:1,accuracy:70,errors:2,pyqs:8},
  {id:"ch26",name:"Chemistry in Everyday Life",subject:"Chemistry",topic:"Organic",weight:1,accuracy:70,errors:2,pyqs:6},
  {id:"ph1",name:"Physical World & Units",subject:"Physics",topic:"Mechanics",weight:1,accuracy:70,errors:2,pyqs:5},
  {id:"ph2",name:"Kinematics",subject:"Physics",topic:"Mechanics",weight:2,accuracy:55,errors:7,pyqs:22},
  {id:"ph3",name:"Laws of Motion",subject:"Physics",topic:"Mechanics",weight:3,accuracy:50,errors:10,pyqs:28},
  {id:"ph4",name:"Work, Energy & Power",subject:"Physics",topic:"Mechanics",weight:2,accuracy:55,errors:7,pyqs:20},
  {id:"ph5",name:"System of Particles & Rotational Motion",subject:"Physics",topic:"Mechanics",weight:2,accuracy:45,errors:11,pyqs:20},
  {id:"ph6",name:"Gravitation",subject:"Physics",topic:"Mechanics",weight:2,accuracy:60,errors:5,pyqs:16},
  {id:"ph7",name:"Mechanical Properties of Solids & Fluids",subject:"Physics",topic:"Mechanics",weight:1,accuracy:60,errors:4,pyqs:12},
  {id:"ph8",name:"Thermal Properties & Thermodynamics",subject:"Physics",topic:"Mechanics",weight:2,accuracy:50,errors:9,pyqs:20},
  {id:"ph9",name:"Kinetic Theory of Gases",subject:"Physics",topic:"Mechanics",weight:1,accuracy:60,errors:4,pyqs:10},
  {id:"ph10",name:"Oscillations (SHM)",subject:"Physics",topic:"Mechanics",weight:2,accuracy:55,errors:7,pyqs:18},
  {id:"ph11",name:"Waves",subject:"Physics",topic:"Mechanics",weight:2,accuracy:55,errors:7,pyqs:16},
  {id:"ph12",name:"Electrostatics",subject:"Physics",topic:"Electricity",weight:3,accuracy:40,errors:14,pyqs:32},
  {id:"ph13",name:"Current Electricity",subject:"Physics",topic:"Electricity",weight:3,accuracy:40,errors:14,pyqs:30},
  {id:"ph14",name:"Moving Charges & Magnetism",subject:"Physics",topic:"Electricity",weight:2,accuracy:50,errors:9,pyqs:20},
  {id:"ph15",name:"Magnetism & Matter",subject:"Physics",topic:"Electricity",weight:1,accuracy:60,errors:4,pyqs:10},
  {id:"ph16",name:"Electromagnetic Induction",subject:"Physics",topic:"Electricity",weight:2,accuracy:50,errors:9,pyqs:18},
  {id:"ph17",name:"Alternating Current",subject:"Physics",topic:"Electricity",weight:2,accuracy:50,errors:9,pyqs:16},
  {id:"ph18",name:"Electromagnetic Waves",subject:"Physics",topic:"Electricity",weight:1,accuracy:65,errors:3,pyqs:8},
  {id:"ph19",name:"Ray Optics & Optical Instruments",subject:"Physics",topic:"Optics",weight:3,accuracy:45,errors:12,pyqs:28},
  {id:"ph20",name:"Wave Optics",subject:"Physics",topic:"Optics",weight:2,accuracy:50,errors:9,pyqs:18},
  {id:"ph21",name:"Dual Nature of Radiation & Matter",subject:"Physics",topic:"Modern",weight:2,accuracy:55,errors:7,pyqs:16},
  {id:"ph22",name:"Atoms",subject:"Physics",topic:"Modern",weight:2,accuracy:55,errors:7,pyqs:14},
  {id:"ph23",name:"Nuclei",subject:"Physics",topic:"Modern",weight:2,accuracy:55,errors:7,pyqs:14},
  {id:"ph24",name:"Semiconductor Devices & Logic Gates",subject:"Physics",topic:"Modern",weight:2,accuracy:50,errors:8,pyqs:16},
];

const INIT_CHAPTERS = DEFAULT_CHAPTERS.map(c => ({...c, group: calcGroup(c.weight, c.accuracy)}));
const priorityScore = c => c.weight * (4 - c.accuracy / 25);
const getGroupColor = g => ({Q1:T.q1,Q2:T.q2,Q3:T.q3,Q4:T.q4}[g]||T.blue);
const getGroupBg = g => ({Q1:T.redDim,Q2:T.amberDim,Q3:T.blueDim,Q4:T.greenDim}[g]||T.blueDim);
const SUBJECT_COLORS = {Biology:T.green,Chemistry:T.amber,Physics:T.blue};
const WEEKS = ["W19","W20","W21","W22","W23","W24","W25","W26"];

function calcDaysLeft(dateStr) {
  if (!dateStr) return null;
  const exam = new Date(dateStr); exam.setHours(0,0,0,0);
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.ceil((exam - today) / (1000*60*60*24));
}
function getUrgencyColor(days) {
  if (days === null) return T.textDim;
  if (days <= 30) return T.red;
  if (days <= 60) return T.amber;
  return T.green;
}

function seedRand(seed) {
  let s = seed % 2147483647; if (s <= 0) s += 2147483646;
  return () => { s = s * 16807 % 2147483647; return (s-1)/2147483646; };
}
function getHistory(ch) {
  const rand = seedRand(ch.id.charCodeAt(0)*31+ch.accuracy);
  return WEEKS.map((w,i) => ({
    week:w,
    accuracy: Math.max(20,Math.min(95,Math.round(ch.accuracy-15+i*2+rand()*8))),
    errors: Math.max(0,Math.round(ch.errors-i*0.5+rand()*3)),
  }));
}

// ── SPARKLINE ────────────────────────────────────────────────────────────────
function Spark({data,color}) {
  const vals = data.map(d=>d.accuracy);
  const mn=Math.min(...vals), mx=Math.max(...vals);
  const W=52,H=16;
  const pts = vals.map((v,i)=>`${(i/(vals.length-1))*W},${H-((v-mn)/(mx-mn||1))*H}`).join(" ");
  const last = pts.split(" ").at(-1).split(",");
  return (
    <svg width={W} height={H} style={{overflow:"visible"}}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={last[0]} cy={last[1]} r="2.5" fill={color}/>
    </svg>
  );
}

// ── LINE CHART ───────────────────────────────────────────────────────────────
function LineChartSVG({ series, width=400, height=130 }) {
  const PAD={top:10,right:10,bottom:22,left:30};
  const W=width-PAD.left-PAD.right, H=height-PAD.top-PAD.bottom;
  const toX=i=>PAD.left+(i/(WEEKS.length-1))*W;
  const toY=v=>PAD.top+H-((v-20)/(100-20))*H;
  const [tip,setTip]=useState(null);
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{overflow:"visible"}}>
      {[20,40,60,80,100].map(v=><line key={v} x1={PAD.left} x2={PAD.left+W} y1={toY(v)} y2={toY(v)} stroke={T.border} strokeWidth="1" strokeDasharray="3,3"/>)}
      {[20,50,80,100].map(v=><text key={v} x={PAD.left-4} y={toY(v)+3} fill={T.textDim} fontSize="8" textAnchor="end">{v}</text>)}
      {WEEKS.map((w,i)=><text key={w} x={toX(i)} y={height-4} fill={T.textDim} fontSize="8" textAnchor="middle">{w}</text>)}
      <line x1={PAD.left} x2={PAD.left+W} y1={toY(70)} y2={toY(70)} stroke={T.green} strokeWidth="1" strokeDasharray="5,4" strokeOpacity="0.5"/>
      {series.map(s=>{
        const pts=s.data.map((d,i)=>`${toX(i)},${toY(d.accuracy)}`).join(" ");
        return (
          <g key={s.id}>
            <polyline points={pts} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {s.data.map((d,i)=>(
              <circle key={i} cx={toX(i)} cy={toY(d.accuracy)} r="3.5" fill={s.color} stroke={T.bg1} strokeWidth="1.5" style={{cursor:"pointer"}}
                onMouseEnter={()=>setTip({x:toX(i),y:toY(d.accuracy),d,name:s.name,color:s.color})}
                onMouseLeave={()=>setTip(null)}/>
            ))}
          </g>
        );
      })}
      {tip&&<g>
        <rect x={Math.min(tip.x+8,width-90)} y={tip.y-36} width="84" height="34" rx="4" fill={T.bg1} stroke={tip.color} strokeWidth="1"/>
        <text x={Math.min(tip.x+14,width-84)} y={tip.y-22} fill={T.text} fontSize="9" fontWeight="700">{tip.name}</text>
        <text x={Math.min(tip.x+14,width-84)} y={tip.y-10} fill={tip.color} fontSize="9">{tip.d.week}: {tip.d.accuracy}%</text>
      </g>}
    </svg>
  );
}

// ── PRIORITY MATRIX ──────────────────────────────────────────────────────────
function PriorityMatrix({ chapters, onSelect, selected, subject }) {
  const [tooltip,setTooltip]=useState(null);
  const W=400,H=330,PAD=42;
  const IW=W-PAD*2,IH=H-PAD*2;
  const filtered=subject==="All"?chapters:chapters.filter(c=>c.subject===subject);
  const cx=acc=>PAD+(acc/100)*IW;
  const cy=wt=>PAD+IH-((wt-1)/2)*IH;
  const quads=[
    {x:PAD,y:PAD,w:IW/2,h:IH/2,color:T.q2,label:"MAINTENANCE",lx:PAD+8,ly:PAD+14,anchor:"start"},
    {x:PAD+IW/2,y:PAD,w:IW/2,h:IH/2,color:T.q4,label:"MINIMAL",lx:PAD+IW-8,ly:PAD+14,anchor:"end"},
    {x:PAD,y:PAD+IH/2,w:IW/2,h:IH/2,color:T.q1,label:"DANGER",lx:PAD+8,ly:PAD+IH-6,anchor:"start"},
    {x:PAD+IW/2,y:PAD+IH/2,w:IW/2,h:IH/2,color:T.q3,label:"LOW EXPOSURE",lx:PAD+IW-8,ly:PAD+IH-6,anchor:"end"},
  ];
  return (
    <div style={{position:"relative"}}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",overflow:"visible",cursor:"crosshair"}} onMouseLeave={()=>setTooltip(null)}>
        <defs>{quads.map((q,i)=><radialGradient key={i} id={`qg${i}`} cx="50%" cy="50%"><stop offset="0%" stopColor={q.color} stopOpacity="0.12"/><stop offset="100%" stopColor={q.color} stopOpacity="0.02"/></radialGradient>)}</defs>
        {quads.map((q,i)=><g key={i}><rect x={q.x} y={q.y} width={q.w} height={q.h} fill={`url(#qg${i})`} stroke={q.color} strokeOpacity="0.2" strokeWidth="1"/><text x={q.lx} y={q.ly} fill={q.color} fillOpacity="0.4" fontSize="8" textAnchor={q.anchor} fontWeight="800" letterSpacing="1.5">{q.label}</text></g>)}
        <line x1={PAD} y1={PAD} x2={PAD} y2={PAD+IH} stroke={T.border} strokeWidth="1"/>
        <line x1={PAD} y1={PAD+IH} x2={PAD+IW} y2={PAD+IH} stroke={T.border} strokeWidth="1"/>
        <line x1={PAD+IW/2} y1={PAD} x2={PAD+IW/2} y2={PAD+IH} stroke={T.borderHi} strokeWidth="1" strokeDasharray="4,3"/>
        <line x1={PAD} y1={PAD+IH/2} x2={PAD+IW} y2={PAD+IH/2} stroke={T.borderHi} strokeWidth="1" strokeDasharray="4,3"/>
        <text x={PAD+IW/2} y={H-3} fill={T.textMuted} fontSize="8" textAnchor="middle">← WEAK · ACCURACY · STRONG →</text>
        <text x={9} y={PAD+IH/2} fill={T.textMuted} fontSize="8" textAnchor="middle" transform={`rotate(-90,9,${PAD+IH/2})`}>WEIGHTAGE</text>
        {[0,25,50,75,100].map(v=><text key={v} x={cx(v)} y={PAD+IH+11} fill={T.textDim} fontSize="7" textAnchor="middle">{v}%</text>)}
        {[1,2,3].map(v=><text key={v} x={PAD-5} y={cy(v)+3} fill={T.textDim} fontSize="7" textAnchor="end">{v}</text>)}
        {filtered.map(ch=>{
          const x=cx(ch.accuracy),y=cy(ch.weight),r=5+ch.errors*0.35;
          const color=getGroupColor(ch.group),isSel=selected?.id===ch.id;
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
          const {ch,x,y}=tooltip,tx=Math.min(x+12,W-148),ty=Math.max(y-60,PAD),col=getGroupColor(ch.group);
          const labels={"Q1":"⚡ Danger","Q2":"🔄 Maintain","Q3":"📉 Low","Q4":"✅ Minimal"};
          return <g>
            <rect x={tx} y={ty} width="142" height="58" rx="5" fill={T.bg1} stroke={col} strokeWidth="1" strokeOpacity="0.9"/>
            <text x={tx+10} y={ty+15} fill={T.text} fontSize="10" fontWeight="700">{ch.name.length>22?ch.name.slice(0,22)+"…":ch.name}</text>
            <text x={tx+10} y={ty+29} fill={T.textMuted} fontSize="8">{`Acc: ${ch.accuracy}%  Wt: ${ch.weight}  Err: ${ch.errors}`}</text>
            <text x={tx+10} y={ty+43} fill={col} fontSize="8" fontWeight="600">{labels[ch.group]}</text>
          </g>;
        })()}
      </svg>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:6}}>
        {["Biology","Chemistry","Physics"].map(s=><div key={s} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:T.textMuted}}><div style={{width:8,height:8,borderRadius:"50%",background:SUBJECT_COLORS[s]}}/>{s}</div>)}
        <span style={{fontSize:11,color:T.textDim}}>● size = errors</span>
      </div>
    </div>
  );
}

// ── TOP-10 ROW ───────────────────────────────────────────────────────────────
function Top10Row({ ch, rank, onSelect, selected }) {
  const isSel=selected?.id===ch.id,score=priorityScore(ch),pct=Math.min(100,(score/12)*100),color=getGroupColor(ch.group);
  return (
    <div onClick={()=>onSelect(ch)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",background:isSel?`${getGroupBg(ch.group)}99`:"transparent",border:`1px solid ${isSel?color:T.border}`,borderRadius:8,cursor:"pointer",transition:"all 0.15s",marginBottom:5,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",left:0,top:0,bottom:0,width:`${pct}%`,background:`linear-gradient(90deg,${color}1A,${color}05)`}}/>
      <div style={{width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:rank<=3?color:T.bg3,color:rank<=3?"#000":T.textMuted,fontSize:11,fontWeight:700,flexShrink:0,zIndex:1}}>{rank}</div>
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

// ── QUICK LOG ────────────────────────────────────────────────────────────────
function QuickLog({ chapters, onUpdate, onClose }) {
  const [subject,setSubject]=useState("All");
  const [search,setSearch]=useState("");
  const [showOnly,setShowOnly]=useState("all");
  const [edits,setEdits]=useState(Object.fromEntries(chapters.map(c=>[c.id,{accuracy:c.accuracy,errors:c.errors}])));
  const changedIds=new Set(chapters.filter(c=>edits[c.id].accuracy!==c.accuracy||edits[c.id].errors!==c.errors).map(c=>c.id));
  const filtered=chapters.filter(c=>{
    if(subject!=="All"&&c.subject!==subject) return false;
    if(search&&!c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if(showOnly==="danger"&&c.group!=="Q1") return false;
    if(showOnly==="changed"&&!changedIds.has(c.id)) return false;
    return true;
  }).sort((a,b)=>priorityScore(b)-priorityScore(a));

  function setAcc(id,val){setEdits(e=>({...e,[id]:{...e[id],accuracy:Number(val)}}))}
  function setErr(id,delta){setEdits(e=>({...e,[id]:{...e[id],errors:Math.max(0,e[id].errors+delta)}}))}
  function handleSave(){
    const updated=chapters.map(c=>{const{accuracy,errors}=edits[c.id];return{...c,accuracy,errors,group:calcGroup(c.weight,accuracy)};});
    onUpdate(updated);onClose();
  }

  return (
    <div style={{position:"fixed",inset:0,background:"#000000BB",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}} onClick={onClose}>
      <div style={{background:T.bg1,border:`1px solid ${T.borderHi}`,borderRadius:16,width:"100%",maxWidth:680,maxHeight:"90vh",display:"flex",flexDirection:"column",boxShadow:"0 32px 80px #000E"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
          <div style={{width:34,height:34,borderRadius:8,background:`linear-gradient(135deg,${T.amber},${T.red})`,display:"flex",alignItems:"center",justifyContent:"center"}}><Edit3 size={16} color="#000"/></div>
          <div><div style={{fontSize:15,fontWeight:700,color:T.text}}>Quick Log</div><div style={{fontSize:11,color:T.textMuted}}>Update after each mock/practice session</div></div>
          <div style={{flex:1}}/>
          {changedIds.size>0&&<div style={{fontSize:12,color:T.amber,background:T.amberDim,padding:"4px 10px",borderRadius:6}}>{changedIds.size} changed</div>}
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:T.textMuted}}><X size={18}/></button>
        </div>
        <div style={{padding:"12px 20px",borderBottom:`1px solid ${T.border}`,display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",flexShrink:0}}>
          <div style={{display:"flex",gap:4}}>
            {["All","Biology","Chemistry","Physics"].map(s=><button key={s} onClick={()=>setSubject(s)} style={{padding:"5px 10px",borderRadius:6,border:"none",fontSize:11,cursor:"pointer",background:subject===s?`${(SUBJECT_COLORS[s]||T.blue)}22`:"transparent",color:subject===s?(SUBJECT_COLORS[s]||T.blue):T.textMuted,outline:`1px solid ${subject===s?(SUBJECT_COLORS[s]||T.blue):T.border}`}}>{s}</button>)}
          </div>
          <div style={{display:"flex",gap:4}}>
            {[["all","All"],["danger","⚡ Danger"],["changed","✏️ Changed"]].map(([v,l])=><button key={v} onClick={()=>setShowOnly(v)} style={{padding:"5px 10px",borderRadius:6,border:"none",fontSize:11,cursor:"pointer",background:showOnly===v?`${T.red}22`:"transparent",color:showOnly===v?T.red:T.textMuted,outline:`1px solid ${showOnly===v?T.red:T.border}`}}>{l}</button>)}
          </div>
          <div style={{flex:1,minWidth:120,display:"flex",alignItems:"center",gap:7,background:T.bg2,border:`1px solid ${T.border}`,borderRadius:7,padding:"5px 10px"}}>
            <Search size={12} color={T.textDim}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search chapter..." style={{background:"none",border:"none",outline:"none",color:T.text,fontSize:12,width:"100%"}}/>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"8px 20px"}}>
          {filtered.map(ch=>{
            const ed=edits[ch.id],color=getGroupColor(calcGroup(ch.weight,ed.accuracy)),changed=changedIds.has(ch.id);
            return (
              <div key={ch.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:5,borderRadius:8,border:`1px solid ${changed?color+"44":T.border}`,background:changed?`${getGroupBg(calcGroup(ch.weight,ed.accuracy))}55`:T.bg2,transition:"all 0.2s"}}>
                <div style={{width:190,flexShrink:0}}>
                  <div style={{fontSize:12,fontWeight:600,color:T.text,lineHeight:1.2,marginBottom:2}}>{ch.name.length>28?ch.name.slice(0,28)+"…":ch.name}</div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <span style={{fontSize:10,color:SUBJECT_COLORS[ch.subject]}}>{ch.topic}</span>
                    <span style={{fontSize:9,padding:"1px 5px",borderRadius:3,background:getGroupBg(calcGroup(ch.weight,ed.accuracy)),color,fontWeight:600}}>{calcGroup(ch.weight,ed.accuracy)}</span>
                  </div>
                </div>
                <div style={{flex:1,minWidth:120}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:10,color:T.textMuted}}>Accuracy</span>
                    <span style={{fontSize:12,fontWeight:700,color}}>{ed.accuracy}%</span>
                  </div>
                  <input type="range" min="0" max="100" step="1" value={ed.accuracy} onChange={e=>setAcc(ch.id,e.target.value)} style={{width:"100%",accentColor:color,cursor:"pointer"}}/>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                  <span style={{fontSize:10,color:T.textMuted,width:32}}>Err:</span>
                  <button onClick={()=>setErr(ch.id,-1)} style={{width:22,height:22,borderRadius:4,border:`1px solid ${T.border}`,background:T.bg3,color:T.text,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                  <span style={{fontSize:14,fontWeight:700,color:T.red,minWidth:22,textAlign:"center"}}>{ed.errors}</span>
                  <button onClick={()=>setErr(ch.id,+1)} style={{width:22,height:22,borderRadius:4,border:`1px solid ${T.border}`,background:T.bg3,color:T.text,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                </div>
                {changed&&<button onClick={()=>setEdits(e=>({...e,[ch.id]:{accuracy:ch.accuracy,errors:ch.errors}}))} style={{background:"none",border:`1px solid ${T.border}`,borderRadius:4,cursor:"pointer",color:T.textDim,padding:"3px 5px"}}><RefreshCw size={10}/></button>}
              </div>
            );
          })}
        </div>
        <div style={{padding:"12px 20px",borderTop:`1px solid ${T.border}`,display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
          <div style={{flex:1,fontSize:11,color:T.textMuted}}>{changedIds.size>0?`${changedIds.size} chapter(s) updated · quadrants auto-recalculated`:"Adjust sliders to log latest scores"}</div>
          <button onClick={onClose} style={{padding:"9px 16px",borderRadius:8,border:`1px solid ${T.border}`,background:"transparent",color:T.textMuted,fontSize:12,cursor:"pointer"}}>Cancel</button>
          <button onClick={handleSave} disabled={changedIds.size===0} style={{padding:"9px 20px",borderRadius:8,border:"none",background:changedIds.size>0?T.amber:"transparent",color:changedIds.size>0?"#000":T.textDim,fontWeight:700,fontSize:13,cursor:changedIds.size>0?"pointer":"not-allowed",outline:changedIds.size===0?`1px solid ${T.border}`:"none"}}>
            Save {changedIds.size>0?`(${changedIds.size})`:""}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── EXAM DATE MODAL ───────────────────────────────────────────────────────────
function ExamDateModal({ current, onSave, onClose }) {
  const [val,setVal]=useState(current||"");
  const days=calcDaysLeft(val),col=getUrgencyColor(days);
  return (
    <div style={{position:"fixed",inset:0,background:"#000000BB",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
      <div style={{background:T.bg1,border:`1px solid ${T.borderHi}`,borderRadius:16,padding:28,width:"100%",maxWidth:380,boxShadow:"0 32px 80px #000E"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
          <div style={{width:36,height:36,borderRadius:9,background:`linear-gradient(135deg,${T.amber},${T.red})`,display:"flex",alignItems:"center",justifyContent:"center"}}><Calendar size={18} color="#000"/></div>
          <div><div style={{fontSize:15,fontWeight:700,color:T.text}}>Set NEET Exam Date</div><div style={{fontSize:11,color:T.textMuted}}>Countdown updates automatically</div></div>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,color:T.textMuted,marginBottom:8}}>Select your exam date:</div>
          <input type="date" value={val} min={new Date().toISOString().split("T")[0]} onChange={e=>setVal(e.target.value)} style={{width:"100%",padding:"12px 14px",borderRadius:8,border:`1px solid ${val?T.amber:T.border}`,background:T.bg2,color:T.text,fontSize:15,outline:"none",cursor:"pointer",colorScheme:"dark"}}/>
        </div>
        {val&&<div style={{padding:"12px 16px",borderRadius:8,background:T.redDim,border:`1px solid ${col}44`,marginBottom:16,textAlign:"center"}}>
          <div style={{fontSize:32,fontWeight:800,color:col,letterSpacing:-1}}>{days<0?"—":days}</div>
          <div style={{fontSize:12,color:T.textMuted}}>days remaining</div>
          <div style={{fontSize:11,color:col,marginTop:6}}>{days<=30?"⚡ Final sprint!":days<=60?"🔥 Stay consistent.":"📅 Use this time well."}</div>
        </div>}
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>{onSave(val);onClose();}} disabled={!val} style={{flex:1,padding:"11px",borderRadius:8,border:"none",background:val?T.amber:"transparent",color:val?"#000":T.textDim,fontWeight:700,fontSize:13,cursor:val?"pointer":"not-allowed"}}>Set Date</button>
          <button onClick={onClose} style={{padding:"11px 16px",borderRadius:8,border:`1px solid ${T.border}`,background:"transparent",color:T.textMuted,cursor:"pointer"}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── LOGIN SCREEN ──────────────────────────────────────────────────────────────

// ── ACCESS GATE ───────────────────────────────────────────────────────────────
// Shows a code entry screen before anything else. Free alternative to Vercel's
// $150/month password protection.
function AccessGate({ onUnlock }) {
  const [val, setVal]     = useState("");
  const [shake, setShake] = useState(false);
  const [show, setShow]   = useState(false);

  function attempt() {
    if (val.trim().toLowerCase() === ACCESS_CODE.toLowerCase()) {
      localStorage.setItem(ACCESS_KEY, "1");
      onUnlock();
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setVal("");
    }
  }

  return (
    <div style={{minHeight:"100vh",background:T.bg0,display:"flex",alignItems:"center",
      justifyContent:"center",padding:20,
      backgroundImage:"radial-gradient(ellipse at 5% 0%,#0F2040,transparent 50%),radial-gradient(ellipse at 95% 100%,#1A0820,transparent 50%)"}}>
      <div style={{width:"100%",maxWidth:380,textAlign:"center"}}>
        {/* Logo */}
        <div style={{width:64,height:64,borderRadius:18,
          background:`linear-gradient(135deg,${T.red},${T.amber})`,
          display:"flex",alignItems:"center",justifyContent:"center",
          margin:"0 auto 20px",boxShadow:`0 0 32px ${T.amber}44`}}>
          <Zap size={30} color="#000"/>
        </div>
        <div style={{fontSize:28,fontWeight:900,color:T.text,marginBottom:6,letterSpacing:-0.5}}>NEET Mission</div>
        <div style={{fontSize:13,color:T.textMuted,marginBottom:36}}>Revision Command Centre · Beta</div>

        {/* Card */}
        <div style={{
          background:T.bg1,border:`1px solid ${T.border}`,
          borderRadius:20,padding:"32px 28px",
          boxShadow:"0 24px 60px #000C",
          animation: shake ? "shake 0.5s ease" : "none",
        }}>
          <div style={{fontSize:32,marginBottom:10}}>🔐</div>
          <div style={{fontSize:16,fontWeight:800,color:T.text,marginBottom:6}}>Enter Access Code</div>
          <div style={{fontSize:13,color:T.textMuted,marginBottom:24,lineHeight:1.6}}>
            This is a private beta.<br/>Ask the creator for the access code.
          </div>

          {/* Input */}
          <div style={{position:"relative",marginBottom:14}}>
            <input
              type={show?"text":"password"}
              value={val}
              onChange={e=>setVal(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&attempt()}
              placeholder="Enter code…"
              autoFocus
              style={{
                width:"100%",padding:"14px 44px 14px 16px",
                borderRadius:12,border:`1px solid ${val?T.amber:T.border}`,
                background:T.bg2,color:T.text,fontSize:16,
                outline:"none",letterSpacing:show?1:3,
                boxSizing:"border-box",
                transition:"border-color 0.2s",
              }}
            />
            <button onClick={()=>setShow(s=>!s)} style={{
              position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",
              background:"none",border:"none",cursor:"pointer",color:T.textMuted,fontSize:16,padding:4,
            }}>{show?"🙈":"👁"}</button>
          </div>

          <button onClick={attempt} style={{
            width:"100%",padding:"14px",borderRadius:12,border:"none",
            background:`linear-gradient(135deg,${T.amber},${T.red})`,
            color:"#000",fontSize:15,fontWeight:800,cursor:"pointer",
            boxShadow:`0 4px 20px ${T.amber}44`,
            transition:"transform 0.15s, box-shadow 0.15s",
          }}>
            Unlock →
          </button>

          <div style={{fontSize:11,color:T.textDim,marginTop:18}}>
            Only shared with invited students · Not public
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-10px)}
          40%{transform:translateX(10px)}
          60%{transform:translateX(-8px)}
          80%{transform:translateX(8px)}
        }
      `}</style>
    </div>
  );
}

function LoginScreen() {
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  async function handleGoogle() {
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin }
    });
    if (error) { setError(error.message); setLoading(false); }
  }
  return (
    <div style={{minHeight:"100vh",background:T.bg0,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backgroundImage:"radial-gradient(ellipse at 5% 0%,#0F2040,transparent 50%),radial-gradient(ellipse at 95% 100%,#1A0820,transparent 50%)"}}>
      <div style={{width:"100%",maxWidth:400,textAlign:"center"}}>
        <div style={{width:64,height:64,borderRadius:16,background:`linear-gradient(135deg,${T.red},${T.amber})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
          <Zap size={30} color="#000"/>
        </div>
        <div style={{fontSize:28,fontWeight:800,color:T.text,marginBottom:6,letterSpacing:-0.5}}>NEET Mission</div>
        <div style={{fontSize:14,color:T.textMuted,marginBottom:40}}>Your personal revision command centre</div>

        <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:16,padding:32}}>
          <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:8}}>Welcome 👋</div>
          <div style={{fontSize:13,color:T.textMuted,marginBottom:28,lineHeight:1.6}}>Sign in to save your progress across all devices and track your preparation journey.</div>
          <button onClick={handleGoogle} disabled={loading} style={{width:"100%",padding:"14px",borderRadius:10,border:`1px solid ${T.border}`,background:T.bg2,color:T.text,fontSize:14,fontWeight:600,cursor:loading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:12,transition:"all 0.2s"}}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? "Signing in…" : "Continue with Google"}
          </button>
          {error&&<div style={{marginTop:12,fontSize:12,color:T.red,background:T.redDim,padding:"8px 12px",borderRadius:6}}>{error}</div>}
          <div style={{fontSize:11,color:T.textDim,marginTop:20,lineHeight:1.6}}>Your data is saved securely to your account. No ads. No spam.</div>
        </div>
      </div>
    </div>
  );
}

// ── ADMIN DASHBOARD ───────────────────────────────────────────────────────────
function AdminDashboard({ onClose }) {
  const [users,setUsers]=useState([]);
  const [loading,setLoading]=useState(true);
  const [tab,setTab]=useState("overview");
  const [selectedUser,setSelectedUser]=useState(null);

  useEffect(()=>{
    loadData();
  },[]);

  async function loadData() {
    setLoading(true);
    // Load all profiles
    const { data: profiles } = await supabase.from("profiles").select("*").order("last_seen",{ascending:false});
    // Load all chapter data
    const { data: allChapters } = await supabase.from("chapter_data").select("*");

    if (profiles) {
      const enriched = profiles.map(p => ({
        ...p,
        chapters: allChapters?.filter(c=>c.user_id===p.id) || [],
      }));
      setUsers(enriched);
    }
    setLoading(false);
  }

  const now = new Date();
  const oneDayAgo = new Date(now - 24*60*60*1000);
  const oneWeekAgo = new Date(now - 7*24*60*60*1000);
  const activeToday = users.filter(u => new Date(u.last_seen) > oneDayAgo).length;
  const activeWeek = users.filter(u => new Date(u.last_seen) > oneWeekAgo).length;
  const todaySignups = users.filter(u => new Date(u.created_at) > oneDayAgo).length;

  // Chapter struggle analysis across all users
  const chapterStats = {};
  users.forEach(u => {
    u.chapters.forEach(c => {
      if (!chapterStats[c.chapter_id]) chapterStats[c.chapter_id] = { total:0, sumAcc:0, count:0 };
      chapterStats[c.chapter_id].sumAcc += c.accuracy;
      chapterStats[c.chapter_id].count += 1;
    });
  });
  const hardestChapters = Object.entries(chapterStats)
    .map(([id,s]) => ({ id, avgAcc: Math.round(s.sumAcc/s.count), users: s.count }))
    .sort((a,b)=>a.avgAcc-b.avgAcc)
    .slice(0,8);

  const cardStyle = {background:T.bg2,border:`1px solid ${T.border}`,borderRadius:10,padding:"14px 18px"};

  return (
    <div style={{position:"fixed",inset:0,background:T.bg0,zIndex:400,overflowY:"auto",backgroundImage:"radial-gradient(ellipse at 5% 0%,#0F2040,transparent 50%)"}}>
      {/* Header */}
      <div style={{padding:"0 24px",borderBottom:`1px solid ${T.border}`,background:`${T.bg1}DD`,position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:12,height:54,maxWidth:1100,margin:"0 auto"}}>
          <Shield size={18} color={T.purple}/>
          <div style={{fontSize:14,fontWeight:700,color:T.text}}>Admin Dashboard</div>
          <div style={{fontSize:11,color:T.textDim,background:T.purpleDim,padding:"2px 8px",borderRadius:4}}>OWNER ONLY</div>
          <div style={{flex:1}}/>
          <button onClick={loadData} style={{background:"none",border:`1px solid ${T.border}`,borderRadius:6,padding:"5px 10px",color:T.textMuted,cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",gap:5}}><RefreshCw size={11}/> Refresh</button>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:T.textMuted}}><X size={18}/></button>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:"0 auto",padding:"20px 24px"}}>
        {loading ? (
          <div style={{textAlign:"center",padding:"60px 0",color:T.textMuted}}>Loading data…</div>
        ) : (
          <>
            {/* Stats row */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12,marginBottom:20}}>
              {[
                {l:"Total Users",v:users.length,c:T.blue,icon:<Users size={16}/>},
                {l:"New Today",v:todaySignups,c:T.green,icon:<Zap size={16}/>},
                {l:"Active Today",v:activeToday,c:T.amber,icon:<Activity size={16}/>},
                {l:"Active This Week",v:activeWeek,c:T.purple,icon:<TrendingUp size={16}/>},
              ].map(s=>(
                <div key={s.l} style={cardStyle}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,color:s.c}}>{s.icon}<span style={{fontSize:11,color:T.textMuted}}>{s.l}</span></div>
                  <div style={{fontSize:28,fontWeight:800,color:s.c}}>{s.v}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div style={{display:"flex",gap:4,marginBottom:16,borderBottom:`1px solid ${T.border}`,paddingBottom:0}}>
              {[["overview","Overview"],["users","All Users"],["chapters","Chapter Analysis"]].map(([v,l])=>(
                <button key={v} onClick={()=>setTab(v)} style={{padding:"9px 16px",border:"none",borderBottom:`2px solid ${tab===v?T.purple:"transparent"}`,background:"transparent",color:tab===v?T.purple:T.textMuted,fontSize:12,cursor:"pointer",fontWeight:tab===v?700:400}}>{l}</button>
              ))}
            </div>

            {/* Overview tab */}
            {tab==="overview"&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                {/* Recent signups */}
                <div style={cardStyle}>
                  <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:12}}>Recent Signups</div>
                  {users.slice(0,6).map(u=>(
                    <div key={u.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                      <div style={{width:32,height:32,borderRadius:"50%",background:T.bg3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{u.name?u.name[0].toUpperCase():"?"}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:12,fontWeight:600,color:T.text}}>{u.name||"Unnamed"}</div>
                        <div style={{fontSize:10,color:T.textMuted}}>{u.email}</div>
                      </div>
                      <div style={{fontSize:10,color:T.textDim}}>{new Date(u.created_at).toLocaleDateString("en-IN")}</div>
                    </div>
                  ))}
                </div>

                {/* Active/Inactive breakdown */}
                <div style={cardStyle}>
                  <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:12}}>Activity Status</div>
                  {[
                    {l:"Active today",v:activeToday,c:T.green},
                    {l:"Active this week",v:activeWeek,c:T.amber},
                    {l:"Inactive (>7 days)",v:users.length-activeWeek,c:T.red},
                  ].map(s=>(
                    <div key={s.l} style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                      <div style={{flex:1,fontSize:12,color:T.textMuted}}>{s.l}</div>
                      <div style={{width:120,height:6,borderRadius:3,background:T.bg3,overflow:"hidden"}}>
                        <div style={{width:`${users.length?Math.round(s.v/users.length*100):0}%`,height:"100%",background:s.c,borderRadius:3}}/>
                      </div>
                      <div style={{fontSize:13,fontWeight:700,color:s.c,width:28,textAlign:"right"}}>{s.v}</div>
                    </div>
                  ))}
                  <div style={{marginTop:16,fontSize:11,color:T.textDim,borderTop:`1px solid ${T.border}`,paddingTop:12}}>
                    Retention: <span style={{color:T.amber,fontWeight:700}}>{users.length?Math.round(activeWeek/users.length*100):0}%</span> weekly active
                  </div>
                </div>
              </div>
            )}

            {/* All users tab */}
            {tab==="users"&&(
              <div>
                {users.map(u=>{
                  const avgAcc = u.chapters.length ? Math.round(u.chapters.reduce((s,c)=>s+c.accuracy,0)/u.chapters.length) : null;
                  const isActive = new Date(u.last_seen) > oneDayAgo;
                  const isExpanded = selectedUser===u.id;
                  return (
                    <div key={u.id} style={{...cardStyle,marginBottom:8,cursor:"pointer"}} onClick={()=>setSelectedUser(isExpanded?null:u.id)}>
                      <div style={{display:"flex",alignItems:"center",gap:12}}>
                        <div style={{width:38,height:38,borderRadius:"50%",background:`linear-gradient(135deg,${T.blue},${T.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#fff",flexShrink:0}}>
                          {u.name?u.name[0].toUpperCase():"?"}
                        </div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:13,fontWeight:700,color:T.text}}>{u.name||"Unnamed User"}</div>
                          <div style={{fontSize:11,color:T.textMuted}}>{u.email}</div>
                        </div>
                        <div style={{display:"flex",gap:16,alignItems:"center"}}>
                          <div style={{textAlign:"center"}}>
                            <div style={{fontSize:15,fontWeight:700,color:avgAcc?avgAcc>65?T.green:avgAcc>50?T.amber:T.red:T.textDim}}>{avgAcc!==null?`${avgAcc}%`:"—"}</div>
                            <div style={{fontSize:9,color:T.textDim}}>avg acc</div>
                          </div>
                          <div style={{textAlign:"center"}}>
                            <div style={{fontSize:15,fontWeight:700,color:T.blue}}>{u.chapters.length}</div>
                            <div style={{fontSize:9,color:T.textDim}}>chapters</div>
                          </div>
                          <div style={{width:8,height:8,borderRadius:"50%",background:isActive?T.green:T.red,flexShrink:0}} title={isActive?"Active today":"Inactive"}/>
                          <div style={{fontSize:10,color:T.textDim,width:60,textAlign:"right"}}>{new Date(u.last_seen).toLocaleDateString("en-IN")}</div>
                          <ChevronRight size={14} color={T.textDim} style={{transform:isExpanded?"rotate(90deg)":"none",transition:"transform 0.2s"}}/>
                        </div>
                      </div>
                      {isExpanded&&u.chapters.length>0&&(
                        <div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${T.border}`}}>
                          <div style={{fontSize:11,color:T.textMuted,marginBottom:8}}>Chapter breakdown (bottom 6 by accuracy):</div>
                          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:6}}>
                            {[...u.chapters].sort((a,b)=>a.accuracy-b.accuracy).slice(0,6).map(c=>{
                              const ch = INIT_CHAPTERS.find(x=>x.id===c.chapter_id);
                              const color = c.accuracy>65?T.green:c.accuracy>50?T.amber:T.red;
                              return (
                                <div key={c.chapter_id} style={{padding:"6px 10px",background:T.bg3,borderRadius:6,border:`1px solid ${color}33`}}>
                                  <div style={{fontSize:11,color:T.text,marginBottom:2}}>{ch?ch.name.slice(0,24):c.chapter_id}</div>
                                  <div style={{fontSize:13,fontWeight:700,color}}>{c.accuracy}%</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Chapter analysis tab */}
            {tab==="chapters"&&(
              <div style={cardStyle}>
                <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:4}}>Hardest Chapters Across All Users</div>
                <div style={{fontSize:11,color:T.textMuted,marginBottom:16}}>Chapters where students struggle the most (avg accuracy)</div>
                {hardestChapters.length===0?(
                  <div style={{textAlign:"center",padding:"30px",color:T.textDim}}>No chapter data yet — users need to log their scores first.</div>
                ):hardestChapters.map(c=>{
                  const ch=INIT_CHAPTERS.find(x=>x.id===c.id);
                  const color=c.avgAcc>65?T.green:c.avgAcc>50?T.amber:T.red;
                  return (
                    <div key={c.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:12,fontWeight:600,color:T.text}}>{ch?ch.name:c.id}</div>
                        <div style={{fontSize:10,color:T.textMuted}}>{ch?`${ch.subject} · ${ch.topic}`:"—"} · {c.users} user{c.users!==1?"s":""}</div>
                      </div>
                      <div style={{width:140,height:5,borderRadius:3,background:T.bg3,overflow:"hidden"}}>
                        <div style={{width:`${c.avgAcc}%`,height:"100%",background:color,borderRadius:3}}/>
                      </div>
                      <div style={{fontSize:14,fontWeight:700,color,width:42,textAlign:"right"}}>{c.avgAcc}%</div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════════════
// MOBILE APP UI
// ════════════════════════════════════════════════════════════════════════════

// ── MOBILE HOME SCREEN ────────────────────────────────────────────────────────
function MobileHome({ chapters, examDate, daysLeft, urgencyColor, onSetExamDate, onQuickLog, userName }) {
  const danger = chapters.filter(c=>c.group==="Q1").length;
  const avgAcc = Math.round(chapters.reduce((s,c)=>s+c.accuracy,0)/chapters.length);
  const strong = chapters.filter(c=>c.group==="Q4").length;
  const top5 = [...chapters].sort((a,b)=>priorityScore(b)-priorityScore(a)).slice(0,5);

  return (
    <div style={{padding:"0 16px 100px"}}>
      {/* Hero countdown card */}
      <div onClick={onSetExamDate} style={{
        margin:"16px 0 12px",borderRadius:20,padding:"22px 22px",cursor:"pointer",
        background:`linear-gradient(135deg,${T.bg1} 0%,${T.bg2} 100%)`,
        border:`1px solid ${daysLeft!==null?urgencyColor+"44":T.border}`,
        position:"relative",overflow:"hidden",
      }}>
        <div style={{position:"absolute",top:-20,right:-20,width:140,height:140,borderRadius:"50%",
          background:urgencyColor,opacity:0.05}}/>
        <div style={{fontSize:12,color:T.textMuted,marginBottom:4}}>Hey {userName} 👋</div>
        {daysLeft === null ? (
          <div>
            <div style={{fontSize:20,fontWeight:800,color:T.text}}>Set your NEET date</div>
            <div style={{fontSize:13,color:T.textMuted,marginTop:4}}>Tap to set exam date →</div>
          </div>
        ) : (
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:52,fontWeight:900,color:urgencyColor,lineHeight:1,letterSpacing:-2}}>{daysLeft}</div>
              <div style={{fontSize:13,color:T.textMuted,marginTop:4}}>days to NEET</div>
              <div style={{fontSize:11,color:T.textDim,marginTop:2}}>
                {new Date(examDate+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:11,color:T.textDim,marginBottom:6}}>Your status</div>
              <div style={{fontSize:12,color:urgencyColor,fontWeight:700,background:`${urgencyColor}18`,padding:"6px 12px",borderRadius:8}}>
                {daysLeft<=30?"⚡ Final sprint":daysLeft<=60?"🔥 Stay consistent":"📅 On track"}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick stats row */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
        {[
          {v:danger,l:"Danger",c:T.red,bg:T.redDim,icon:"⚡"},
          {v:`${avgAcc}%`,l:"Avg Acc",c:T.amber,bg:T.amberDim,icon:"🎯"},
          {v:strong,l:"Strong",c:T.green,bg:T.greenDim,icon:"✅"},
        ].map(s=>(
          <div key={s.l} style={{padding:"12px 10px",borderRadius:14,background:s.bg,border:`1px solid ${s.c}33`,textAlign:"center"}}>
            <div style={{fontSize:18}}>{s.icon}</div>
            <div style={{fontSize:20,fontWeight:800,color:s.c,marginTop:2}}>{s.v}</div>
            <div style={{fontSize:10,color:T.textMuted,marginTop:1}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Quick log CTA */}
      <button onClick={onQuickLog} style={{
        width:"100%",padding:"16px",borderRadius:16,border:"none",marginBottom:14,
        background:`linear-gradient(135deg,${T.amber},${T.red})`,
        color:"#000",fontSize:15,fontWeight:800,cursor:"pointer",
        display:"flex",alignItems:"center",justifyContent:"center",gap:10,
      }}>
        <PenLine size={18}/> Log Today's Session
      </button>

      {/* Top 5 danger chapters */}
      <div style={{marginBottom:6}}>
        <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
          <Flame size={14} color={T.red}/> Focus Right Now
        </div>
        {top5.map((ch,i)=>{
          const color = getGroupColor(ch.group);
          const score = priorityScore(ch);
          return (
            <div key={ch.id} style={{
              display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
              background:T.bg1,border:`1px solid ${T.border}`,
              borderRadius:12,marginBottom:8,
            }}>
              <div style={{width:28,height:28,borderRadius:8,background:i<3?color:T.bg3,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:12,fontWeight:800,color:i<3?"#000":T.textMuted,flexShrink:0}}>
                {i+1}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ch.name}</div>
                <div style={{display:"flex",gap:8,marginTop:3,alignItems:"center"}}>
                  <span style={{fontSize:10,color:SUBJECT_COLORS[ch.subject]}}>{ch.subject}</span>
                  <div style={{flex:1,height:4,borderRadius:2,background:T.bg3,overflow:"hidden",maxWidth:80}}>
                    <div style={{width:`${ch.accuracy}%`,height:"100%",background:ch.accuracy>65?T.green:ch.accuracy>50?T.amber:T.red,borderRadius:2}}/>
                  </div>
                  <span style={{fontSize:10,color:T.textMuted}}>{ch.accuracy}%</span>
                </div>
              </div>
              <div style={{fontSize:15,fontWeight:800,color,flexShrink:0}}>{score.toFixed(1)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── MOBILE CHAPTERS SCREEN ───────────────────────────────────────────────────
function MobileChapters({ chapters, onUpdateChapters }) {
  const [subject, setSubject] = useState("All");
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("All");

  const filtered = chapters.filter(c => {
    if (subject !== "All" && c.subject !== subject) return false;
    if (group !== "All" && c.group !== group) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a,b) => priorityScore(b) - priorityScore(a));

  function quickEdit(ch, newAcc) {
    const updated = chapters.map(c => c.id===ch.id
      ? {...c, accuracy:newAcc, group:calcGroup(c.weight,newAcc)}
      : c
    );
    onUpdateChapters(updated);
  }

  return (
    <div style={{padding:"0 16px 100px"}}>
      {/* Search */}
      <div style={{display:"flex",alignItems:"center",gap:8,background:T.bg1,border:`1px solid ${T.border}`,borderRadius:12,padding:"10px 14px",margin:"14px 0 10px"}}>
        <Search size={14} color={T.textDim}/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search chapters…"
          style={{background:"none",border:"none",outline:"none",color:T.text,fontSize:14,width:"100%"}}/>
        {search && <button onClick={()=>setSearch("")} style={{background:"none",border:"none",color:T.textDim,cursor:"pointer"}}><X size={14}/></button>}
      </div>

      {/* Subject filter */}
      <div style={{display:"flex",gap:6,marginBottom:8,overflowX:"auto",paddingBottom:4}}>
        {["All","Biology","Chemistry","Physics"].map(s=>(
          <button key={s} onClick={()=>setSubject(s)} style={{
            padding:"6px 14px",borderRadius:20,border:"none",whiteSpace:"nowrap",
            background:subject===s?`${(SUBJECT_COLORS[s]||T.amber)}22`:"transparent",
            color:subject===s?(SUBJECT_COLORS[s]||T.amber):T.textMuted,
            outline:`1px solid ${subject===s?(SUBJECT_COLORS[s]||T.amber):T.border}`,
            fontSize:12,cursor:"pointer",
          }}>{s}</button>
        ))}
      </div>

      {/* Group filter */}
      <div style={{display:"flex",gap:6,marginBottom:14}}>
        {[["All","All"],["Q1","⚡ Danger"],["Q2","🔄 Maintain"],["Q3","📉 Low"],["Q4","✅ Strong"]].map(([v,l])=>(
          <button key={v} onClick={()=>setGroup(v)} style={{
            padding:"5px 10px",borderRadius:20,border:"none",whiteSpace:"nowrap",
            background:group===v?`${getGroupColor(v)}22`:"transparent",
            color:group===v?getGroupColor(v):T.textMuted,
            outline:`1px solid ${group===v?getGroupColor(v):T.border}`,
            fontSize:11,cursor:"pointer",
          }}>{l}</button>
        ))}
      </div>

      <div style={{fontSize:11,color:T.textDim,marginBottom:8}}>{filtered.length} chapters</div>

      {filtered.map(ch => {
        const color = getGroupColor(ch.group);
        return (
          <div key={ch.id} style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:10}}>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:3}}>{ch.name}</div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <span style={{fontSize:10,color:SUBJECT_COLORS[ch.subject]}}>{ch.topic}</span>
                  <span style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:getGroupBg(ch.group),color,fontWeight:600}}>{ch.group}</span>
                  <span style={{fontSize:9,color:T.textDim}}>·</span>
                  <span style={{fontSize:9,color:T.textDim}}>{ch.pyqs} PYQs</span>
                </div>
              </div>
              <div style={{fontSize:20,fontWeight:800,color,flexShrink:0}}>{ch.accuracy}%</div>
            </div>
            {/* Accuracy bar + slider */}
            <div style={{marginBottom:8}}>
              <div style={{height:6,borderRadius:3,background:T.bg3,overflow:"hidden",marginBottom:6}}>
                <div style={{width:`${ch.accuracy}%`,height:"100%",borderRadius:3,
                  background:ch.accuracy>65?T.green:ch.accuracy>50?T.amber:T.red,transition:"width 0.3s"}}/>
              </div>
              <input type="range" min="0" max="100" value={ch.accuracy}
                onChange={e=>quickEdit(ch,Number(e.target.value))}
                style={{width:"100%",accentColor:color,cursor:"pointer"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:11,color:T.textMuted}}>Weight: {ch.weight}/3 · Errors: <span style={{color:T.red,fontWeight:600}}>{ch.errors}</span></div>
              <div style={{fontSize:11,color:color,fontWeight:700}}>Score: {priorityScore(ch).toFixed(1)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── MOBILE PROFILE SCREEN ────────────────────────────────────────────────────
function MobileProfile({ session, examDate, onSetExamDate, onSignOut, isAdmin, onOpenAdmin, savingChapters }) {
  const userName = session?.user?.user_metadata?.full_name || "Student";
  const userEmail = session?.user?.email || "";
  const avatar = userName[0]?.toUpperCase() || "?";

  return (
    <div style={{padding:"16px 16px 100px"}}>
      {/* Profile card */}
      <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:20,padding:"24px",marginBottom:14,textAlign:"center"}}>
        <div style={{width:70,height:70,borderRadius:"50%",
          background:`linear-gradient(135deg,${T.blue},${T.purple})`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:28,fontWeight:800,color:"#fff",margin:"0 auto 12px"}}>
          {avatar}
        </div>
        <div style={{fontSize:18,fontWeight:800,color:T.text}}>{userName}</div>
        <div style={{fontSize:12,color:T.textMuted,marginTop:3}}>{userEmail}</div>
        {savingChapters && <div style={{fontSize:11,color:T.amber,marginTop:8}}>⏳ Saving progress…</div>}
      </div>

      {/* Menu items */}
      {[
        {icon:<Calendar size={18}/>, l:"Exam Date", desc:examDate?new Date(examDate+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}):"Not set", c:T.amber, onClick:onSetExamDate},
        ...(isAdmin?[{icon:<Shield size={18}/>, l:"Admin Dashboard", desc:"View all users & analytics", c:T.purple, onClick:onOpenAdmin}]:[]),
        {icon:<LogOut size={18}/>, l:"Sign Out", desc:"Logout from this device", c:T.red, onClick:onSignOut},
      ].map((item,i) => (
        <button key={i} onClick={item.onClick} style={{
          width:"100%",display:"flex",alignItems:"center",gap:14,padding:"16px",
          background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,
          marginBottom:8,cursor:"pointer",textAlign:"left",
        }}>
          <div style={{width:40,height:40,borderRadius:10,background:`${item.c}18`,
            display:"flex",alignItems:"center",justifyContent:"center",color:item.c,flexShrink:0}}>
            {item.icon}
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:700,color:T.text}}>{item.l}</div>
            <div style={{fontSize:11,color:T.textMuted,marginTop:2}}>{item.desc}</div>
          </div>
          <ChevronRight size={16} color={T.textDim}/>
        </button>
      ))}

      {/* Legend */}
      <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:"16px",marginTop:6}}>
        <div style={{fontSize:12,fontWeight:700,color:T.text,marginBottom:10}}>Quadrant Guide</div>
        {[["Q1","⚡ Danger","High weight, low accuracy. Daily revision."],["Q2","🔄 Maintain","High weight, good accuracy. Weekly review."],["Q3","📉 Low","Low weight, low accuracy. Deprioritise."],["Q4","✅ Strong","Low weight, good accuracy. Glance only."]].map(([q,l,d])=>(
          <div key={q} style={{display:"flex",gap:10,marginBottom:10,alignItems:"flex-start"}}>
            <div style={{width:28,height:28,borderRadius:6,background:getGroupBg(q),display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:getGroupColor(q),flexShrink:0}}>{q}</div>
            <div>
              <div style={{fontSize:12,fontWeight:600,color:getGroupColor(q)}}>{l}</div>
              <div style={{fontSize:11,color:T.textMuted,marginTop:1}}>{d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MOBILE SHELL ─────────────────────────────────────────────────────────────
function MobileApp({ session, chapters, setChapters, handleChaptersUpdate, examDate, daysLeft, urgencyColor, saveExamDate, setExamDateOpen, setQuickLogOpen, handleSignOut, isAdmin, setAdminOpen, savingChapters, adminOpen, quickLogOpen, examDateOpen }) {
  const [tab, setTab] = useState("home");
  const userName = session?.user?.user_metadata?.full_name?.split(" ")[0] || "Student";

  const NAV = [
    { id:"home",  icon:<Home size={20}/>,     label:"Home" },
    { id:"chapters", icon:<BookOpen size={20}/>, label:"Chapters" },
    { id:"log",   icon:<PenLine size={20}/>,   label:"Log" },
    { id:"profile", icon:<User size={20}/>,    label:"Profile" },
  ];

  return (
    <div style={{minHeight:"100vh",background:T.bg0,color:T.text,fontSize:13,
      backgroundImage:"radial-gradient(ellipse at 20% 0%,#0F2040,transparent 60%)"}}>

      {/* Mobile top bar */}
      <div style={{position:"sticky",top:0,zIndex:50,background:`${T.bg1}EE`,
        backdropFilter:"blur(12px)",borderBottom:`1px solid ${T.border}`,
        padding:"0 16px",height:52,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:28,height:28,borderRadius:7,background:`linear-gradient(135deg,${T.red},${T.amber})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Zap size={14} color="#000"/>
          </div>
          <span style={{fontSize:13,fontWeight:800,letterSpacing:0.5}}>NEET MISSION</span>
        </div>
        {savingChapters && <span style={{fontSize:10,color:T.amber}}>Saving…</span>}
      </div>

      {/* Page content */}
      <div style={{overflowY:"auto",height:"calc(100vh - 52px - 64px)"}}>
        {tab==="home" && (
          <MobileHome
            chapters={chapters}
            examDate={examDate}
            daysLeft={daysLeft}
            urgencyColor={urgencyColor}
            onSetExamDate={()=>setExamDateOpen(true)}
            onQuickLog={()=>setQuickLogOpen(true)}
            userName={userName}
          />
        )}
        {tab==="chapters" && (
          <MobileChapters chapters={chapters} onUpdateChapters={handleChaptersUpdate}/>
        )}
        {tab==="log" && (
          // Directly show QuickLog content in-page on mobile
          <div style={{padding:"16px 0 0"}}>
            <div style={{padding:"0 16px",marginBottom:12}}>
              <div style={{fontSize:16,fontWeight:800,color:T.text}}>Quick Log</div>
              <div style={{fontSize:12,color:T.textMuted,marginTop:2}}>Update your accuracy after each session</div>
            </div>
            <MobileChapters chapters={chapters} onUpdateChapters={handleChaptersUpdate}/>
          </div>
        )}
        {tab==="profile" && (
          <MobileProfile
            session={session}
            examDate={examDate}
            onSetExamDate={()=>setExamDateOpen(true)}
            onSignOut={handleSignOut}
            isAdmin={isAdmin}
            onOpenAdmin={()=>setAdminOpen(true)}
            savingChapters={savingChapters}
          />
        )}
      </div>

      {/* Bottom nav bar */}
      <div style={{
        position:"fixed",bottom:0,left:0,right:0,
        height:64,background:`${T.bg1}F5`,
        backdropFilter:"blur(16px)",
        borderTop:`1px solid ${T.border}`,
        display:"flex",zIndex:50,
        paddingBottom:"env(safe-area-inset-bottom)",
      }}>
        {NAV.map(n => {
          // Log tab gets special treatment — opens quick log
          const isLog = n.id === "log";
          const active = tab === n.id;
          return (
            <button key={n.id} onClick={()=>setTab(n.id)} style={{
              flex:1,display:"flex",flexDirection:"column",alignItems:"center",
              justifyContent:"center",gap:3,border:"none",background:"transparent",
              cursor:"pointer",transition:"all 0.15s",
              color: active ? T.amber : T.textMuted,
              position:"relative",
            }}>
              {/* Log button gets a raised pill style */}
              {isLog ? (
                <div style={{
                  width:48,height:48,borderRadius:14,
                  background: active ? `linear-gradient(135deg,${T.amber},${T.red})` : T.bg3,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  color: active ? "#000" : T.textMuted,
                  border:`1px solid ${active?T.amber:T.border}`,
                  marginBottom:-6,
                }}>
                  {n.icon}
                </div>
              ) : (
                <>
                  <div style={{color: active ? T.amber : T.textMuted}}>{n.icon}</div>
                  <div style={{fontSize:10,fontWeight:active?700:400}}>{n.label}</div>
                  {active && <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:24,height:2,borderRadius:1,background:T.amber}}/>}
                </>
              )}
              {!isLog && <div style={{fontSize:10,fontWeight:active?700:400}}>{n.label}</div>}
            </button>
          );
        })}
      </div>

      {/* Modals */}
      {quickLogOpen && <QuickLog chapters={chapters} onUpdate={handleChaptersUpdate} onClose={()=>setQuickLogOpen(false)}/>}
      {examDateOpen && <ExamDateModal current={examDate} onSave={saveExamDate} onClose={()=>setExamDateOpen(false)}/>}
      {adminOpen && isAdmin && <AdminDashboard onClose={()=>setAdminOpen(false)}/>}

      <style>{`*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}::-webkit-scrollbar{display:none}input[type=range]{height:4px;border-radius:2px}`}</style>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
const EXAM_DATE_KEY = "neet_mission_exam_date";

export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [chapters, setChapters] = useState(INIT_CHAPTERS);
  const [savingChapters, setSavingChapters] = useState(false);
  const [examDate, setExamDate] = useState("");
  const [examDateOpen, setExamDateOpen] = useState(false);
  const [subject, setSubject] = useState("All");
  const [selected, setSelected] = useState(null);
  const [quickLogOpen, setQuickLogOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const isAdmin = session?.user?.email === ADMIN_EMAIL;

  // ── Auth listener ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Load user data from Supabase when logged in ──
  useEffect(() => {
    if (!session?.user) return;
    loadUserData();
    updateLastSeen();
    // Load exam date from localStorage (per device preference)
    const saved = localStorage.getItem(`${EXAM_DATE_KEY}_${session.user.id}`);
    if (saved) setExamDate(saved);
  }, [session?.user?.id]);

  async function updateLastSeen() {
    await supabase.from("profiles").upsert({
      id: session.user.id,
      email: session.user.email,
      name: session.user.user_metadata?.full_name || "",
      last_seen: new Date().toISOString(),
    }, { onConflict: "id" });
  }

  async function loadUserData() {
    const { data } = await supabase
      .from("chapter_data")
      .select("*")
      .eq("user_id", session.user.id);

    if (data && data.length > 0) {
      // Merge saved data with default chapters
      setChapters(INIT_CHAPTERS.map(ch => {
        const saved = data.find(d => d.chapter_id === ch.id);
        if (saved) return { ...ch, accuracy: saved.accuracy, errors: saved.errors, group: calcGroup(ch.weight, saved.accuracy) };
        return ch;
      }));
    }
  }

  async function saveChaptersToSupabase(updatedChapters) {
    if (!session?.user) return;
    setSavingChapters(true);
    // Find only changed chapters
    const changed = updatedChapters.filter((ch, i) =>
      ch.accuracy !== INIT_CHAPTERS[i]?.accuracy || ch.errors !== INIT_CHAPTERS[i]?.errors
    );
    const rows = updatedChapters.map(ch => ({
      user_id: session.user.id,
      chapter_id: ch.id,
      accuracy: ch.accuracy,
      errors: ch.errors,
      updated_at: new Date().toISOString(),
    }));
    await supabase.from("chapter_data").upsert(rows, { onConflict: "user_id,chapter_id" });
    setSavingChapters(false);
  }

  function handleChaptersUpdate(updated) {
    setChapters(updated);
    saveChaptersToSupabase(updated);
  }

  function saveExamDate(d) {
    setExamDate(d);
    if (session?.user) localStorage.setItem(`${EXAM_DATE_KEY}_${session.user.id}`, d);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  const daysLeft = calcDaysLeft(examDate);
  const urgencyColor = getUrgencyColor(daysLeft);
  const top10 = [...chapters].sort((a,b)=>priorityScore(b)-priorityScore(a)).slice(0,10);
  const danger = chapters.filter(c=>c.group==="Q1").length;
  const avgAcc = Math.round(chapters.reduce((s,c)=>s+c.accuracy,0)/chapters.length);

  const isMobile = useIsMobile();

  // ── Access gate check ──
  const [unlocked, setUnlocked] = useState(() => {
    try { return localStorage.getItem(ACCESS_KEY) === "1"; } catch(e) { return false; }
  });

  if (!unlocked) return <AccessGate onUnlock={() => setUnlocked(true)} />;

  if (authLoading) return (
    <div style={{minHeight:"100vh",background:T.bg0,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{color:T.textMuted,fontSize:13}}>Loading…</div>
    </div>
  );

  if (!session) return <LoginScreen />;

  const userName = session.user.user_metadata?.full_name?.split(" ")[0] || "Student";

  // ── MOBILE LAYOUT ──
  if (isMobile) return (
    <MobileApp
      session={session}
      chapters={chapters}
      setChapters={setChapters}
      handleChaptersUpdate={handleChaptersUpdate}
      examDate={examDate}
      daysLeft={daysLeft}
      urgencyColor={urgencyColor}
      saveExamDate={saveExamDate}
      setExamDateOpen={setExamDateOpen}
      setQuickLogOpen={setQuickLogOpen}
      handleSignOut={handleSignOut}
      isAdmin={isAdmin}
      setAdminOpen={setAdminOpen}
      savingChapters={savingChapters}
      adminOpen={adminOpen}
      quickLogOpen={quickLogOpen}
      examDateOpen={examDateOpen}
    />
  );

  // ── DESKTOP LAYOUT ──
  const strong = chapters.filter(c=>c.group==="Q4").length;

  return (
    <div style={{minHeight:"100vh",background:T.bg0,color:T.text,fontSize:13,
      backgroundImage:"radial-gradient(ellipse at 5% 0%,#0F2040,transparent 55%),radial-gradient(ellipse at 95% 100%,#1A0820,transparent 55%)"}}>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div style={{padding:"0 28px",borderBottom:`1px solid ${T.border}`,background:`${T.bg1}E8`,backdropFilter:"blur(16px)",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:12,height:60,maxWidth:1400,margin:"0 auto"}}>

          {/* Logo */}
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${T.red},${T.amber})`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 18px ${T.amber}44`}}>
              <Zap size={18} color="#000"/>
            </div>
            <div>
              <div style={{fontSize:14,fontWeight:800,letterSpacing:1,color:T.text}}>NEET MISSION</div>
              <div style={{fontSize:9,color:T.textMuted,letterSpacing:2}}>REVISION COMMAND</div>
            </div>
          </div>

          <div style={{flex:1}}/>

          {/* Subject filter pills */}
          <div style={{display:"flex",gap:5,background:T.bg2,padding:"4px",borderRadius:10,border:`1px solid ${T.border}`}}>
            {["All","Biology","Chemistry","Physics"].map(s=>(
              <button key={s} onClick={()=>setSubject(s)} style={{
                padding:"5px 14px",borderRadius:7,border:"none",fontSize:11,fontWeight:600,cursor:"pointer",transition:"all 0.15s",
                background:subject===s?(SUBJECT_COLORS[s]||T.amber):"transparent",
                color:subject===s?"#000":(SUBJECT_COLORS[s]||T.textMuted),
                boxShadow:subject===s?`0 2px 8px ${(SUBJECT_COLORS[s]||T.amber)}44`:"none",
              }}>{s}</button>
            ))}
          </div>

          {/* Quick Log button */}
          <button onClick={()=>setQuickLogOpen(true)} style={{
            padding:"9px 20px",borderRadius:10,border:"none",
            background:`linear-gradient(135deg,${T.amber},${T.red})`,
            color:"#000",fontSize:13,fontWeight:800,cursor:"pointer",
            display:"flex",alignItems:"center",gap:8,
            boxShadow:`0 4px 16px ${T.amber}44`,transition:"transform 0.15s",
          }}>
            <PenLine size={15}/> Quick Log
          </button>

          {/* Admin */}
          {isAdmin && (
            <button onClick={()=>setAdminOpen(true)} style={{padding:"8px 14px",borderRadius:10,border:`1px solid ${T.purple}55`,background:`${T.purple}18`,color:T.purple,fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
              <Shield size={13}/> Admin
            </button>
          )}

          {/* User avatar + signout */}
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {savingChapters && <span style={{fontSize:10,color:T.amber}}>Saving…</span>}
            <div style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${T.blue},${T.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"#fff"}}>
              {userName[0]?.toUpperCase()}
            </div>
            <button onClick={handleSignOut} title="Sign out" style={{padding:"7px",borderRadius:8,border:`1px solid ${T.border}`,background:"transparent",color:T.textMuted,cursor:"pointer",display:"flex",alignItems:"center"}}>
              <LogOut size={14}/>
            </button>
          </div>
        </div>
      </div>

      {/* ── HERO ROW ───────────────────────────────────────────────────────── */}
      <div style={{maxWidth:1400,margin:"0 auto",padding:"20px 28px 0",display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 2fr",gap:12}}>

        {/* Stat cards */}
        {[
          {emoji:"⚡",v:danger,    l:"Danger",     sub:"Need daily work", c:T.red,    bg:T.redDim},
          {emoji:"🎯",v:`${avgAcc}%`,l:"Avg Accuracy",sub:"Across all chapters",c:T.amber,  bg:T.amberDim},
          {emoji:"✅",v:strong,    l:"Strong",     sub:"Q4 — glance only",c:T.green,  bg:T.greenDim},
          {emoji:"📚",v:chapters.length,l:"Total",sub:"Full NEET syllabus",c:T.blue,bg:T.blueDim},
        ].map(s=>(
          <div key={s.l} style={{
            padding:"18px 20px",borderRadius:16,
            background:`linear-gradient(135deg,${s.bg} 0%,${T.bg1} 100%)`,
            border:`1px solid ${s.c}33`,
            position:"relative",overflow:"hidden",
          }}>
            <div style={{position:"absolute",top:-10,right:-10,width:70,height:70,borderRadius:"50%",background:s.c,opacity:0.08}}/>
            <div style={{fontSize:22,marginBottom:6}}>{s.emoji}</div>
            <div style={{fontSize:28,fontWeight:900,color:s.c,lineHeight:1,letterSpacing:-1}}>{s.v}</div>
            <div style={{fontSize:12,fontWeight:700,color:T.text,marginTop:4}}>{s.l}</div>
            <div style={{fontSize:10,color:T.textMuted,marginTop:2}}>{s.sub}</div>
          </div>
        ))}

        {/* Countdown hero card */}
        <button onClick={()=>setExamDateOpen(true)} style={{
          padding:"20px 24px",borderRadius:16,cursor:"pointer",border:"none",textAlign:"left",
          background:`linear-gradient(135deg,${T.bg1} 0%,${T.bg2} 100%)`,
          outline:`1px solid ${daysLeft!==null?urgencyColor+"55":T.border}`,
          position:"relative",overflow:"hidden",transition:"transform 0.15s",
        }}>
          <div style={{position:"absolute",top:-30,right:-30,width:160,height:160,borderRadius:"50%",background:urgencyColor,opacity:0.06}}/>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:11,color:T.textMuted,marginBottom:6,display:"flex",alignItems:"center",gap:5}}>
                <Calendar size={11}/> NEET COUNTDOWN
              </div>
              {daysLeft===null ? (
                <div>
                  <div style={{fontSize:20,fontWeight:800,color:T.text}}>Set your exam date</div>
                  <div style={{fontSize:12,color:T.textMuted,marginTop:4}}>Click to set →</div>
                </div>
              ) : (
                <>
                  <div style={{fontSize:52,fontWeight:900,color:urgencyColor,lineHeight:1,letterSpacing:-2}}>{daysLeft}</div>
                  <div style={{fontSize:13,color:T.textMuted,marginTop:4}}>days remaining</div>
                  <div style={{fontSize:11,color:T.textDim,marginTop:2}}>
                    {new Date(examDate+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}
                  </div>
                </>
              )}
            </div>
            {daysLeft!==null && (
              <div style={{textAlign:"right",paddingTop:4}}>
                <div style={{fontSize:11,color:T.textDim,marginBottom:8}}>Status</div>
                <div style={{fontSize:12,color:urgencyColor,fontWeight:700,background:`${urgencyColor}18`,padding:"8px 14px",borderRadius:10,border:`1px solid ${urgencyColor}33`}}>
                  {daysLeft<=30?"⚡ Final sprint":daysLeft<=60?"🔥 Consistent grind":"📅 On track"}
                </div>
              </div>
            )}
          </div>
          {/* Thin urgency bar at bottom */}
          {daysLeft!==null && (
            <div style={{position:"absolute",bottom:0,left:0,right:0,height:3,background:T.bg3}}>
              <div style={{height:"100%",background:urgencyColor,width:`${Math.min(100,Math.max(0,(1-daysLeft/365)*100))}%`,borderRadius:2,transition:"width 1s"}}/>
            </div>
          )}
        </button>
      </div>

      {/* ── MAIN GRID ──────────────────────────────────────────────────────── */}
      <div style={{maxWidth:1400,margin:"0 auto",padding:"16px 28px 40px",display:"grid",gridTemplateColumns:"minmax(360px,44%) 1fr",gap:16}}>

        {/* ── LEFT COLUMN ── */}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>

          {/* Priority Matrix card */}
          <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:18,padding:20,boxShadow:"0 4px 24px #00000044"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div>
                <div style={{fontSize:15,fontWeight:800,color:T.text}}>Priority Matrix</div>
                <div style={{fontSize:11,color:T.textMuted,marginTop:2}}>Hover = tooltip · Click dot = detail · Size = errors</div>
              </div>
              <div style={{display:"flex",gap:5}}>
                {["Q1","Q2","Q3","Q4"].map(q=>(
                  <div key={q} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:T.textMuted}}>
                    <div style={{width:8,height:8,borderRadius:2,background:getGroupColor(q)}}/>
                    {q}
                  </div>
                ))}
              </div>
            </div>
            <PriorityMatrix chapters={chapters} onSelect={c=>setSelected(s=>s?.id===c.id?null:c)} selected={selected} subject={subject}/>

            {/* Quadrant summary pills */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:14}}>
              {[
                ["Q1","⚡","Danger","Daily revision cycle"],
                ["Q2","🔄","Maintain","Weekly review"],
                ["Q3","📉","Low","Deprioritise now"],
                ["Q4","✅","Strong","Glance only"],
              ].map(([q,emoji,label,desc])=>{
                const count = chapters.filter(c=>c.group===q).length;
                const color = getGroupColor(q);
                return (
                  <div key={q} style={{padding:"12px 14px",background:getGroupBg(q),borderRadius:12,border:`1px solid ${color}30`,display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:36,height:36,borderRadius:10,background:`${color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
                      {emoji}
                    </div>
                    <div>
                      <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                        <span style={{fontSize:22,fontWeight:900,color,lineHeight:1}}>{count}</span>
                        <span style={{fontSize:12,fontWeight:700,color}}>{label}</span>
                      </div>
                      <div style={{fontSize:10,color:T.textMuted,marginTop:1}}>{desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected chapter detail */}
          {selected && (
            <div style={{background:T.bg1,border:`1px solid ${getGroupColor(selected.group)}44`,borderRadius:18,overflow:"hidden",boxShadow:`0 4px 24px ${getGroupColor(selected.group)}18`}}>
              <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.border}`,background:`linear-gradient(135deg,${getGroupBg(selected.group)}88,transparent)`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div>
                  <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:10,padding:"2px 8px",borderRadius:4,background:getGroupBg(selected.group),color:getGroupColor(selected.group),fontWeight:700}}>{selected.group}</span>
                    <span style={{fontSize:10,color:SUBJECT_COLORS[selected.subject]}}>{selected.subject}</span>
                    <span style={{fontSize:10,color:T.textDim}}>· {selected.topic}</span>
                  </div>
                  <div style={{fontSize:15,fontWeight:800,color:T.text}}>{selected.name}</div>
                </div>
                <button onClick={()=>setSelected(null)} style={{background:"none",border:"none",cursor:"pointer",color:T.textMuted,padding:4}}><X size={16}/></button>
              </div>
              <div style={{padding:"16px 18px"}}>
                {/* Mini stats */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}}>
                  {[
                    {l:"Accuracy",v:`${selected.accuracy}%`,c:selected.accuracy>70?T.green:selected.accuracy>50?T.amber:T.red},
                    {l:"Weight",v:`${selected.weight}/3`,c:T.blue},
                    {l:"PYQs",v:selected.pyqs,c:T.purple},
                    {l:"Score",v:priorityScore(selected).toFixed(1),c:getGroupColor(selected.group)},
                  ].map(s=>(
                    <div key={s.l} style={{textAlign:"center",padding:"10px 6px",background:T.bg2,borderRadius:10,border:`1px solid ${T.border}`}}>
                      <div style={{fontSize:18,fontWeight:800,color:s.c}}>{s.v}</div>
                      <div style={{fontSize:10,color:T.textMuted,marginTop:2}}>{s.l}</div>
                    </div>
                  ))}
                </div>
                {/* Accuracy bar */}
                <div style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:11,color:T.textMuted}}>
                    <span>Accuracy</span><span style={{color:selected.accuracy>65?T.green:selected.accuracy>50?T.amber:T.red,fontWeight:700}}>{selected.accuracy}%</span>
                  </div>
                  <div style={{height:8,borderRadius:4,background:T.bg3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${selected.accuracy}%`,borderRadius:4,background:selected.accuracy>65?T.green:selected.accuracy>50?T.amber:T.red,transition:"width 0.4s"}}/>
                  </div>
                </div>
                {/* Strategy */}
                {(()=>{
                  const plans={Q1:{emoji:"⚡",label:"Daily Microcycles",desc:"PYQs daily + mock every 3 days. Triple revision.",freq:"Daily",target:"≥75%"},Q2:{emoji:"🔄",label:"Weekly Maintenance",desc:"One full test/week. Review errors on weekend.",freq:"Weekly",target:"≥80%"},Q3:{emoji:"📉",label:"Corrective Cycle",desc:"One focused session then deprioritize.",freq:"Fortnightly",target:"≥70%"},Q4:{emoji:"✅",label:"Glance Mode",desc:"10-min review every 2-3 weeks.",freq:"Monthly",target:"Maintain"}};
                  const p=plans[selected.group];
                  const color=getGroupColor(selected.group);
                  return (
                    <div style={{padding:"14px",background:`${getGroupBg(selected.group)}88`,borderRadius:12,border:`1px solid ${color}30`}}>
                      <div style={{fontSize:14,fontWeight:800,color,marginBottom:4}}>{p.emoji} {p.label}</div>
                      <div style={{fontSize:12,color:T.textMuted,lineHeight:1.6,marginBottom:10}}>{p.desc}</div>
                      <div style={{display:"flex",gap:12,fontSize:11}}>
                        <span style={{color:T.textMuted}}>Frequency: <span style={{color:T.text,fontWeight:600}}>{p.freq}</span></span>
                        <span style={{color:T.textMuted}}>Target: <span style={{color,fontWeight:600}}>{p.target}</span></span>
                        <span style={{color:T.textMuted}}>PYQs: <span style={{color:T.blue,fontWeight:600}}>{selected.pyqs}</span></span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>

          {/* Top 10 Priority list — with progress bars */}
          <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:18,padding:20,boxShadow:"0 4px 24px #00000044"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <div>
                <div style={{fontSize:15,fontWeight:800,color:T.text,display:"flex",alignItems:"center",gap:8}}>
                  <Flame size={16} color={T.red}/> Focus List — Top 10
                </div>
                <div style={{fontSize:11,color:T.textMuted,marginTop:2}}>Ranked by priority score · Click to see detail</div>
              </div>
              <button onClick={()=>setQuickLogOpen(true)} style={{padding:"7px 14px",borderRadius:8,border:"none",background:`linear-gradient(135deg,${T.amber},${T.red})`,color:"#000",fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
                <PenLine size={12}/> Log Session
              </button>
            </div>

            {top10.map((ch,i)=>{
              const isSel=selected?.id===ch.id;
              const color=getGroupColor(ch.group);
              const score=priorityScore(ch);
              return (
                <div key={ch.id} onClick={()=>setSelected(s=>s?.id===ch.id?null:ch)} style={{
                  display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
                  marginBottom:6,borderRadius:12,cursor:"pointer",transition:"all 0.15s",
                  background:isSel?`${getGroupBg(ch.group)}CC`:T.bg2,
                  border:`1px solid ${isSel?color:T.border}`,
                  boxShadow:isSel?`0 4px 16px ${color}22`:"none",
                }}>
                  {/* Rank badge */}
                  <div style={{width:30,height:30,borderRadius:8,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,background:i<3?color:T.bg3,color:i<3?"#000":T.textMuted}}>
                    {i+1}
                  </div>
                  {/* Info */}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:700,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ch.name}</div>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
                      <span style={{fontSize:10,color:SUBJECT_COLORS[ch.subject]}}>{ch.subject}</span>
                      <div style={{flex:1,height:5,borderRadius:3,background:T.bg3,overflow:"hidden",maxWidth:120}}>
                        <div style={{height:"100%",width:`${ch.accuracy}%`,background:ch.accuracy>65?T.green:ch.accuracy>50?T.amber:T.red,borderRadius:3,transition:"width 0.4s"}}/>
                      </div>
                      <span style={{fontSize:10,color:T.textMuted}}>{ch.accuracy}%</span>
                      <span style={{fontSize:9,padding:"1px 6px",borderRadius:4,background:getGroupBg(ch.group),color,fontWeight:600}}>{ch.errors} err</span>
                    </div>
                  </div>
                  {/* Score */}
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:18,fontWeight:900,color,lineHeight:1}}>{score.toFixed(1)}</div>
                    <div style={{fontSize:9,color:T.textDim,marginTop:1}}>score</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subject breakdown cards */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
            {["Biology","Chemistry","Physics"].map(sub=>{
              const subChs = chapters.filter(c=>c.subject===sub);
              const subAvg = Math.round(subChs.reduce((s,c)=>s+c.accuracy,0)/subChs.length);
              const subDanger = subChs.filter(c=>c.group==="Q1").length;
              const color = SUBJECT_COLORS[sub];
              return (
                <div key={sub} style={{padding:"16px",borderRadius:14,background:T.bg1,border:`1px solid ${color}33`,cursor:"pointer"}} onClick={()=>setSubject(s=>s===sub?"All":sub)}>
                  <div style={{fontSize:11,color,fontWeight:700,marginBottom:2}}>{sub}</div>
                  <div style={{fontSize:26,fontWeight:900,color,marginBottom:4}}>{subAvg}%</div>
                  <div style={{height:5,borderRadius:3,background:T.bg3,overflow:"hidden",marginBottom:8}}>
                    <div style={{height:"100%",width:`${subAvg}%`,background:color,borderRadius:3}}/>
                  </div>
                  <div style={{fontSize:11,color:T.textMuted}}><span style={{color:T.red,fontWeight:700}}>{subDanger}</span> danger · {subChs.length} chapters</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {quickLogOpen && <QuickLog chapters={chapters} onUpdate={handleChaptersUpdate} onClose={()=>setQuickLogOpen(false)}/>}
      {examDateOpen && <ExamDateModal current={examDate} onSave={saveExamDate} onClose={()=>setExamDateOpen(false)}/>}
      {adminOpen && isAdmin && <AdminDashboard onClose={()=>setAdminOpen(false)}/>}

      <style>{`
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:${T.bg1}}
        ::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}
        input[type=range]{height:4px;border-radius:2px}
        button:active{transform:scale(0.97)}
      `}</style>
    </div>
  );
}

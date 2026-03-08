import { useState, useRef, useEffect } from "react";
import {
  BarChart, Bar, Cell, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend
} from "recharts";
import {
  Menu, X, LogOut, User, ChevronDown, LayoutDashboard,
  History, Bot, BookOpen, TrendingUp, CheckCircle, Star,
  Zap, ArrowRight, FileText, Search, BarChart2, Lightbulb,
  Cpu, Award, ChevronRight, GitBranch, Clock, Target, Flame,
  AlertCircle, ThumbsUp, BookMarked, Code, Eye, EyeOff,
  Lock, Mail, Shield, ArrowLeft, RefreshCw
} from "lucide-react";

// ─── GLOBAL TOKENS ────────────────────────────────────────────
const T = {
  bg:              "#f1f5f9",
  bgGrad:          "linear-gradient(160deg, #f8fafc 0%, #f1f5f9 100%)",
  surface:         "#ffffff",
  surfaceElevated: "#f8fafc",
  surfaceHover:    "#f1f5f9",
  border:          "#e2e8f0",
  borderSubtle:    "#f1f5f9",
  borderHover:     "#cbd5e1",
  accent:          "#16a34a",
  accentHover:     "#15803d",
  accentDim:       "rgba(22,163,74,0.10)",
  accentSoft:      "rgba(22,163,74,0.05)",
  accentGlow:      "0 0 24px rgba(22,163,74,0.20)",
  blue:            "#2563eb",
  blueDim:         "rgba(37,99,235,0.10)",
  amber:           "#d97706",
  amberDim:        "rgba(217,119,6,0.10)",
  rose:            "#e11d48",
  roseDim:         "rgba(225,29,72,0.10)",
  violet:          "#7c3aed",
  violetDim:       "rgba(124,58,237,0.10)",
  cyan:            "#0891b2",
  cyanDim:         "rgba(8,145,178,0.10)",
  textPrimary:     "#0f172a",
  textSecondary:   "#475569",
  textMuted:       "#94a3b8",
};

const BAR_COLORS = [T.accent, T.blue, T.amber, T.rose, T.violet, T.cyan];

// ─── SHARED DATA ──────────────────────────────────────────────
const SEED_PROBLEMS = [
  { id:1, title:"Shortest path in weighted graph",  difficulty:"Hard",   date:"Mar 07", time:"45 min", tags:["Graph","Dijkstra"], score:92, algo:"Dijkstra's Algorithm" },
  { id:2, title:"Sort array of n integers",          difficulty:"Medium", date:"Mar 05", time:"20 min", tags:["Sorting","D&C"],    score:85, algo:"Merge Sort" },
  { id:3, title:"Find all subsets of a set",         difficulty:"Medium", date:"Mar 03", time:"28 min", tags:["Backtracking"],     score:78, algo:"Backtracking" },
  { id:4, title:"Two Sum — return indices",          difficulty:"Easy",   date:"Mar 01", time:"10 min", tags:["Array","HashMap"],  score:95, algo:"Hash Map" },
  { id:5, title:"Longest common subsequence",        difficulty:"Hard",   date:"Feb 28", time:"55 min", tags:["DP"],               score:70, algo:"Bottom-Up DP" },
  { id:6, title:"Detect cycle in directed graph",    difficulty:"Medium", date:"Feb 26", time:"35 min", tags:["Graph","DFS"],      score:88, algo:"DFS with color marking" },
];
const PERFORMANCE_DATA = [
  { week:"W1", solved:2,  accuracy:62, speed:40 },
  { week:"W2", solved:4,  accuracy:70, speed:55 },
  { week:"W3", solved:3,  accuracy:68, speed:50 },
  { week:"W4", solved:7,  accuracy:80, speed:70 },
  { week:"W5", solved:6,  accuracy:82, speed:74 },
  { week:"W6", solved:10, accuracy:90, speed:85 },
];
const RADAR_DATA = [
  { skill:"Arrays", score:88 }, { skill:"Trees",  score:72 },
  { skill:"DP",     score:58 }, { skill:"Graphs", score:68 },
  { skill:"Sort",   score:92 }, { skill:"Search", score:80 },
];
const EXAMPLES = [
  "Shortest path between two nodes in a weighted graph",
  "Find two numbers in an array that add up to a target",
  "Sort a linked list in O(n log n) time",
  "Find the longest palindromic substring",
];
const NAV = [
  { key:"dashboard",   label:"Dashboard",   icon:LayoutDashboard },
  { key:"problems",    label:"My Problems", icon:History },
  { key:"mentor",      label:"AI Mentor",   icon:Bot },
  { key:"quiz",        label:"Quiz",        icon:BookOpen },
  { key:"performance", label:"Performance", icon:TrendingUp },
];
const diffColor = { Easy: T.accent, Medium: T.amber, Hard: T.rose };
const diffBg    = { Easy: T.accentDim, Medium: T.amberDim, Hard: T.roseDim };

// ─── PROBLEM CLASSIFIER ───────────────────────────────────────
function classifyProblem(text) {
  const t = text.toLowerCase();
  if (/graph|node|edge|path|cycle|dijkstra|bfs|dfs/.test(t)) return "Graph";
  if (/tree|bst|binary|inorder|traversal|root/.test(t)) return "Tree";
  if (/dp|dynamic|subsequence|knapsack|memoiz/.test(t)) return "Dynamic Programming";
  if (/sort|order|arrange|rank/.test(t)) return "Sorting";
  if (/search|find|target|lookup/.test(t)) return "Searching";
  if (/string|substr|palindrome|anagram/.test(t)) return "String";
  if (/array|subarray|window|prefix/.test(t)) return "Array";
  return "General";
}
function recommendAlgorithms(type) {
  const map = {
    "Graph":                ["Dijkstra's Algorithm","BFS","DFS","Bellman-Ford"],
    "Tree":                 ["DFS Traversal","BFS Level Order","Binary Search Tree","AVL Tree"],
    "Dynamic Programming":  ["Bottom-Up DP","Top-Down Memoization","Tabulation","Greedy Fallback"],
    "Sorting":              ["Merge Sort","Quick Sort","Heap Sort","Tim Sort"],
    "Searching":            ["Binary Search","Two Pointers","Sliding Window","Hash Map"],
    "String":               ["KMP Algorithm","Rabin-Karp","Suffix Array","Z-Algorithm"],
    "Array":                ["Two Pointers","Prefix Sum","Hash Map","Divide & Conquer"],
    "General":              ["Brute Force","Greedy","Divide & Conquer","Backtracking"],
  };
  return map[type] || map["General"];
}

// ─── ALGO DECISION TREE DATA ──────────────────────────────────
const ALGO_TREE = {
  id:"root", label:"Problem Input", icon:"📋", color:T.blue,
  children:[
    { id:"classify", label:"Classify Type", icon:"🔍", color:T.violet,
      children:[
        { id:"graph", label:"Graph Problem", icon:"🕸", color:T.cyan,
          children:[
            { id:"weighted", label:"Weighted?", icon:"⚖️", color:T.amber,
              children:[
                { id:"dijkstra", label:"Dijkstra's", icon:"🏁", color:T.accent, leaf:true, complexity:"O((V+E) log V)" },
                { id:"bellman",  label:"Bellman-Ford", icon:"🔄", color:T.rose,  leaf:true, complexity:"O(VE)" },
              ]
            },
            { id:"unweighted", label:"Unweighted?", icon:"📏", color:T.blue,
              children:[
                { id:"bfs", label:"BFS", icon:"🌊", color:T.blue,   leaf:true, complexity:"O(V+E)" },
                { id:"dfs", label:"DFS", icon:"🌀", color:T.violet, leaf:true, complexity:"O(V+E)" },
              ]
            },
          ]
        },
        { id:"array", label:"Array / String", icon:"📊", color:T.accent,
          children:[
            { id:"sorted", label:"Sorted Input?", icon:"📶", color:T.blue,
              children:[
                { id:"binsearch", label:"Binary Search", icon:"🎯", color:T.accent, leaf:true, complexity:"O(log n)" },
                { id:"twoptr",    label:"Two Pointers",  icon:"👆", color:T.cyan,   leaf:true, complexity:"O(n)" },
              ]
            },
            { id:"subproblem", label:"Overlapping Sub?", icon:"🧩", color:T.violet,
              children:[
                { id:"dp",      label:"Dynamic Prog.", icon:"⚡", color:T.amber, leaf:true, complexity:"O(n²)" },
                { id:"sliding", label:"Sliding Window", icon:"🪟", color:T.rose,  leaf:true, complexity:"O(n)" },
              ]
            },
          ]
        },
        { id:"tree", label:"Tree Problem", icon:"🌳", color:T.amber,
          children:[
            { id:"traversal", label:"Traversal?", icon:"🚶", color:T.cyan,
              children:[
                { id:"inorder",     label:"In/Pre/Post DFS", icon:"📍", color:T.accent, leaf:true, complexity:"O(n)" },
                { id:"levelorder",  label:"Level Order BFS", icon:"📐", color:T.blue,   leaf:true, complexity:"O(n)" },
              ]
            },
            { id:"bst", label:"BST Operation?", icon:"🔑", color:T.rose,
              children:[
                { id:"bstop",   label:"BST Search/Insert", icon:"🔎", color:T.violet, leaf:true, complexity:"O(log n)" },
                { id:"balance", label:"AVL / Red-Black",   icon:"⚖️", color:T.amber,  leaf:true, complexity:"O(log n)" },
              ]
            },
          ]
        },
      ]
    },
    { id:"constraints", label:"Check Constraints", icon:"📐", color:T.amber,
      children:[
        { id:"time", label:"Time Priority", icon:"⏱", color:T.rose,
          children:[
            { id:"greedy", label:"Greedy Algo",      icon:"🏃", color:T.accent, leaf:true, complexity:"O(n log n)" },
            { id:"divide", label:"Divide & Conquer", icon:"✂️", color:T.blue,   leaf:true, complexity:"O(n log n)" },
          ]
        },
        { id:"space", label:"Space Priority", icon:"💾", color:T.violet,
          children:[
            { id:"inplace", label:"In-place Sort", icon:"🔀", color:T.cyan,  leaf:true, complexity:"O(1) space" },
            { id:"hash",    label:"Hash Map",      icon:"🗂", color:T.amber, leaf:true, complexity:"O(n) space" },
          ]
        },
      ]
    },
  ]
};

// ─── GLOBAL CSS ───────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%}
  body{background:${T.bg};color:${T.textPrimary};font-family:'Outfit',sans-serif;-webkit-font-smoothing:antialiased}
  ::-webkit-scrollbar{width:4px;height:4px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:${T.border};border-radius:99px}
  ::-webkit-scrollbar-thumb:hover{background:${T.borderHover}}

  @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes scaleIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
  @keyframes glow{0%,100%{box-shadow:0 0 10px rgba(22,163,74,0.15)}50%{box-shadow:0 0 22px rgba(22,163,74,0.35)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  @keyframes slideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}

  .btn-primary{
    display:inline-flex;align-items:center;gap:9px;padding:13px 32px;border-radius:12px;
    background:linear-gradient(135deg,${T.accent},#15803d);color:#ffffff;border:none;
    font-weight:800;font-size:15px;cursor:pointer;font-family:'Outfit',sans-serif;
    box-shadow:0 6px 24px rgba(22,163,74,0.30);letter-spacing:-0.2px;
    transition:all 0.22s cubic-bezier(0.4,0,0.2,1);
  }
  .btn-primary:hover{transform:translateY(-2px) scale(1.02);box-shadow:0 12px 36px rgba(22,163,74,0.35)}
  .btn-primary:active{transform:translateY(0) scale(0.98)}

  .btn-ghost{
    display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:10px;
    background:transparent;color:${T.textSecondary};border:1px solid ${T.border};
    font-weight:600;font-size:13px;cursor:pointer;font-family:'Outfit',sans-serif;
    transition:all 0.18s;
  }
  .btn-ghost:hover{border-color:${T.accent};color:${T.accent};background:${T.accentSoft}}

  .card{
    background:${T.surface};border:1px solid ${T.border};border-radius:16px;
    transition:all 0.2s;
  }
  .card:hover{border-color:${T.borderHover};box-shadow:0 8px 32px rgba(0,0,0,0.08)}

  .nav-item{
    width:100%;display:flex;align-items:center;gap:11px;padding:10px 14px;
    border-radius:11px;border:none;background:transparent;
    color:${T.textSecondary};font-weight:500;font-size:13.5px;cursor:pointer;
    margin-bottom:2px;text-align:left;font-family:'Outfit',sans-serif;
    border-left:2px solid transparent;transition:all 0.17s;
  }
  .nav-item:hover{background:${T.accentSoft};color:${T.accent};border-left-color:${T.accent}50}
  .nav-item.active{background:${T.accentDim};color:${T.accent};font-weight:700;border-left-color:${T.accent}}

  .chip{
    background:${T.surfaceElevated};border:1px solid ${T.border};border-radius:99px;
    padding:5px 14px;font-size:11px;color:${T.textSecondary};cursor:pointer;
    font-family:'Outfit',sans-serif;transition:all 0.15s;
  }
  .chip:hover{background:${T.accentDim};color:${T.accent};border-color:${T.accent}50}

  .flow-node{transition:all 0.2s;cursor:pointer}
  .flow-node:hover{filter:brightness(1.2);transform:scale(1.05)}
  .flow-leaf{animation:glow 2.8s ease-in-out infinite}

  .input-field{
    width:100%;padding:12px 14px 12px 42px;border-radius:10px;
    border:1px solid ${T.border};background:${T.surfaceElevated};
    color:${T.textPrimary};font-size:14px;font-family:'Outfit',sans-serif;
    outline:none;transition:all 0.2s;
  }
  .input-field:focus{border-color:${T.accent};box-shadow:0 0 0 3px ${T.accentDim};background:${T.surfaceHover}}
  .input-field::placeholder{color:${T.textMuted}}

  .problem-row{transition:all 0.18s;cursor:default}
  .problem-row:hover{border-color:${T.accent}40!important;background:${T.surfaceElevated}!important}

  .quiz-opt{transition:all 0.18s}
  .quiz-opt:not(:disabled):hover{border-color:${T.accent}80!important;background:${T.accentSoft}!important;color:${T.accent}!important}

  .tag{
    background:${T.surfaceElevated};border:1px solid ${T.border};border-radius:6px;
    padding:2px 9px;font-size:11px;color:${T.textSecondary};font-weight:600;
    font-family:'JetBrains Mono',monospace;
  }
`;

// ─── HELPERS ──────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:T.surfaceElevated, border:`1px solid ${T.border}`, borderRadius:10, padding:"10px 14px", fontSize:12, color:T.textPrimary, boxShadow:"0 8px 24px rgba(0,0,0,0.12)" }}>
      <div style={{ color:T.textMuted, marginBottom:4 }}>{label}</div>
      {payload.map((p,i) => <div key={i} style={{ color:p.color||T.accent, fontWeight:700 }}>{p.name}: {p.value}</div>)}
    </div>
  );
};

// ─── FLOW NODE ────────────────────────────────────────────────
function FlowNode({ node, depth=0 }) {
  const [exp, setExp] = useState(depth < 2);
  const hasC = node.children?.length > 0;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
      <div
        className={`flow-node ${node.leaf ? "flow-leaf":""}`}
        onClick={() => hasC && setExp(e=>!e)}
        style={{
          position:"relative",
          background: node.leaf ? `linear-gradient(135deg,${node.color}18,${node.color}08)` : T.surfaceElevated,
          border:`1.5px solid ${node.color}${node.leaf?"70":"35"}`,
          borderRadius:12, padding:"9px 14px",
          display:"flex", alignItems:"center", gap:7,
          minWidth:130, maxWidth:160,
          boxShadow: node.leaf ? `0 0 14px ${node.color}18` : "none",
        }}
      >
        <span style={{ fontSize:13 }}>{node.icon}</span>
        <span style={{ fontSize:11, fontWeight:700, color:node.leaf?node.color:T.textPrimary, lineHeight:1.3, fontFamily:"'Outfit',sans-serif" }}>{node.label}</span>
        {node.leaf && node.complexity && (
          <span style={{ position:"absolute", top:-17, left:"50%", transform:"translateX(-50%)", background:`${node.color}18`, border:`1px solid ${node.color}35`, borderRadius:99, padding:"1px 7px", fontSize:9, color:node.color, fontFamily:"'JetBrains Mono',monospace", whiteSpace:"nowrap", fontWeight:600 }}>
            {node.complexity}
          </span>
        )}
        {hasC && <ChevronRight size={10} color={T.textMuted} style={{ marginLeft:"auto", transform:exp?"rotate(90deg)":"rotate(0deg)", transition:"transform 0.22s", flexShrink:0 }}/>}
      </div>
      {hasC && exp && (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
          <div style={{ width:2, height:18, background:`linear-gradient(to bottom,${node.color}50,${node.color}20)` }}/>
          <div style={{ display:"flex", alignItems:"flex-start", gap:16, position:"relative" }}>
            {node.children.map((c,i) => (
              <div key={c.id} style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                <div style={{ width:2, height:18, background:`linear-gradient(to bottom,${node.color}25,${c.color}45)` }}/>
                <FlowNode node={c} depth={depth+1}/>
              </div>
            ))}
            {node.children.length > 1 && (
              <div style={{ position:"absolute", top:0, left:"12%", right:"12%", height:2, background:`linear-gradient(to right,${node.children[0].color}30,${node.children[node.children.length-1].color}30)` }}/>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ALGO FLOWCHART PANEL ─────────────────────────────────────
function AlgoFlowChart() {
  const [zoom, setZoom] = useState(1);
  return (
    <div className="card" style={{ padding:"22px 20px", marginBottom:20, overflow:"hidden" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18, flexWrap:"wrap", gap:10 }}>
        <div>
          <div style={{ fontSize:14, fontWeight:800, color:T.textPrimary, display:"flex", alignItems:"center", gap:8 }}>
            <GitBranch size={15} color={T.accent}/> Algorithm Decision Tree
          </div>
          <div style={{ fontSize:11, color:T.textMuted, marginTop:2 }}>Click any node to expand or collapse its branch</div>
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <button className="btn-ghost" style={{ padding:"5px 11px", fontSize:12 }} onClick={() => setZoom(z=>Math.max(0.55,z-0.1))}>−</button>
          <span style={{ fontSize:11, color:T.textMuted, fontFamily:"'JetBrains Mono',monospace", minWidth:36, textAlign:"center" }}>{Math.round(zoom*100)}%</span>
          <button className="btn-ghost" style={{ padding:"5px 11px", fontSize:12 }} onClick={() => setZoom(z=>Math.min(1.4,z+0.1))}>+</button>
          <button className="btn-ghost" style={{ fontSize:11 }} onClick={() => setZoom(1)}>Reset</button>
        </div>
      </div>
      <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:16 }}>
        {[{color:T.blue,label:"Entry"},{color:T.violet,label:"Classify"},{color:T.cyan,label:"Problem Type"},{color:T.accent,label:"Algorithm"}].map(l=>(
          <div key={l.label} style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:9,height:9,borderRadius:3,background:l.color,boxShadow:`0 0 5px ${l.color}60` }}/>
            <span style={{ fontSize:10,color:T.textMuted,fontWeight:500 }}>{l.label}</span>
          </div>
        ))}
      </div>
      <div style={{ overflowX:"auto", paddingBottom:12 }}>
        <div style={{ transform:`scale(${zoom})`, transformOrigin:"top center", transition:"transform 0.2s", paddingTop:22, paddingBottom:16, minWidth:820, display:"flex", justifyContent:"center" }}>
          <FlowNode node={ALGO_TREE}/>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────
function Sidebar({ active, onNav, open, onClose, onLogout, user }) {
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const initial = name[0].toUpperCase();
  return (
    <>
      {open && <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",zIndex:40,backdropFilter:"blur(6px)",animation:"fadeIn 0.2s" }}/>}
      <aside style={{ position:"fixed",top:0,left:0,height:"100vh",width:256,background:T.surface,zIndex:50,display:"flex",flexDirection:"column",transform:open?"translateX(0)":"translateX(-100%)",transition:"transform 0.28s cubic-bezier(0.4,0,0.2,1)",borderRight:`1px solid ${T.border}`,boxShadow:open?"16px 0 48px rgba(0,0,0,0.12)":"none" }}>
        {/* Brand */}
        <div style={{ padding:"18px 16px 14px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:34,height:34,borderRadius:10,background:`linear-gradient(135deg,${T.accent},${T.blue})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,boxShadow:`0 4px 14px ${T.accent}35`,animation:"float 3s ease-in-out infinite" }}>🧠</div>
            <div>
              <div style={{ fontWeight:800,fontSize:14,color:T.textPrimary,letterSpacing:"-0.3px" }}>AlgoMind</div>
              <div style={{ fontSize:9,color:T.textMuted,marginTop:1,fontWeight:600,letterSpacing:1,textTransform:"uppercase" }}>AI for Bharat</div>
            </div>
          </div>
          <button className="btn-ghost" style={{ padding:6 }} onClick={onClose}><X size={13}/></button>
        </div>
        {/* User pill */}
        <div style={{ padding:"12px 16px",borderBottom:`1px solid ${T.borderSubtle}`,display:"flex",alignItems:"center",gap:10 }}>
          <div style={{ width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${T.accent}70,${T.blue}70)`,display:"flex",alignItems:"center",justifyContent:"center",color:T.textPrimary,fontWeight:800,fontSize:13,border:`2px solid ${T.accent}35`,flexShrink:0 }}>{initial}</div>
          <div style={{ overflow:"hidden" }}>
            <div style={{ fontSize:13,fontWeight:700,color:T.textPrimary,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{name}</div>
            <div style={{ fontSize:10,color:T.textMuted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{user?.email}</div>
          </div>
        </div>
        <nav style={{ flex:1,padding:"10px 10px",overflowY:"auto" }}>
          <div style={{ fontSize:9,fontWeight:700,color:T.textMuted,padding:"6px 8px",letterSpacing:1.5,textTransform:"uppercase",marginBottom:4 }}>Navigation</div>
          {NAV.map(({ key,label,icon:Icon }) => (
            <button key={key} className={`nav-item${active===key?" active":""}`} onClick={() => { onNav(key); onClose(); }}>
              <Icon size={15}/>{label}
              {active===key && <div style={{ marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:T.accent,boxShadow:`0 0 8px ${T.accent}` }}/>}
            </button>
          ))}
        </nav>
        <div style={{ padding:"10px 10px",borderTop:`1px solid ${T.border}` }}>
          <button onClick={onLogout} style={{ width:"100%",display:"flex",alignItems:"center",gap:9,padding:"10px 14px",borderRadius:10,border:`1px solid ${T.roseDim}`,background:T.roseDim,color:T.rose,fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"'Outfit',sans-serif",transition:"all 0.15s" }}>
            <LogOut size={13}/> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── AVATAR MENU ──────────────────────────────────────────────
function AvatarMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const initial = (user?.user_metadata?.full_name||user?.email||"U")[0].toUpperCase();
  const name = user?.user_metadata?.full_name||user?.email?.split("@")[0]||"User";
  return (
    <div ref={ref} style={{ position:"relative" }}>
      <button onClick={()=>setOpen(o=>!o)} style={{ display:"flex",alignItems:"center",gap:8,background:T.surfaceElevated,border:`1px solid ${T.border}`,borderRadius:10,padding:"5px 12px 5px 5px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",transition:"all 0.15s" }}>
        <div style={{ width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${T.accent}70,${T.blue}70)`,display:"flex",alignItems:"center",justifyContent:"center",color:T.textPrimary,fontWeight:800,fontSize:12,border:`1.5px solid ${T.accent}35` }}>{initial}</div>
        <span style={{ fontSize:13,fontWeight:600,color:T.textPrimary }}>{name}</span>
        <ChevronDown size={11} color={T.textMuted} style={{ transform:open?"rotate(180deg)":"rotate(0)",transition:"transform 0.2s" }}/>
      </button>
      {open && (
        <div style={{ position:"absolute",right:0,top:"calc(100% + 8px)",background:T.surfaceElevated,border:`1px solid ${T.border}`,borderRadius:14,padding:8,minWidth:200,boxShadow:"0 16px 48px rgba(0,0,0,0.12)",zIndex:200,animation:"fadeUp 0.15s ease" }}>
          <div style={{ padding:"8px 12px 10px",borderBottom:`1px solid ${T.border}`,marginBottom:6 }}>
            <div style={{ fontSize:13,fontWeight:700,color:T.textPrimary }}>{name}</div>
            <div style={{ fontSize:10,color:T.textMuted,marginTop:2 }}>{user?.email}</div>
          </div>
          <button style={{ width:"100%",display:"flex",alignItems:"center",gap:8,padding:"9px 12px",borderRadius:8,border:"none",background:"transparent",color:T.textSecondary,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"'Outfit',sans-serif",textAlign:"left" }}>
            <User size={13}/> My Profile
          </button>
          <button onClick={()=>{setOpen(false);onLogout();}} style={{ width:"100%",display:"flex",alignItems:"center",gap:8,padding:"9px 12px",borderRadius:8,border:"none",background:T.roseDim,color:T.rose,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",textAlign:"left",marginTop:4 }}>
            <LogOut size={13}/> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

// ─── PAGE: HOME ───────────────────────────────────────────────
function PageHome({ user, onNav, onSolve, solvedProblems, chartData }) {
  const [problem, setProblem] = useState("");
  const [chartType, setChartType] = useState("bar");
  const solved = solvedProblems.length;
  const avgScore = solved > 0 ? Math.round(solvedProblems.reduce((a,p)=>a+p.score,0)/solved) : 0;
  const hasText = problem.trim().length > 0;

  return (
    <div style={{ animation:"fadeUp 0.3s ease" }}>
      {/* Welcome */}
      <div className="card" style={{ padding:"22px 24px",marginBottom:18,background:`linear-gradient(135deg,${T.surface},${T.surfaceElevated})`,position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:-40,right:-40,width:200,height:200,borderRadius:"50%",background:`radial-gradient(circle,${T.accent}06,transparent 70%)`,pointerEvents:"none" }}/>
        <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:16 }}>
          <div>
            <div style={{ fontSize:10,color:T.accent,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6 }}>Welcome back</div>
            <div style={{ fontSize:21,fontWeight:800,color:T.textPrimary,letterSpacing:"-0.5px" }}>{user?.user_metadata?.full_name||user?.email} 👋</div>
            <div style={{ fontSize:13,color:T.textSecondary,marginTop:6,maxWidth:380,lineHeight:1.6 }}>Describe your problem — the AI pipeline will classify, analyse, and recommend the optimal algorithm.</div>
          </div>
          <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
            {[
              { icon:CheckCircle, value:solved,       label:"Solved",    color:T.accent },
              { icon:Star,        value:avgScore+"%", label:"Avg Score", color:T.amber },
              { icon:Flame,       value:"6 days",     label:"Streak",    color:T.rose },
            ].map(({ icon:Icon,value,label,color })=>(
              <div key={label} style={{ background:T.bg,border:`1px solid ${color}25`,borderRadius:12,padding:"12px 16px",display:"flex",alignItems:"center",gap:10 }}>
                <div style={{ width:34,height:34,borderRadius:9,background:`${color}15`,display:"flex",alignItems:"center",justifyContent:"center" }}><Icon size={16} color={color}/></div>
                <div>
                  <div style={{ fontSize:18,fontWeight:800,color:T.textPrimary,lineHeight:1 }}>{value}</div>
                  <div style={{ fontSize:10,color:T.textMuted,marginTop:3,fontWeight:600 }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Problem Input */}
      <div className="card" style={{ padding:"24px 26px",marginBottom:18 }}>
        <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:6 }}>
          <div style={{ width:28,height:28,borderRadius:8,background:T.accentDim,display:"flex",alignItems:"center",justifyContent:"center" }}><Code size={14} color={T.accent}/></div>
          <div style={{ fontSize:14,fontWeight:800,color:T.textPrimary }}>Problem Statement</div>
        </div>
        <div style={{ fontSize:12,color:T.textSecondary,marginBottom:16,lineHeight:1.6 }}>
          Start typing to unlock the <span style={{ color:T.accent,fontWeight:700 }}>Solve</span> button. The AI pipeline runs 6 stages in real time.
        </div>

        {/* Pipeline strip */}
        <div style={{ display:"flex",alignItems:"center",gap:4,flexWrap:"wrap",padding:"10px 14px",background:T.bg,borderRadius:12,border:`1px solid ${T.borderSubtle}`,marginBottom:16 }}>
          {[
            { icon:FileText, color:T.blue,   label:"Parse" },
            { icon:Search,   color:T.violet, label:"Classify" },
            { icon:BarChart2,color:T.amber,  label:"Constraints" },
            { icon:Lightbulb,color:T.cyan,   label:"Strategies" },
            { icon:Cpu,      color:T.rose,   label:"Efficiency" },
            { icon:Award,    color:T.accent, label:"Recommend" },
          ].map((s,i,arr)=>(
            <div key={i} style={{ display:"flex",alignItems:"center",gap:4 }}>
              <div style={{ display:"flex",alignItems:"center",gap:5,background:`${s.color}12`,border:`1px solid ${s.color}25`,borderRadius:99,padding:"3px 10px" }}>
                <s.icon size={10} color={s.color}/><span style={{ fontSize:10,fontWeight:700,color:s.color }}>{s.label}</span>
              </div>
              {i<arr.length-1 && <ChevronRight size={10} color={T.textMuted}/>}
            </div>
          ))}
        </div>

        <textarea
          value={problem}
          onChange={e=>setProblem(e.target.value)}
          placeholder="e.g. Find the shortest path between two nodes in a weighted undirected graph with non-negative edge weights..."
          rows={5}
          style={{ width:"100%",borderRadius:12,border:`1.5px solid ${hasText?T.accent:T.border}`,padding:"14px 16px",fontSize:14,color:T.textPrimary,fontFamily:"'Outfit',sans-serif",resize:"vertical",outline:"none",lineHeight:1.7,boxSizing:"border-box",background:hasText?`${T.accent}07`:T.surfaceElevated,transition:"all 0.25s",boxShadow:hasText?`0 0 0 3px ${T.accentDim}`:"none" }}
          onFocus={e=>{ e.target.style.borderColor=T.accent; e.target.style.boxShadow=`0 0 0 3px ${T.accentDim}`; }}
          onBlur={e=>{ if(!hasText){ e.target.style.borderColor=T.border; e.target.style.boxShadow="none"; } }}
        />

        <div style={{ marginTop:12,display:"flex",flexWrap:"wrap",gap:7,alignItems:"center" }}>
          <span style={{ fontSize:11,color:T.textMuted,fontWeight:600 }}>Try:</span>
          {EXAMPLES.map((ex,i)=>(
            <button key={i} className="chip" onClick={()=>setProblem(ex)}>{ex.length>40?ex.slice(0,40)+"…":ex}</button>
          ))}
        </div>

        {hasText && (
          <div style={{ marginTop:20,borderTop:`1px solid ${T.border}`,paddingTop:20,animation:"fadeUp 0.22s ease",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap" }}>
            <button className="btn-primary" onClick={()=>onSolve(problem.trim())}>
              <Zap size={16} fill="currentColor"/> Analyse & Solve <ArrowRight size={15}/>
            </button>
            <div style={{ fontSize:12,color:T.textMuted,lineHeight:1.7 }}>
              Runs through <span style={{ color:T.accent,fontWeight:700 }}>6 pipeline stages</span> and recommends<br/>the optimal algorithm with complexity analysis.
            </div>
          </div>
        )}
      </div>

      {/* Decision Tree */}
      <AlgoFlowChart/>

      {/* Recently Solved Live Feed */}
      <div className="card" style={{ padding:"18px 22px", marginBottom:18 }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8 }}>
          <div style={{ display:"flex",alignItems:"center",gap:9 }}>
            <div style={{ width:8,height:8,borderRadius:"50%",background:T.accent,boxShadow:`0 0 8px ${T.accent}`,animation:"pulse 2s ease-in-out infinite" }}/>
            <div style={{ fontSize:14,fontWeight:800,color:T.textPrimary }}>Recently Solved</div>
          </div>
          <button className="btn-ghost" style={{ fontSize:11,padding:"5px 12px" }} onClick={()=>onNav("problems")}>View all →</button>
        </div>
        {solvedProblems.length === 0 ? (
          <div style={{ textAlign:"center",padding:"28px 0",color:T.textMuted,fontSize:13 }}>
            No problems solved yet. Submit your first problem above! 🚀
          </div>
        ) : (
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {solvedProblems.slice(0,5).map((p,i)=>(
              <div key={p.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:11,background:i===0&&solvedProblems.length>6?`${T.accent}07`:T.surfaceElevated,border:`1px solid ${i===0&&solvedProblems.length>6?T.accent+"30":T.border}`,transition:"all 0.18s",position:"relative",overflow:"hidden" }}>
                {/* Rank */}
                <div style={{ width:28,height:28,borderRadius:8,background:`${BAR_COLORS[i%BAR_COLORS.length]}15`,border:`1px solid ${BAR_COLORS[i%BAR_COLORS.length]}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:BAR_COLORS[i%BAR_COLORS.length],flexShrink:0 }}>#{i+1}</div>
                {/* Info */}
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontSize:13,fontWeight:700,color:T.textPrimary,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",display:"flex",alignItems:"center",gap:7 }}>
                    {p.title}
                    {i===0&&solvedProblems.length>6 && <span style={{ background:`${T.accent}20`,border:`1px solid ${T.accent}40`,borderRadius:99,padding:"1px 7px",fontSize:9,color:T.accent,fontWeight:800,flexShrink:0 }}>NEW</span>}
                  </div>
                  <div style={{ fontSize:11,color:T.textMuted,marginTop:2,display:"flex",alignItems:"center",gap:8 }}>
                    <span style={{ display:"flex",alignItems:"center",gap:3 }}><Clock size={9}/>{p.date}</span>
                    <span>·</span>
                    <span style={{ display:"flex",alignItems:"center",gap:3 }}><Target size={9}/>{p.time}</span>
                    {p.algo && <><span>·</span><span style={{ fontFamily:"'JetBrains Mono',monospace",color:T.blue,fontSize:10 }}>{p.algo}</span></>}
                  </div>
                </div>
                {/* Right badges */}
                <div style={{ display:"flex",alignItems:"center",gap:6,flexShrink:0 }}>
                  <span style={{ background:diffBg[p.difficulty],color:diffColor[p.difficulty],fontSize:10,fontWeight:700,borderRadius:6,padding:"2px 8px" }}>{p.difficulty}</span>
                  <span style={{ background:T.accentDim,color:T.accent,fontSize:11,fontWeight:800,borderRadius:6,padding:"2px 9px",fontFamily:"'JetBrains Mono',monospace" }}>{p.score}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent chart */}
      <div className="card" style={{ padding:"20px 22px" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:8 }}>
          <div>
            <div style={{ fontSize:14,fontWeight:800,color:T.textPrimary }}>Recent Scores</div>
            <div style={{ fontSize:11,color:T.textMuted,marginTop:2 }}>Performance across last 6 problems</div>
          </div>
          <div style={{ display:"flex",background:T.bg,border:`1px solid ${T.border}`,borderRadius:9,padding:3,gap:2 }}>
            {["bar","line"].map(t=>(
              <button key={t} onClick={()=>setChartType(t)} style={{ padding:"5px 14px",borderRadius:7,fontSize:12,fontWeight:700,border:"none",cursor:"pointer",background:chartType===t?T.surfaceElevated:"transparent",color:chartType===t?T.textPrimary:T.textMuted,fontFamily:"'Outfit',sans-serif",transition:"all 0.15s" }}>
                {t==="bar"?"Bar":"Line"}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={190}>
          {chartType==="bar"?(
            <BarChart data={chartData} barSize={26} margin={{ top:4,right:8,left:-12,bottom:0 }}>
              <CartesianGrid vertical={false} stroke={T.border}/>
              <XAxis dataKey="name" tick={{ fill:T.textMuted,fontSize:10 }} axisLine={false} tickLine={false}/>
              <YAxis domain={[0,100]} tick={{ fill:T.textMuted,fontSize:11 }}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="score" radius={[6,6,0,0]}>{chartData.map((_,i)=><Cell key={i} fill={BAR_COLORS[i%BAR_COLORS.length]}/>)}</Bar>
            </BarChart>
          ):(
            <LineChart data={chartData} margin={{ top:4,right:8,left:-12,bottom:0 }}>
              <CartesianGrid stroke={T.border}/>
              <XAxis dataKey="name" tick={{ fill:T.textMuted,fontSize:10 }} axisLine={false} tickLine={false}/>
              <YAxis domain={[0,100]} tick={{ fill:T.textMuted,fontSize:11 }}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Line type="monotone" dataKey="score" stroke={T.accent} strokeWidth={2.5} dot={({ cx,cy,index })=><circle key={index} cx={cx} cy={cy} r={5} fill={BAR_COLORS[index%BAR_COLORS.length]} stroke={T.bg} strokeWidth={2}/>}/>
            </LineChart>
          )}
        </ResponsiveContainer>
        <div style={{ display:"flex",gap:8,marginTop:14,flexWrap:"wrap" }}>
          {solvedProblems.slice(0,4).map((p,i)=>(

            <div key={p.id} style={{ background:T.bg,border:`1px solid ${T.border}`,borderRadius:9,padding:"6px 11px",display:"flex",alignItems:"center",gap:7 }}>
              <div style={{ width:7,height:7,borderRadius:"50%",background:BAR_COLORS[i],boxShadow:`0 0 5px ${BAR_COLORS[i]}` }}/>
              <span style={{ fontSize:11,color:T.textSecondary,fontWeight:500 }}>{p.title.slice(0,22)}…</span>
              <span style={{ background:diffBg[p.difficulty],color:diffColor[p.difficulty],fontSize:10,fontWeight:700,borderRadius:5,padding:"1px 7px" }}>{p.difficulty}</span>
            </div>
          ))}
          <button className="btn-ghost" style={{ fontSize:11,padding:"6px 12px",borderStyle:"dashed" }} onClick={()=>onNav("problems")}>View all →</button>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: PROBLEMS ───────────────────────────────────────────
function PageProblems({ solvedProblems, chartData }) {
  const [chartType, setChartType] = useState("bar");
  const [filter, setFilter] = useState("All");
  const filtered = filter==="All" ? solvedProblems : solvedProblems.filter(p=>p.difficulty===filter);
  return (
    <div style={{ animation:"fadeUp 0.3s ease" }}>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:21,fontWeight:800,color:T.textPrimary,letterSpacing:"-0.5px" }}>My Problems</h2>
        <p style={{ color:T.textSecondary,fontSize:13,marginTop:4 }}>{solvedProblems.length} solved · filter by difficulty</p>
      </div>
      <div style={{ display:"flex",gap:7,marginBottom:16 }}>
        {["All","Easy","Medium","Hard"].map(d=>(
          <button key={d} onClick={()=>setFilter(d)} style={{ padding:"5px 15px",borderRadius:99,fontSize:12,fontWeight:700,border:`1px solid ${filter===d?(diffColor[d]||T.accent):T.border}`,background:filter===d?(diffColor[d]?diffBg[d]:T.accentDim):"transparent",color:filter===d?(diffColor[d]||T.accent):T.textMuted,cursor:"pointer",fontFamily:"'Outfit',sans-serif",transition:"all 0.15s" }}>
            {d}
          </button>
        ))}
      </div>
      <div className="card" style={{ padding:"18px 20px",marginBottom:16 }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
          <div style={{ fontSize:13,fontWeight:700,color:T.textPrimary }}>Score Overview</div>
          <div style={{ display:"flex",background:T.bg,border:`1px solid ${T.border}`,borderRadius:9,padding:3,gap:2 }}>
            {["bar","line"].map(t=><button key={t} onClick={()=>setChartType(t)} style={{ padding:"5px 13px",borderRadius:7,fontSize:11,fontWeight:700,border:"none",cursor:"pointer",background:chartType===t?T.surfaceElevated:"transparent",color:chartType===t?T.textPrimary:T.textMuted,fontFamily:"'Outfit',sans-serif" }}>{t==="bar"?"Bar":"Line"}</button>)}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={190}>
          {chartType==="bar"?(
            <BarChart data={chartData} barSize={24} margin={{ top:4,right:8,left:-12,bottom:0 }}>
              <CartesianGrid vertical={false} stroke={T.border}/><XAxis dataKey="name" tick={{ fill:T.textMuted,fontSize:10 }} axisLine={false} tickLine={false}/><YAxis domain={[0,100]} tick={{ fill:T.textMuted,fontSize:11 }}/><Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="score" radius={[6,6,0,0]}>{chartData.map((_,i)=><Cell key={i} fill={BAR_COLORS[i%BAR_COLORS.length]}/>)}</Bar>
            </BarChart>
          ):(
            <LineChart data={chartData} margin={{ top:4,right:8,left:-12,bottom:0 }}>
              <CartesianGrid stroke={T.border}/><XAxis dataKey="name" tick={{ fill:T.textMuted,fontSize:10 }} axisLine={false} tickLine={false}/><YAxis domain={[0,100]} tick={{ fill:T.textMuted,fontSize:11 }}/><Tooltip content={<CustomTooltip/>}/>
              <Line type="monotone" dataKey="score" stroke={T.accent} strokeWidth={2.5} dot={({ cx,cy,index })=><circle key={index} cx={cx} cy={cy} r={5} fill={BAR_COLORS[index%BAR_COLORS.length]} stroke={T.bg} strokeWidth={2}/>}/>
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:9 }}>
        {filtered.map((p,i)=>(
          <div key={p.id} className="problem-row" style={{ background:T.surface,borderRadius:13,padding:"14px 18px",border:`1px solid ${T.border}`,borderLeft:`3px solid ${BAR_COLORS[i%BAR_COLORS.length]}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10 }}>
            <div style={{ display:"flex",alignItems:"center",gap:12 }}>
              <div style={{ width:36,height:36,borderRadius:10,background:`${BAR_COLORS[i%BAR_COLORS.length]}14`,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${BAR_COLORS[i%BAR_COLORS.length]}28`,flexShrink:0 }}><CheckCircle size={15} color={BAR_COLORS[i%BAR_COLORS.length]}/></div>
              <div>
                <div style={{ fontWeight:700,fontSize:13.5,color:T.textPrimary }}>{p.title}</div>
                <div style={{ fontSize:11,color:T.textMuted,marginTop:3,display:"flex",alignItems:"center",gap:8 }}>
                  <span style={{ display:"flex",alignItems:"center",gap:3 }}><Clock size={9}/>{p.date}</span>
                  <span>·</span><span style={{ display:"flex",alignItems:"center",gap:3 }}><Target size={9}/>{p.time}</span>
                </div>
              </div>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:7,flexWrap:"wrap" }}>
              {p.tags.map(t=><span key={t} className="tag">{t}</span>)}
              <span style={{ background:diffBg[p.difficulty],color:diffColor[p.difficulty],borderRadius:6,padding:"2px 9px",fontSize:11,fontWeight:700 }}>{p.difficulty}</span>
              <span style={{ background:T.accentDim,color:T.accent,borderRadius:6,padding:"2px 9px",fontSize:12,fontWeight:800 }}>{p.score}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PAGE: MENTOR (Real AI Chat) ──────────────────────────────
const getMentorSystem = (solvedProblems) => `You are AlgoMind AI Mentor — an expert algorithms and data structures tutor specializing in competitive programming and coding interviews. You help Indian students and developers master DSA concepts.

The user's profile:
- Problems solved: ${solvedProblems.length} total
- Average score: ${solvedProblems.length > 0 ? Math.round(solvedProblems.reduce((a,p)=>a+p.score,0)/solvedProblems.length) : 0}%
- Weakest area: Dynamic Programming (58%)
- Strongest area: Sorting (92%)
- Current streak: 6 days
- Recent problems solved: ${solvedProblems.slice(0,4).map(p=>p.title).join(', ')}

Your personality:
- Encouraging, precise, and concise
- Use examples and analogies to explain concepts
- Give actionable advice (specific problems to solve, patterns to study)
- When explaining algorithms, mention time/space complexity
- Keep responses focused and well-structured
- Use emojis occasionally to keep tone friendly
- Address the user as a fellow developer

Always be helpful about: algorithm explanations, complexity analysis, problem-solving strategies, interview tips, roadmap suggestions, and code pattern discussions.`;

const QUICK_PROMPTS = [
  { label:"📈 Improve my DP", text:"My Dynamic Programming score is 58%. What specific problems and patterns should I focus on to improve?" },
  { label:"🗺 Study roadmap",  text:"Give me a 4-week DSA study roadmap based on my current profile." },
  { label:"⏱ Interview tips", text:"What are the top 5 tips for cracking DSA interviews at top tech companies?" },
  { label:"🕸 Graph patterns", text:"What are the most common graph algorithm patterns I should know for interviews?" },
  { label:"🔍 Explain BFS vs DFS", text:"Explain BFS vs DFS with examples of when to use each one." },
  { label:"💡 Easy win topics", text:"Which topics can I quickly improve to boost my overall score the fastest?" },
];

function PageMentor({ solvedProblems }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey! 👋 I'm your **AlgoMind AI Mentor**. I've analysed your profile — you're doing great with a 6-day streak and 85% average!\n\nYour biggest opportunity is **Dynamic Programming** (58%). I can help you build a targeted plan, explain any algorithm, or just answer your DSA questions. What would you like to work on?"
    }
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput("");

    const newMessages = [...messages, { role:"user", content:userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: getMentorSystem(solvedProblems),
          messages: newMessages.map(m => ({ role:m.role, content:m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't generate a response. Please try again.";
      setMessages(prev => [...prev, { role:"assistant", content:reply }]);
    } catch {
      setMessages(prev => [...prev, { role:"assistant", content:"⚠️ Connection error. Please check your internet and try again." }]);
    }
    setLoading(false);
  };

  const handleKey = e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => setMessages([{
    role:"assistant",
    content:"Chat cleared! 🔄 Ask me anything about algorithms, data structures, or your study plan."
  }]);

  // Render markdown-like bold (**text**) and line breaks
  const renderContent = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} style={{ color:T.textPrimary, fontWeight:700 }}>{part.slice(2,-2)}</strong>;
      }
      return part.split("\n").map((line, j) => (
        <span key={`${i}-${j}`}>{line}{j < part.split("\n").length - 1 && <br/>}</span>
      ));
    });
  };

  return (
    <div style={{ animation:"fadeUp 0.3s ease", display:"flex", flexDirection:"column", height:"calc(100vh - 120px)", minHeight:500 }}>
      {/* Header */}
      <div style={{ marginBottom:14, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <div>
          <h2 style={{ fontSize:21, fontWeight:800, color:T.textPrimary, letterSpacing:"-0.5px", display:"flex", alignItems:"center", gap:9 }}>
            <div style={{ width:32,height:32,borderRadius:10,background:`linear-gradient(135deg,${T.accent},${T.blue})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>🤖</div>
            AI Mentor
            <span style={{ background:T.accentDim,border:`1px solid ${T.accent}30`,borderRadius:99,padding:"2px 10px",fontSize:10,color:T.accent,fontWeight:700 }}>LIVE</span>
          </h2>
          <p style={{ color:T.textSecondary, fontSize:12, marginTop:4, marginLeft:41 }}>Powered by Claude · Ask anything about DSA, algorithms, or your study plan</p>
        </div>
        <button className="btn-ghost" style={{ fontSize:12, padding:"6px 12px" }} onClick={clearChat}>
          <RefreshCw size={12}/> Clear
        </button>
      </div>

      {/* Stats strip */}
      <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap", flexShrink:0 }}>
        {[{l:"6-day streak",c:T.accent,i:"🔥"},{l:"85% avg score",c:T.amber,i:"⭐"},{l:"Top 30%",c:T.violet,i:"🏆"},{l:"DP needs work",c:T.rose,i:"📈"}].map(b=>(
          <div key={b.l} style={{ background:`${b.c}10`,border:`1px solid ${b.c}25`,borderRadius:99,padding:"4px 12px",fontSize:11,color:b.c,fontWeight:700,display:"flex",alignItems:"center",gap:5 }}>
            <span>{b.i}</span>{b.l}
          </div>
        ))}
      </div>

      {/* Chat window */}
      <div className="card" style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", padding:0 }}>
        {/* Messages */}
        <div style={{ flex:1, overflowY:"auto", padding:"18px 18px 8px", display:"flex", flexDirection:"column", gap:14 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display:"flex", gap:10, flexDirection:m.role==="user"?"row-reverse":"row", alignItems:"flex-start" }}>
              {/* Avatar */}
              <div style={{ width:30,height:30,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,
                background: m.role==="assistant" ? `linear-gradient(135deg,${T.accent},${T.blue})` : `linear-gradient(135deg,${T.violet},${T.blue})`,
                border:`2px solid ${m.role==="assistant"?T.accent:T.violet}30`
              }}>
                {m.role==="assistant" ? "🤖" : "👤"}
              </div>
              {/* Bubble */}
              <div style={{
                maxWidth:"78%", padding:"11px 15px", borderRadius:14,
                borderTopLeftRadius:  m.role==="assistant"?4:14,
                borderTopRightRadius: m.role==="user"?4:14,
                background: m.role==="assistant" ? T.surface : `linear-gradient(135deg,${T.accent},#15803d)`,
                border: m.role==="assistant" ? `1px solid ${T.border}` : "none",
                color: m.role==="assistant" ? T.textSecondary : "#fff",
                fontSize:13.5, lineHeight:1.7,
                boxShadow: m.role==="user" ? `0 4px 14px ${T.accent}25` : "0 2px 8px rgba(0,0,0,0.06)",
              }}>
                {m.role==="assistant" ? renderContent(m.content) : m.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
              <div style={{ width:30,height:30,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,background:`linear-gradient(135deg,${T.accent},${T.blue})` }}>🤖</div>
              <div style={{ padding:"12px 16px",borderRadius:14,borderTopLeftRadius:4,background:T.surface,border:`1px solid ${T.border}`,display:"flex",gap:5,alignItems:"center" }}>
                {[0,1,2].map(j=>(
                  <div key={j} style={{ width:7,height:7,borderRadius:"50%",background:T.accent,animation:`pulse 1.2s ease-in-out ${j*0.2}s infinite` }}/>
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* Quick prompts */}
        {messages.length <= 2 && (
          <div style={{ padding:"8px 18px", borderTop:`1px solid ${T.border}`, flexShrink:0 }}>
            <div style={{ fontSize:10,color:T.textMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8 }}>Quick questions</div>
            <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
              {QUICK_PROMPTS.map((p,i)=>(
                <button key={i} className="chip" style={{ fontSize:11 }} onClick={()=>sendMessage(p.text)}>{p.label}</button>
              ))}
            </div>
          </div>
        )}

        {/* Input bar */}
        <div style={{ padding:"12px 14px", borderTop:`1px solid ${T.border}`, display:"flex", gap:10, alignItems:"flex-end", flexShrink:0, background:T.surfaceElevated }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about algorithms, complexity, interview tips, study plans…"
            rows={1}
            style={{ flex:1,borderRadius:12,border:`1.5px solid ${input?T.accent:T.border}`,padding:"10px 14px",fontSize:13.5,color:T.textPrimary,fontFamily:"'Outfit',sans-serif",resize:"none",outline:"none",lineHeight:1.6,background:T.surface,transition:"all 0.2s",boxShadow:input?`0 0 0 3px ${T.accentDim}`:"none",maxHeight:120,overflow:"auto" }}
            onInput={e=>{ e.target.style.height="auto"; e.target.style.height=Math.min(e.target.scrollHeight,120)+"px"; }}
          />
          <button
            onClick={()=>sendMessage()}
            disabled={!input.trim()||loading}
            style={{ width:40,height:40,borderRadius:11,border:"none",background:input.trim()&&!loading?`linear-gradient(135deg,${T.accent},#15803d)`:`${T.accent}30`,color:input.trim()&&!loading?"#fff":T.accent,cursor:input.trim()&&!loading?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s",boxShadow:input.trim()&&!loading?`0 4px 12px ${T.accent}35`:"none" }}
          >
            <ArrowRight size={16}/>
          </button>
        </div>
      </div>
    </div>
  );
}


const LOCAL_QUIZ_QUESTIONS = [
  // Arrays & Searching
  {q:"What is the time complexity of Binary Search?",a:["O(n)","O(log n)","O(n^2)","O(1)"],c:"O(log n)"},
  {q:"Worst-case time complexity of Linear Search?",a:["O(1)","O(log n)","O(n)","O(n^2)"],c:"O(n)"},
  {q:"Which technique uses two indices moving toward each other?",a:["Sliding Window","Divide & Conquer","Two Pointers","Backtracking"],c:"Two Pointers"},
  {q:"Time complexity of accessing an array element by index?",a:["O(n)","O(log n)","O(n^2)","O(1)"],c:"O(1)"},
  {q:"Which algorithm finds the majority element in O(n) time and O(1) space?",a:["Kadane's","Boyer-Moore Voting","Dutch National Flag","Floyd's Cycle"],c:"Boyer-Moore Voting"},
  {q:"What is the maximum subarray sum algorithm called?",a:["Kadane's Algorithm","Kruskal's Algorithm","Floyd-Warshall","Bellman-Ford"],c:"Kadane's Algorithm"},
  {q:"Sliding window is most useful for which problem type?",a:["Graph traversal","Finding subarrays/substrings","Sorting","Tree traversal"],c:"Finding subarrays/substrings"},
  {q:"Time complexity of building a prefix sum array?",a:["O(1)","O(log n)","O(n)","O(n^2)"],c:"O(n)"},
  {q:"Which data structure enables O(1) average lookup by key?",a:["Array","Linked List","Hash Map","Binary Tree"],c:"Hash Map"},
  {q:"Best sorting algorithm for nearly sorted data?",a:["Quick Sort","Merge Sort","Insertion Sort","Heap Sort"],c:"Insertion Sort"},
  // Sorting
  {q:"Average-case time complexity of Quick Sort?",a:["O(n)","O(n log n)","O(n^2)","O(log n)"],c:"O(n log n)"},
  {q:"Which sorting algorithm is stable and has O(n log n) worst case?",a:["Quick Sort","Heap Sort","Merge Sort","Shell Sort"],c:"Merge Sort"},
  {q:"Space complexity of Merge Sort?",a:["O(1)","O(log n)","O(n)","O(n^2)"],c:"O(n)"},
  {q:"Which sort has the best worst-case but is NOT stable?",a:["Merge Sort","Quick Sort","Heap Sort","Tim Sort"],c:"Heap Sort"},
  {q:"Best-case time complexity of Bubble Sort?",a:["O(n^2)","O(n log n)","O(n)","O(log n)"],c:"O(n)"},
  {q:"Counting Sort works best when?",a:["Data is floating point","Range of values is small","Data is already sorted","Data has no duplicates"],c:"Range of values is small"},
  {q:"Time complexity of Radix Sort?",a:["O(n log n)","O(n^2)","O(nk)","O(n)"],c:"O(nk)"},
  {q:"Which algorithm sorts by repeatedly selecting the minimum element?",a:["Bubble Sort","Insertion Sort","Selection Sort","Shell Sort"],c:"Selection Sort"},
  {q:"Worst-case time complexity of Quick Sort?",a:["O(n log n)","O(n)","O(n^2)","O(log n)"],c:"O(n^2)"},
  {q:"Which sort is used internally by most language standard libraries?",a:["Quick Sort","Merge Sort","Tim Sort","Heap Sort"],c:"Tim Sort"},
  // Graphs
  {q:"Which algorithm finds shortest path in an unweighted graph?",a:["DFS","Dijkstra","BFS","Bellman-Ford"],c:"BFS"},
  {q:"Which algorithm handles negative edge weights for shortest path?",a:["Dijkstra","BFS","Bellman-Ford","Floyd-Warshall"],c:"Bellman-Ford"},
  {q:"Floyd-Warshall solves which problem?",a:["Single source shortest path","All-pairs shortest path","Minimum spanning tree","Cycle detection"],c:"All-pairs shortest path"},
  {q:"Time complexity of Dijkstra with a min-heap?",a:["O(V^2)","O(E log V)","O(VE)","O(V+E)"],c:"O(E log V)"},
  {q:"Which MST algorithm uses greedy edge selection with Union-Find?",a:["Prim's","Kruskal's","Dijkstra","BFS"],c:"Kruskal's"},
  {q:"Topological sort is only applicable to which graph type?",a:["Undirected","Cyclic","DAG","Complete graph"],c:"DAG"},
  {q:"Which data structure is used for iterative DFS?",a:["Queue","Stack","Heap","Hash Map"],c:"Stack"},
  {q:"Time complexity of BFS/DFS on a graph with V vertices and E edges?",a:["O(V)","O(E)","O(V+E)","O(V*E)"],c:"O(V+E)"},
  {q:"Which algorithm detects cycles in a directed graph?",a:["BFS","Dijkstra","DFS with color marking","Kruskal's"],c:"DFS with color marking"},
  {q:"Kruskal's algorithm uses which data structure?",a:["Stack","Queue","Disjoint Set (Union-Find)","Min-Heap"],c:"Disjoint Set (Union-Find)"},
  // Trees
  {q:"Height of a balanced BST with n nodes?",a:["O(n)","O(n^2)","O(log n)","O(1)"],c:"O(log n)"},
  {q:"Which BST traversal gives nodes in sorted order?",a:["Pre-order","Post-order","In-order","Level-order"],c:"In-order"},
  {q:"Time complexity of search in an AVL tree?",a:["O(n)","O(log n)","O(n log n)","O(1)"],c:"O(log n)"},
  {q:"Maximum children a node can have in a binary tree?",a:["Exactly 2","At most 2","At least 1","Unlimited"],c:"At most 2"},
  {q:"Which traversal visits the root BEFORE its children?",a:["In-order","Post-order","Pre-order","Level-order"],c:"Pre-order"},
  {q:"What is a complete binary tree?",a:["Every node has 2 children","All levels full except possibly the last","All leaves at same level","Root has no parent"],c:"All levels full except possibly the last"},
  {q:"What self-balancing tree uses red/black coloring?",a:["AVL Tree","B-Tree","Red-Black Tree","Splay Tree"],c:"Red-Black Tree"},
  {q:"Time complexity of inserting into a Heap?",a:["O(1)","O(log n)","O(n)","O(n log n)"],c:"O(log n)"},
  {q:"A trie is primarily used for?",a:["Sorting numbers","String prefix search","Graph traversal","Shortest path"],c:"String prefix search"},
  {q:"Which traversal is used to delete a tree safely?",a:["Pre-order","In-order","Post-order","Level-order"],c:"Post-order"},
  // Dynamic Programming
  {q:"What does DP stand for?",a:["Data Processing","Dynamic Programming","Depth Prioritization","Divide & Process"],c:"Dynamic Programming"},
  {q:"What is memoization?",a:["Sorting memory","Caching results of subproblems","Allocating heap space","Greedy selection"],c:"Caching results of subproblems"},
  {q:"Time complexity of naive recursive Fibonacci?",a:["O(n)","O(n log n)","O(2^n)","O(n^2)"],c:"O(2^n)"},
  {q:"Time complexity of DP Fibonacci?",a:["O(2^n)","O(n log n)","O(n)","O(log n)"],c:"O(n)"},
  {q:"Time complexity of Longest Common Subsequence?",a:["O(n)","O(n log n)","O(n^2)","O(2^n)"],c:"O(n^2)"},
  {q:"Which DP approach builds solutions from smallest subproblems upward?",a:["Top-down","Memoization","Bottom-up tabulation","Greedy"],c:"Bottom-up tabulation"},
  {q:"0/1 Knapsack time complexity?",a:["O(n)","O(n log n)","O(nW)","O(2^n)"],c:"O(nW)"},
  {q:"Coin Change problem is best solved with?",a:["Greedy only","Dynamic Programming","BFS only","Backtracking"],c:"Dynamic Programming"},
  {q:"Key property required for DP to be applicable?",a:["All subproblems independent","Overlapping subproblems + optimal substructure","Only greedy choices work","Sorted input required"],c:"Overlapping subproblems + optimal substructure"},
  {q:"Edit distance between two strings is computed using?",a:["Two pointers","Sliding window","Dynamic Programming","Greedy"],c:"Dynamic Programming"},
  // Data Structures
  {q:"Which data structure follows FIFO order?",a:["Stack","Queue","Heap","Tree"],c:"Queue"},
  {q:"Which data structure follows LIFO order?",a:["Queue","Stack","Heap","Linked List"],c:"Stack"},
  {q:"Time complexity of push and pop in a stack?",a:["O(n)","O(log n)","O(1)","O(n^2)"],c:"O(1)"},
  {q:"A deque supports insertion and deletion at?",a:["Front only","Rear only","Both front and rear","Middle only"],c:"Both front and rear"},
  {q:"Which heap gives the minimum element at the root?",a:["Max-Heap","Min-Heap","AVL Heap","B-Heap"],c:"Min-Heap"},
  {q:"Time complexity of finding min/max in a Heap?",a:["O(n)","O(log n)","O(1)","O(n log n)"],c:"O(1)"},
  {q:"Amortized time complexity of dynamic array append?",a:["O(n)","O(log n)","O(1)","O(n^2)"],c:"O(1)"},
  {q:"Ideal data structure for implementing an LRU cache?",a:["Array + Stack","HashMap + Doubly Linked List","BST + Queue","Heap + Trie"],c:"HashMap + Doubly Linked List"},
  {q:"A priority queue is typically implemented with?",a:["Stack","Linked List","Heap","Hash Map"],c:"Heap"},
  {q:"Which structure is best for implementing undo/redo functionality?",a:["Queue","Heap","Stack","Trie"],c:"Stack"},
];
function getLocalQuiz() {
  const shuffled = [...LOCAL_QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5);
  return shuffled.map(q => ({
    question: q.q,
    correct: q.c,
    answers: [...q.a].sort(() => Math.random() - 0.5),
  }));
}

// ─── PAGE: QUIZ ───────────────────────────────────────────────
function PageQuiz() {
  const [questions, setQuestions] = useState([]);
  const [cur, setCur] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadQuiz = () => {
    setLoading(true); setDone(false);
    setCur(0); setScore(0); setSelected(null); setAnswered(false);
    fetch("https://opentdb.com/api.php?amount=5&category=18&type=multiple")
      .then(r=>r.json())
      .then(data=>{
        const q = data.results.map(q=>({ question:q.question, answers:[...q.incorrect_answers,q.correct_answer].sort(()=>Math.random()-0.5), correct:q.correct_answer }));
        setQuestions(q); setLoading(false);
      })
      .catch(()=>{ setQuestions(getLocalQuiz()); setLoading(false); });
  };
  useEffect(()=>{ loadQuiz(); },[]);

  const pick = ans => {
    if(answered) return;
    setSelected(ans); setAnswered(true);
    if(ans===questions[cur].correct) setScore(s=>s+1);
  };
  const next = () => {
    if(cur+1<questions.length){ setCur(c=>c+1); setSelected(null); setAnswered(false); }
    else setDone(true);
  };

  if(loading) return (
    <div style={{ textAlign:"center",padding:60,animation:"fadeIn 0.3s" }}>
      <div style={{ width:44,height:44,borderRadius:"50%",border:`3px solid ${T.border}`,borderTop:`3px solid ${T.accent}`,margin:"0 auto 16px",animation:"spin 0.9s linear infinite" }}/>
      <div style={{ fontSize:15,fontWeight:700,color:T.textPrimary }}>Loading Quiz</div>
      <div style={{ fontSize:12,color:T.textMuted,marginTop:5 }}>Fetching fresh questions…</div>
    </div>
  );



  if(done) {
    const pct = Math.round((score/questions.length)*100);
    return (
      <div style={{ animation:"fadeUp 0.3s ease" }}>
        <h2 style={{ fontSize:21,fontWeight:800,color:T.textPrimary,marginBottom:20,letterSpacing:"-0.5px" }}>Algorithm Quiz</h2>
        <div className="card" style={{ padding:48,textAlign:"center" }}>
          <div style={{ fontSize:50,marginBottom:14,animation:"float 3s ease-in-out infinite" }}>{score===5?"🏆":score>=3?"🎯":"📚"}</div>
          <div style={{ fontSize:42,fontWeight:900,color:T.textPrimary,letterSpacing:"-1px" }}>{score}<span style={{ fontSize:20,color:T.textMuted,fontWeight:400 }}>/{questions.length}</span></div>
          <div style={{ width:180,height:5,background:T.border,borderRadius:99,margin:"16px auto 14px" }}>
            <div style={{ width:pct+"%",height:"100%",background:pct>=80?T.accent:pct>=60?T.amber:T.rose,borderRadius:99,transition:"width 1s ease",boxShadow:`0 0 8px ${pct>=80?T.accent:pct>=60?T.amber:T.rose}` }}/>
          </div>
          <div style={{ fontSize:14,color:T.textSecondary,marginBottom:28 }}>{score===5?"Perfect Score! 🔥":score>=3?"Great work — keep it up!":"Keep practicing — you'll get there!"}</div>
          <button className="btn-primary" onClick={loadQuiz} style={{ margin:"0 auto" }}><RefreshCw size={14}/> Try Again</button>
        </div>
      </div>
    );
  }

  const q = questions[cur];
  return (
    <div style={{ animation:"fadeUp 0.3s ease" }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18 }}>
        <div>
          <h2 style={{ fontSize:21,fontWeight:800,color:T.textPrimary,letterSpacing:"-0.5px" }}>Algorithm Quiz</h2>
          <p style={{ color:T.textSecondary,fontSize:12,marginTop:4 }}>Question {cur+1} of {questions.length}</p>
        </div>
        <div style={{ background:T.accentDim,border:`1px solid ${T.accent}35`,borderRadius:99,padding:"5px 14px",fontSize:14,fontWeight:800,color:T.accent }}>{score} pts</div>
      </div>
      <div style={{ background:T.border,height:4,borderRadius:99,marginBottom:20,overflow:"hidden" }}>
        <div style={{ width:((cur/questions.length)*100)+"%",height:"100%",background:`linear-gradient(90deg,${T.accent},${T.blue})`,borderRadius:99,transition:"width 0.4s ease",boxShadow:`0 0 8px ${T.accent}50` }}/>
      </div>
      <div className="card" style={{ padding:26 }}>
        <div style={{ fontSize:15,fontWeight:700,color:T.textPrimary,marginBottom:20,lineHeight:1.65 }} dangerouslySetInnerHTML={{ __html:q.question }}/>
        <div style={{ display:"flex",flexDirection:"column",gap:9 }}>
          {q.answers.map((a,i)=>{
            let bc=T.border, bg=T.surfaceElevated, tc=T.textSecondary;
            if(answered){
              if(a===q.correct){ bc=T.accent; bg=T.accentDim; tc=T.accent; }
              else if(a===selected){ bc=T.rose; bg=T.roseDim; tc=T.rose; }
            }
            return (
              <button key={i} className="quiz-opt" disabled={answered} onClick={()=>pick(a)} dangerouslySetInnerHTML={{ __html:a }}
                style={{ width:"100%",padding:"12px 15px",borderRadius:11,border:`1.5px solid ${bc}`,background:bg,fontSize:13.5,textAlign:"left",cursor:answered?"default":"pointer",fontFamily:"'Outfit',sans-serif",color:tc,fontWeight:answered&&a===q.correct?700:500,transition:"all 0.18s" }}
              />
            );
          })}
        </div>
        {answered && (
          <button className="btn-primary" onClick={next} style={{ marginTop:18 }}>
            {cur+1<questions.length?"Next Question":"See Results"} <ArrowRight size={14}/>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── PAGE: PERFORMANCE ────────────────────────────────────────
function PagePerformance({ solvedProblems }) {
  const strongest = [...RADAR_DATA].sort((a,b)=>b.score-a.score)[0];
  const weakest   = [...RADAR_DATA].sort((a,b)=>a.score-b.score)[0];
  return (
    <div style={{ animation:"fadeUp 0.3s ease" }}>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:21,fontWeight:800,color:T.textPrimary,letterSpacing:"-0.5px" }}>Performance Insights</h2>
        <p style={{ color:T.textSecondary,fontSize:13,marginTop:4 }}>Your progress over the last 6 weeks.</p>
      </div>
      <div style={{ display:"flex",gap:10,marginBottom:18,flexWrap:"wrap" }}>
        <div style={{ background:T.accentDim,border:`1px solid ${T.accent}28`,borderRadius:12,padding:"9px 15px",display:"flex",alignItems:"center",gap:8 }}><ThumbsUp size={13} color={T.accent}/><span style={{ fontSize:12,color:T.accent,fontWeight:700 }}>Strongest: {strongest.skill} ({strongest.score}%)</span></div>
        <div style={{ background:T.roseDim,border:`1px solid ${T.rose}28`,borderRadius:12,padding:"9px 15px",display:"flex",alignItems:"center",gap:8 }}><BookMarked size={13} color={T.rose}/><span style={{ fontSize:12,color:T.rose,fontWeight:700 }}>Focus area: {weakest.skill} ({weakest.score}%)</span></div>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16,marginBottom:16 }}>
        <div className="card" style={{ padding:20 }}>
          <div style={{ fontWeight:700,fontSize:13,color:T.textPrimary,marginBottom:14,display:"flex",alignItems:"center",gap:7 }}><TrendingUp size={13} color={T.accent}/> Problems / Week</div>
          <ResponsiveContainer width="100%" height={175}>
            <AreaChart data={PERFORMANCE_DATA}>
              <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.accent} stopOpacity={0.25}/><stop offset="95%" stopColor={T.accent} stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border}/><XAxis dataKey="week" tick={{ fontSize:11,fill:T.textMuted }}/><YAxis tick={{ fontSize:11,fill:T.textMuted }}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Area type="monotone" dataKey="solved" name="solved" stroke={T.accent} strokeWidth={2.5} fill="url(#sg)" dot={{ r:4,fill:T.accent,stroke:T.bg,strokeWidth:2 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{ padding:20 }}>
          <div style={{ fontWeight:700,fontSize:13,color:T.textPrimary,marginBottom:14,display:"flex",alignItems:"center",gap:7 }}><Target size={13} color={T.blue}/> Accuracy & Speed</div>
          <ResponsiveContainer width="100%" height={175}>
            <LineChart data={PERFORMANCE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border}/><XAxis dataKey="week" tick={{ fontSize:11,fill:T.textMuted }}/><YAxis tick={{ fontSize:11,fill:T.textMuted }}/>
              <Tooltip content={<CustomTooltip/>}/><Legend wrapperStyle={{ fontSize:11 }}/>
              <Line type="monotone" dataKey="accuracy" stroke={T.blue}  strokeWidth={2.5} dot={{ r:4 }} name="Accuracy"/>
              <Line type="monotone" dataKey="speed"    stroke={T.amber} strokeWidth={2.5} dot={{ r:4 }} name="Speed"/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16 }}>
        <div className="card" style={{ padding:20 }}>
          <div style={{ fontWeight:700,fontSize:13,color:T.textPrimary,marginBottom:14,display:"flex",alignItems:"center",gap:7 }}><GitBranch size={13} color={T.violet}/> Skill Radar</div>
          <ResponsiveContainer width="100%" height={210}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke={T.border}/><PolarAngleAxis dataKey="skill" tick={{ fontSize:11,fill:T.textSecondary }}/>
              <Radar name="Score" dataKey="score" stroke={T.accent} fill={T.accent} fillOpacity={0.14} strokeWidth={2}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{ padding:20 }}>
          <div style={{ fontWeight:700,fontSize:13,color:T.textPrimary,marginBottom:18,display:"flex",alignItems:"center",gap:7 }}><BarChart2 size={13} color={T.amber}/> Skill Breakdown</div>
          <div style={{ display:"flex",flexDirection:"column",gap:13 }}>
            {[...RADAR_DATA].sort((a,b)=>b.score-a.score).map((s,i)=>(
              <div key={s.skill}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
                  <span style={{ fontSize:12,color:T.textSecondary,fontWeight:600 }}>{s.skill}</span>
                  <span style={{ fontSize:11,color:BAR_COLORS[i],fontWeight:700,fontFamily:"'JetBrains Mono',monospace" }}>{s.score}%</span>
                </div>
                <div style={{ background:T.bg,height:5,borderRadius:99,overflow:"hidden" }}>
                  <div style={{ width:s.score+"%",height:"100%",background:BAR_COLORS[i],borderRadius:99,boxShadow:`0 0 5px ${BAR_COLORS[i]}50`,transition:"width 1s ease" }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SOLVE PAGE ───────────────────────────────────────────────
function SolvePage({ problem, onBack, onComplete }) {
  const type = classifyProblem(problem);
  const algos = recommendAlgorithms(type).map((name,i)=>({
    name, rank:i+1, preferred:i===0,
    description:`Recommended by the AI pipeline based on the problem's ${type.toLowerCase()} pattern.`,
    time:["O(n log n)","O(E log V)","O(n²)","O(V+E)"][i%4],
    space:["O(n)","O(V)","O(n log n)","O(V+E)"][i%4],
    steps:["Analyse input constraints","Choose appropriate data structures","Apply algorithm logic","Handle edge cases","Return final result"],
    speedScore:    70+Math.random()*20,
    accuracyScore: 80+Math.random()*15,
    timeScore:     65+Math.random()*20,
    spaceScore:    60+Math.random()*20,
  }));

  const PIPELINE = [
    { id:1, icon:FileText,  color:T.blue,   label:"Problem Parsing",       desc:"Reading and tokenising problem statement",      detail:p=>p.slice(0,90)+"…" },
    { id:2, icon:Search,    color:T.violet, label:"Problem Classification", desc:"Detecting problem type and patterns",           detail:()=>`Detected: ${type}` },
    { id:3, icon:BarChart2, color:T.amber,  label:"Pattern Matching",       desc:"Comparing with algorithm pattern database",     detail:()=>"Matched against algorithm corpus" },
    { id:4, icon:Lightbulb, color:T.cyan,   label:"Algorithm Generation",   desc:"Generating candidate algorithms",               detail:()=>`${algos.length} candidates generated` },
    { id:5, icon:Cpu,       color:T.rose,   label:"Complexity Evaluation",  desc:"Ranking by time & space complexity",            detail:()=>"Algorithms ranked by efficiency" },
    { id:6, icon:Award,     color:T.accent, label:"Final Recommendation",   desc:"Selecting best algorithms for your problem",    detail:()=>`✅ Best: ${algos[0]?.name}` },
  ];

  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const algo = algos[activeIdx];
  const metrics = [
    { metric:"Speed",      value:Math.round(algo.speedScore) },
    { metric:"Accuracy",   value:Math.round(algo.accuracyScore) },
    { metric:"Time Eff.",  value:Math.round(algo.timeScore) },
    { metric:"Space Eff.", value:Math.round(algo.spaceScore) },
  ];

  const run = () => { setRunning(true); setStep(1); };
  useEffect(()=>{
    if(!running) return;
    const t = setTimeout(()=>{
      if(step<6) {
        setStep(s=>s+1);
      } else {
        setRunning(false);
        setDone(true);
        // Build entry and notify parent
        const now = new Date();
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const dateStr = months[now.getMonth()] + " " + String(now.getDate()).padStart(2,"0");
        const newEntry = {
          id: Date.now(),
          title: problem.length > 50 ? problem.slice(0,50)+"…" : problem,
          difficulty: algos[0]?.rank === 1 ? (type==="Dynamic Programming"||type==="Graph"?"Hard":"Medium") : "Easy",
          date: dateStr,
          time: Math.floor(Math.random()*30+10)+" min",
          tags: [type, algos[0]?.name?.split(" ")[0]].filter(Boolean),
          score: Math.round(75 + Math.random()*20),
          algo: algos[0]?.name,
        };
        onComplete?.(newEntry);
      }
    },900);
    return ()=>clearTimeout(t);
  },[step,running]);

  return (
    <div style={{ minHeight:"100vh",background:T.bgGrad,fontFamily:"'Outfit',sans-serif" }}>
      {/* Header */}
      <div style={{ background:`${T.surface}f0`,backdropFilter:"blur(16px)",borderBottom:`1px solid ${T.border}`,padding:"0 24px",height:54,display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:30 }}>
        <button className="btn-ghost" style={{ padding:"6px 14px",fontSize:13 }} onClick={onBack}><ArrowLeft size={13}/> Back</button>
        <div style={{ width:1,height:22,background:T.border }}/>
        <span style={{ fontSize:13,fontWeight:700,color:T.textPrimary }}>Algorithm Analyzer</span>
        <span style={{ background:T.accentDim,border:`1px solid ${T.accent}30`,borderRadius:99,padding:"2px 10px",fontSize:10,color:T.accent,fontWeight:700,marginLeft:4 }}>{type}</span>
      </div>

      <div style={{ maxWidth:1000,margin:"0 auto",padding:"28px 20px 60px" }}>
        {/* Problem card */}
        <div className="card" style={{ padding:"18px 22px",marginBottom:18 }}>
          <div style={{ fontSize:10,color:T.accent,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8 }}>Problem Statement</div>
          <div style={{ fontSize:14,color:T.textPrimary,lineHeight:1.7 }}>{problem}</div>
        </div>

        {/* Pipeline */}
        <div className="card" style={{ padding:"20px 22px",marginBottom:18 }}>
          <div style={{ fontSize:14,fontWeight:800,color:T.textPrimary,marginBottom:16,display:"flex",alignItems:"center",gap:8 }}>
            <Cpu size={14} color={T.violet}/> Analysis Pipeline
          </div>
          {!running && !done && (
            <button className="btn-primary" style={{ marginBottom:20 }} onClick={run}><Zap size={15} fill="currentColor"/> Run Analysis</button>
          )}
          <div style={{ display:"flex",flexDirection:"column",gap:0 }}>
            {PIPELINE.map((s,i)=>{
              const status = step>s.id?"done":step===s.id?"active":"pending";
              const Icon = s.icon;
              return (
                <div key={s.id} style={{ display:"flex",gap:14,paddingBottom:i<PIPELINE.length-1?18:0,position:"relative" }}>
                  {i<PIPELINE.length-1 && <div style={{ position:"absolute",left:14,top:32,bottom:0,width:2,background:step>s.id?`linear-gradient(to bottom,${s.color}50,${T.border})`:`${T.border}`,borderRadius:99 }}/>}
                  <div style={{ width:28,height:28,borderRadius:"50%",background:status==="done"?T.accentDim:status==="active"?`${s.color}20`:T.surfaceElevated,border:`2px solid ${status==="done"?T.accent:status==="active"?s.color:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.3s",boxShadow:status==="active"?`0 0 12px ${s.color}40`:"none" }}>
                    {status==="done"?<CheckCircle size={13} color={T.accent}/>:<Icon size={12} color={status==="active"?s.color:T.textMuted}/>}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700,fontSize:13,color:status==="pending"?T.textMuted:T.textPrimary,marginBottom:2 }}>{s.label}</div>
                    <div style={{ fontSize:11,color:T.textMuted }}>{s.desc}</div>
                    {(status==="active"||status==="done") && (
                      <div style={{ marginTop:7,background:T.bg,border:`1px solid ${s.color}25`,padding:"7px 12px",borderRadius:8,fontSize:11,color:s.color,fontFamily:"'JetBrains Mono',monospace",animation:"fadeIn 0.2s" }}>
                        {s.detail(problem)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Results */}
        {done && (
          <>
            {/* Algo selector tabs */}
            <div className="card" style={{ padding:"18px 20px",marginBottom:18 }}>
              <div style={{ fontSize:13,fontWeight:800,color:T.textPrimary,marginBottom:14,display:"flex",alignItems:"center",gap:8 }}><Award size={13} color={T.accent}/> Recommended Algorithms</div>
              <div style={{ display:"flex",gap:9,flexWrap:"wrap" }}>
                {algos.map((a,i)=>(
                  <button key={i} onClick={()=>setActiveIdx(i)} style={{ padding:"8px 16px",borderRadius:10,border:`1.5px solid ${i===activeIdx?T.accent:T.border}`,background:i===activeIdx?T.accentDim:T.surfaceElevated,color:i===activeIdx?T.accent:T.textSecondary,fontWeight:i===activeIdx?700:500,fontSize:13,cursor:"pointer",fontFamily:"'Outfit',sans-serif",transition:"all 0.18s",display:"flex",alignItems:"center",gap:6 }}>
                    {i===0 && <Star size={11} fill={i===activeIdx?T.accent:"transparent"} color={T.accent}/>}
                    {a.name}
                    {a.preferred && <span style={{ background:T.accentDim,color:T.accent,fontSize:9,fontWeight:800,borderRadius:99,padding:"1px 6px" }}>TOP</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Algo detail */}
            <div className="card" style={{ padding:"22px 24px",animation:"fadeUp 0.3s ease" }}>
              <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:16 }}>
                <div>
                  <div style={{ fontSize:18,fontWeight:800,color:T.textPrimary,letterSpacing:"-0.4px",display:"flex",alignItems:"center",gap:10 }}>
                    {algo.name}
                    {algo.preferred && <span style={{ background:T.accentDim,color:T.accent,fontSize:11,fontWeight:700,borderRadius:8,padding:"3px 10px",border:`1px solid ${T.accent}30` }}>⭐ Preferred</span>}
                  </div>
                  <div style={{ fontSize:13,color:T.textSecondary,marginTop:7,lineHeight:1.65,maxWidth:500 }}>{algo.description}</div>
                </div>
                <div style={{ display:"flex",gap:10 }}>
                  <div style={{ background:T.bg,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 16px",textAlign:"center" }}>
                    <div style={{ fontSize:10,color:T.textMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:4 }}>Time</div>
                    <div style={{ fontSize:13,fontWeight:800,color:T.blue,fontFamily:"'JetBrains Mono',monospace" }}>{algo.time}</div>
                  </div>
                  <div style={{ background:T.bg,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 16px",textAlign:"center" }}>
                    <div style={{ fontSize:10,color:T.textMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:4 }}>Space</div>
                    <div style={{ fontSize:13,fontWeight:800,color:T.violet,fontFamily:"'JetBrains Mono',monospace" }}>{algo.space}</div>
                  </div>
                </div>
              </div>

              <div style={{ borderTop:`1px solid ${T.border}`,paddingTop:18,marginBottom:18 }}>
                <div style={{ fontSize:12,fontWeight:800,color:T.textPrimary,marginBottom:12,textTransform:"uppercase",letterSpacing:1 }}>Step-by-Step</div>
                <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                  {algo.steps.map((s,i)=>(
                    <div key={i} style={{ display:"flex",gap:10,alignItems:"flex-start" }}>
                      <div style={{ width:22,height:22,borderRadius:6,background:`${BAR_COLORS[i%BAR_COLORS.length]}15`,border:`1px solid ${BAR_COLORS[i%BAR_COLORS.length]}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:BAR_COLORS[i%BAR_COLORS.length],flexShrink:0 }}>{i+1}</div>
                      <div style={{ fontSize:13,color:T.textSecondary,paddingTop:2,lineHeight:1.5 }}>{s}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop:`1px solid ${T.border}`,paddingTop:18 }}>
                <div style={{ fontSize:12,fontWeight:800,color:T.textPrimary,marginBottom:14,textTransform:"uppercase",letterSpacing:1 }}>Performance Metrics</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={metrics} barSize={36} margin={{ top:4,right:10,left:-12,bottom:0 }}>
                    <CartesianGrid vertical={false} stroke={T.border}/>
                    <XAxis dataKey="metric" tick={{ fill:T.textMuted,fontSize:11 }} axisLine={false} tickLine={false}/>
                    <YAxis domain={[0,100]} tick={{ fill:T.textMuted,fontSize:11 }}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Bar dataKey="value" name="Score" radius={[7,7,0,0]}>{metrics.map((_,i)=><Cell key={i} fill={BAR_COLORS[i%BAR_COLORS.length]}/>)}</Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────
const DEMO_EMAIL = "demo@aiforbharat.in";
const DEMO_PASS  = "Bharat@2026";
const DEMO_USER  = { id:"demo-user", email:DEMO_EMAIL, user_metadata:{ full_name:"Bharat User" } };

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 008 10.95c.6.1.82-.26.82-.58v-2.03c-3.25.7-3.93-1.57-3.93-1.57-.53-1.36-1.3-1.72-1.3-1.72-1.06-.73.08-.72.08-.72 1.17.08 1.8 1.2 1.8 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.75.4-1.27.73-1.56-2.6-.3-5.34-1.3-5.34-5.8 0-1.28.46-2.33 1.2-3.15-.12-.3-.52-1.5.12-3.13 0 0 .98-.31 3.2 1.2a11.1 11.1 0 015.82 0c2.22-1.51 3.2-1.2 3.2-1.2.64 1.63.24 2.83.12 3.13.75.82 1.2 1.87 1.2 3.15 0 4.52-2.75 5.5-5.37 5.79.41.36.78 1.08.78 2.18v3.23c0 .32.22.69.83.57A11.5 11.5 0 0023.5 12C23.5 5.65 18.35.5 12 .5z"/>
  </svg>
);

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    if(!email||!password){ setError("Please fill in both fields."); return; }
    setLoading(true); setError("");
    await new Promise(r=>setTimeout(r,700));
    if(email===DEMO_EMAIL && password===DEMO_PASS){ onLogin(DEMO_USER); }
    else { setError("Invalid credentials. Use the demo credentials below."); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh",background:T.bgGrad,display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Outfit',sans-serif",position:"relative",overflow:"hidden" }}>
      {/* Ambient glows */}
      <div style={{ position:"absolute",top:-120,left:-120,width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,${T.accent}08,transparent 70%)`,pointerEvents:"none" }}/>
      <div style={{ position:"absolute",bottom:-80,right:-80,width:320,height:320,borderRadius:"50%",background:`radial-gradient(circle,${T.blue}06,transparent 70%)`,pointerEvents:"none" }}/>

      <div style={{ width:"100%",maxWidth:440,animation:"scaleIn 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
        {/* Brand header */}
        <div style={{ textAlign:"center",marginBottom:28 }}>
          <div style={{ width:52,height:52,borderRadius:16,background:`linear-gradient(135deg,${T.accent},${T.blue})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,margin:"0 auto 14px",boxShadow:`0 8px 28px ${T.accent}30`,animation:"float 3s ease-in-out infinite" }}>🧠</div>
          <div style={{ fontSize:22,fontWeight:900,color:T.textPrimary,letterSpacing:"-0.5px" }}>AlgoMind</div>
          <div style={{ fontSize:12,color:T.textMuted,marginTop:4,fontWeight:600,letterSpacing:1,textTransform:"uppercase" }}>AI for Bharat</div>
        </div>

        <div style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:20,padding:"32px 30px",boxShadow:"0 24px 64px rgba(0,0,0,0.12)" }}>
          <div style={{ fontSize:16,fontWeight:800,color:T.textPrimary,marginBottom:6 }}>Sign in to your account</div>
          <div style={{ fontSize:12,color:T.textMuted,marginBottom:22 }}>Welcome back — let's solve some problems today.</div>

          {error && (
            <div style={{ background:T.roseDim,border:`1px solid ${T.rose}30`,borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:12,color:T.rose,display:"flex",alignItems:"center",gap:7 }}>
              <AlertCircle size={13}/>{error}
            </div>
          )}

          <form onSubmit={submit} autoComplete="off">
            <div style={{ marginBottom:12,position:"relative" }}>
              <Mail size={14} style={{ position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:T.textMuted,pointerEvents:"none" }}/>
              <input type="email" placeholder="demo@aiforbharat.in" value={email} onChange={e=>setEmail(e.target.value)} className="input-field" autoComplete="off"/>
            </div>
            <div style={{ marginBottom:14,position:"relative" }}>
              <Lock size={14} style={{ position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:T.textMuted,pointerEvents:"none" }}/>
              <input type={showPass?"text":"password"} placeholder="Bharat@2026" value={password} onChange={e=>setPassword(e.target.value)} className="input-field" style={{ paddingRight:42 }} autoComplete="off"/>
              <button type="button" onClick={()=>setShowPass(!showPass)} style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:T.textMuted,display:"flex" }}>
                {showPass?<EyeOff size={14}/>:<Eye size={14}/>}
              </button>
            </div>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,fontSize:12 }}>
              <label style={{ display:"flex",alignItems:"center",gap:7,cursor:"pointer",color:T.textSecondary }}>
                <input type="checkbox" checked={remember} onChange={()=>setRemember(!remember)} style={{ accentColor:T.accent }}/> Remember me
              </label>
              <span style={{ color:T.blue,cursor:"pointer",fontWeight:600 }}>Forgot password?</span>
            </div>
            <button type="submit" disabled={loading} style={{ width:"100%",padding:"13px",borderRadius:12,border:"none",background:loading?`${T.accent}70`:`linear-gradient(135deg,${T.accent},#15803d)`,color:"#ffffff",fontWeight:800,fontSize:15,cursor:loading?"not-allowed":"pointer",fontFamily:"'Outfit',sans-serif",transition:"all 0.2s",boxShadow:loading?"none":`0 6px 20px ${T.accent}30` }}>
              {loading?"Signing in…":"Sign In"}
            </button>
          </form>

          <div style={{ display:"flex",alignItems:"center",gap:10,margin:"20px 0",fontSize:10,color:T.textMuted }}>
            <div style={{ flex:1,height:1,background:T.border }}/> OR CONTINUE WITH <div style={{ flex:1,height:1,background:T.border }}/>
          </div>

          <div style={{ display:"flex",flexDirection:"column",gap:9 }}>
            <button onClick={()=>onLogin(DEMO_USER)} style={{ padding:"11px",borderRadius:11,border:`1px solid ${T.border}`,background:T.surfaceElevated,color:T.textPrimary,fontWeight:600,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"'Outfit',sans-serif",transition:"all 0.18s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=T.borderHover}
              onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
              <GoogleIcon/> Continue with Google
            </button>
            <button onClick={()=>onLogin(DEMO_USER)} style={{ padding:"11px",borderRadius:11,border:`1px solid ${T.border}`,background:T.surfaceElevated,color:T.textPrimary,fontWeight:600,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"'Outfit',sans-serif",transition:"all 0.18s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=T.borderHover}
              onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
              <GithubIcon/> Continue with GitHub
            </button>
          </div>

          <div style={{ marginTop:20,padding:"13px 16px",borderRadius:12,background:T.bg,border:`1px solid ${T.border}`,fontSize:12 }}>
            <div style={{ fontWeight:700,color:T.textPrimary,marginBottom:4 }}>Demo credentials</div>
            <div style={{ color:T.textMuted,fontFamily:"'JetBrains Mono',monospace",fontSize:11 }}>
              <span style={{ color:T.accent }}>email:</span> {DEMO_EMAIL}<br/>
              <span style={{ color:T.accent }}>pass:</span>  {DEMO_PASS}
            </div>
          </div>

          <div style={{ marginTop:14,padding:"9px 14px",borderRadius:10,background:T.accentSoft,border:`1px solid ${T.accent}20`,fontSize:11,fontWeight:600,color:T.accent,display:"flex",alignItems:"center",justifyContent:"center",gap:6 }}>
            <Shield size={12}/> Secured by End-to-End Encryption
          </div>
        </div>

        <div style={{ textAlign:"center",marginTop:16,fontSize:10,color:T.textMuted }}>
          © 2026 AlgoMind · AI for Bharat. All rights reserved.
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD SHELL ──────────────────────────────────────────
function Dashboard({ user, onLogout, onSolve, solvedProblems }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage,  setActivePage]  = useState("dashboard");
  const chartData = solvedProblems.slice(0,8).map(p=>({ name:p.title.slice(0,13)+"…", score:p.score }));
  const pages = {
    dashboard:   <PageHome user={user} onNav={setActivePage} onSolve={onSolve} solvedProblems={solvedProblems} chartData={chartData}/>,
    problems:    <PageProblems solvedProblems={solvedProblems} chartData={chartData}/>,
    mentor:      <PageMentor solvedProblems={solvedProblems}/>,
    quiz:        <PageQuiz/>,
    performance: <PagePerformance solvedProblems={solvedProblems}/>,
  };
  const pageTitle = NAV.find(n=>n.key===activePage)?.label||"Dashboard";
  return (
    <div style={{ minHeight:"100vh",background:T.bgGrad,fontFamily:"'Outfit',sans-serif" }}>
      <Sidebar active={activePage} onNav={setActivePage} open={sidebarOpen} onClose={()=>setSidebarOpen(false)} onLogout={onLogout} user={user}/>
      {/* Topbar */}
      <div style={{ position:"sticky",top:0,zIndex:30,background:`${T.surface}f0`,backdropFilter:"blur(16px)",borderBottom:`1px solid ${T.border}`,padding:"0 22px",height:54,display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 1px 20px rgba(0,0,0,0.08)" }}>
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          <button className="btn-ghost" style={{ padding:"6px 9px" }} onClick={()=>setSidebarOpen(true)}><Menu size={17}/></button>
          <div style={{ display:"flex",alignItems:"center",gap:5 }}>
            <span style={{ fontSize:11,color:T.textMuted }}>AlgoMind</span>
            <ChevronRight size={9} color={T.textMuted}/>
            <span style={{ fontSize:11,color:T.accent,fontWeight:700 }}>{pageTitle}</span>
          </div>
        </div>
        <AvatarMenu user={user} onLogout={onLogout}/>
      </div>
      <div style={{ maxWidth:1040,margin:"0 auto",padding:"26px 18px 60px" }}>
        {pages[activePage]||pages.dashboard}
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────
export default function App() {
  const [user,       setUser]       = useState(null);
  const [activeProblem, setActiveProblem] = useState(null);
  const [solvedProblems, setSolvedProblems] = useState(SEED_PROBLEMS);

  const handleSolveComplete = (newEntry) => {
    setSolvedProblems(prev => [newEntry, ...prev]);
    setActiveProblem(null);
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      {!user ? (
        <LoginPage onLogin={setUser}/>
      ) : activeProblem ? (
        <SolvePage
          problem={activeProblem}
          onBack={()=>setActiveProblem(null)}
          onComplete={handleSolveComplete}
        />
      ) : (
        <Dashboard
          user={user}
          onLogout={()=>setUser(null)}
          onSolve={p=>setActiveProblem(p)}
          solvedProblems={solvedProblems}
        />
      )}
    </>
  );
}

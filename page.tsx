"use client";
import {useMemo,useState} from "react";
import * as XLSX from "xlsx";

type Row = Record<string, string|number>;
const norm=(v:unknown)=>String(v??"").trim();
const num=(v:unknown)=>{if(typeof v==="number")return v; const s=String(v??"").replace(/[^0-9,.-]/g,"").replace(/\./g,"").replace(",","."); return Number(s)||0};
const rupiah=(n:number)=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);
const findKey=(row:Row,names:string[])=>{const keys=Object.keys(row);return keys.find(k=>names.includes(k.trim().toUpperCase()))};
const val=(row:Row,names:string[])=>{const k=findKey(row,names);return k?row[k]:""};
const labels=[
 ["Unit",["DIT","UNIT","NAMA UNIT"]],["Program",["CNPRO","NPRO","PROGRAM"]],["Kegiatan",["CNKEG","NKEG","KEGIATAN"]],
 ["KRO",["CNKRO","NKRO","KRO"]],["RO",["CNRO","NRO","RO"]],["Komponen",["NKOM","KOM","KOMPONEN"]],
 ["Subkomponen",["CNSKO","NKSKO","SUBKOMPONEN"]],["Akun",["CNAKUN","NAKUN","AKUN"]],["Detail",["DETIL","DETAIL","URAIAN"]]
] as const;
const demo:Row[]=[
 {DIT:"Unit A",CNPRO:"Program Dukungan Manajemen",CNKEG:"Pengelolaan Organisasi",CNKRO:"Layanan Dukungan Manajemen",CNRO:"Layanan Organisasi",NKOM:"Pelaksanaan Kegiatan",CNSKO:"Dukungan Operasional",CNAKUN:"Belanja Barang",DETIL:"Kebutuhan operasional",PAGU:850000000,REALISASI:612000000,SISA:238000000},
 {DIT:"Unit B",CNPRO:"Program Dukungan Manajemen",CNKEG:"Pengelolaan SDM",CNKRO:"Layanan Internal",CNRO:"Layanan Kepegawaian",NKOM:"Pelaksanaan Kegiatan",CNSKO:"Administrasi",CNAKUN:"Belanja Jasa",DETIL:"Dukungan layanan",PAGU:620000000,REALISASI:341000000,SISA:279000000},
];
export default function Home(){
 const [rows,setRows]=useState<Row[]>(demo); const [unit,setUnit]=useState("Semua Unit"); const [message,setMessage]=useState("Mode demo aktif. Upload Excel terbaru untuk melihat data Anda di perangkat ini."); const [err,setErr]=useState(false);
 const units=useMemo(()=>["Semua Unit",...Array.from(new Set(rows.map(r=>norm(val(r,["DIT","UNIT","NAMA UNIT"]))).filter(Boolean)))],[rows]);
 const shown=useMemo(()=>unit==="Semua Unit"?rows:rows.filter(r=>norm(val(r,["DIT","UNIT","NAMA UNIT"]))===unit),[rows,unit]);
 const totals=useMemo(()=>shown.reduce((a,r)=>{const p=num(val(r,["PAGU"])),real=num(val(r,["REALISASI"]));a.p+=p;a.r+=real;a.s+=num(val(r,["SISA"]))||p-real;return a},{p:0,r:0,s:0}),[shown]);
 const byUnit=useMemo(()=>{const m=new Map<string,{p:number,r:number}>(); shown.forEach(r=>{const u=norm(val(r,["DIT","UNIT","NAMA UNIT"]))||"Tanpa Unit";const x=m.get(u)||{p:0,r:0};x.p+=num(val(r,["PAGU"]));x.r+=num(val(r,["REALISASI"]));m.set(u,x)});return [...m.entries()].sort((a,b)=>b[1].r-a[1].r)},[shown]);
 const read=async(e:React.ChangeEvent<HTMLInputElement>)=>{const f=e.target.files?.[0];if(!f)return;try{const b=await f.arrayBuffer();const wb=XLSX.read(b);const ws=wb.Sheets[wb.SheetNames[0]];const data=XLSX.utils.sheet_to_json<Row>(ws,{defval:""});if(!data.length)throw new Error("Sheet pertama kosong");const k=Object.keys(data[0]).map(x=>x.trim().toUpperCase());const missing=["PAGU","REALISASI"].filter(x=>!k.includes(x));if(missing.length)throw new Error("Kolom wajib tidak ditemukan: "+missing.join(", "));setRows(data);setUnit("Semua Unit");setErr(false);setMessage(`${f.name} berhasil dibaca: ${data.length.toLocaleString("id-ID")} baris. Data tersimpan sementara di browser.`)}catch(ex){setErr(true);setMessage(ex instanceof Error?ex.message:"File gagal dibaca")}};
 const pct=totals.p?totals.r/totals.p*100:0;
 return <main className="shell">
  <header className="top"><div><div className="eyebrow">Monitoring Realisasi</div><h1 className="title">Dashboard Anggaran</h1><div className="muted">Ringkasan pagu, realisasi, sisa, dan rincian bertingkat.</div></div><label className="upload">Upload Excel<input type="file" accept=".xlsx,.xls" onChange={read}/></label></header>
  <div className={`notice ${err?"error":""}`}>{message}</div>
  <section className="cards"><div className="card"><div className="label">Total Pagu</div><div className="value cyan">{rupiah(totals.p)}</div></div><div className="card"><div className="label">Total Realisasi</div><div className="value green">{rupiah(totals.r)}</div></div><div className="card"><div className="label">Total Sisa</div><div className="value amber">{rupiah(totals.s)}</div></div><div className="card"><div className="label">Persentase Realisasi</div><div className="value violet">{pct.toFixed(2)}%</div></div></section>
  <div className="filters"><select className="select" value={unit} onChange={e=>setUnit(e.target.value)}>{units.map(u=><option key={u}>{u}</option>)}</select><span className="chip">{shown.length.toLocaleString("id-ID")} baris</span></div>
  <section className="grid"><div className="panel"><h2>Realisasi per Unit</h2><div className="bars">{byUnit.map(([u,x])=>{const p=x.p?Math.min(100,x.r/x.p*100):0;return <div key={u}><div className="barhead"><span>{u}</span><strong>{p.toFixed(1)}%</strong></div><div className="track"><div className="fill" style={{width:`${p}%`}}/></div></div>})}</div></div>
  <div className="panel"><h2>Rincian Bertingkat</h2><div className="tablewrap"><table className="tree"><thead><tr><th>Struktur</th><th>Pagu</th><th>Realisasi</th><th>Sisa</th></tr></thead><tbody>{shown.slice(0,300).map((r,i)=>{const path=labels.map(([label,names])=>{const x=norm(val(r,[...names]));return x?`${label}: ${x}`:""}).filter(Boolean).join(" › ");const p=num(val(r,["PAGU"])),real=num(val(r,["REALISASI"])),s=num(val(r,["SISA"]))||p-real;return <tr key={i}><td className="level">{path||`Baris ${i+1}`}</td><td>{rupiah(p)}</td><td>{rupiah(real)}</td><td>{rupiah(s)}</td></tr>})}</tbody></table></div></div></section>
  <div className="foot">Prototype piloting • Data upload saat ini hanya berada di browser perangkat yang digunakan</div>
 </main>
}

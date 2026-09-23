'use client';

import { motion } from 'framer-motion';

type IconKind = 'computer' | 'folder' | 'video' | 'user' | 'gear' | 'service' | 'mail' | 'recycle' | 'program' | 'file' | 'play' | 'start';

export default function XPIcon({ kind, size = 44 }: { kind: IconKind; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 48 48', 'aria-hidden': true };
  const stroke = '#12314d';
  const fill = '#eef7ff';
  if (kind === 'start') return <svg {...common}><defs><linearGradient id="startBlue" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#67c7ff"/><stop offset="1" stopColor="#15659e"/></linearGradient><linearGradient id="startGreen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8be18c"/><stop offset="1" stopColor="#22824b"/></linearGradient></defs><rect x="5" y="5" width="38" height="38" rx="9" fill="#f7fbff" stroke={stroke} strokeWidth="2"/><path d="M10 10h12v12H10z" fill="url(#startBlue)"/><path d="M26 10h12v12H26z" fill="url(#startGreen)"/><path d="M10 26h12v12H10z" fill="#f0c55d"/><path d="M26 26h12v12H26z" fill="#db7564"/><path d="M24 10v28M10 24h28" stroke="#fff" strokeWidth="1.5" opacity=".9"/></svg>;
  if (kind === 'computer') return <svg {...common}><rect x="5" y="6" width="38" height="27" rx="3" fill={fill} stroke={stroke}/><rect x="9" y="10" width="30" height="18" fill="#69b7e8"/><path d="M19 38h10M15 41h18" stroke={stroke} strokeWidth="3" strokeLinecap="round"/><path d="M14 15h20" stroke="#fff" strokeOpacity=".65"/></svg>;
  if (kind === 'folder') return <svg {...common}><path d="M4 13a4 4 0 0 1 4-4h12l5 5h15a4 4 0 0 1 4 4v17a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V13Z" fill="#f8d96f" stroke={stroke}/><path d="M5 17h38" stroke="#fff4ad" strokeWidth="2"/><path d="M7 22h34" stroke="#c49f32" strokeOpacity=".5"/></svg>;
  if (kind === 'video') return <svg {...common}><rect x="4" y="9" width="40" height="30" rx="4" fill="#eaf4fb" stroke={stroke}/><rect x="8" y="13" width="26" height="22" rx="2" fill="#16344d"/><path d="m22 24-7-5v10l7-5Zm3 0h8" fill="#5bb5e6" stroke="#5bb5e6" strokeWidth="3" strokeLinejoin="round"/></svg>;
  if (kind === 'user') return <svg {...common}><circle cx="24" cy="14" r="8" fill="#f2c39d" stroke={stroke}/><path d="M11 41c1-11 7-17 13-17s12 6 13 17" fill="#4b77ac" stroke={stroke}/><path d="M16 14c2-7 13-10 17 0" fill="none" stroke="#33241b" strokeWidth="4"/></svg>;
  if (kind === 'gear') return <svg {...common}><path d="m20 4 8 0 1 6 6 3 5-3 4 7-5 4 0 6 5 4-4 7-5-3-6 3-1 6h-8l-1-6-6-3-5 3-4-7 5-4 0-6-5-4 4-7 5 3 6-3 1-6Z" fill="#b9c4cd" stroke={stroke}/><circle cx="24" cy="24" r="6" fill="#eef7ff" stroke={stroke}/></svg>;
  if (kind === 'service') return <svg {...common}><rect x="5" y="12" width="38" height="28" rx="3" fill="#dfe8ee" stroke={stroke}/><path d="M14 12v-3h20v3" fill="none" stroke={stroke} strokeWidth="2"/><path d="M14 23h20M14 30h13M14 36h16" stroke="#4e6d84" strokeWidth="3" strokeLinecap="round"/></svg>;
  if (kind === 'mail') return <svg {...common}><rect x="5" y="9" width="38" height="30" rx="4" fill="#edf5fb" stroke={stroke}/><path d="m7 13 17 14 17-14" fill="none" stroke="#4c7b9e" strokeWidth="2"/><path d="m7 35 13-11M41 35 28 24" fill="none" stroke="#4c7b9e"/></svg>;
  if (kind === 'recycle') return <svg {...common}><path d="m17 10 5-5 4 5M19 10h14" fill="none" stroke="#1f516e" strokeWidth="2"/><path d="M13 14h22l-2 27H15l-2-27Z" fill="#c8d5dc" stroke={stroke}/><path d="M19 19v16M24 19v16M29 19v16" stroke="#8096a6" strokeWidth="3"/></svg>;
  if (kind === 'program') return <svg {...common}><rect x="6" y="8" width="36" height="31" rx="4" fill="#f3f5f7" stroke={stroke}/><rect x="6" y="8" width="36" height="7" rx="4" fill="#2b78af"/><circle cx="11" cy="11.5" r="1.5" fill="#fff"/><circle cx="16" cy="11.5" r="1.5" fill="#fff"/><rect x="12" y="21" width="24" height="3" rx="1.5" fill="#b7c4ce"/><rect x="12" y="27" width="18" height="3" rx="1.5" fill="#d0d8de"/></svg>;
  if (kind === 'file') return <svg {...common}><path d="M10 4h18l10 10v30H10z" fill="#f0f2f3" stroke={stroke}/><path d="M28 4v11h10" fill="#d4dce2" stroke={stroke}/><path d="M15 25h18M15 31h15M15 37h10" stroke="#5d7181" strokeWidth="2"/></svg>;
  return <motion.svg {...common} whileHover={{ scale: 1.06 }}><rect x="5" y="8" width="38" height="32" rx="4" fill="#101f2c" stroke="#8ed4ff"/><path d="m20 16 14 8-14 8z" fill="#8ed4ff"/></motion.svg>;
}

'use client';

import { useState } from 'react';
import { useT } from '@/src/shared/LanguageContext';
import styles from '../win7.module.css';

// Small standard accessories, kept in their windows when minimized.
export default function SystemTools({ id }: { id: 'calculator' | 'notepad' }) {
  const t = useT();
  const [text, setText] = useState('');
  const [value, setValue] = useState('0');
  const [stored, setStored] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [replace, setReplace] = useState(false);

  function press(key: string) {
    if (key === 'C') { setValue('0'); setStored(null); setOperation(null); setReplace(false); return; }
    if (/^[0-9.]$/.test(key)) {
      setValue(current => {
        const base = replace || current === 'Error' ? '0' : current;
        return key === '.' ? base.includes('.') ? base : `${base}.` : (base === '0' ? key : `${base}${key}`).slice(0, 16);
      });
      setReplace(false); return;
    }
    if (key === 'Backspace') { setValue(current => current.slice(0, -1) || '0'); return; }
    const number = Number(value);
    const result = stored === null || !operation || replace ? number
      : operation === '+' ? stored + number : operation === '−' ? stored - number
        : operation === '×' ? stored * number : stored / number;
    setValue(Number.isFinite(result) ? String(Number(result.toPrecision(12))) : 'Error');
    setStored(key === '=' ? null : result);
    setOperation(key === '=' ? null : key); setReplace(true);
  }

  if (id === 'notepad') return <textarea className={styles.notepad} aria-label={t('Texto')} spellCheck={false}
    value={text} onChange={event => setText(event.target.value)} />;

  return <div className={styles.calculator} tabIndex={0} onKeyDown={event => {
    // Buttons retain native Enter/Space behavior.
    const key = ({ '*': '×', '/': '÷', '-': '−', Enter: '=', Escape: 'C', Delete: 'C' } as Record<string, string>)[event.key] || event.key;
    if (event.target instanceof HTMLButtonElement && event.key === 'Enter') return;
    if (/^[0-9.+×÷−=]$/.test(key) || key === 'C' || key === 'Backspace') { event.preventDefault(); press(key); }
  }}>
    <output aria-label={t('Resultado')} aria-live="polite">{value}</output>
    <div>{['C', '÷', '×', '−', '7', '8', '9', '+', '4', '5', '6', '=', '1', '2', '3', '.', '0'].map(key =>
      <button type="button" key={key} onClick={() => press(key)} aria-label={key === 'C' ? t('Limpar') : key}>{key}</button>)}</div>
  </div>;
}

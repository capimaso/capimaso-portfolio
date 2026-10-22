'use client';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { tr, type Language } from '@/lib/locale-dictionary';
const LanguageContext = createContext<Language>('en');
export function LanguageProvider({language,children}:{language:Language;children:ReactNode}) {return <LanguageContext.Provider value={language}>{children}</LanguageContext.Provider>}
export function useLanguage(){return useContext(LanguageContext)}
export function useT(){const lang=useLanguage();return useMemo(()=>(text:string)=>tr(lang,text),[lang])}

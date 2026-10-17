'use client';
import { useState } from 'react';
/** Local assets are preferred. Fallback serves ORIGINAL assets until sync finishes. */
export default function XPImage({src,alt='',className='',...rest}:{src:string;alt?:string;className?:string;loading?:'lazy'|'eager'}) {
  const [fallback,setFallback] = useState(false);
  const url = fallback && src.startsWith('/') ? `https://raw.githubusercontent.com/capimaso/capimaso-portfolio/8959ea5a72142ac25a9a443394501c5053424e2e/public${src}` : src;
  return <img src={url} alt={alt} className={className} onError={()=>{if(!fallback)setFallback(true);}} {...rest}/>;
}

import type React from "react";
import Link from "next/link";
import { HERO } from "../data/site";
import { IconArrow, IconDrop, IconFlask, IconSun } from "./icons";

const BADGE_ICONS = { drop: IconDrop, flask: IconFlask, sun: IconSun };
const BADGE_POS = ["one", "two", "three"];
const HERO_IMAGE = "https://raw.githubusercontent.com/hoseinsamadi/SamadiFarmFront/nextjs-preview/mainBiBak.png";

export default function Hero() {
  return <section id="home" className="hero">
    <svg className="bee-route" viewBox="0 0 1440 640" preserveAspectRatio="none" aria-hidden="true"><path className="route-path" d="M-60,430 C220,320 360,120 620,170 S1000,380 1220,240 S1440,150 1520,190" fill="none" stroke="rgba(216,149,33,.4)" strokeWidth="2" strokeDasharray="3 14" strokeLinecap="round"/><g><animateMotion dur="18s" repeatCount="indefinite" rotate="auto" path="M-60,430 C220,320 360,120 620,170 S1000,380 1220,240 S1440,150 1520,190"/><text x="0" y="0" fontSize="24">🐝</text></g></svg>
    <div className="shell hero-inner"><div>
      <span className="eyebrow reveal">{HERO.eyebrow}</span>
      <h1 className="hero-title reveal-lines"><span className="line-mask"><span className="line-inner">{HERO.titleLines[0]}</span></span><span className="line-mask"><span className="line-inner" style={{ "--d": ".14s" } as React.CSSProperties}>{HERO.titleLines[1]}<span className="marker">{HERO.highlightWord}</span>،</span></span><span className="line-mask"><span className="line-inner" style={{ "--d": ".28s" } as React.CSSProperties}>{HERO.titleLines[2]}</span></span></h1>
      <p className="hero-desc reveal" style={{ "--d": ".2s" } as React.CSSProperties}>{HERO.desc}</p>
      <div className="hero-ctas reveal" style={{ "--d": ".32s" } as React.CSSProperties}><Link href="/products" className="btn btn-primary">{HERO.ctaPrimary}<IconArrow size={18}/></Link><Link href="/story" className="btn btn-ghost">{HERO.ctaSecondary}</Link></div>
      <div className="hero-mini reveal" style={{ "--d": ".44s" } as React.CSSProperties}><div className="hero-mini-avatars" aria-hidden="true">{HERO.mini.avatars.map((a) => <span key={a}>{a}</span>)}</div><p>{HERO.mini.text}</p></div>
    </div><div className="hero-photo reveal" style={{ "--d": ".18s" } as React.CSSProperties}><svg className="hex-orbit" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 3 91 26.5v47L50 97 9 73.5v-47Z" fill="none" stroke="currentColor" strokeWidth=".5" strokeDasharray="3 5"/></svg>{HERO.badges.map((badge,i)=>{const Icon=BADGE_ICONS[badge.icon];return <span key={badge.text} className={`float-badge float-badge--${BADGE_POS[i]}`}><Icon size={16}/>{badge.text}</span>})}<div className="hero-photo-frame"><img src={HERO_IMAGE} alt={HERO.imgAlt}/></div><div className="hero-caption"><strong><span className="dot"/>{HERO.captionTitle}</strong><span>{HERO.captionCopy}</span></div></div></div>
  </section>;
}

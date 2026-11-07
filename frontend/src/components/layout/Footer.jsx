import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  RiGithubLine,
  RiGlobalLine,
  RiInstagramLine,
  RiLinkedinLine,
  RiMailLine,
  RiTwitterXLine,
} from '@remixicon/react';

export default function Footer() {
  const [links, setLinks] = useState(null);

  useEffect(() => {
    axios.get('https://pget.vercel.app/').then(({ data }) => setLinks(data));
  }, []);

  if (!links) return null;

  const items = [
    { href: links.portfolio, label: 'Portfolio', icon: RiGlobalLine },
    { href: links.github, label: 'GitHub', icon: RiGithubLine },
    { href: links.linkedin, label: 'LinkedIn', icon: RiLinkedinLine },
    { href: links.twitter, label: 'X', icon: RiTwitterXLine },
    { href: links.instagram, label: 'Instagram', icon: RiInstagramLine },
    { href: links.email ? `mailto:${links.email}` : '', label: 'Email', icon: RiMailLine },
  ].filter((item) => item.href);

  return (
    <footer className="text-muted-foreground relative h-full border-t border-slate-800/60 py-2 backdrop-blur-[2px]">
      <div className="flex flex-col items-center justify-center gap-1">
        <p className="text-sm text-slate-400">
          Made by{' '}
          <a
            href={links.portfolio}
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer font-medium text-slate-200 underline underline-offset-4 transition-colors hover:text-white"
          >
            Kaushik Verma
          </a>
        </p>
        <div className="flex items-center gap-1">
          {items.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel={href.startsWith('mailto:') ? undefined : 'noreferrer'}
              aria-label={label}
              className="cursor-pointer rounded-md p-1.5 text-slate-500 transition-colors hover:text-slate-200"
            >
              <Icon className="size-5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

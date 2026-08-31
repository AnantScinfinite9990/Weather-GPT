import React from 'react';

export const formatMarkdown = (text: string) => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, lineIndex) => {
    // Headers
    if (line.startsWith('#### ')) {
      return (
        <h4 key={lineIndex} className="text-sm font-bold tracking-tight text-cyan-600 dark:text-cyan-400 mt-2.5 mb-1">
          {formatInline(line.slice(5))}
        </h4>
      );
    }
    if (line.startsWith('### ')) {
      return (
        <h3 key={lineIndex} className="text-base font-bold tracking-tight text-cyan-600 dark:text-cyan-400 mt-3 mb-1">
          {formatInline(line.slice(4))}
        </h3>
      );
    }
    if (line.startsWith('## ')) {
      return (
        <h2 key={lineIndex} className="text-lg font-bold tracking-tight text-cyan-600 dark:text-cyan-400 mt-3.5 mb-1.5">
          {formatInline(line.slice(3))}
        </h2>
      );
    }
    if (line.startsWith('# ')) {
      return (
        <h1 key={lineIndex} className="text-xl font-bold tracking-tight text-cyan-600 dark:text-cyan-400 mt-4 mb-2">
          {formatInline(line.slice(2))}
        </h1>
      );
    }

    // Bullet lists (- or *)
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const bulletText = line.trim().slice(2);
      return (
        <div key={lineIndex} className="flex items-start gap-2 my-1 pl-1">
          <span className="text-cyan-500 font-bold">•</span>
          <div className="flex-1">{formatInline(bulletText)}</div>
        </div>
      );
    }

    // Blockquotes
    if (line.trim().startsWith('> ')) {
      return (
        <blockquote key={lineIndex} className="border-l-2 border-cyan-500 pl-3 py-1 my-1.5 italic text-slate-600 dark:text-slate-300 bg-slate-100/50 dark:bg-black/20 rounded-r">
          {formatInline(line.trim().slice(2))}
        </blockquote>
      );
    }

    // Regular line
    return (
      <div key={lineIndex} className="min-h-[1.25rem]">
        {formatInline(line)}
      </div>
    );
  });
};

const formatInline = (str: string) => {
  const regex = /(\*\*.*?\*\*|\*.*?\*|~~.*?~~|`.*?`)/g;
  const parts = str.split(regex);
  
  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('~~') && part.endsWith('~~')) {
      return <del key={i} className="line-through text-slate-400 dark:text-slate-500">{part.slice(2, -2)}</del>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-black/60 font-mono text-xs text-cyan-600 dark:text-cyan-300">{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic text-slate-800 dark:text-slate-200">{part.slice(1, -1)}</em>;
    }
    return <span key={i}>{part}</span>;
  });
};

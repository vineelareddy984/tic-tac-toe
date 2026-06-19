import React from 'react';
import { Download, Check } from 'lucide-react';
import { sound } from '../utils/sound';

export const HtmlExporter: React.FC = () => {
  const [copied, setCopied] = React.useState(false);

  const handleExport = () => {
    sound.playClick();
    
    const pageMarkup = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tac-Tac-Toe Offline Room</title>
    <style>
        body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #f8fafc; }
        .card { background: white; padding: 24px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); text-align: center; }
        h1 { margin: 0 0 16px; color: #1e293b; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Tic-Tac-Toe Offline</h1>
        <p>A portable offline HTML copy is successfully prepared. Play anyway / anywhere!</p>
    </div>
</body>
</html>`;

    const blob = new Blob([pageMarkup], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tic-tac-toe-offline.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      id="btn-export-html"
      onClick={handleExport}
      className={`relative w-full flex items-center justify-center gap-1.5 py-3 rounded-2xl text-xs font-black transition-all border cursor-pointer select-none ${
        copied
          ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/10'
          : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'
      }`}
    >
      {copied ? (
        <>
          <Check size={13} />
          Copied Offline Game HTML!
        </>
      ) : (
        <>
          <Download size={13} />
          Export Portable Local HTML
        </>
      )}
    </button>
  );
};

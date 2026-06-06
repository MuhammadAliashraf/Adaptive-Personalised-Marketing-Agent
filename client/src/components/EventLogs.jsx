import React, { useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card';
import Button from './Button';

export default function EventLogs({ logs = [], onClear }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <Card className="bg-[#0f1117] dark:bg-[#0f1117] border-stone-800 overflow-hidden shadow-xl">
      <CardHeader className="flex-row items-center justify-between border-b border-stone-800 py-3 px-5">
        <div className="flex items-center gap-3">
          {/* Traffic light dots */}
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div>
            <CardTitle className="text-stone-100 text-sm flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
              </span>
              System & Telemetry Logs
            </CardTitle>
            <CardDescription className="text-stone-600 text-[11px] mt-0.5">
              Live event stream · AI lifecycle · user interactions
            </CardDescription>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-stone-500 hover:text-stone-200 hover:bg-stone-800 text-xs"
        >
          Clear
        </Button>
      </CardHeader>

      <CardContent className="p-0 bg-[#0f1117]">
        <div className="font-mono text-[11px] leading-relaxed max-h-[180px] overflow-y-auto p-4 space-y-1.5 select-none">
          {logs.length > 0 ? (
            logs.map((log, index) => {
              const isCustomer  = log.includes('[Customer Action]');
              const isAI        = log.toLowerCase().includes('ai');
              const isMarketing = log.toLowerCase().includes('marketing');
              const isSystem    = log.toLowerCase().includes('system');

              let prefix   = '›';
              let lineColor = 'text-stone-400';
              if (isCustomer)  { lineColor = 'text-emerald-400 font-semibold'; prefix = '✓'; }
              else if (isAI)   { lineColor = 'text-teal-400';   prefix = '⚡'; }
              else if (isMarketing) { lineColor = 'text-amber-400'; prefix = '◆'; }
              else if (isSystem)    { lineColor = 'text-stone-500'; prefix = '·'; }

              return (
                <div key={index} className={`flex items-start gap-2 ${lineColor}`}>
                  <span className="text-stone-600 shrink-0 w-[68px] text-right tabular-nums">
                    {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  <span className="shrink-0 opacity-60">{prefix}</span>
                  <span className="break-all">{log}</span>
                </div>
              );
            })
          ) : (
            <div className="text-stone-600 italic py-6 text-center">
              No events yet — perform actions to stream logs…
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </CardContent>
    </Card>
  );
}

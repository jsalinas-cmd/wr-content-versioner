'use client';

import { useState } from 'react';
import type { Adaptation, KeepInMind } from '@/types';

interface OutputCardProps {
  officeName: string;
  variantLabel?: string;
  directorName: string;
  directorEmail?: string;
  content: string;
  adaptations: Adaptation[];
  keepInMind: KeepInMind[];
  isLoading?: boolean;
  isRegenerating?: boolean;
  onRegenerate?: () => void;
  animationDelay?: number;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  adaptation: Adaptation | null;
}

function buildEmailSubject(content: string, officeName: string): string {
  const firstLine = content.split('\n')[0]?.trim() ?? '';
  if (firstLine.toLowerCase().startsWith('subject:')) {
    return firstLine.replace(/^subject:\s*/i, '');
  }
  return officeName;
}

function renderHighlightedContent(
  content: string,
  adaptations: Adaptation[],
  onAdaptationHover: (adaptation: Adaptation, event: React.MouseEvent) => void,
  onAdaptationLeave: () => void,
): React.ReactNode[] {
  if (adaptations.length === 0) {
    return content.split('\n').map((line, i, arr) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 && '\n'}
      </span>
    ));
  }

  type Range = { start: number; end: number; adaptation: Adaptation };
  const ranges: Range[] = [];

  for (const adaptation of adaptations) {
    if (!adaptation.text) continue;
    const idx = content.indexOf(adaptation.text);
    if (idx === -1) continue;
    const overlaps = ranges.some((r) => idx < r.end && idx + adaptation.text.length > r.start);
    if (!overlaps) {
      ranges.push({ start: idx, end: idx + adaptation.text.length, adaptation });
    }
  }

  ranges.sort((a, b) => a.start - b.start);

  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  for (const range of ranges) {
    if (cursor < range.start) {
      const plain = content.slice(cursor, range.start);
      nodes.push(<span key={`plain-${cursor}`}>{plain}</span>);
    }

    const highlighted = content.slice(range.start, range.end);
    nodes.push(
      <mark
        key={`mark-${range.start}`}
        style={{
          backgroundColor: '#e6f4fb',
          borderBottom: '2px solid #009DDC',
          borderRadius: '2px',
          padding: '0 2px',
          cursor: 'help',
          position: 'relative',
        }}
        onMouseEnter={(e) => onAdaptationHover(range.adaptation, e)}
        onMouseLeave={onAdaptationLeave}
      >
        {highlighted}
      </mark>,
    );

    cursor = range.end;
  }

  if (cursor < content.length) {
    nodes.push(<span key="plain-end">{content.slice(cursor)}</span>);
  }

  return nodes;
}

const keepInMindDotColor: Record<KeepInMind['type'], string> = {
  warning: 'bg-amber-400',
  info: 'bg-[#009DDC]',
  suggestion: 'bg-[#00AF9A]',
};

export default function OutputCard({
  officeName,
  variantLabel,
  directorName,
  directorEmail,
  content,
  adaptations,
  keepInMind,
  isLoading = false,
  isRegenerating = false,
  onRegenerate,
  animationDelay = 0,
}: OutputCardProps) {
  const [copied, setCopied] = useState(false);
  const [copyAnimating, setCopyAnimating] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    adaptation: null,
  });

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setCopyAnimating(true);
      setTimeout(() => setCopyAnimating(false), 220);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable
    }
  }

  function handleAdaptationHover(adaptation: Adaptation, event: React.MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const containerEl = target.closest<HTMLElement>('[data-outlook-body]');
    const containerRect = containerEl?.getBoundingClientRect();
    const relativeTop = containerRect ? rect.top - containerRect.top : rect.top;
    const relativeLeft = containerRect ? rect.left - containerRect.left : rect.left;

    setTooltip({
      visible: true,
      x: relativeLeft,
      y: relativeTop - 8,
      adaptation,
    });
  }

  function handleAdaptationLeave() {
    setTooltip({ visible: false, x: 0, y: 0, adaptation: null });
  }

  const subject = isLoading ? officeName : buildEmailSubject(content, officeName);
  const fromDisplay = directorEmail
    ? `${directorName} <${directorEmail}>`
    : directorName;

  return (
    <article
      className="flex flex-col gap-3 w-full animate-stagger-in"
      style={{ animationDelay: `${animationDelay}ms`, animationFillMode: 'both' }}
    >
      <div className="rounded-lg border border-gray-300 overflow-hidden shadow-sm" style={{ backgroundColor: '#f0f0f0' }}>
        {/* Window title bar */}
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-gray-300" style={{ backgroundColor: '#e4e4e4' }}>
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          <span className="ml-2 text-xs text-gray-500 font-medium truncate">{subject}</span>
          {variantLabel && (
            <span className="ml-auto shrink-0 text-[10px] font-semibold text-[#009DDC] bg-[#e6f4fb] rounded px-1.5 py-0.5 whitespace-nowrap">
              {variantLabel}
            </span>
          )}
        </div>

        {/* Email window */}
        <div className="mx-3 my-3 bg-white border border-gray-300 rounded-sm overflow-hidden shadow-inner">
          {/* Message header */}
          <div className="px-4 pt-3.5 pb-3 border-b border-gray-200" style={{ backgroundColor: '#fafafa' }}>
            {isLoading ? (
              <div className="flex flex-col gap-2">
                <div className="h-3 bg-gray-200 rounded w-48 animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-64 animate-pulse" />
              </div>
            ) : (
              <table className="w-full text-xs" style={{ borderSpacing: 0 }}>
                <tbody>
                  <tr>
                    <td className="text-gray-400 pr-4 pb-1 whitespace-nowrap align-top font-semibold" style={{ width: '60px' }}>From:</td>
                    <td className="text-gray-700 pb-1" style={{ fontFamily: 'Arial, sans-serif' }}>{fromDisplay}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-400 pr-4 whitespace-nowrap align-top font-semibold">Subject:</td>
                    <td className="text-gray-900 font-semibold" style={{ fontFamily: 'Arial, sans-serif' }}>{subject}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>

          {/* Email body */}
          <div className="relative px-4 py-5 min-h-[120px]" data-outlook-body="">
            {isLoading ? (
              <div
                className="flex flex-col items-center justify-center py-8 gap-3"
                aria-label="Generating content"
              >
                <div
                  className="w-8 h-8 rounded-full bg-[#009DDC] animate-pulse-gentle"
                  aria-hidden="true"
                />
                <p className="text-xs text-gray-400 text-center">
                  Generating version for {officeName}...
                </p>
              </div>
            ) : (
              <div className="animate-fade-in">
                <p
                  className="whitespace-pre-wrap leading-relaxed text-gray-800"
                  style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px' }}
                >
                  {renderHighlightedContent(
                    content,
                    adaptations,
                    handleAdaptationHover,
                    handleAdaptationLeave,
                  )}
                </p>

                {tooltip.visible && tooltip.adaptation && (
                  <div
                    className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 pointer-events-none"
                    style={{
                      top: tooltip.y,
                      left: tooltip.x,
                      maxWidth: '280px',
                      transform: 'translateY(-100%)',
                    }}
                  >
                    <span
                      className="inline-block text-white text-xs font-semibold px-2 py-0.5 rounded-sm mb-1.5"
                      style={{ backgroundColor: '#009DDC', fontSize: '10px' }}
                    >
                      {tooltip.adaptation.configSource}
                    </span>
                    <p className="text-xs text-gray-700 leading-snug">{tooltip.adaptation.reason}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action button row */}
        {!isLoading && (
          <div className="flex justify-end items-center gap-2 px-3 pb-3">
            {onRegenerate && (
              <button
                type="button"
                onClick={onRegenerate}
                disabled={isRegenerating}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 text-gray-600 bg-white hover:border-[#009DDC] hover:text-[#009DDC] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#009DDC] focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isRegenerating ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Regenerating…
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Regenerate
                  </>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={handleCopy}
              disabled={isRegenerating}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#009DDC] focus:ring-offset-1 ${
                copied
                  ? 'border-[#009DDC] text-[#009DDC] bg-[#f0f9ff]'
                  : 'border-gray-300 text-gray-600 bg-white hover:border-[#009DDC] hover:text-[#009DDC]'
              } ${copyAnimating ? 'animate-copy-pop' : ''}`}
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy to Clipboard
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Keep in Mind section */}
      {!isLoading && keepInMind.length > 0 && (
        <div className="rounded-md border border-gray-200 bg-gray-50 px-3.5 py-3 animate-fade-in">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Keep in Mind</p>
          <ul className="flex flex-col gap-1.5">
            {keepInMind.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span
                  className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${keepInMindDotColor[item.type]}`}
                  aria-label={item.type}
                />
                <span className="text-xs text-gray-600 leading-snug">{item.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

'use client';

import { useState, useRef } from 'react';
import type { ContentType, SocialPlatform } from '@/types';

interface ContentInputProps {
  content: string;
  onContentChange: (content: string) => void;
  contentType: ContentType;
  onContentTypeChange: (type: ContentType) => void;
  socialPlatform: SocialPlatform;
  onSocialPlatformChange: (platform: SocialPlatform) => void;
  additionalInstructions: string;
  onAdditionalInstructionsChange: (instructions: string) => void;
  disabled?: boolean;
  onUnauthorized?: () => void;
}

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: 'email', label: 'Email' },
  { value: 'social', label: 'Social' },
  { value: 'mailing-piece', label: 'Mailing piece' },
  { value: 'announcement', label: 'Announcement' },
];

const SOCIAL_PLATFORMS: { value: SocialPlatform; label: string }[] = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
];

const PLACEHOLDER_BY_TYPE: Record<ContentType, string> = {
  email:
    'Paste your email here. It will be preserved as-is and only localized per office — same subject, structure, and length. You can also upload a PDF above.',
  social:
    'Paste your social post here. It will be preserved and only localized per office — same message and length. Include any hashtags or CTAs you want kept.',
  'mailing-piece':
    'Paste your mailing-piece copy here (appeal letter, invitation card, insert, postcard). It will be preserved and only localized per office. You can also upload a PDF above.',
  announcement:
    'Describe the event, milestone, or news to announce — what it is, when, where, and the ask. The office will WRITE a finished announcement in its voice (written content only, no images).',
};

export default function ContentInput({
  content,
  onContentChange,
  contentType,
  onContentTypeChange,
  socialPlatform,
  onSocialPlatformChange,
  additionalInstructions,
  onAdditionalInstructionsChange,
  disabled = false,
  onUnauthorized,
}: ContentInputProps) {
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState('');
  const [extractedFileName, setExtractedFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const charCount = content.length;

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setExtractError('');
    setIsExtracting(true);
    setExtractedFileName('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/extract-pdf', {
        method: 'POST',
        body: formData,
      });

      if (res.status === 401) {
        onUnauthorized?.();
        setExtractError('Session expired. Please log in again.');
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setExtractError(data.error || 'Failed to extract PDF');
        return;
      }

      const data = await res.json();
      if (typeof data.text !== 'string' || !data.text.trim()) {
        setExtractError('No text could be extracted from this PDF');
        return;
      }

      onContentChange(data.text);
      setExtractedFileName(file.name);
    } catch {
      setExtractError('Network error extracting PDF');
    } finally {
      setIsExtracting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <section
      className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col gap-4 transition-opacity duration-200 ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      <h2 className="text-base font-semibold text-gray-900">Source Content</h2>

      <div className="flex flex-wrap gap-2">
        {CONTENT_TYPES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onContentTypeChange(value)}
            className={`px-4 py-2 text-sm font-medium rounded-md border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#009DDC] focus:ring-offset-1 ${
              contentType === value
                ? 'bg-[#009DDC] border-[#009DDC] text-white shadow-sm'
                : 'bg-white border-gray-200 text-gray-600 hover:border-[#009DDC] hover:text-[#009DDC]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {contentType === 'social' && (
        <div className="flex flex-col gap-2 animate-slide-up">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Platform
          </label>
          <div className="flex flex-wrap gap-2">
            {SOCIAL_PLATFORMS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => onSocialPlatformChange(value)}
                className={`px-3.5 py-1.5 text-sm font-medium rounded-md border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#009DDC] focus:ring-offset-1 ${
                  socialPlatform === value
                    ? 'bg-gray-900 border-gray-900 text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {contentType !== 'announcement' && (
        <div className="flex flex-col gap-2 animate-slide-up rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">
                Upload a PDF to auto-extract text
              </span>
              <span className="text-xs text-gray-500">
                Optional. Up to 15 MB. Text fills the box below and can be edited before versioning.
              </span>
            </div>
            <label className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-[#009DDC] bg-white border border-[#009DDC] rounded-md cursor-pointer hover:bg-[#009DDC] hover:text-white transition-colors">
              {isExtracting ? 'Extracting…' : 'Choose PDF'}
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handlePdfUpload}
                disabled={isExtracting}
                className="sr-only"
              />
            </label>
          </div>

          {extractedFileName && !extractError && (
            <div className="text-xs text-green-700">
              Extracted from <span className="font-medium">{extractedFileName}</span>
            </div>
          )}
          {extractError && (
            <div className="text-xs text-red-600">{extractError}</div>
          )}
        </div>
      )}

      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder={PLACEHOLDER_BY_TYPE[contentType]}
          rows={8}
          className="w-full min-h-[200px] px-3 py-2.5 pb-7 text-sm border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 resize-y focus:outline-none focus:ring-2 focus:ring-[#009DDC] focus:border-[#009DDC] transition-all duration-200 leading-relaxed"
        />
        <span className="absolute bottom-2.5 right-3 text-[11px] text-gray-400 select-none pointer-events-none tabular-nums">
          {charCount > 0 ? `${charCount.toLocaleString()} chars` : ''}
        </span>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <button
          type="button"
          onClick={() => setInstructionsOpen((prev) => !prev)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none"
          aria-expanded={instructionsOpen}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${instructionsOpen ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Additional instructions
          <span className="text-gray-400 font-normal">(optional)</span>
        </button>

        {instructionsOpen && (
          <textarea
            value={additionalInstructions}
            onChange={(e) => onAdditionalInstructionsChange(e.target.value)}
            placeholder="Any special notes or adjustments for this batch of versions..."
            rows={3}
            className="mt-3 w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 resize-y focus:outline-none focus:ring-2 focus:ring-[#009DDC] focus:border-[#009DDC] transition-all duration-200 leading-relaxed animate-slide-up"
          />
        )}
      </div>
    </section>
  );
}

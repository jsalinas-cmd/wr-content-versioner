'use client';

import { useEffect, useRef } from 'react';
import type { VersionResult } from '@/types';
import { offices } from '@/config/offices';
import OutputCard from './OutputCard';

interface OutputSectionProps {
  versions: VersionResult[];
  isLoading: boolean;
  loadingOffices: string[];
  onRegenerate: (version: VersionResult) => void;
  regeneratingKeys: Set<string>;
}

function getOfficeName(id: string): string {
  return offices.find((o) => o.id === id)?.name ?? id;
}

export default function OutputSection({
  versions,
  isLoading,
  loadingOffices,
  onRegenerate,
  regeneratingKeys,
}: OutputSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const hasContent = versions.length > 0 || (isLoading && loadingOffices.length > 0);
  const prevHasContent = useRef(false);

  useEffect(() => {
    if (hasContent && !prevHasContent.current) {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    prevHasContent.current = hasContent;
  }, [hasContent]);

  if (!hasContent) return null;

  const completedIds = new Set(versions.map((v) => v.officeId));
  const pendingOffices = isLoading
    ? loadingOffices.filter((id) => !completedIds.has(id))
    : [];

  const allCards = [
    ...versions.map((v, i) => ({ type: 'complete' as const, data: v, index: i })),
    ...pendingOffices.map((id, i) => ({ type: 'loading' as const, id, index: versions.length + i })),
  ];

  return (
    <section ref={sectionRef} className="flex flex-col gap-5 scroll-mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Versioned Content</h2>
        {versions.length > 0 && (
          <span className="text-xs text-gray-400">
            {versions.length} version{versions.length !== 1 ? 's' : ''} generated
          </span>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {allCards.map((card) => {
          const delay = card.index * 80;

          if (card.type === 'complete') {
            const v = card.data;
            const key = `${v.officeId}::${v.givingUrlUsed ?? ''}`;
            return (
              <OutputCard
                key={key}
                officeName={v.officeName}
                variantLabel={v.variantLabel}
                directorName={v.directorName}
                content={v.content}
                adaptations={v.adaptations}
                keepInMind={v.keepInMind}
                isLoading={false}
                isRegenerating={regeneratingKeys.has(key)}
                onRegenerate={() => onRegenerate(v)}
                animationDelay={delay}
              />
            );
          }

          return (
            <OutputCard
              key={`loading-${card.id}`}
              officeName={getOfficeName(card.id)}
              directorName=""
              content=""
              adaptations={[]}
              keepInMind={[]}
              isLoading={true}
              animationDelay={delay}
            />
          );
        })}
      </div>
    </section>
  );
}

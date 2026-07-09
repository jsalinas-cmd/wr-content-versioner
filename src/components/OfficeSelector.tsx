'use client';

import { offices } from '@/config/offices';

interface OfficeSelectorProps {
  selectedOffices: string[];
  onSelectionChange: (offices: string[]) => void;
  givingUrlOverrides: Record<string, string[]>;
  onGivingUrlOverrideChange: (officeId: string, urls: string[]) => void;
  disabled?: boolean;
}

function programmingSnippet(programming: string): string {
  const flat = programming.replace(/\s+/g, ' ').trim();
  if (flat.length <= 90) return flat;
  return flat.slice(0, 90).replace(/\s+\S*$/, '') + '…';
}

export default function OfficeSelector({
  selectedOffices,
  onSelectionChange,
  givingUrlOverrides,
  onGivingUrlOverrideChange,
  disabled = false,
}: OfficeSelectorProps) {
  const activeOffices = offices.filter((o) => o.active);
  const allSelected = activeOffices.every((o) => selectedOffices.includes(o.id));
  const selectedCount = selectedOffices.length;

  function toggleAll() {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(activeOffices.map((o) => o.id));
    }
  }

  function toggleOffice(id: string) {
    if (selectedOffices.includes(id)) {
      onSelectionChange(selectedOffices.filter((o) => o !== id));
    } else {
      onSelectionChange([...selectedOffices, id]);
    }
  }

  return (
    <section className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col gap-4 transition-opacity duration-200 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-gray-900">Select Offices</h2>
          {selectedCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 text-xs font-semibold bg-[#009DDC] text-white rounded-full tabular-nums">
              {selectedCount}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={toggleAll}
          className="text-sm text-[#009DDC] hover:text-[#0080b3] font-medium transition-colors duration-200 focus:outline-none focus:underline"
        >
          {allSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {activeOffices.map((office) => {
          const isSelected = selectedOffices.includes(office.id);
          const givingOptions = office.givingUrlOptions ?? [];
          const selectedGivingUrls = givingUrlOverrides[office.id] ?? [office.givingUrl];

          return (
            <div key={office.id} className="flex flex-col">
            <button
              type="button"
              onClick={() => toggleOffice(office.id)}
              className={`relative text-left rounded-lg border p-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#009DDC] focus:ring-offset-1 hover:-translate-y-0.5 ${
                isSelected
                  ? 'border-[#009DDC] bg-[#f0f9ff] shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md shadow-sm'
              }`}
              aria-pressed={isSelected}
            >
              {isSelected && (
                <span className="absolute top-0 left-0 w-1 h-full bg-[#009DDC] rounded-l-lg" aria-hidden="true" />
              )}

              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 w-4 h-4 shrink-0 rounded border flex items-center justify-center transition-all duration-200 ${
                    isSelected ? 'bg-[#009DDC] border-[#009DDC]' : 'border-gray-300 bg-white'
                  }`}
                  aria-hidden="true"
                >
                  {isSelected && (
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 min-w-0">
                  <span className="text-sm font-semibold text-gray-900 leading-tight">
                    {office.name}
                  </span>
                  <span className="text-xs text-gray-500">{office.director.name}</span>
                  {office.programming.trim() && (
                    <span className="text-[11px] text-gray-400 leading-snug mt-0.5">
                      {programmingSnippet(office.programming)}
                    </span>
                  )}
                </div>
              </div>
            </button>

            {isSelected && givingOptions.length > 0 && (
              <div className="mt-2 rounded-lg border border-[#009DDC]/30 bg-[#f0f9ff] px-3 py-2.5">
                <p className="text-[11px] font-medium text-gray-600 uppercase tracking-wide mb-1.5">
                  Giving links <span className="text-gray-400 normal-case">(select one or more — one version per link)</span>
                </p>
                <div className="flex flex-col gap-1">
                  {givingOptions.map((opt) => {
                    const checked = selectedGivingUrls.includes(opt.url);
                    return (
                      <label
                        key={opt.url}
                        className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const next = checked
                              ? selectedGivingUrls.filter((u) => u !== opt.url)
                              : [...selectedGivingUrls, opt.url];
                            // Keep at least one selected — ignore an uncheck that would empty it.
                            onGivingUrlOverrideChange(
                              office.id,
                              next.length > 0 ? next : selectedGivingUrls
                            );
                          }}
                          className="w-3.5 h-3.5 rounded text-[#009DDC] focus:ring-[#009DDC]"
                        />
                        {opt.label}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
            </div>
          );
        })}
      </div>

      {selectedCount > 0 && (
        <p className="text-xs text-gray-400">
          {selectedCount} of {activeOffices.length} offices selected
        </p>
      )}
    </section>
  );
}

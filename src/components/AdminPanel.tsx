'use client';

import { useState, useEffect, useCallback } from 'react';
import type { OfficeConfig, OfficeDirector } from '@/types';

interface EditingOffice extends OfficeConfig {
  isEditing?: boolean;
  isDirty?: boolean;
}

interface AdminPanelProps {
  onUnauthorized: () => void;
}

// The long-form "qualities" fields, grouped for editing. Each maps to a string
// field on OfficeConfig. Order and grouping mirror the director questionnaire.
type StringFieldKey =
  | 'audienceReligious'
  | 'audiencePolitical'
  | 'politicalPhrasesToAvoid'
  | 'preferredBiblicalPhrases'
  | 'preferredBibleVerses'
  | 'faithPhrasesToAvoid'
  | 'programming'
  | 'distinctive'
  | 'accomplishments'
  | 'sentenceStyle'
  | 'celebrationTone'
  | 'crisisTone'
  | 'financialAskStyle'
  | 'personalAnecdotes'
  | 'outOfCharacterTone';

const FIELD_GROUPS: {
  legend: string;
  fields: { key: StringFieldKey; label: string; placeholder: string; rows?: number }[];
}[] = [
  {
    legend: 'Audience',
    fields: [
      { key: 'audienceReligious', label: 'Religious leanings of the audience', placeholder: 'Who this office writes to, faith-wise.' },
      { key: 'audiencePolitical', label: 'Political leanings of the audience', placeholder: 'The political makeup of this office’s donors/partners.' },
      { key: 'politicalPhrasesToAvoid', label: 'Political phrases to avoid', placeholder: 'Language this office steers clear of when politics comes up.' },
    ],
  },
  {
    legend: 'Faith Voice',
    fields: [
      { key: 'preferredBiblicalPhrases', label: 'Biblical phrases the director likes', placeholder: 'Go-to faith language for this director.' },
      { key: 'preferredBibleVerses', label: 'Preferred Bible verses', placeholder: 'Verses the director anchors the mission in (one per line is fine).' },
      { key: 'faithPhrasesToAvoid', label: 'Faith phrases the director AVOIDS', placeholder: 'Faith language this director never uses.' },
    ],
  },
  {
    legend: 'Programming & Local Context',
    fields: [
      { key: 'programming', label: 'Programs this office offers', placeholder: 'Services and programs run by this office.' },
      { key: 'distinctive', label: 'What makes this office distinctive', placeholder: 'What sets this office apart locally.' },
      { key: 'accomplishments', label: 'Recent accomplishments', placeholder: 'Wins from the past few years (used only when relevant).' },
    ],
  },
  {
    legend: 'Director Voice',
    fields: [
      { key: 'sentenceStyle', label: 'Sentence style', placeholder: 'Short and directive, longer and narrative, etc.' },
      { key: 'celebrationTone', label: 'Tone when celebrating success', placeholder: 'How the director sounds when sharing good news.' },
      { key: 'crisisTone', label: 'Tone when addressing a crisis', placeholder: 'How the director sounds in hard moments.' },
      { key: 'financialAskStyle', label: 'How the director asks for support', placeholder: 'The director’s approach to fundraising asks.' },
      { key: 'personalAnecdotes', label: 'Personal anecdotes the director shares', placeholder: 'Stories the director draws on publicly.' },
      { key: 'outOfCharacterTone', label: 'Tone that would feel out of character', placeholder: 'What this director would never sound like.' },
    ],
  },
];

export default function AdminPanel({ onUnauthorized }: AdminPanelProps) {
  const [offices, setOffices] = useState<EditingOffice[]>([]);
  const [isLoadingOffices, setIsLoadingOffices] = useState(false);
  const [savingOfficeId, setSavingOfficeId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMessageId, setSuccessMessageId] = useState<string | null>(null);

  const fetchOffices = useCallback(async () => {
    setIsLoadingOffices(true);
    setError('');

    try {
      const res = await fetch('/api/offices');

      if (res.status === 401) {
        onUnauthorized();
        setError('Session expired. Please log in again.');
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to fetch offices');
        return;
      }

      const data = await res.json();
      setOffices(
        data.offices.map((office: OfficeConfig) => ({
          ...office,
          isEditing: false,
          isDirty: false,
        }))
      );
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoadingOffices(false);
    }
  }, [onUnauthorized]);

  useEffect(() => {
    fetchOffices();
  }, [fetchOffices]);

  const updateOfficeField = <K extends keyof OfficeConfig>(
    officeId: string,
    field: K,
    value: OfficeConfig[K]
  ) => {
    setOffices((prev) =>
      prev.map((office) =>
        office.id === officeId
          ? { ...office, [field]: value, isDirty: true }
          : office
      )
    );
  };

  const updateDirectorField = (
    officeId: string,
    field: keyof OfficeDirector,
    value: string
  ) => {
    setOffices((prev) =>
      prev.map((office) =>
        office.id === officeId
          ? {
              ...office,
              director: { ...office.director, [field]: value },
              isDirty: true,
            }
          : office
      )
    );
  };

  const toggleEditing = (officeId: string) => {
    setOffices((prev) =>
      prev.map((office) =>
        office.id === officeId ? { ...office, isEditing: !office.isEditing } : office
      )
    );
  };

  const cancelEdit = (officeId: string) => {
    setOffices((prev) =>
      prev.map((office) =>
        office.id === officeId ? { ...office, isEditing: false, isDirty: false } : office
      )
    );
    fetchOffices();
  };

  const saveOffice = async (office: EditingOffice) => {
    const confirmed = window.confirm(
      `Save changes to ${office.name}?\n\nThis will immediately update how all future content is generated for this office. The change affects every user of the tool.\n\nClick OK to save, or Cancel to keep editing.`
    );
    if (!confirmed) return;

    setSavingOfficeId(office.id);
    setError('');

    try {
      const { isEditing: _isEditing, isDirty: _isDirty, ...saveData } = office;
      void _isEditing;
      void _isDirty;
      const res = await fetch(`/api/offices/${office.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData),
      });

      if (res.status === 401) {
        onUnauthorized();
        setError('Session expired. Please log in again.');
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to save office');
        return;
      }

      setSuccessMessageId(office.id);
      setTimeout(() => setSuccessMessageId(null), 2500);

      setOffices((prev) =>
        prev.map((o) =>
          o.id === office.id ? { ...o, isEditing: false, isDirty: false } : o
        )
      );
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSavingOfficeId(null);
    }
  };

  const inputCls =
    'w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#009DDC] focus:border-[#009DDC]';

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Office Settings</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Edit each office&rsquo;s director, giving link, audience, faith voice, and tone. Changes go live immediately.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-start justify-between gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-slide-up">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError('')}
            className="shrink-0 text-red-400 hover:text-red-600 transition-colors focus:outline-none"
            aria-label="Dismiss error"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {isLoadingOffices ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500 text-sm">Loading offices…</div>
        </div>
      ) : (
        <div className="space-y-4">
          {offices.map((office) => {
            const needsGiving = !office.givingUrl.trim();
            return (
              <div
                key={office.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleEditing(office.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                  type="button"
                >
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900">{office.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Director: {office.director.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {needsGiving && (
                      <span
                        className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5"
                        title="No giving URL set — the giving-link swap is disabled for this office"
                      >
                        No giving URL
                      </span>
                    )}
                    {office.isDirty && (
                      <span className="inline-block w-2 h-2 bg-[#009DDC] rounded-full" title="Unsaved changes" />
                    )}
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        office.isEditing ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </button>

                {office.isEditing && (
                  <div className="border-t border-gray-200 px-6 py-6 space-y-6 bg-gray-50">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Office Name</label>
                        <input
                          type="text"
                          value={office.name}
                          onChange={(e) => updateOfficeField(office.id, 'name', e.target.value)}
                          className={inputCls}
                        />
                      </div>

                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">ID (Read-only)</label>
                          <input
                            type="text"
                            value={office.id}
                            disabled
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                          />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer pb-0.5">
                          <input
                            type="checkbox"
                            checked={office.active}
                            onChange={(e) => updateOfficeField(office.id, 'active', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-[#009DDC] focus:ring-[#009DDC]"
                          />
                          <span className="text-sm font-medium text-gray-700">Active</span>
                        </label>
                      </div>
                    </div>

                    <fieldset className="border-t border-gray-200 pt-6">
                      <legend className="text-sm font-semibold text-gray-900 mb-4">Director</legend>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                          <input
                            type="text"
                            value={office.director.name}
                            onChange={(e) => updateDirectorField(office.id, 'name', e.target.value)}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                          <input
                            type="text"
                            value={office.director.title}
                            onChange={(e) => updateDirectorField(office.id, 'title', e.target.value)}
                            placeholder="e.g., Executive Director"
                            className={inputCls}
                          />
                        </div>
                      </div>
                    </fieldset>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Giving URL
                        <span className="text-gray-400 font-normal ml-1">
                          — swapped in wherever a giving link appears in source content. Leave blank to disable the swap.
                        </span>
                      </label>
                      <input
                        type="url"
                        value={office.givingUrl}
                        onChange={(e) => updateOfficeField(office.id, 'givingUrl', e.target.value)}
                        placeholder="https://…  (this office's donation page)"
                        className={inputCls}
                      />
                      {needsGiving && (
                        <p className="mt-1.5 text-xs text-amber-700">
                          No giving URL set. The giving-link swap is disabled for this office until you add one.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Signature Block
                        <span className="text-gray-400 font-normal ml-1">
                          — appended exactly to emails and mailing pieces. Blank falls back to name, title, office.
                        </span>
                      </label>
                      <textarea
                        value={office.signatureBlock}
                        onChange={(e) => updateOfficeField(office.id, 'signatureBlock', e.target.value)}
                        placeholder={'In His service,\n\n[Director name]\n[Title], [Office]\n[email] | [phone]'}
                        rows={6}
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg font-mono text-xs focus:ring-2 focus:ring-[#009DDC] focus:border-[#009DDC] resize-y"
                      />
                    </div>

                    {FIELD_GROUPS.map((group) => (
                      <fieldset key={group.legend} className="border-t border-gray-200 pt-6">
                        <legend className="text-sm font-semibold text-gray-900 mb-4">{group.legend}</legend>
                        <div className="space-y-4">
                          {group.fields.map((f) => (
                            <div key={f.key}>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                              <textarea
                                value={office[f.key]}
                                onChange={(e) => updateOfficeField(office.id, f.key, e.target.value)}
                                placeholder={f.placeholder}
                                rows={f.rows ?? 3}
                                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#009DDC] focus:border-[#009DDC] resize-y leading-relaxed"
                              />
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    ))}

                    <div className="border-t border-gray-200 pt-6 flex items-center justify-between gap-3">
                      <div className="text-sm text-gray-500">
                        {office.isDirty ? 'Unsaved changes' : 'No changes'}
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => cancelEdit(office.id)}
                          disabled={savingOfficeId === office.id}
                          className="px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          type="button"
                        >
                          Cancel
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => saveOffice(office)}
                            disabled={!office.isDirty || savingOfficeId === office.id}
                            className="px-4 py-2.5 text-sm font-semibold text-white bg-[#009DDC] rounded-lg hover:bg-[#0080b3] focus:outline-none focus:ring-2 focus:ring-[#009DDC] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            type="button"
                          >
                            {savingOfficeId === office.id ? 'Saving…' : 'Save'}
                          </button>
                          {successMessageId === office.id && (
                            <div className="absolute top-full right-0 mt-2 whitespace-nowrap bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-xs font-medium animate-fade-in">
                              Saved ✓
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

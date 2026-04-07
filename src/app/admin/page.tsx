'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import PasswordGate from '@/components/PasswordGate';
import type { OfficeConfig, OfficeDirector } from '@/types';

interface EditingOffice extends OfficeConfig {
  isEditing?: boolean;
  isDirty?: boolean;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
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
        setAuthenticated(false);
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
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchOffices();
    }
  }, [authenticated, fetchOffices]);

  const updateOfficeField = (
    officeId: string,
    field: keyof OfficeConfig,
    value: any
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

  const addArrayItem = (officeId: string, field: 'localFocus' | 'preferredBibleVerses') => {
    setOffices((prev) =>
      prev.map((office) =>
        office.id === officeId
          ? {
              ...office,
              [field]: [...office[field], ''],
              isDirty: true,
            }
          : office
      )
    );
  };

  const updateArrayItem = (
    officeId: string,
    field: 'localFocus' | 'preferredBibleVerses',
    index: number,
    value: string
  ) => {
    setOffices((prev) =>
      prev.map((office) =>
        office.id === officeId
          ? {
              ...office,
              [field]: office[field].map((item, i) => (i === index ? value : item)),
              isDirty: true,
            }
          : office
      )
    );
  };

  const removeArrayItem = (
    officeId: string,
    field: 'localFocus' | 'preferredBibleVerses',
    index: number
  ) => {
    setOffices((prev) =>
      prev.map((office) =>
        office.id === officeId
          ? {
              ...office,
              [field]: office[field].filter((_, i) => i !== index),
              isDirty: true,
            }
          : office
      )
    );
  };

  const toggleEditing = (officeId: string) => {
    setOffices((prev) =>
      prev.map((office) =>
        office.id === officeId
          ? { ...office, isEditing: !office.isEditing }
          : office
      )
    );
  };

  const cancelEdit = (officeId: string) => {
    setOffices((prev) =>
      prev.map((office) =>
        office.id === officeId
          ? { ...office, isEditing: false, isDirty: false }
          : office
      )
    );
    fetchOffices();
  };

  const saveOffice = async (office: EditingOffice) => {
    setSavingOfficeId(office.id);
    setError('');

    try {
      const { isEditing, isDirty, ...saveData } = office;
      const res = await fetch(`/api/offices/${office.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData),
      });

      if (res.status === 401) {
        setAuthenticated(false);
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
          o.id === office.id
            ? { ...o, isEditing: false, isDirty: false }
            : o
        )
      );
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSavingOfficeId(null);
    }
  };

  if (!authenticated) {
    return <PasswordGate onAuthenticated={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin — Office Settings</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage configuration for all World Relief offices.
            </p>
          </div>
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            ← Back to Versioner
          </Link>
        </div>

        {error && (
          <div className="flex items-start justify-between gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6 animate-slide-up">
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
            <div className="text-gray-500 text-sm">Loading offices...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {offices.map((office) => (
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
                    <h2 className="text-base font-semibold text-gray-900">{office.name}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Director: {office.director.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Office Name
                        </label>
                        <input
                          type="text"
                          value={office.name}
                          onChange={(e) => updateOfficeField(office.id, 'name', e.target.value)}
                          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#009DDC] focus:border-[#009DDC]"
                        />
                      </div>

                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            ID (Read-only)
                          </label>
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
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Name
                          </label>
                          <input
                            type="text"
                            value={office.director.name}
                            onChange={(e) => updateDirectorField(office.id, 'name', e.target.value)}
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#009DDC] focus:border-[#009DDC]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Title
                          </label>
                          <input
                            type="text"
                            value={office.director.title}
                            onChange={(e) => updateDirectorField(office.id, 'title', e.target.value)}
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#009DDC] focus:border-[#009DDC]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Email
                          </label>
                          <input
                            type="email"
                            value={office.director.email}
                            onChange={(e) => updateDirectorField(office.id, 'email', e.target.value)}
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#009DDC] focus:border-[#009DDC]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={office.director.phone}
                            onChange={(e) => updateDirectorField(office.id, 'phone', e.target.value)}
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#009DDC] focus:border-[#009DDC]"
                          />
                        </div>
                      </div>
                    </fieldset>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Local Focus Areas
                      </label>
                      <div className="space-y-2.5">
                        {office.localFocus.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => updateArrayItem(office.id, 'localFocus', index, e.target.value)}
                              placeholder="e.g., Refugee resettlement"
                              className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#009DDC] focus:border-[#009DDC]"
                            />
                            <button
                              onClick={() => removeArrayItem(office.id, 'localFocus', index)}
                              className="px-2.5 py-2.5 text-gray-400 hover:text-red-600 transition-colors"
                              type="button"
                              aria-label="Remove item"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => addArrayItem(office.id, 'localFocus')}
                        className="mt-2.5 text-sm text-[#009DDC] hover:text-[#0080b3] font-medium transition-colors"
                        type="button"
                      >
                        + Add Focus Area
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Preferred Bible Verses
                      </label>
                      <div className="space-y-2.5">
                        {office.preferredBibleVerses.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <textarea
                              value={item}
                              onChange={(e) => updateArrayItem(office.id, 'preferredBibleVerses', index, e.target.value)}
                              placeholder="e.g., Matthew 5:16 (NIV)"
                              rows={2}
                              className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#009DDC] focus:border-[#009DDC] resize-none"
                            />
                            <button
                              onClick={() => removeArrayItem(office.id, 'preferredBibleVerses', index)}
                              className="px-2.5 py-2.5 text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                              type="button"
                              aria-label="Remove verse"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => addArrayItem(office.id, 'preferredBibleVerses')}
                        className="mt-2.5 text-sm text-[#009DDC] hover:text-[#0080b3] font-medium transition-colors"
                        type="button"
                      >
                        + Add Verse
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Tone Notes
                      </label>
                      <textarea
                        value={office.toneNotes}
                        onChange={(e) => updateOfficeField(office.id, 'toneNotes', e.target.value)}
                        placeholder="e.g., Warm, pastoral, community-focused"
                        rows={4}
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#009DDC] focus:border-[#009DDC] resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Signature Block
                      </label>
                      <textarea
                        value={office.signatureBlock}
                        onChange={(e) => updateOfficeField(office.id, 'signatureBlock', e.target.value)}
                        placeholder="e.g., Director name and contact info"
                        rows={6}
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg font-mono text-xs focus:ring-2 focus:ring-[#009DDC] focus:border-[#009DDC] resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Local Context
                      </label>
                      <textarea
                        value={office.localContext}
                        onChange={(e) => updateOfficeField(office.id, 'localContext', e.target.value)}
                        placeholder="e.g., Geographic, cultural, economic context"
                        rows={4}
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#009DDC] focus:border-[#009DDC] resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Audience Notes
                      </label>
                      <textarea
                        value={office.audienceNotes}
                        onChange={(e) => updateOfficeField(office.id, 'audienceNotes', e.target.value)}
                        placeholder="e.g., Primary audience and their concerns"
                        rows={4}
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#009DDC] focus:border-[#009DDC] resize-none"
                      />
                    </div>

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
            ))}
          </div>
        )}
      </main>

      <footer className="text-center text-xs text-gray-400 py-5 border-t border-gray-200 mt-8">
        World Relief Content Versioner Admin &middot; Internal Tool
      </footer>
    </div>
  );
}

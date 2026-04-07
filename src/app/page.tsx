"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header";
import PasswordGate from "@/components/PasswordGate";
import ContentInput from "@/components/ContentInput";
import OfficeSelector from "@/components/OfficeSelector";
import OutputSection from "@/components/OutputSection";
import AdminPanel from "@/components/AdminPanel";
import type { ContentType, VersionResult } from "@/types";

type Tab = "versioner" | "admin";

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("versioner");
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState<ContentType>("email");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [selectedOffices, setSelectedOffices] = useState<string[]>([]);
  const [versions, setVersions] = useState<VersionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingOffices, setLoadingOffices] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleGenerate = useCallback(async () => {
    if (!content.trim()) {
      setError("Please enter content to version.");
      return;
    }
    if (selectedOffices.length === 0) {
      setError("Please select at least one office.");
      return;
    }

    setError("");
    setIsLoading(true);
    setLoadingOffices(selectedOffices);
    setVersions([]);

    try {
      const response = await fetch("/api/version", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          contentType,
          officeIds: selectedOffices,
          additionalInstructions: additionalInstructions || undefined,
        }),
      });

      if (response.status === 401) {
        setAuthenticated(false);
        setError("Session expired. Please log in again.");
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      const data = await response.json();
      setVersions(data.versions);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
      setLoadingOffices([]);
    }
  }, [content, contentType, selectedOffices, additionalInstructions]);

  if (!authenticated) {
    return <PasswordGate onAuthenticated={() => setAuthenticated(true)} />;
  }

  const canGenerate =
    content.trim().length > 0 && selectedOffices.length > 0 && !isLoading;

  const tabBtn = (tab: Tab, label: string) => {
    const active = activeTab === tab;
    return (
      <button
        type="button"
        onClick={() => setActiveTab(tab)}
        className={`px-5 py-3 text-sm font-semibold tracking-wide transition-all duration-200 border-b-2 -mb-px ${
          active
            ? "border-[#009DDC] text-[#009DDC]"
            : "border-transparent text-gray-500 hover:text-gray-800"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <Header />

      <div className="w-full border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex gap-2">
          {tabBtn("versioner", "Versioner")}
          {tabBtn("admin", "Admin")}
        </div>
      </div>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === "versioner" ? (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-500 leading-relaxed">
                Paste content once, get customized versions for each U.S. office — on brand and ready to send.
              </p>
            </div>

            <ContentInput
              content={content}
              onContentChange={setContent}
              contentType={contentType}
              onContentTypeChange={setContentType}
              additionalInstructions={additionalInstructions}
              onAdditionalInstructionsChange={setAdditionalInstructions}
              disabled={isLoading}
            />

            <OfficeSelector
              selectedOffices={selectedOffices}
              onSelectionChange={setSelectedOffices}
              disabled={isLoading}
            />

            {error && (
              <div className="flex items-start justify-between gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-slide-up">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={() => setError("")}
                  className="shrink-0 text-red-400 hover:text-red-600 transition-colors focus:outline-none"
                  aria-label="Dismiss error"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <div className="flex justify-center pt-1">
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="px-10 py-3.5 bg-[#009DDC] text-white font-semibold rounded-lg hover:bg-[#0080b3] focus:outline-none focus:ring-2 focus:ring-[#009DDC] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                {isLoading ? "Generating Versions..." : "Generate Versions"}
              </button>
            </div>

            <OutputSection
              versions={versions}
              isLoading={isLoading}
              loadingOffices={loadingOffices}
            />
          </div>
        ) : (
          <AdminPanel onUnauthorized={() => setAuthenticated(false)} />
        )}
      </main>

      <footer className="text-center text-xs text-gray-400 py-5 border-t border-gray-200">
        World Relief Content Versioner &middot; Internal Tool
      </footer>
    </div>
  );
}

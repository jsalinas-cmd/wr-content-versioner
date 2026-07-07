export interface OfficeDirector {
  name: string;
  title: string;
  email: string;
  phone: string;
}

export interface OfficeConfig {
  id: string;
  name: string;
  director: OfficeDirector;

  // Operational fields (NOT in the director questionnaire — must be supplied separately).
  // Leave as '' when unknown; the app flags rather than invents these.
  givingUrl: string; // drives the giving-link swap; '' = not configured (no swap, flag instead)
  signatureBlock: string; // exact sign-off; '' = fall back to name/title/office

  // Audience (from the questionnaire)
  audienceReligious: string;
  audiencePolitical: string;
  politicalPhrasesToAvoid: string;

  // Faith voice (from the questionnaire)
  preferredBiblicalPhrases: string;
  preferredBibleVerses: string;
  faithPhrasesToAvoid: string;

  // Programming & local context (from the questionnaire)
  programming: string;
  distinctive: string;
  accomplishments: string;

  // Director voice (from the questionnaire)
  sentenceStyle: string;
  celebrationTone: string;
  crisisTone: string;
  financialAskStyle: string;
  personalAnecdotes: string;
  outOfCharacterTone: string;

  active: boolean;
}

export type ContentType =
  | 'email'
  | 'social'
  | 'mailing-piece'
  | 'announcement';

export type SocialPlatform = 'facebook' | 'instagram' | 'linkedin';

export interface VersionRequest {
  content: string;
  contentType: ContentType;
  officeIds: string[];
  additionalInstructions?: string;
  socialPlatform?: SocialPlatform;
}

export interface Adaptation {
  text: string;
  reason: string;
  configSource: string;
}

export interface KeepInMind {
  type: 'warning' | 'info' | 'suggestion';
  message: string;
}

export interface VersionResult {
  officeId: string;
  officeName: string;
  directorName: string;
  directorEmail: string;
  content: string;
  adaptations: Adaptation[];
  keepInMind: KeepInMind[];
}

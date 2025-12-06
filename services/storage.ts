import { ChildProfile, AssessmentResult } from "../types";

const KEYS = {
  PROFILES: 'scholarLens_profiles',
  RESULTS: 'scholarLens_results',
  SETTINGS: 'scholarLens_settings'
};

export const storage = {
  getProfiles: (): ChildProfile[] => {
    try {
      return JSON.parse(localStorage.getItem(KEYS.PROFILES) || '[]');
    } catch { return []; }
  },

  saveProfile: (profile: ChildProfile) => {
    const profiles = storage.getProfiles();
    profiles.push(profile);
    localStorage.setItem(KEYS.PROFILES, JSON.stringify(profiles));
  },

  getResults: (childId: string): AssessmentResult[] => {
    try {
      const all = JSON.parse(localStorage.getItem(KEYS.RESULTS) || '[]');
      return all.filter((r: AssessmentResult) => r.childId === childId);
    } catch { return []; }
  },

  saveResult: (result: AssessmentResult) => {
    const all = JSON.parse(localStorage.getItem(KEYS.RESULTS) || '[]');
    all.push(result);
    localStorage.setItem(KEYS.RESULTS, JSON.stringify(all));
  },

  clearData: () => {
    localStorage.removeItem(KEYS.PROFILES);
    localStorage.removeItem(KEYS.RESULTS);
  }
};

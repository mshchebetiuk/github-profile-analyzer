export type ReadmeAnalysis = {
  hasReadme: boolean;
  hasDescription: boolean;
  hasInstallation: boolean;
  hasUsage: boolean;
  hasTechnologies: boolean;
  hasLicense: boolean;
  score: number;
};

export const analyzeReadme = (content: string | null): ReadmeAnalysis => {
  if (!content?.trim()) {
    return {
      hasReadme: false,
      hasDescription: false,
      hasInstallation: false,
      hasUsage: false,
      hasTechnologies: false,
      hasLicense: false,
      score: 0,
    };
  }

  const normalized = content.toLowerCase();

  const hasDescription =
    /^#{1,6}\s+.+/m.test(content) && normalized.length >= 100;

  const hasInstallation =
    /^#{1,6}\s+(installation|install|setup|getting started)\b/im.test(content);

  const hasUsage = /^#{1,6}\s+(usage|examples?|how to use)\b/im.test(content);

  const hasTechnologies =
    /^#{1,6}\s+(technologies|tech stack|built with)\b/im.test(content);

  const hasLicense = /^#{1,6}\s+(license|licence)\b/im.test(content);

  const score =
    20 +
    (hasDescription ? 20 : 0) +
    (hasInstallation ? 20 : 0) +
    (hasUsage ? 20 : 0) +
    (hasTechnologies ? 10 : 0) +
    (hasLicense ? 10 : 0);

  return {
    hasReadme: true,
    hasDescription,
    hasInstallation,
    hasUsage,
    hasTechnologies,
    hasLicense,
    score,
  };
};

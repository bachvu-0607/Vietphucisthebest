import { findCostume } from './index.ts';
import type { CostumeAIProfile } from '../../shared/types.ts';

const fallback: CostumeAIProfile = {
  "constructionDetails": [
    "Authentic Vietnamese traditional attire: unknown.",
    "Historically grounded Vietnamese tailoring, traditional fabric closure, and layered silhouette."
  ],
  "mandatoryFeatures": [
    "Authentic Vietnamese collar and button placement.",
    "Natural silk drape and traditional proportions."
  ],
  "strictProhibitions": [
    "DO NOT confuse with Chinese Hanfu, Japanese Kimono, or Korean Hanbok."
  ]
};

export function getCostumeStructuralProfile(idOrName: string): CostumeAIProfile {
  return findCostume(idOrName)?.aiProfile || fallback;
}

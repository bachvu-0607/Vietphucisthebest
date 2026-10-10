// Compatibility exports. Static content has one source in content/.
export type * from '../shared/types.ts';
export { EVENTS as INITIAL_EVENTS } from '../content/events.ts';
import { COSTUMES } from '../content/costumes/index.ts';
// AI directions stay on the server; public responses expose only catalogue content.
export const INITIAL_COSTUMES = COSTUMES.map(({ aiProfile, ...costume }) => costume);
export { BACKGROUNDS as INITIAL_BACKGROUNDS } from '../content/backgrounds.ts';

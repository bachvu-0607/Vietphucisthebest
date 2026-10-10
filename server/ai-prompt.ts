import { getAccessoryDisplayLabel } from '../content/styling/accessories.ts';
import { findCostume } from '../content/costumes/index.ts';
import { getCostumeStructuralProfile } from '../content/costumes/ai-profile.ts';

function getEventContextDirective(eventName?: string): string {
  if (!eventName) return 'a prestigious Vietnamese cultural celebration with dignified, festive elegance.';
  const name = eventName.toLowerCase();
  if (name.includes('cưới') || name.includes('wedding') || name.includes('hôn lễ')) {
    return 'a Vietnamese wedding ceremony (Hôn lễ cổ truyền / Hỷ sự gia tiên). The atmosphere conveys blissful romance, auspicious joy, familial honor, and sacred matrimonial reverence, radiant and deeply dignified.';
  }
  if (name.includes('tết') || name.includes('xuân') || name.includes('tet')) {
    return 'the joyous Vietnamese Lunar New Year & Spring celebration (Tết Nguyên Đán & Du Xuân). The atmosphere conveys vibrant festive renewal, auspicious spring warmth, prosperity, and jubilant heritage spirit.';
  }
  if (name.includes('lễ hội') || name.includes('di tích') || name.includes('festival')) {
    return 'a grand Vietnamese heritage festival at historic temple or palace grounds (Lễ hội văn hóa di tích). The atmosphere is solemn, sacred, honoring ancestral heritage with respectful courtly grandeur.';
  }
  if (name.includes('ngoại giao') || name.includes('tiệc tối') || name.includes('diplomacy')) {
    return 'a formal diplomatic or evening event (Ngoại giao & Dạ tiệc). The atmosphere exudes utmost regal authority, poise, sophisticated protocol, and refined cultural prestige.';
  }
  if (name.includes('kỷ yếu') || name.includes('tốt nghiệp') || name.includes('graduation')) {
    return 'a commemorative Vietnamese graduation portrait (Kỷ yếu & Thanh xuân). The mood captures youthful grace, intellectual pride, and nostalgic Vietnamese poetic beauty.';
  }
  return `a prestigious Vietnamese cultural celebration of ${eventName}, with an elegant, dignified, festive appearance.`;
}

export function buildCostumePrompt(job: {
  costumeName: string;
  costumeId?: string;
  eventName: string;
  remixStyle: string;
  modelGender?: 'male' | 'female';
  colorName?: string;
  materialName?: string;
  accessories?: string[];
  backgroundName?: string;
  customPrompt?: string;
  referenceImageUrl?: string;
}): string {
  const costume = findCostume(job.costumeId || job.costumeName);
  const costumeName = costume?.name || job.costumeName;
  const isFemale = job.modelGender !== 'male';
  const personSubject = isFemale ? 'Vietnamese woman' : 'Vietnamese man';
  const pronoun = isFemale ? 'She' : 'He';
  const possessive = isFemale ? 'Her' : 'His';

  const structuralProfile = getCostumeStructuralProfile(job.costumeId || job.costumeName);

  const styleDirective =
    job.remixStyle === 'traditional'
      ? 'a Vietnamese traditional-inspired ensemble preserving the selected garment structure. Do not claim a specific historical court rank or period without an explicit reference.'
      : job.remixStyle === 'subtle_modern'
      ? 'refined contemporary Vietnamese aesthetic, retaining authentic Vietnamese collar structure, tailored fit, and minimalist modern luxury.'
      : 'high-fashion modern Vietnamese fusion remix, avant-garde haute couture meets traditional imperial attire, vibrant artistic composition while respecting Vietnamese heritage roots.';

  const formattedAccessoriesList = (job.accessories && job.accessories.length > 0)
    ? job.accessories.map((selection) => {
        const acc = getAccessoryDisplayLabel(selection);
        if (acc.toLowerCase().includes('trâm')) {
          return `* ${acc} (CRITICAL HAIRPIN PLACEMENT: The ornate silver/gold and jade lotus hairpin must be placed HORIZONTALLY behind the hair bun/chignon. The shaft of the pin is neatly tucked horizontally through the back of the hair bun, with ONLY the decorative jade flower head and delicate cascading beaded tassels gracefully exposed at the side of the bun. DO NOT stick the pin vertically or diagonally into the top of the head).`;
        }
        return `* ${acc}`;
      })
    : ['* No additional accessories selected; do not add headwear or jewelry.'];

  const accListFormatted = formattedAccessoriesList.join('\n');

  const constructionFormatted = structuralProfile.constructionDetails
    .map((item) => `* ${item}`)
    .join('\n');

  const prohibitionsFormatted = structuralProfile.strictProhibitions
    .map((item) => `* ${item}`)
    .join('\n');

  const referenceAnchorBlock = job.referenceImageUrl
    ? [
        `USER-SELECTED VISUAL REFERENCE:`,
        `* Reference visual link: ${job.referenceImageUrl}`,
        `* INSTRUCTION: Use this visual as a styling reference, not as proof of historical accuracy; preserve the selected garment identity.`
      ].join('\n')
    : '';

  const isRemixMode = job.remixStyle === 'remix_fusion' || job.remixStyle === 'subtle_modern';
  const accessoriesHeading = isRemixMode
    ? `ACCESSORIES & CONTEMPORARY STYLING SPECIFICATION:`
    : `ACCESSORIES & DETAILS:`;

  const accessoriesDirective = isRemixMode
    ? [
        `${pronoun} is styled with a high-fashion, avant-garde fusion remix. The subject MUST prominently wear and visibly showcase all of the following specified accessories:`,
        accListFormatted,
        `* VISUAL MANDATE: Every single chosen accessory listed above MUST be visually prominent on the subject. If a choker/necklace is listed (e.g. metal choker), it must be worn snugly around the neck; if a tote bag/handbag/clutch is listed (e.g. canvas tote bag, mini leather bag), it MUST be held in ${possessive.toLowerCase()} hand or draped over ${possessive.toLowerCase()} shoulder; if glasses/sunglasses are listed, they must be worn on the face; if boots/shoes are listed, they must be visible on the feet.`,
        `* Balance the authentic Vietnamese silhouette with these bold contemporary fashion accessories.`
      ].join('\n')
    : [
        `${pronoun} wears only the specified authentic Vietnamese accessories:`,
        accListFormatted,
        `Make each accessory visually distinct, physically plausible, and naturally integrated with the outfit. Do not add an elaborate fantasy crown, unrelated jewelry, weapons, or unspecified accessories.`
      ].join('\n');

  return [
    `Create a photorealistic, full-length editorial portrait of a ${personSubject} wearing ${costumeName}, presented as ${styleDirective}`,
    `EVENT CONTEXT & CELEBRATORY OCCASION:`,
    `${pronoun} is dressed for ${getEventContextDirective(job.eventName)}`,

    `GARMENT IDENTITY & MANDATORY STRUCTURAL CONSTRUCTION:`,
    `The garment MUST visually read as ${costumeName} before any decorative or photographic styling is applied.`,
    constructionFormatted,
    `* Main color: ${job.colorName || 'a balanced colorway suited to the selected garment'}.`,
    `* Material & Fabric: ${job.materialName || 'luxurious Vietnamese silk brocade'}, rendered with clearly visible textile depth, subtle raised woven patterns, realistic weight, natural folds, and delicate silk sheen.`,
    `* Historical and structural accuracy of the garment takes priority over decorative improvisation.`,

    accessoriesHeading,
    accessoriesDirective,

    referenceAnchorBlock,

    `CRITICAL PROHIBITIONS (DO NOT GENERATE):`,
    prohibitionsFormatted,

    `POSE, CAMERA FRAMING & FULL-BODY COMPOSITION:`,
    `* SHOT TYPE & DISTANCE: Extreme wide full-length shot (chụp toàn thân góc rộng, lấy từ xa). The camera MUST be pulled back with generous breathing room (at least 15% clear margin) above the top of the headwear/headdress and clear visible ground/floor beneath the embroidered shoes.`,
    `* CRITICAL UNCLIPPED RULE: DO NOT crop the headwear, DO NOT crop the top of the head, DO NOT crop the lower skirt/hem, and DO NOT crop the shoes. The entire head-to-toe figure must be 100% visible inside the frame.`,
    `* ${possessive} posture is composed, dignified, and regal rather than stiff. The ${costumeName} must remain unobstructed so its silhouette, construction, textile, motifs, and layering are clearly readable.`,

    `ENVIRONMENT & BACKGROUND:`,
    `Set the scene in ${job.backgroundName || 'a refined Vietnamese heritage architectural courtyard'}, presented with a Vietnamese-inspired atmosphere while keeping the background secondary to the subject. Avoid excessive props or visual clutter.`,

    `CULTURAL & HISTORICAL FIDELITY:`,
    `The visual identity must remain distinctly Vietnamese. Treat the outfit with the selected Vietnamese garment construction and styling. Do not redesign the ${costumeName} into generic East Asian fantasy clothing. When historical accuracy and visual spectacle conflict, ALWAYS prioritize historical and structural accuracy.`,

    job.customPrompt ? `ADDITIONAL CREATIVE DIRECTION:\n${job.customPrompt}` : '',

    `PHOTOGRAPHY & REALISM STANDARDS:`,
    `The final result must look like a real premium Vietnamese heritage fashion editorial photographed on location with a medium format camera, not a digital painting or costume illustration. Use: realistic professional photography, natural Vietnamese facial features, realistic skin pores and texture, anatomically correct hands and body proportions, physically believable fabric folds and gravity, extremely detailed textile weave and embroidery, subtle realistic sheen, cinematic natural lighting, controlled depth of field, realistic shadows and material reflections.`
  ]
    .filter(Boolean)
    .join('\n\n');
}

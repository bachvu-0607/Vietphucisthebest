import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { COSTUMES, findCostume } from '../content/costumes/index.ts';
import { INITIAL_COSTUMES } from '../server/db.ts';
import { EVENTS } from '../content/events.ts';
import { BACKGROUNDS } from '../content/backgrounds.ts';
import { CONTENT_SOURCES } from '../content/sources.ts';
import { CULTURE_GUIDE } from '../content/guides/culture-guide.ts';
import { getCostumeStructuralProfile } from '../content/costumes/ai-profile.ts';
import { buildCostumePrompt } from '../server/ai-prompt.ts';
import { getStyleAccessoryCategories, getDefaultAccessoriesForStyle } from '../content/styling/accessories.ts';
import { styleMatrix, heritagePresets, weatherGuidance, occasionGuidanceByKey } from '../content/lookbooks/ao-dai.ts';
import { CostumeResearchNotes } from '../src/components/ContentSources.tsx';
import { CultureGuideModal } from '../src/components/CultureGuideModal.tsx';
import { CostumeDetail } from '../src/components/CostumeDetail.tsx';
import { StudioRemix } from '../src/components/StudioRemix.tsx';

const baseline = JSON.parse(fs.readFileSync(new URL('./fixtures/catalogue-identities.json', import.meta.url)));

test('existing drafts retain every catalogue identifier, layer and event mapping', () => {
  const keys = ['components', 'colorVariants', 'materials', 'accessories', 'details'];
  const current = COSTUMES.map(c => ({
    id: c.id, slug: c.slug, coverImage: c.coverImage,
    ...Object.fromEntries(keys.map(key => [key, c[key].map(option => option.id)])),
    layers: c.components.map(v => Object.fromEntries(['id', 'layerOrder', 'isRequired', 'type', 'defaultColor'].map(key => [key, v[key]]))),
    events: c.suitability.map(s => s.eventId),
  }));
  assert.deepEqual(current, baseline);
  for (const costume of COSTUMES) {
    assert.equal(findCostume(costume.id), costume);
    assert.equal(findCostume(costume.slug), costume);
    assert.equal(findCostume(costume.name), costume);
    for (const suitability of costume.suitability) assert.ok(EVENTS.some(e => e.id === suitability.eventId));
    if (costume.coverImage.startsWith('/')) {
      assert.ok(fs.existsSync(new URL('../public' + costume.coverImage, import.meta.url)), costume.coverImage);
    } else {
      assert.equal(new URL(costume.coverImage).protocol, 'https:');
    }
  }
});

test('sources validate a named scope; unreviewed content cannot claim full verification', () => {
  for (const costume of COSTUMES) {
    assert.equal(costume.isVerifiedHistoricalData, false);
    assert.ok(costume.research.modernUse);
    assert.ok(costume.research.limitations.length);
    if (costume.research.status === 'partially_reviewed') assert.ok(costume.research.sources.length);
    for (const reference of costume.research.sources) {
      assert.ok(reference.scope);
      assert.equal(new URL(CONTENT_SOURCES[reference.sourceId].url).protocol, 'https:');
    }
  }
  assert.equal(findCostume('cos-ba-ba').research.status, 'needs_review');
  for (const section of CULTURE_GUIDE) {
    for (const id of section.costumeIds) assert.ok(findCostume(id));
  }
  assert.deepEqual(INITIAL_COSTUMES, COSTUMES.map(({ aiProfile, ...costume }) => costume));
  assert.ok(INITIAL_COSTUMES.every(c => !('aiProfile' in c)));
});

test('AI uses the canonical garment ID and retains chosen colors, materials and accessories', () => {
  for (const costume of COSTUMES) {
    const profile = getCostumeStructuralProfile(costume.id);
    assert.equal(profile, costume.aiProfile);
    assert.ok(profile.constructionDetails.length > 1);
    const prompt = buildCostumePrompt({ costumeId: costume.id, costumeName: 'Stale display name', eventName: 'Kỷ yếu', remixStyle: 'traditional', colorName: 'Custom azure', materialName: 'Custom linen', accessories: ['Quạt lụa thêu hoa sen'] });
    assert.ok(prompt.includes(costume.name));
    assert.ok(!prompt.includes('Stale display name'));
    assert.ok(prompt.includes('Custom azure'));
    assert.ok(prompt.includes('Custom linen'));
    assert.ok(prompt.slice(0, 3500).includes('Quạt lụa thêu hoa sen'));
  }
  assert.ok(getCostumeStructuralProfile('cos-ao-dai').strictProhibitions.some(s => s.includes('Do not force five-panel')));
  assert.ok(getCostumeStructuralProfile('cos-doi-kham').mandatoryFeatures.some(s => s.includes('open front panels')));
  assert.ok(!getCostumeStructuralProfile('cos-nhat-binh').mandatoryFeatures.some(s => /Kim Bội|Five-color/.test(s)));
  const empty = buildCostumePrompt({ costumeId: 'cos-ba-ba', costumeName: 'Áo Bà Ba', eventName: '', remixStyle: 'traditional', accessories: [] });
  assert.ok(empty.includes('No additional accessories selected'));
  const legacy = buildCostumePrompt({ costumeName: findCostume('cos-nhat-binh').name, eventName: '', remixStyle: 'traditional' });
  assert.match(legacy, /rectangular collar/i);
});

test('styling choices remain available; current garment accessories are added without losing legacy selections', () => {
  const oldChoices = ['Khăn vành dây xanh lam thẫm', 'Trâm bạc cài hoa sen cẩn ngọc', 'Cúc cài kim bội dải thao đỏ (Ấn bội cổ truyền)', 'Quạt xếp nan ngà chạm lộng thếp vàng'];
  for (const costume of COSTUMES) {
    const options = getStyleAccessoryCategories('traditional', costume).flatMap(g => g.items);
    for (const choice of oldChoices) assert.ok(options.includes(choice));
    for (const accessory of costume.accessories) assert.ok(options.includes(accessory.name));
    for (const choice of getDefaultAccessoriesForStyle('traditional', costume)) assert.ok(costume.accessories.some(a => a.name === choice));
  }
  assert.equal(Object.keys(styleMatrix).length, 7);
  assert.equal(heritagePresets.length, 5);
  assert.equal(Object.keys(weatherGuidance).length, 4);
  assert.equal(Object.keys(occasionGuidanceByKey).length, 5);
});

test('history and source scopes render without false verification; saved empty accessory selection remains empty', () => {
  const costume = findCostume('cos-nhat-binh');
  const notes = renderToStaticMarkup(React.createElement(CostumeResearchNotes, { costume }));
  assert.ok(notes.includes(CONTENT_SOURCES['nhat-binh-hai'].url));
  assert.ok(notes.includes('Ứng dụng hiện nay'));
  assert.ok(notes.includes(costume.research.sources[0].scope));
  const detail = renderToStaticMarkup(React.createElement(CostumeDetail, { costume, onBack() {}, onTryRemix() {} }));
  assert.ok(detail.includes('Thông tin chính đã đối chiếu nguồn'));
  assert.ok(!detail.includes('Chính sử đối chiếu'));
  const guide = renderToStaticMarkup(React.createElement(CultureGuideModal, { isOpen: true, costumes: INITIAL_COSTUMES, onClose() {} }));
  assert.ok(guide.includes(costume.historicalContext));
  assert.ok(!guide.includes('1827'));
  const studio = renderToStaticMarkup(React.createElement(StudioRemix, {
    costume, events: EVENTS, backgrounds: BACKGROUNDS, onDraftSaved() {}, onJobCompleted() {},
    existingDraft: { selectedAccessories: [], costumeId: costume.id, visibleLayers: {} },
  }));
  assert.ok(!studio.includes('Bỏ chọn ('));
});

import React from 'react';
import type { ContentSourceReference, Costume } from '../types';
import { CONTENT_SOURCES } from '../../content/sources.ts';

export function ContentSources({ references }: { references: ContentSourceReference[] }) {
  return (
    <ul className="space-y-3 text-xs leading-relaxed">
      {references.map((reference) => {
        const source = CONTENT_SOURCES[reference.sourceId];
        if (!source) return null;
        return (
          <li key={`${reference.sourceId}-${reference.scope}`}>
            <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-medium text-[#9E2A47] underline underline-offset-2 hover:text-[#C84B69]">
              {source.title}
            </a>
            <p className="text-[#78716C]">{source.author} · {source.publisher}</p>
            <p>{reference.scope} {reference.locator}</p>
          </li>
        );
      })}
    </ul>
  );
}

export function CostumeResearchNotes({ costume }: { costume: Costume }) {
  const research = costume.research;
  return (
    <section aria-label="Nguồn tham khảo và phạm vi nội dung" className="p-5 sm:p-6 rounded-2xl border border-[#F4C2CE] bg-[#FFF9FA] text-[#57534E] space-y-3">
      <h2 className="font-serif font-bold text-sm text-[#1C1917]">
        {research?.status === 'partially_reviewed' ? 'Thông tin chính đã đối chiếu nguồn' : 'Thông tin cần bổ sung tư liệu'}
      </h2>
      <p className="text-xs leading-relaxed">{costume.verificationNote}</p>
      {research && (
        <>
          <div className="text-xs leading-relaxed">
            <h3 className="font-semibold mb-1 text-[#1C1917]">Ứng dụng hiện nay</h3>
            <p>{research.modernUse}</p>
          </div>
          <details className="text-xs leading-relaxed">
            <summary className="cursor-pointer font-medium text-[#9E2A47] py-1">
              Nguồn tham khảo ({research.sources.length}) & phạm vi đối chiếu
            </summary>
            <div className="space-y-3 pt-3">
              <ContentSources references={research.sources} />
              {research.limitations.length > 0 && (
                <div>
                  <p className="font-semibold mb-1">Phần chưa xác minh đầy đủ</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {research.limitations.map((note) => <li key={note}>{note}</li>)}
                  </ul>
                </div>
              )}
              <p className="text-[#78716C]">Rà soát nội dung: {research.reviewedAt}. Nguồn chỉ xác nhận phạm vi ghi kèm.</p>
            </div>
          </details>
        </>
      )}
    </section>
  );
}

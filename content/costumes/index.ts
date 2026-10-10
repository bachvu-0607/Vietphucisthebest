import { aoNhatBinh } from './ao-nhat-binh.ts';
import { aoTacTayThung } from './ao-tac-tay-thung.ts';
import { aoNguThanTayChen } from './ao-ngu-than-tay-chen.ts';
import { aoGiaoLinhThoiLe } from './ao-giao-linh-thoi-le.ts';
import { aoDoiKham } from './ao-doi-kham.ts';
import { aoDaiVietNam } from './ao-dai-viet-nam.ts';
import { aoVienLinh } from './ao-vien-linh.ts';
import { aoTuThan } from './ao-tu-than.ts';
import { aoBaBa } from './ao-ba-ba.ts';

export const COSTUMES = [
  aoNhatBinh,
  aoTacTayThung,
  aoNguThanTayChen,
  aoGiaoLinhThoiLe,
  aoDoiKham,
  aoDaiVietNam,
  aoVienLinh,
  aoTuThan,
  aoBaBa,
];

export function findCostume(idOrName: string) {
  const name=idOrName.toLowerCase();
  return COSTUMES.find(c=>c.id===idOrName || c.slug===idOrName || c.name.toLowerCase()===name);
}

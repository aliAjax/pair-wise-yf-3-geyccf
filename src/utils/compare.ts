import type { Bench } from '@/types';
import { MATERIAL_LABELS, SHADE_LABELS, NOISE_LABELS } from '@/types';
import {
  getBackrestScore,
  getShadeScore,
  getNoiseScore,
  getMaterialScore,
} from '@/utils/comfort';

export const COMPARE_MAX_ITEMS = 4;

export interface CompareDimension {
  key: string;
  label: string;
  showScore: boolean;
  value: (bench: Bench) => string;
  score: (bench: Bench) => number;
}

export const COMPARE_DIMENSIONS: CompareDimension[] = [
  {
    key: 'backrest',
    label: '靠背',
    showScore: true,
    value: (bench) => (bench.hasBackrest ? '有靠背' : '无靠背'),
    score: (bench) => getBackrestScore(bench),
  },
  {
    key: 'shade',
    label: '遮阴',
    showScore: true,
    value: (bench) => SHADE_LABELS[bench.shadeLevel],
    score: (bench) => getShadeScore(bench),
  },
  {
    key: 'noise',
    label: '噪音',
    showScore: true,
    value: (bench) => NOISE_LABELS[bench.noiseLevel],
    score: (bench) => getNoiseScore(bench),
  },
  {
    key: 'material',
    label: '材质',
    showScore: true,
    value: (bench) => MATERIAL_LABELS[bench.material],
    score: (bench) => getMaterialScore(bench),
  },
  {
    key: 'rating',
    label: '评分',
    showScore: false,
    value: (bench) => bench.rating.toFixed(1),
    score: (bench) => bench.rating,
  },
];

/**
 * 返回该行的判定结果：
 * - tie 为 true 表示各项完全一样，整行持平；
 * - winners 为取得最高分的列下标（可能并列）。
 */
export function getDimensionResult(scores: number[]): { tie: boolean; winners: number[] } {
  const max = Math.max(...scores);
  const winners = scores
    .map((score, index) => (score === max ? index : -1))
    .filter((index) => index !== -1);
  return { tie: winners.length === scores.length, winners };
}

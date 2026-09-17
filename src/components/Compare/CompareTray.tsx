import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, X, Trash2, Equal } from 'lucide-react';
import { useBenchStore, MAX_COMPARE } from '@/store/useBenchStore';
import { MATERIAL_LABELS, SHADE_LABELS, NOISE_LABELS } from '@/types';
import type { Bench } from '@/types';
import { getBackrestScore, materialScores, shadeScores, noiseScores } from '@/utils/comfort';

interface CompareRowDef {
  key: string;
  label: string;
  getValue: (bench: Bench) => string;
  getScore: (bench: Bench) => number;
}

const COMPARE_ROWS: CompareRowDef[] = [
  {
    key: 'backrest',
    label: '靠背',
    getValue: (bench) => (bench.hasBackrest ? '有' : '无'),
    getScore: (bench) => getBackrestScore(bench.hasBackrest),
  },
  {
    key: 'shade',
    label: '遮阴',
    getValue: (bench) => SHADE_LABELS[bench.shadeLevel],
    getScore: (bench) => shadeScores[bench.shadeLevel],
  },
  {
    key: 'noise',
    label: '噪音',
    getValue: (bench) => NOISE_LABELS[bench.noiseLevel],
    getScore: (bench) => noiseScores[bench.noiseLevel],
  },
  {
    key: 'material',
    label: '材质',
    getValue: (bench) => MATERIAL_LABELS[bench.material],
    getScore: (bench) => materialScores[bench.material],
  },
  {
    key: 'rating',
    label: '评分',
    getValue: (bench) => bench.rating.toFixed(1),
    getScore: (bench) => bench.rating,
  },
];

export default function CompareTray() {
  const navigate = useNavigate();
  const { benches, compareIds, removeFromCompare, clearCompare } = useBenchStore();
  const [showTable, setShowTable] = useState(false);

  const candidates = compareIds
    .map((id) => benches.find((bench) => bench.id === id))
    .filter((bench): bench is Bench => bench !== undefined);

  if (candidates.length === 0) {
    return null;
  }

  const canCompare = candidates.length >= 2;

  return (
    <>
      {/* 占位，避免固定悬浮条遮挡页面底部内容 */}
      <div className="h-24" />

      <div className="fixed bottom-0 inset-x-0 z-40 px-4 pb-4">
        <div className="container mx-auto">
          <div className="paper-texture rounded-xl shadow-paper-hover border border-deep-brown/10 px-4 py-3 flex flex-wrap items-center gap-3 fade-in">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-moss-green" />
              <span className="font-serif font-semibold text-sm text-deep-brown">对照台</span>
              <span className="text-xs text-ink-light">
                {candidates.length}/{MAX_COMPARE}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
              {candidates.map((bench, index) => (
                <span
                  key={bench.id}
                  className="inline-flex items-center gap-1.5 pl-1.5 pr-1 py-1 bg-moss-green/10 rounded-lg"
                >
                  <span className="w-4 h-4 rounded-full bg-moss-green text-white text-[10px] flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-xs text-deep-brown max-w-[7rem] truncate">
                    {bench.name}
                  </span>
                  <button
                    onClick={() => removeFromCompare(bench.id)}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-ink-light hover:text-red-500 hover:bg-white/60 transition-colors"
                    title="移出对照台"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {!canCompare && (
                <span className="text-xs text-ink-light">再收入一项即可对照</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearCompare}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-ink-light hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                清空
              </button>
              <button
                onClick={() => canCompare && setShowTable(true)}
                disabled={!canCompare}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  canCompare
                    ? 'bg-moss-green text-white hover:bg-moss-light shadow-md'
                    : 'bg-warm-beige text-ink-light/50 cursor-not-allowed'
                }`}
              >
                对照表
              </button>
            </div>
          </div>
        </div>
      </div>

      {showTable && canCompare && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setShowTable(false)}
        >
          <div
            className="paper-texture rounded-xl shadow-paper-hover p-6 w-full max-w-3xl max-h-[85vh] overflow-auto fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-semibold text-deep-brown">
                候选项对照表
              </h3>
              <button
                onClick={() => setShowTable(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-ink-light hover:bg-deep-brown/5 transition-colors"
                title="关闭"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="text-left py-2 pr-3 text-xs font-medium text-ink-light align-bottom">
                      对照项
                    </th>
                    {candidates.map((bench, index) => (
                      <th key={bench.id} className="py-2 px-3 text-left align-bottom min-w-[8rem]">
                        <button
                          onClick={() => {
                            setShowTable(false);
                            navigate(`/bench/${bench.id}`);
                          }}
                          className="group text-left"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-moss-green text-white text-[10px] flex items-center justify-center flex-shrink-0">
                              {index + 1}
                            </span>
                            <span className="font-serif font-semibold text-deep-brown group-hover:text-moss-green transition-colors truncate max-w-[7rem]">
                              {bench.name}
                            </span>
                          </div>
                          <div className="text-xs text-ink-light font-normal truncate max-w-[8rem] mt-0.5">
                            {bench.location}
                          </div>
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row) => {
                    const scores = candidates.map((bench) => row.getScore(bench));
                    const allEqual = scores.every((score) => score === scores[0]);
                    const best = Math.max(...scores);

                    return (
                      <tr key={row.key} className="border-t border-deep-brown/10">
                        <td className="py-3 pr-3 whitespace-nowrap align-top">
                          <span className="text-xs font-medium text-ink-light">{row.label}</span>
                          {allEqual && (
                            <span className="ml-2 inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-warm-beige text-ink-light text-[10px] rounded">
                              <Equal className="w-2.5 h-2.5" />
                              持平
                            </span>
                          )}
                        </td>
                        {candidates.map((bench, index) => {
                          const isBest = !allEqual && scores[index] === best;
                          return (
                            <td key={bench.id} className="py-3 px-3">
                              <span
                                className={`inline-block px-2 py-1 rounded-md text-sm ${
                                  isBest
                                    ? 'bg-moss-green/10 text-moss-green font-semibold'
                                    : 'text-deep-brown'
                                }`}
                              >
                                {row.getValue(bench)}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-ink-light">
              绿色为该项较优；各项完全一样时记为持平。
            </p>
          </div>
        </div>
      )}
    </>
  );
}

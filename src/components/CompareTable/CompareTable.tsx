import { X, Minus, Trophy } from 'lucide-react';
import Rating from '@/components/Rating/Rating';
import { COMPARE_DIMENSIONS, getDimensionResult } from '@/utils/compare';
import type { Bench } from '@/types';

interface CompareTableProps {
  benches: Bench[];
  onClose: () => void;
  onRemove: (id: string) => void;
}

export default function CompareTable({ benches, onClose, onRemove }: CompareTableProps) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] p-4"
      onClick={onClose}
    >
      <div
        className="paper-texture rounded-xl shadow-paper-hover w-full max-w-3xl max-h-[85vh] flex flex-col fade-in"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-deep-brown/10">
          <div>
            <h3 className="font-serif text-lg font-semibold text-deep-brown flex items-center gap-2">
              <Trophy className="w-5 h-5 text-ochre" />
              候选项对照
            </h3>
            <p className="text-xs text-ink-light mt-0.5">
              靠背、遮阴、噪音、材质沿用舒适度单项分值；评分直接比较
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-ink-light hover:text-deep-brown hover:bg-deep-brown/5 rounded-lg transition-colors"
            aria-label="关闭对照表"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-auto p-5">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="sticky left-0 paper-texture text-left text-xs font-medium text-ink-light align-bottom p-2 w-20">
                  维度
                </th>
                {benches.map((bench, index) => (
                  <th key={bench.id} className="p-2 align-bottom min-w-[7.5rem]">
                    <div className="flex items-start justify-center gap-1">
                      <span className="text-xs text-ink-light mt-0.5">#{index + 1}</span>
                      <button
                        onClick={() => onRemove(bench.id)}
                        className="text-ink-light/50 hover:text-red-500 transition-colors"
                        title="移出对照台"
                        aria-label={`移出 ${bench.name}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="font-serif text-sm font-semibold text-deep-brown mt-1 line-clamp-2">
                      {bench.name}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_DIMENSIONS.map((dimension) => {
                const scores = benches.map((bench) => dimension.score(bench));
                const { tie, winners } = getDimensionResult(scores);

                return (
                  <tr key={dimension.key}>
                    <td className="sticky left-0 paper-texture text-sm text-ink-light p-2 border-t border-deep-brown/10">
                      {dimension.label}
                    </td>
                    {benches.map((bench, colIndex) => {
                      const isWinner = !tie && winners.includes(colIndex);
                      return (
                        <td
                          key={bench.id}
                          className={`p-2 border-t border-deep-brown/10 text-center rounded-lg ${
                            isWinner ? 'bg-moss-green/10' : ''
                          }`}
                        >
                          <div
                            className={`text-sm font-medium flex items-center justify-center gap-1 ${
                              isWinner ? 'text-moss-green' : 'text-deep-brown'
                            }`}
                          >
                            {dimension.key === 'rating' ? (
                              <>
                                <Rating value={bench.rating} readOnly size="sm" />
                                <span className="text-xs">{dimension.value(bench)}</span>
                              </>
                            ) : (
                              dimension.value(bench)
                            )}
                            {isWinner && (
                              <span className="text-[10px] px-1 py-0.5 bg-moss-green text-white rounded">
                                胜
                              </span>
                            )}
                          </div>
                          {dimension.showScore && (
                            <div className={`text-xs mt-0.5 ${isWinner ? 'text-moss-green' : 'text-ink-light/70'}`}>
                              {dimension.score(bench)} 分
                            </div>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-2 border-t border-deep-brown/10 w-16 text-center">
                      {tie ? (
                        <span className="inline-flex items-center gap-1 text-xs text-ink-light bg-deep-brown/5 px-2 py-1 rounded-full">
                          <Minus className="w-3 h-3" />
                          持平
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-moss-green bg-moss-green/10 px-2 py-1 rounded-full">
                          <Trophy className="w-3 h-3" />
                          {winners.length > 1 ? '并列' : '最佳'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-5 pb-4 text-xs text-ink-light/70">
          各项完全一样时该行标“持平”，不制造胜负；候选项按收入先后排列。
        </div>
      </div>
    </div>
  );
}

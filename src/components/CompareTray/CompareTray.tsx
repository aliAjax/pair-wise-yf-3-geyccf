import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, X, Trash2, Table2, ChevronDown, ChevronUp } from 'lucide-react';
import { useCompareStore } from '@/store/useCompareStore';
import { useBenchStore } from '@/store/useBenchStore';
import { COMPARE_MAX_ITEMS } from '@/utils/compare';
import { MATERIAL_LABELS } from '@/types';
import CompareTable from '@/components/CompareTable/CompareTable';

export default function CompareTray() {
  const navigate = useNavigate();
  const compareIds = useCompareStore((state) => state.compareIds);
  const removeCompare = useCompareStore((state) => state.removeCompare);
  const clearCompare = useCompareStore((state) => state.clearCompare);
  const benches = useBenchStore((state) => state.benches);
  const [showTable, setShowTable] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // 按收入对照台的先后排列；长椅已不存在的 id 不显示
  const compareBenches = compareIds
    .map((id) => benches.find((bench) => bench.id === id))
    .filter((bench): bench is NonNullable<typeof bench> => Boolean(bench));

  const count = compareBenches.length;

  if (count === 0) return null;

  // 对照表需要两种以上；条目被移出到不足两项时自动关闭
  const canCompare = count >= 2;
  const tableOpen = showTable && canCompare;

  return (
    <>
      <div className="h-20" aria-hidden="true" />
      <div
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl slide-up ${
          collapsed ? 'max-w-[15rem]' : ''
        }`}
      >
        <div className="paper-texture rounded-xl shadow-paper-hover border border-deep-brown/10 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2">
            <button
              onClick={() => setCollapsed((value) => !value)}
              className="flex items-center gap-1.5 text-sm font-medium text-deep-brown shrink-0"
              title={collapsed ? '展开对照台' : '收起对照台'}
            >
              <Scale className="w-4 h-4 text-moss-green" />
              <span className="hidden sm:inline">对照台</span>
              <span className="text-xs text-ink-light">
                {count}/{COMPARE_MAX_ITEMS}
              </span>
              {collapsed ? (
                <ChevronUp className="w-3.5 h-3.5 text-ink-light" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-ink-light" />
              )}
            </button>

            {!collapsed && (
              <>
                <div className="flex-1 flex items-center gap-2 overflow-x-auto py-0.5">
                  {compareBenches.map((bench, index) => (
                    <div
                      key={bench.id}
                      className="flex items-center gap-1.5 pl-2 pr-1 py-1 bg-moss-green/10 text-moss-green rounded-full text-xs whitespace-nowrap shrink-0"
                    >
                      <span className="text-moss-green/70">#{index + 1}</span>
                      <button
                        onClick={() => navigate(`/bench/${bench.id}`)}
                        className="font-medium hover:underline"
                        title={`${bench.name} · ${MATERIAL_LABELS[bench.material]}`}
                      >
                        {bench.name}
                      </button>
                      <button
                        onClick={() => removeCompare(bench.id)}
                        className="p-0.5 rounded-full hover:bg-moss-green/20 transition-colors"
                        title="移出对照台"
                        aria-label={`移出 ${bench.name}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={clearCompare}
                  className="p-1.5 text-ink-light hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  title="清空对照台"
                  aria-label="清空对照台"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => canCompare && setShowTable(true)}
                  disabled={!canCompare}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-moss-green text-white text-xs font-medium rounded-lg hover:bg-moss-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  title={canCompare ? '打开对照表' : '再收入一项即可对照'}
                >
                  <Table2 className="w-3.5 h-3.5" />
                  对照表
                </button>
              </>
            )}
          </div>

          {collapsed && (
            <button
              onClick={() => canCompare && setShowTable(true)}
              disabled={!canCompare}
              className="w-full px-3 pb-2 text-[11px] text-ink-light hover:text-deep-brown disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {canCompare ? '点此打开对照表' : '再收入一项即可对照'}
            </button>
          )}
        </div>
      </div>

      {tableOpen && (
        <CompareTable
          benches={compareBenches}
          onClose={() => setShowTable(false)}
          onRemove={removeCompare}
        />
      )}
    </>
  );
}

import { Scale, Check } from 'lucide-react';
import { useCompareStore } from '@/store/useCompareStore';
import { COMPARE_MAX_ITEMS } from '@/utils/compare';

interface CompareButtonProps {
  benchId: string;
  variant?: 'card' | 'detail';
}

export default function CompareButton({ benchId, variant = 'card' }: CompareButtonProps) {
  const compareIds = useCompareStore((state) => state.compareIds);
  const addCompare = useCompareStore((state) => state.addCompare);
  const removeCompare = useCompareStore((state) => state.removeCompare);
  const inCompare = compareIds.includes(benchId);
  const isFull = compareIds.length >= COMPARE_MAX_ITEMS;

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (inCompare) {
      removeCompare(benchId);
    } else {
      addCompare(benchId);
    }
  };

  if (variant === 'detail') {
    return (
      <button
        onClick={handleClick}
        disabled={!inCompare && isFull}
        title={!inCompare && isFull ? `对照台最多保留 ${COMPARE_MAX_ITEMS} 项` : undefined}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          inCompare
            ? 'text-moss-green bg-moss-green/10 hover:bg-moss-green/15'
            : 'text-ink-light hover:bg-deep-brown/5 hover:text-deep-brown'
        }`}
      >
        {inCompare ? <Check className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
        {inCompare ? '移出对照台' : '收入对照台'}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={!inCompare && isFull}
      title={!inCompare && isFull ? `对照台最多保留 ${COMPARE_MAX_ITEMS} 项` : undefined}
      className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        inCompare
          ? 'text-moss-green bg-moss-green/10 hover:bg-moss-green/15'
          : 'text-ink-light hover:bg-deep-brown/5 hover:text-deep-brown'
      }`}
    >
      {inCompare ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
      {inCompare ? '已收入' : '对照'}
    </button>
  );
}

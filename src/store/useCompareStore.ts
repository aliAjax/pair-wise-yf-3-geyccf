import { create } from 'zustand';
import { loadCompareIds, saveCompareIds } from '@/utils/storage';
import { COMPARE_MAX_ITEMS } from '@/utils/compare';

interface CompareState {
  compareIds: string[];
}

interface CompareActions {
  addCompare: (id: string) => boolean;
  removeCompare: (id: string) => void;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  isComparing: (id: string) => boolean;
  /** 长椅档案已不存在时，同步清理对照台 */
  pruneMissing: (existingIds: string[]) => void;
}

export const useCompareStore = create<CompareState & CompareActions>((set, get) => ({
  // 仅存浏览器本地；旧数据没有对应 key，打开时即为空数组
  compareIds: loadCompareIds(),

  addCompare: (id) => {
    const { compareIds } = get();
    if (compareIds.includes(id)) return true;
    if (compareIds.length >= COMPARE_MAX_ITEMS) return false;
    const next = [...compareIds, id];
    set({ compareIds: next });
    saveCompareIds(next);
    return true;
  },

  removeCompare: (id) => {
    const next = get().compareIds.filter((compareId) => compareId !== id);
    set({ compareIds: next });
    saveCompareIds(next);
  },

  toggleCompare: (id) => {
    if (get().compareIds.includes(id)) {
      get().removeCompare(id);
    } else {
      get().addCompare(id);
    }
  },

  clearCompare: () => {
    set({ compareIds: [] });
    saveCompareIds([]);
  },

  isComparing: (id) => get().compareIds.includes(id),

  pruneMissing: (existingIds) => {
    const next = get().compareIds.filter((id) => existingIds.includes(id));
    if (next.length !== get().compareIds.length) {
      set({ compareIds: next });
      saveCompareIds(next);
    }
  },
}));

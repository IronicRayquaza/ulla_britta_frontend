import { create } from 'zustand';
import { nanoid } from 'nanoid';

export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  stars: number;
  commits: number;
  language: string;
  x: number;
  z: number;
}

interface CityState {
  repos: Repository[];
  selectedRepo: string | null;
  addRepo: (repoData: Omit<Repository, 'id' | 'x' | 'z'>) => void;
  setRepos: (repos: Repository[]) => void;
  setSelectedRepo: (id: string | null) => void;
}

export const useCityStore = create<CityState>((set) => ({
  repos: [],
  selectedRepo: null,
  addRepo: (repoData) => set((state) => {
    const x = (Math.random() - 0.5) * 80;
    const z = (Math.random() - 0.5) * 80;
    return {
      repos: [...state.repos, { ...repoData, id: nanoid(), x, z }]
    };
  }),
  setRepos: (repos) => set({ repos }),
  setSelectedRepo: (id) => set({ selectedRepo: id }),
}));

import { create } from 'zustand';
import type { Team } from '../models/model';

type GameStore = {
  teams: Team[];
  activeTeam: Team | null;
  setTeams: (teams: Team[]) => void;
  setActiveTeam: (team: Team | null) => void;
};

export const useGameStore = create<GameStore>((set) => ({
  teams: [],
  activeTeam: null,
  setTeams: (teams) => set({ teams }),
  setActiveTeam: (activeTeam) => set({ activeTeam }),
}));

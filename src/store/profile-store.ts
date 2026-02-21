import { create } from 'zustand';

export interface Profile {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  bio: string;
  profilePhoto: string;
  stats?: {
    totalRecipes: number;
    cookedRecipes: number;
    successRate: number;
  };
}

interface ProfileStore {
  profile: Profile;
  setProfile: (profile: Profile) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: {
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
    profilePhoto: "",
    stats: {
      totalRecipes: 0,
      cookedRecipes: 0,
      successRate: 0,
    }
  },
  setProfile: (profile) => set({ profile }),
}));

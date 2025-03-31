// store/useHouseStore.ts
import { create } from 'zustand';

// Types
export interface UserRating {
    cleanliness: number;    // rp1
    behavior: number;       // rp2
    payment: number;        // rp3
    maintenance: number;    // rp4
    communication: number;  // rp5
}

export interface MaintainerRating {
    communication: number;  // mp1
    behavior: number;      // mp2
    maintenance: number;   // mp3
}

export interface HouseMember {
    id: string;
    name: string;
    type: 'tenant' | 'maintainer';
    username: string;
    email: string;
    phone: string;
    image_url: string | null;
    image_key: string | null;
    bio: string | null;
    ratings: UserRating | MaintainerRating;
    joined_at: string;
}

export interface House {
    id: string;
    name: string;
    address: string;
    members: HouseMember[];
    
}

interface HouseState {
    currentHouse: House | null;
    isLoading: boolean;
    error: string | null;
    
    // House Actions
    setCurrentHouse: (house: House | null) => void;
    updateHouse: (data: Partial<House>) => void;
    clearHouse: () => void;
    
    // Member Actions 
    addMember: (member: HouseMember) => void;
    removeMember: (memberId: string) => void;
    updateMember: (memberId: string, data: Partial<HouseMember>) => void;
    updateMemberRating: (memberId: string, ratings: Partial<UserRating | MaintainerRating>) => void;
    
    // Getters
    getMember: (memberId: string) => HouseMember | undefined;
    getTenants: () => HouseMember[];
    getMaintainers: () => HouseMember[];
    
    // Status Actions
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useHouseStore = create<HouseState>((set, get) => ({
    currentHouse: null,
    isLoading: false,
    error: null,

    // House Actions
    setCurrentHouse: (house) => set({ currentHouse: house, error: null }),
    
    updateHouse: (data) => set((state) => ({
        currentHouse: state.currentHouse 
            ? { ...state.currentHouse, ...data }
            : null
    })),
    
    clearHouse: () => set({ currentHouse: null, error: null }),

    // Member Actions
    addMember: (member) => set((state) => {
        if (!state.currentHouse) return state;
        return {
            currentHouse: {
                ...state.currentHouse,
                members: [...state.currentHouse.members, member]
            }
        };
    }),

    removeMember: (memberId) => set((state) => {
        if (!state.currentHouse) return state;
        return {
            currentHouse: {
                ...state.currentHouse,
                members: state.currentHouse.members.filter(m => m.id !== memberId)
            }
        };
    }),

    updateMember: (memberId, data) => set((state) => {
        if (!state.currentHouse) return state;
        return {
            currentHouse: {
                ...state.currentHouse,
                members: state.currentHouse.members.map(member =>
                    member.id === memberId 
                        ? { ...member, ...data }
                        : member
                )
            }
        };
    }),

    updateMemberRating: (memberId, ratings) => set((state) => {
        if (!state.currentHouse) return state;
        return {
            currentHouse: {
                ...state.currentHouse,
                members: state.currentHouse.members.map(member =>
                    member.id === memberId
                        ? {
                            ...member,
                            ratings: { ...member.ratings, ...ratings }
                        }
                        : member
                )
            }
        };
    }),

    // Getters
    getMember: (memberId) => {
        const state = get();
        return state.currentHouse?.members.find(m => m.id === memberId);
    },

    getTenants: () => {
        const state = get();
        return state.currentHouse?.members.filter(m => m.type === 'tenant') || [];
    },

    getMaintainers: () => {
        const state = get();
        return state.currentHouse?.members.filter(m => m.type === 'maintainer') || [];
    },

    // Status Actions
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error })
})
);
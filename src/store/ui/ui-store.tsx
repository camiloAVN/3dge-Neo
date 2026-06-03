import { create } from 'zustand'

interface State{
    isSideMenuOpen:boolean;
    openSideMenu:()=>void;
    closeSideMenu:()=>void;
    
    
    isCartOpen:boolean;
    openCart:()=>void;
    closeCart:()=>void;

}


export const useUIStore = create<State>()((set) => ({
    isSideMenuOpen: false,
    isCartOpen:false,

    openSideMenu:()=>set({isSideMenuOpen: true}),
    closeSideMenu:()=>set({isSideMenuOpen:false}),

    openCart:()=>set({isCartOpen: true}),
    closeCart:()=>set({isCartOpen:false})

}))

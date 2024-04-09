import {create} from 'zustand';

interface StoreState {
  baseStep: number;
  zoomLevel: number;
  setBaseStep: (baseStep: number) => void;
  setZoomLevel: (zoomLevel: number) => void;
}

const useStore = create<StoreState>(set => ({
  baseStep: 60,
  zoomLevel: 1,
  setBaseStep: (baseStep: number) => set({baseStep}),
  setZoomLevel: (zoomLevel: number) => set({zoomLevel}),
}));

export default useStore;

import {create} from 'zustand';

const useStore = create(set => ({
  bears: 0,
  zoomLevel: 1 as number,
  setZoomLevel: (zoomLevel: number) => set({zoomLevel}),
}));

export default useStore;

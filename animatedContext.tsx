import {ReactNode, createContext} from 'react';
import {
  SharedValue,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';
import useStore from './store';

export interface IAnimatedContextValue {
  zoomLevel: SharedValue<number>;
  subCellUpperDisplay: SharedValue<'flex' | 'none'>;
  subCellMidDisplay: SharedValue<'flex' | 'none'>;
  subCellLowerDisplay: SharedValue<'flex' | 'none'>;
  cellHeight: SharedValue<number>;
  subCellHeight: SharedValue<number>;
  CELL_HEIGHT: number;
}

const AnimatedContext = createContext({});

const getSubCellHeightFromZoomLevelAnimated = (zoomLevel: number) => {
  'worklet';
  if (zoomLevel === 3) return 15;
  return 60 / zoomLevel;
};
const getSubCellHeightFromZoomLevel = (zoomLevel: number) => {
  if (zoomLevel === 3) return 15;
  return 60 / zoomLevel;
};

function AnimatedProvider({children}: {children: ReactNode}) {
  // initial zoom values, from settings
  const ZoomLevelSettings = useStore(state => state.zoomLevel);
  const zoomLevel = useSharedValue(ZoomLevelSettings);
  const subCellHeight = useSharedValue(
    getSubCellHeightFromZoomLevel(ZoomLevelSettings),
  );

  // constant height of a cell container, it can contain 1 2 or 4 subCells
  const CELL_HEIGHT = 60;

  // height of a cell container, zoomLevel applied
  const cellHeight = useSharedValue(CELL_HEIGHT * zoomLevel.value);

  // initialize visibility of cell sub divisions
  const subCellUpperDisplay = useSharedValue(
    zoomLevel.value > 0 ? 'flex' : 'none',
  );
  const subCellMidDisplay = useSharedValue(
    zoomLevel.value > 1 ? 'flex' : 'none',
  );
  const subCellLowerDisplay = useSharedValue(
    zoomLevel.value > 2 ? 'flex' : 'none',
  );

  // sync baseStep with zoomLevelChanges
  useAnimatedReaction(
    () => zoomLevel.value,
    () => {
      subCellHeight.value = getSubCellHeightFromZoomLevelAnimated(
        zoomLevel.value,
      );
    },
  );

  return (
    <AnimatedContext.Provider
      value={
        {
          zoomLevel,
          subCellUpperDisplay,
          subCellMidDisplay,
          subCellLowerDisplay,
          cellHeight,
          subCellHeight,
          CELL_HEIGHT,
        } as IAnimatedContextValue
      }>
      {children}
    </AnimatedContext.Provider>
  );
}

export {AnimatedProvider, AnimatedContext};

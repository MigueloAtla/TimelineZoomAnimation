import React, {useContext} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {AnimatedContext, IAnimatedContextValue} from './animatedContext';
import {Text} from 'react-native';

export const HOURS_OF_DAY = Array.from({length: 24}, (_, hour) => ({
  string: `${hour.toString().padStart(2, '0')}:00`,
  number: hour,
}));

const Grid = () => {
  const {
    zoomLevel,
    cellHeight,
    subCellUpperDisplay,
    subCellMidDisplay,
    subCellLowerDisplay,
    CELL_HEIGHT,
  } = useContext(AnimatedContext) as IAnimatedContextValue;

  const rAnimatedCellStyles = useAnimatedStyle(() => {
    return {
      height: cellHeight.value,
    };
  });
  const rAnimatedSubCellUpperStyles = useAnimatedStyle(() => {
    return {
      display: subCellUpperDisplay.value,
    };
  });
  const rAnimatedSubCellMidStyles = useAnimatedStyle(() => {
    return {
      display: subCellMidDisplay.value,
    };
  });
  const rAnimatedSubCellLowerStyles = useAnimatedStyle(() => {
    return {
      display: subCellLowerDisplay.value,
    };
  });

  useAnimatedReaction(
    () => zoomLevel.value,
    () => {
      cellHeight.value = withTiming(CELL_HEIGHT * zoomLevel.value, {
        duration: 150,
      });
      if (zoomLevel.value === 1) {
        subCellUpperDisplay.value = 'flex';
        subCellMidDisplay.value = 'none';
        subCellLowerDisplay.value = 'none';
      } else if (zoomLevel.value === 2) {
        subCellUpperDisplay.value = 'flex';
        subCellMidDisplay.value = 'flex';
        subCellLowerDisplay.value = 'none';
      } else if (zoomLevel.value === 3) {
        subCellUpperDisplay.value = 'flex';
        subCellMidDisplay.value = 'flex';
        subCellLowerDisplay.value = 'flex';
      }
    },
  );

  return (
    <View>
      {HOURS_OF_DAY.map((hour, i) => {
        return (
          <Cell
            i={i}
            hour={hour.string}
            key={hour.string}
            rAnimatedCellStyles={rAnimatedCellStyles}
            rAnimatedSubCellUpperStyles={rAnimatedSubCellUpperStyles}
            rAnimatedSubCellMidStyles={rAnimatedSubCellMidStyles}
            rAnimatedSubCellLowerStyles={rAnimatedSubCellLowerStyles}
          />
        );
      })}
    </View>
  );
};

export default Grid;

const PressableAnimated = Animated.createAnimatedComponent(Pressable);

const Cell = ({
  i,
  hour,
  rAnimatedCellStyles,
  rAnimatedSubCellUpperStyles,
  rAnimatedSubCellMidStyles,
  rAnimatedSubCellLowerStyles,
}: {
  i: number;
  hour: string;
  rAnimatedCellStyles: any;
  rAnimatedSubCellUpperStyles: any;
  rAnimatedSubCellMidStyles: any;
  rAnimatedSubCellLowerStyles: any;
}) => {
  // console.log('cell renders');
  const {subCellHeight} = useContext(AnimatedContext) as IAnimatedContextValue;

  const onSubCellPress = (i: number, j: number) => {
    console.log('sub cell', i, j, subCellHeight.value);
  };

  return (
    <Animated.View
      style={[
        styles.cell,
        rAnimatedCellStyles,
        {
          backgroundColor: i % 2 === 0 ? '#12181F' : '#212632',
        },
      ]}>
      <Animated.View style={styles.timeContainer}>
        <Text>{hour}</Text>
      </Animated.View>
      <Animated.View style={styles.subCellsContainer}>
        <PressableAnimated
          style={[styles.subCell, rAnimatedSubCellUpperStyles]}
          onPress={() => onSubCellPress(i, 0)}
        />
        <PressableAnimated
          style={[styles.subCell, rAnimatedSubCellMidStyles]}
          onPress={() => onSubCellPress(i, 1)}
        />
        <PressableAnimated
          style={[styles.subCell, rAnimatedSubCellLowerStyles]}
          onPress={() => onSubCellPress(i, 2)}
        />
        <PressableAnimated
          style={[styles.subCell, rAnimatedSubCellLowerStyles]}
          onPress={() => onSubCellPress(i, 3)}
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cell: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    backgroundColor: 'transparent',
  },
  subCell: {
    borderBottomWidth: 1,
    borderColor: 'white',
    // opacity: 1,
    width: '100%',
    flex: 1,
  },
  subCellsContainer: {
    justifyContent: 'space-evenly',
    height: '100%',
    width: '100%',
  },
  cellPressable: {
    width: '100%',
    height: '100%',
  },
  timeContainer: {
    width: 50,
    height: '100%',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'white',
  },
});

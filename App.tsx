/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import useStore from './store';

const blocks = [
  {
    pos: 60,
    height: 60,
  },
  {
    pos: 180,
    height: 120,
  },
  {
    pos: 360,
    height: 60,
  },
];

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const zoomLevelAnimated = useSharedValue(1);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const cellSize = 60;

  const zoomLevel = useStore((state: any) => state.zoomLevel);
  const setZoomLevel = useStore((state: any) => state.setZoomLevel);

  const cellHeight = useSharedValue(cellSize * zoomLevelAnimated.value);
  const subCellUpperOpacity = useSharedValue(
    zoomLevelAnimated.value > 1 ? 1 : 0,
  );
  const subCellLowerOpacity = useSharedValue(
    zoomLevelAnimated.value > 1 ? 1 : 0,
  );
  // const subCellLowerHeight = useSharedValue(
  //   zoomLevelAnimated.value > 1 ? 1 : 0,
  // );

  const runSetZoomLevel = () =>
    setTimeout(() => setZoomLevel(zoomLevelAnimated.value), 0);

  useAnimatedReaction(
    () => zoomLevelAnimated.value,
    () => {
      cellHeight.value = withTiming(cellSize * zoomLevelAnimated.value, {
        duration: 150,
      });
      if (zoomLevelAnimated.value > 1) {
        // subCellOpacity.value = withDelay(150, withTiming(1, {duration: 100}));
        subCellUpperOpacity.value = 1;
        // subCellLowerHeight.value = 0
      } else subCellUpperOpacity.value = 0;
      if (zoomLevelAnimated.value > 2) {
        subCellLowerOpacity.value = 1;
      } else subCellLowerOpacity.value = 0;
      // runOnJS(runSetZoomLevel)();
    },
  );

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <Header zoomLevelAnimated={zoomLevelAnimated} />
        {/* Grid  */}
        <ScrollView>
          <View>
            {[
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23,
            ].map(i => {
              return (
                <Cell
                  key={i}
                  zoomLevelAnimated={zoomLevelAnimated}
                  cellHeight={cellHeight}
                  subCellUpperOpacity={subCellUpperOpacity}
                  subCellLowerOpacity={subCellLowerOpacity}
                />
              );
            })}
          </View>
          {blocks.map(({pos, height}, i) => {
            return (
              <Block
                key={i}
                pos={pos}
                height={height}
                zoomLevelAnimated={zoomLevelAnimated}
              />
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default App;

const Cell = ({
  cellHeight,
  subCellUpperOpacity,
  subCellLowerOpacity,
  zoomLevelAnimated,
}: {
  zoomLevelAnimated: SharedValue<number>;
  cellHeight: SharedValue<number>;
  subCellUpperOpacity: SharedValue<number>;
  subCellLowerOpacity: SharedValue<number>;
}) => {
  // console.log('cell renders');

  const zoomLevel = useStore((state: any) => state.zoomLevel);
  const rAnimatedCellStyles = useAnimatedStyle(() => {
    return {
      height: cellHeight.value,
    };
  });
  const rAnimatedSubCellUpperStyles = useAnimatedStyle(() => {
    return {
      opacity: subCellUpperOpacity.value,
      height:
        zoomLevelAnimated.value === 1
          ? '0%'
          : zoomLevelAnimated.value === 2
          ? '50%'
          : zoomLevelAnimated.value > 2 && '25%',
    };
  });
  const rAnimatedSubCellLowerStyles = useAnimatedStyle(() => {
    return {
      opacity: subCellLowerOpacity.value,
      height: zoomLevelAnimated.value < 3 ? 0 : '25%',
    };
  });

  return (
    <Animated.View style={[styles.cell, rAnimatedCellStyles]}>
      <Animated.View style={[styles.subCell, rAnimatedSubCellUpperStyles]} />
      <Animated.View style={[styles.subCell, rAnimatedSubCellUpperStyles]} />
      <Animated.View style={[styles.subCell, rAnimatedSubCellLowerStyles]} />
      <Animated.View style={[styles.subCell, rAnimatedSubCellLowerStyles]} />
    </Animated.View>
  );
};

const Block = ({
  pos,
  height,
  zoomLevelAnimated,
}: {
  pos: number;
  height: number;
  zoomLevelAnimated: SharedValue<number>;
}) => {
  const blockHeight = useSharedValue(height * zoomLevelAnimated.value);
  const blockPos = useSharedValue(pos * zoomLevelAnimated.value);

  useAnimatedReaction(
    () => zoomLevelAnimated.value,
    () => {
      blockHeight.value = withTiming(height * zoomLevelAnimated.value, {
        duration: 200,
      });
      blockPos.value = withTiming(pos * zoomLevelAnimated.value, {
        duration: 200,
      });
    },
  );

  const rBlockContainerStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateY: blockPos.value}],
      height: blockHeight.value,
    };
  });

  return (
    <Animated.View style={[styles.block, rBlockContainerStyles]}>
      <Text>Block</Text>
    </Animated.View>
  );
};

const Header = ({
  zoomLevelAnimated,
}: {
  zoomLevelAnimated: SharedValue<number>;
}) => {
  // const zoomLevel = useStore((state: any) => state.zoomLevel);
  // const setZoomLevel = useStore((state: any) => state.setZoomLevel);

  // const zoomIn = () => setZoomLevel(zoomLevel + 1);
  // const zoomOut = () => setZoomLevel(zoomLevel - 1);

  const zoomIn = () => {
    zoomLevelAnimated.value = zoomLevelAnimated.value + 1;
  };
  const zoomOut = () => {
    zoomLevelAnimated.value = zoomLevelAnimated.value - 1;
  };

  return (
    <View style={styles.header}>
      <Text>Header</Text>
      <View style={styles.zoomButtonsContainer}>
        <Pressable style={styles.zoomButton} onPress={zoomIn}>
          <Text>+</Text>
        </Pressable>
        <Pressable style={styles.zoomButton} onPress={zoomOut}>
          <Text>-</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cell: {
    height: 60,
    width: '100%',
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderColor: 'white',
    justifyContent: 'space-evenly',
  },
  subCell: {
    borderBottomWidth: 1,
    borderColor: 'white',
    // flex: 1,
  },
  block: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: 'violet',
    opacity: 0.6,
  },
  header: {
    height: 60,
    backgroundColor: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  zoomButtonsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  zoomButton: {
    height: 30,
    width: 30,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

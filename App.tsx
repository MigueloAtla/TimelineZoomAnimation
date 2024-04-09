import {GestureHandlerRootView} from 'react-native-gesture-handler';
import React, {useContext} from 'react';
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
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  AnimatedContext,
  AnimatedProvider,
  IAnimatedContextValue,
} from './animatedContext';
import Grid from './Grid';

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

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AnimatedProvider>
        <SafeAreaView style={backgroundStyle}>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
          />
          <Timeline />
        </SafeAreaView>
      </AnimatedProvider>
    </GestureHandlerRootView>
  );
}

export default App;

const Timeline = () => {
  return (
    <>
      <Header />
      <ScrollView>
        <Grid />
        {blocks.map(({pos, height}, i) => {
          return <Block key={i} pos={pos} height={height} />;
        })}
      </ScrollView>
    </>
  );
};

const Block = ({pos, height}: {pos: number; height: number}) => {
  const {zoomLevel} = useContext(AnimatedContext) as IAnimatedContextValue;

  const blockHeight = useSharedValue(height * zoomLevel.value);
  const blockPos = useSharedValue(pos * zoomLevel.value);

  useAnimatedReaction(
    () => zoomLevel.value,
    () => {
      blockHeight.value = withTiming(height * zoomLevel.value, {
        duration: 150,
      });
      blockPos.value = withTiming(pos * zoomLevel.value, {
        duration: 150,
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

const Header = () => {
  const {zoomLevel} = useContext(AnimatedContext) as IAnimatedContextValue;

  const zoomIn = () => {
    zoomLevel.value = zoomLevel.value + 1;
  };
  const zoomOut = () => {
    zoomLevel.value = zoomLevel.value - 1;
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
  block: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    left: 50,
    right: 10,
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

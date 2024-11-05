import React from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const Loader = () => (

  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size="large" />
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    marginTop: 270,
    flex: 1,
    justifyContent: 'center',
  },
});

export default Loader;

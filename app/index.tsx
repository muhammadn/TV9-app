import React from 'react';
import { AppState, BackHandler, StyleSheet } from 'react-native';
import { useScale } from '@/hooks/useScale';
import { ThemedView } from '@/components/ThemedView';
import Video, { VideoRef } from 'react-native-video';
import { useEffect, useState, useRef } from 'react';

export default function AlHijrah() {
  const scale = useScale();
  const styles = useFocusDemoScreenStyles();
  const videoRef = useRef<VideoRef>(null);
  const [data, setData] = useState([]);
  const [position, setPosition] = useState([]);

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    fetch("https://streaming.unrealasia.net/tvalhijrah")
      .then((resp) => resp.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        fetch("https://streaming.unrealasia.net/tvalhijrah")
          .then((resp) => resp.json())
          .then((json) => setData(json))
          .catch((error) => console.error(error)) 
        setPosition(99999999999) 
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });
  }, []);

  return (
    <ThemedView>
       <Video
         // Can be a URL or a local file.
         source={{uri: data.video}}
         // Store reference  
         ref={videoRef}
         style={styles.backgroundVideo}
         controls={true}
         onPlaybackStateChanged={() => setPosition(99999999999)}
         onPlaybackRateChange={() => setPosition(99999999999)}
         startPosition={position}
       />
    </ThemedView>
  )
}

const useFocusDemoScreenStyles = function () {
  const scale = useScale();
  return StyleSheet.create({
    backgroundVideo: {
      position: 'absolute',
      top: -1,
      left: 0,
      bottom: -540,
      right: 0,
    },
  });
};

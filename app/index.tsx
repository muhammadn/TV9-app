import React from 'react';
import { View, AppState, BackHandler, StyleSheet } from 'react-native';
import { useScale } from '@/hooks/useScale';
import { ThemedView } from '@/components/ThemedView';
import Video, { VideoRef } from 'react-native-video';
import Loader from '@/components/Loader';
import { useEffect, useState, useRef } from 'react';

export default function AlHijrah() {
  const scale = useScale();
  const styles = useFocusDemoScreenStyles();
  const videoRef = useRef<VideoRef>(null);
  const [data, setData] = useState([]);
  const [position, setPosition] = useState(99999999999);

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [isLoading, setLoading] = useState(true);

  const getLink = async() => {
    try {
      const response = await fetch("https://streaming.unrealasia.net/tvalhijrah?bust=true",
                           {cache: 'no-store'})
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      handleDelay(); // delay, update video time and close loading
      //setLoading(false);
    }
  };

  const updatePosition = () => {
    console.log("Updating frame position")
    setPosition(99999999999);
  };

  const delay = async (ms) => {
      return new Promise((resolve) => 
          setTimeout(resolve, ms));
  };

  const handleDelay = async () => {
      updatePosition();
      await delay(7000);
      setLoading(false);
  };

  useEffect(() => {
    getLink()
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        setLoading(true)
        getLink()
        console.log('App has come to the foreground!');
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });
  }, []);

  return (
    <ThemedView>
       {isLoading ? 
         <Loader /> :
         <Video
           // Can be a URL or a local file.
           source={{uri: data.video}}
           // Store reference  
           ref={videoRef}
           style={styles.backgroundVideo}
           controls={true}
           startPosition={position}
         />
       }
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

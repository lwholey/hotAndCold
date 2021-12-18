import React, { useState, useEffect } from 'react';
import { Platform, Text, Vibration, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { Audio } from 'expo-av';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [sound, setSound] = React.useState();

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android' && !Constants.isDevice) {
        setErrorMsg(
          'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
        );
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.watchPositionAsync({accuracy:Location.Accuracy.Highest, distanceInterval: 0, timeInterval: 1000 }, loc => setLocation(loc));
    })();
  }, []);

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
       require('./assets/xMarksTheSpot.m4a')
    );
    setSound(sound);

    await sound.playAsync(); }

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync(); }
      : undefined;
  }, [sound]);

  let desiredLat = 42.3424491;
  let desiredLon = -71.1334028;
  let text = 'Waiting..';
  let text2 = 'Waiting..';
  let distance = 0;
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
    distance = coordToDistance(location.coords.latitude,location.coords.longitude,desiredLat,desiredLon);
    if (checkForVibrate(distance) == 1)
    {
      playSound()
    }
    text2 = distance.toPrecision(6).toString()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
      <Text style={styles.paragraph}>Distance from desired location: {text2}</Text>
    </View>
  );
}

// from https://www.movable-type.co.uk/scripts/latlong.html
// lat and long have units of degrees
function coordToDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180; // φ, λ in radians
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  let d = R * c; // in metres
  return d
}

function checkForVibrate(distance) {
  let closeToTargetDist = 3
  if ( typeof checkForVibrate.dist == 'undefined' )
  {
    checkForVibrate.dist = 100000
    checkForVibrate.closeToTarget = 0
  }
  if (distance < checkForVibrate.dist && distance > 0 && checkForVibrate.closeToTarget == 0)
  {
    Vibration.vibrate(1000)
  }
  checkForVibrate.dist = distance
  if (distance < closeToTargetDist && distance > 0 && checkForVibrate.closeToTarget == 0)
  {
    // this will play the voice sound once and stop vibrations
    checkForVibrate.closeToTarget = 1
    return 1
  }
  else
  {
    return 0
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
});

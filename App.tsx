import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

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
    checkForVibrate(distance)
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
  console.log('testing1')
  let maxCnt = 5;
  if ( typeof checkForVibrate.ds == 'undefined' )
  {
    let maxDist = 100000
    checkForVibrate.ds = [maxDist, maxDist, maxDist, maxDist, maxDist];
    checkForVibrate.cnt = 0;
  }
  console.log('testing2')
  for (const i of checkForVibrate.ds) {
    console.log('testing3')
    if (i < maxCnt - 1)
    {
      checkForVibrate.ds[i] = checkForVibrate.ds[i + 1]
    }
    else
    {
      checkForVibrate.ds[i] = distance
    }
    console.log(i);
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

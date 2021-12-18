# hotAndCold
A find the treasure game using the Expo platform

Hardcode the treasure's latitude and longitude in App.tsx. 
See code   
  let desiredLat = 42.3424491;
  let desiredLon = -71.1334028;
  
The phone will vibrate when the user moves closer to the target from one second prior.
When the user is within 3m of the target, a voice message will play "Where x marks the spot, you will find a lot". 
After this, the phone will not vibrate or play the sound (unless the app is restarted)

TODO:
Allow user to enter latitude and longitude through the app.
Remove debugging text from screen

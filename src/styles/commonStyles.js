import {
    StyleSheet,
    Dimensions,
    Platform,
  } from 'react-native';
  
  export const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  export const headerHeight = 80;
  export const menuHeight = 60;
  export const viewHeight = screenHeight - headerHeight - menuHeight;
  
  /*   auth   */
  export const logo                   = require('../../public/images/logo.png');
  export const eye                    = require('../../public/images/eye.png');
  export const eye_slash              = require('../../public/images/eye_slash.png');
  export const good_bye               = require('../../public/images/good_bye.png');
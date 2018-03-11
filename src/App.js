import React, { Component } from 'react';
import {
    Platform,
    Text,
} from 'react-native';

import { Actions, ActionConst, Scene, Router } from 'react-native-router-flux';


import Signin from './scenes/signin'
import Register from './scenes/register'
import Signature from './scenes/signature'
import RecogFace from './scenes/recogFace'
import Print from './scenes/print'
import DetailView from './scenes/detailView'
import InPage from './scenes/inPage'
import OutPage from './scenes/outPage'

export default class App extends Component {
  constructor(props) {
      super(props);
    Text.defaultProps.allowFontScaling=false
  }

  render() {
      const scenes = Actions.create(
          <Scene key="root">
              <Scene key="Signin" component={Signin} hideNavBar initial={true} hideNavBar  />
              <Scene key="Register" component={Register} hideNavBar /> 
              <Scene key="RecogFace" component={RecogFace} hideNavBar type={ActionConst.RESET} />
              <Scene key="Signature" component={Signature} hideNavBar />
              <Scene key="Print" component={Print} hideNavBar />
              <Scene key="DetailView" component={DetailView} hideNavBar />
              <Scene key="InPage" component={InPage} hideNavBar />
              <Scene key="OutPage" component={OutPage} hideNavBar />
          </Scene>
      )

      return (
          <Router hideNavBar scenes={scenes} />
      );
  }
}
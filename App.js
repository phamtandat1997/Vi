/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {StyleSheet, ScrollView, View, Text, StatusBar} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/es/integration/react';
import {SafeAreaView} from 'react-navigation';

import DropDownAlert from './src/components/dropdownAlert';
import LanguagesProvider from './src/components/I18n';
import LoadingSpinner from './src/components/loadingSpinner';
import AppWithNavigation from './src/navigation/AppWithNavigation';
import NetworkProvider from './src/components/networkProvider';
import {Store, PersisStore} from './src/store';
// import Dialog from './src/components/dialog';
// import {Sentry} from 'react-native-sentry';

export default class App extends Component {
  constructor() {
    super();
  }

  // async componentDidMount() {
  //   setTimeout(() => SplashScreen.hide(), 1000);
  // }
  render() {
    return (
     
      <SafeAreaView style={styles.container}>
              <AppWithNavigation/>
            </SafeAreaView>
    );
  }
}
const styles = {
  container: {
    flex: 1,
  },
};

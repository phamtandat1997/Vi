import React from 'react';
import NavigationService from '../utils/NavigationService';
import RootNavigator from './RootNavigator';

const AppWithNavigation = () => {
  return (
    <RootNavigator
      ref={navigatorRef => NavigationService.setContainer(navigatorRef)}
    />
  );
};

export default AppWithNavigation;

import React from 'react';
import { createStackNavigator, createAppContainer } from "react-navigation";

import Profile from './src/screens/Profile';

const AppNavigator = createStackNavigator({
  Profile: {
    screen: Profile
  }
}, {
  headerMode: 'none'
});

export default createAppContainer(AppNavigator);
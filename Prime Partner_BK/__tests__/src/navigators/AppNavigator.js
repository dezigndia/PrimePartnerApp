import React from "react";
import {
  createStackNavigator,
  createBottomTabNavigator,
} from "react-navigation";
import {
  Home,
} from "../scenes";

export const AppNavigator = createStackNavigator(
  {
    Home: { screen: Home },
  },
  {
    headerMode: 'screen',
  })

const prevGetStateForActionHomeStack = AppNavigator.router.getStateForAction;
AppNavigator.router.getStateForAction = (action, state) => {
    if (state && action.type === 'ReplaceCurrentScreen') {
      const routes = state.routes.slice(0, state.routes.length - 1);
      routes.push(action);
      return {
        ...state,
        routes,
        index: routes.length - 1,
      };
    }
    return prevGetStateForActionHomeStack(action, state);
};

export default AppNavigator;

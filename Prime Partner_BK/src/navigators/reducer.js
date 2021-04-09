import { NavigationActions } from 'react-navigation';
import { AppNavigator } from './Navigators';

const Navigator= AppNavigator.router.getActionForPathAndParams('Splash')

const initialNavState = AppNavigator.router.getStateForAction(Navigator);
export const reducer = (state = initialNavState, action) => {

  let nextState;
  switch (action.type) {
    case NavigationActions.BACK: {
      nextState = AppNavigator.router.getStateForAction(action, state);
      if (nextState.isTransitioning) {

      }
      break;
    }
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  return nextState || state;
};

import { NavigationActions } from 'react-navigation';
import RootNavigator from '../../navigation/RootNavigator';

const initialSate = RootNavigator ? RootNavigator.router.getStateForAction(
    NavigationActions.init()) : null;

const nav = (state = initialSate) => {
  const nextState = RootNavigator ? RootNavigator.router.getStateForAction(
      NavigationActions.init()) : null;
  return nextState || state;

};

export default nav;
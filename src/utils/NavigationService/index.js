import {
  NavigationActions,
  StackActions,
} from 'react-navigation';

import Routes from './Routes';

let _container;

function setContainer(container: Object) {
  _container = container;
}

function reset(routeName: string, params) {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: routeName, params })],
  });
  _container.dispatch(resetAction);
}

function navigate(routeName: string, params) {
  _container.dispatch(
      NavigationActions.navigate({
        routeName,
        params,
      }),
  );
}

function navigateDeep(actions) {
  _container.dispatch(
      actions.reduceRight(
          (prevAction, action): any =>
              NavigationActions.navigate({
                routeName: action.routeName,
                params: action.params,
                action: prevAction,
              }),
          undefined,
      ),
  );
}

function goBack() {
  const backAction = NavigationActions.back();
  _container.dispatch(backAction);
}

function getCurrentRoute() {
  if (!_container || !_container.state.nav) {
    return null;
  }

  return _container.state.nav.routes[_container.state.nav.index] || null;
}

export default {
  setContainer,
  navigateDeep,
  navigate,
  reset,
  goBack,
  getCurrentRoute,
  onNavigationStateChange: Routes.onNavigationStateChange,
  addListener: Routes.addListener,
  removeListener: Routes.removeListener,

};

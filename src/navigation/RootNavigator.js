import React from 'react';
import {
  createStackNavigator,
  createDrawerNavigator,
  createAppContainer,
} from 'react-navigation';

import SideBar from '../components/sidebar/SideBar';
import LoginScene from '../scenes/auth/Login';
import HomeScene from '../scenes/home';
import WelcomeScene from '../scenes/welcome';
import CreateOrUpdateNoteScene from '../scenes/information/CreateOrUpdateNote';
import CustomerSaleScene from '../scenes/customer/CustomerSale';
import CustomerReturnScene from '../scenes/customer/CustomerReturn';
import KitchenSaleScene from '../scenes/kitchen/KitchenSale';
import KitchenReturnScene from '../scenes/kitchen/KitchenReturn';
import PackagingSaleScene from '../scenes/packaging/PackagingSale';
import PackagingReturnScene from '../scenes/packaging/PackagingReturn';
import CreateTransitionInputScene
  from '../scenes/transition/CreateTransitionInput';
import TransitionDetailScene
  from '../scenes/transition/TransitionDetail';
import ReceivedTransitionScene
  from '../scenes/transition/ReceivedTransition';
import SendTransitionScene
  from '../scenes/transition/SendTransition';
import ReportScene from '../scenes/report';
import ConfigScene from '../scenes/setting/Config';
import SelectSupermarketScene from '../scenes/setting/SelectSuperMarket';
import PermissionScene from '../scenes/permission';
import InventoriesScene from '../scenes/information/Inventories';
import InputInfoScene from '../scenes/information/InputInfo';
import ReturnInfoScene from '../scenes/information/ReturnInfo';
import CreateInventoryScene from '../scenes/information/CreateInventory';

const WelcomeStack = createStackNavigator({
  Welcome: {
    screen: WelcomeScene,
  },
}, {
  headerMode: 'none',
});

const AuthStack = createStackNavigator({
  Login: {
    screen: LoginScene,
  },
}, {
  headerMode: 'screen',
});

const HomeStack = createStackNavigator({
  Home: {
    screen: HomeScene,
  },
}, {
  headerMode: 'screen',
});

const InputInfoStack = createStackNavigator({
  InputInfo: {
    screen: InputInfoScene,
  },
  CreateOrUpdateNote: {
    screen: CreateOrUpdateNoteScene,
  },
});

const ReturnInfoStack = createStackNavigator({
  ReturnInfo: {
    screen: ReturnInfoScene,
  },
  CreateOrUpdateNote: {
    screen: CreateOrUpdateNoteScene,
  },
});

const InventoryStack = createStackNavigator({
  Inventories: {
    screen: InventoriesScene,
  },
  CreateInventory: {
    screen: CreateInventoryScene,
  },
});

const CustomerSaleStack = createStackNavigator({
  CustomerSale: {
    screen: CustomerSaleScene,
  },
}, {
  headerMode: 'screen',
});

const CustomerReturnStack = createStackNavigator({
  CustomerReturn: {
    screen: CustomerReturnScene,
  },
}, {
  headerMode: 'screen',
});

const PackageSaleStack = createStackNavigator({
  PackageSale: {
    screen: PackagingSaleScene,
  },
}, {
  headerMode: 'screen',
});

const PackageReturnStack = createStackNavigator({
  PackageReturn: {
    screen: PackagingReturnScene,
  },
}, {
  headerMode: 'screen',
});

const KitchenSaleStack = createStackNavigator({
  KitchenSale: {
    screen: KitchenSaleScene,
  },
}, {
  headerMode: 'screen',
});

const KitchenReturnStack = createStackNavigator({
  KitchenReturn: {
    screen: KitchenReturnScene,
  },
}, {
  headerMode: 'screen',
});

const SendTransitionStack = createStackNavigator({
  SendTransition: {
    screen: SendTransitionScene,
  },
  TransitionDetail: {
    screen: TransitionDetailScene,
  },
  CreateTransitionInput: {
    screen: CreateTransitionInputScene,
  },
}, {
  headerMode: 'screen',
});

const ReceivedTransitionStack = createStackNavigator({
  ReceivedTransition: {
    screen: ReceivedTransitionScene,
  },
  TransitionDetail: {
    screen: TransitionDetailScene,
  },
}, {
  headerMode: 'screen',
});

const ReportStack = createStackNavigator({
  ReportToday: {
    screen: ReportScene,
  },
}, {
  headerMode: 'screen',
});

const ConfigStack = createStackNavigator({
  Config: {
    screen: ConfigScene,
  },
}, {
  headerMode: 'screen',
});

const SelectSupermarketStack = createStackNavigator({
  SelectSuperMarket: {
    screen: SelectSupermarketScene,
  },
}, {
  headerMode: 'screen',
});

const PermissionStack = createStackNavigator({
  Permission: {
    screen: PermissionScene,
  },
}, {
  headerMode: 'screen',
});

const RootNavigator = createDrawerNavigator({
  Welcome: {
    screen: WelcomeStack,
  },
  Auth: {
    screen: AuthStack,
  },
  Home: {
    screen: HomeStack,
  },
  InputInfo: {
    screen: InputInfoStack,
  },
  ReturnInfo: {
    screen: ReturnInfoStack,
  },
  Inventories: {
    screen: InventoryStack,
  },
  CustomerSale: {
    screen: CustomerSaleStack,
  },
  CustomerReturn: {
    screen: CustomerReturnStack,
  },
  PackageSale: {
    screen: PackageSaleStack,
  },
  PackageReturn: {
    screen: PackageReturnStack,
  },
  KitchenSale: {
    screen: KitchenSaleStack,
  },
  KitchenReturn: {
    screen: KitchenReturnStack,
  },
  ReceivedTransition: {
    screen: ReceivedTransitionStack,
  },
  SendTransition: {
    screen: SendTransitionStack,
  },
  Report: {
    screen: ReportStack,
  },
  Config: {
    screen: ConfigStack,
  },
  SelectSupermarket: {
    screen: SelectSupermarketStack,
  },
  Permission: {
    screen: PermissionStack,
  },
}, {
  headerMode: 'none',
  gesturesEnabled: false,
  contentComponent: props => <SideBar navigation={props.navigation}/>,
  drawerLockMode: 'locked-closed',
});

export default createAppContainer(RootNavigator);

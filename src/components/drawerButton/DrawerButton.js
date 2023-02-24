import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DrawerActions } from 'react-navigation';

import Colors from '../../constants/Colors';

const DrawerButton = (navigation) => (
    <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
      <Icon style={{ marginLeft: 10 }} size={30}
            color={Colors.primaryConstraint} name="menu"/>
    </TouchableOpacity>
);

export default DrawerButton;
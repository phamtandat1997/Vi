import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

import PermissionService, { PERMISSION } from '../../utils/PermissionService';
import MyText from '../../components/myText/MyText';
import Colors from '../../constants/Colors';
import Images from '../../constants/Images';
import BackHandlerProvider, { TYPE_NAVIGATION } from '../../components/backProvide';
import { Translate } from '../../components/I18n';

export default class PermissionScene extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
  }

  allowPermission = async () => {
    const permissionStorage = await PermissionService.request('storage');
    if (permissionStorage !== PERMISSION.authorized) {
      // TODO deny
    } else {
      this.props.navigation.navigate('Home');
    }
  };

  render() {
    const { container, title, description, button, wrapper, text } = styles;

    return (
      <BackHandlerProvider type={TYPE_NAVIGATION.ROOT}>
        <View style={container}>
          <View style={wrapper}>
            <MyText style={title}>{Translate('GRANT_ACCESS')}</MyText>
            <MyText style={description}>
              {Translate('GRANT_DESCRIPTION')}
            </MyText>
            <Image
              style={{ width: 200, height: 200 }}
              source={Images.PERMISSION}
            />
          </View>
          <TouchableOpacity style={button} onPress={this.allowPermission}>
            <MyText style={text}>{Translate('ALLOW')}</MyText>
          </TouchableOpacity>
        </View>
      </BackHandlerProvider>
    );

  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginHorizontal: 20,
    marginVertical: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.buttonPrimary,
    width: '100%',
    paddingVertical: 15,
  },
  text: {
    textAlign: 'center',
    color: Colors.primaryConstraint,
    fontSize: 16,
    fontWeight: '500',
  },
};




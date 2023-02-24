import React from 'react';
import {
  View,
  Image,
} from 'react-native';
import Images from '../../constants/Images';
import MyText from '../myText/MyText';
import { Translate } from '../I18n';

export default class ErrorView extends React.PureComponent {
  constructor() {
    super();
  }

  render() {
    const message = this.props.message || Translate('ERROR_COMMON_MESSAGE');
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Image
          resizeMode={'contain'}
          style={{ width: 100, height: 100 }}
          source={Images.ERROR}
        />
        <MyText style={{ fontSize: 28 }}>Opps!</MyText>
        <MyText style={{ fontSize: 16 }}>{message}</MyText>
      </View>
    );
  }
}
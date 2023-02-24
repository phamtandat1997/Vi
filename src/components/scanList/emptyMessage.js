import React from 'react';
import { View } from 'react-native';

import MyText from '../myText/MyText';
import { Translate } from '../I18n';

export default class EmptyMessage extends React.PureComponent {

  constructor() {
    super();
  }

  render() {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
      }}>
        <MyText style={{
          color: '#909090',
          fontSize: 20,
          padding: 10,
          textAlign: 'center',
        }}>
          {Translate('PLEASE_SCAN')}
        </MyText>
      </View>
    );
  };
}


import React from 'react';
import {
  View,
} from 'react-native';
import MyText from '../myText/MyText';
import Colors from '../../constants/Colors';

export default NoDataView = (props) => (<View style={{
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: Colors.primaryConstraint,
}}
><MyText style={{ color: '#cccccc' }}>{props.children}</MyText></View>);
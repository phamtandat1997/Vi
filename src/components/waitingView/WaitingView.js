import React from 'react';
import {
  ActivityIndicator,
  View,
} from 'react-native';
import Colors from '../../constants/Colors';
import MyText from '../myText/MyText';

export default WaitingView = (props) => (
  <View style={[styles.container, props.containerStyle]}>
    <ActivityIndicator
      color={Colors.primary}
      size={30}
    />
    <MyText style={styles.textStyle}>{'Đang tải'}...</MyText>
  </View>);

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primaryConstraint,
  },
  textStyle: {
    fontSize: 16,
    marginTop: 10,
    color: Colors.blackPrimary,
  },
};
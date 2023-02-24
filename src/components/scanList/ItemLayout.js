import React from 'react';
import { View } from 'react-native';

import MyText from '../myText/MyText';
import Colors from '../../constants/Colors';
import Strings from "../I18n/Strings";
import I18n from "react-native-i18n";

export default class ItemLayout extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  // onPress = () => {
  //   this.props.onPress && this.props.onPress();
  // };

  render() {
    return (
      <View style={this.props.isHeader ? styles.headerStyle : styles.rowStyle}>
        {/*<MyText numberOfLines={1}*/}
                {/*style={[this.props.isHeader ? styles.textHeaderStyle : styles.textStyle, { width: 160 }]}>{this.props.col1 || I18n.t(Strings.SCAN_TIME)}</MyText>*/}
        <MyText numberOfLines={1}
                style={[this.props.isHeader ? styles.textHeaderStyle : {...styles.textStyle, fontSize: 24}, { width: 185 }]}>
          {this.props.col2 || I18n.t(Strings.BARCODE)}</MyText>
        <MyText numberOfLines={1}
                style={[this.props.isHeader ? styles.textHeaderStyle : styles.textStyle, { flexGrow: 1 }]}>
          {this.props.col3 || I18n.t(Strings.PRODUCT)}</MyText>
        <MyText numberOfLines={1}
                style={[this.props.isHeader ? styles.textHeaderStyle : styles.textStyle, { width: 165 }]}>
          {this.props.col4 || I18n.t(Strings.WEIGHT)}</MyText>
        <View style={{width: 110}}>
          {
            this.props.col5 || <MyText numberOfLines={1} style={this.props.isHeader ? styles.textHeaderStyle : styles.textStyle}>
              {I18n.t(Strings.STATUS)}</MyText>
          }
        </View>
      </View>
    );
  }
}

const styles = {
  headerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    marginTop: 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyBorder
  },
  textHeaderStyle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  rowStyle: {
    flex: 1,
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'center'
  },
  textStyle: {
    fontSize: 30,
    color: Colors.textSecondary
  },
};
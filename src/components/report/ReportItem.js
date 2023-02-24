import React from 'react';
import moment from 'moment';
import I18n from 'react-native-i18n';
import Strings from '../I18n/Strings';
import MyText from '../myText/MyText';
import ReportItemLayout from './ReportItemLayout';

const STATUS = {
  0: Strings.SELL,
  1: Strings.RETURN,
  2: Strings.KITCHEN_SELL,
  3: Strings.KITCHEN_RETURN,
  4: Strings.PACKAGING_SELL,
  5: Strings.PACKAGING_RETURN,
  6: Strings.SHIPPING,
  7: Strings.RECEIVED,
};

export default class ReportItem extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  onPress = () => {
    this.props.onPress && this.props.onPress();
  };

  render() {
    const { productName, weight, datePurchase, statusId } = this.props.item;

    return (
      <ReportItemLayout
        col1={<MyText>{moment(datePurchase).format('HH:mm:ss')}</MyText>}
        col2={<MyText>{productName}</MyText>}
        col3={<MyText>{I18n.t(STATUS[statusId])}</MyText>}
        col4={<MyText>{weight} kg</MyText>}
      />
    );
  }
}
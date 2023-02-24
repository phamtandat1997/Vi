import React from 'react';
import moment from 'moment';
import { Icon } from 'react-native-elements';
import I18n from 'react-native-i18n';
import Strings from '../I18n/Strings';
import MyText from '../myText/MyText';
import Colors from '../../constants/Colors';
import ProcessStatus, { STATUS } from '../processStatus';
import MyButton from '../myButton';
import TransitionItemLayout from './TransitionItemLayout';

export default class TransitionItem extends React.Component {

  constructor(props) {
    super(props);

  }

  shouldComponentUpdate(nextProps) {
    return this.props.item !== nextProps.item;
  }

  onPress = () => {
    this.props.onPress && this.props.onPress();
  };

  onAccept = () => {
    this.props.onAccept && this.props.onAccept();
  };

  renderRight() {
    const { isInput, isDetail, item } = this.props;

    if (!isDetail) {
      return <ProcessStatus status={item.status}/>;
    }
    else {
      if (isInput) {
        if (item.status === STATUS.Shipping.text) {
          return (
            <MyButton
              onPress={this.onAccept}
              textStyle={{ fontSize: 16, marginLeft: 5 }}
              leftIcon={<Icon
                size={18}
                name={'check'}
                color={Colors.primaryConstraint}/>
              }
              title={I18n.t(Strings.CONFIRM)}
              containerStyle={{
                backgroundColor: Colors.unfilledSuccess,
              }}
            />
          );
        }
        return <ProcessStatus status={item.status}/>;
      }
      return <ProcessStatus status={item.status}/>;
    }
  }

  render() {
    const { isInput, item } = this.props;
    const { receiveSuperMarket, sendSuperMarket, receivedAt, sendAt } = item;
    const title = isInput ? sendSuperMarket : receiveSuperMarket;

    return (
      <TransitionItemLayout
        {...this.props}
        col1={<MyText>{title}</MyText>}
        col2={<MyText>{moment(sendAt).format('DD/MM/YY')}</MyText>}
        col3={<MyText>{receivedAt === null ?
          '' : moment(receivedAt).format('DD/MM/YY')}</MyText>}
        col4={this.renderRight()}
      />
    );
  }
}
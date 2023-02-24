import React from 'react';
import I18n from 'react-native-i18n';

import Strings from '../../components/I18n/Strings';
import SelectModalWidget from '../giftedForm/SelectModalWidget';
import OptionWidget from '../giftedForm/OptionWidget';

export default class MarketSelector extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: props.value || null,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.data.length !== nextProps.data.length ||
      this.state.value !== nextState.value;
  }

  onSelect = (marketId) => {
    if (this.state.value !== marketId) {
      this.setState({ value: marketId });
      this.props.onSelect && this.props.onSelect(marketId);
    }
  };

  onPress() {
    this.selectModalWidget.onPress();
  };

  render() {
    const { data } = this.props;

    return (
      <SelectModalWidget
        ref={ref => this.selectModalWidget = ref}
        {...this.props}
        value={this.state.value}
        data={data}
        placeholder={I18n.t(Strings.SELECT_SUPER_MARKET)}
        onSelect={(value) => this.onSelect(value)}
        rightIcon={true}>
        {
          data.map(item =>
            <OptionWidget
              key={item.id}
              title={item.name}
              value={item.id}
            />,
          )
        }
      </SelectModalWidget>
    );
  }
}
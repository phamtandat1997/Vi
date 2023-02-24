import React from "react";
import Spinner from 'react-native-loading-spinner-overlay';

// Public API for login modal
const api = {};
export const LoadingSpinnerApi = api;

export default class LoadingSpinner extends React.Component {
  constructor(props) {
    super(props);

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.toggle = this.toggle.bind(this);

    this.state = {
      visible: false
    };
  }

  show() {
    this.setState({visible: true});
  }

  hide() {
    this.setState({visible: false});
  }

  toggle() {
    this.setState({visible: !this.state.visible});
  }

  render() {
    const {visible} = this.state;
    return <Spinner visible={visible}/>;
  }
}
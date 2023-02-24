import React from 'react';
import DropdownAlert from './DropdownAlert';
import { Translate } from '../I18n';

class DropDownClass {
  showSystemAlert: (type, title, message, options) => void;
  showErrorAlert: (message, title) => void;
  showSuccessAlert: (message: string, title: string) => void;
  showInfoAlert: (message: string, title: string) => void;
}

// Public API
const api = {};
export const DropDown: DropDownClass = api;

export default class DropDownAlert extends React.Component {

  componentDidMount() {
    api.showAlert = this.showAlert;
    api.showSystemAlert = this.showSystemAlert;
    api.showErrorAlert = this.showErrorAlert;
    api.showSuccessAlert = this.showSuccessAlert;
    api.showInfoAlert = this.showInfoAlert;
  }

  showAlert = (type, title, message, options) => {
    options = options || {};
    this.dropdown.alertWithType(type, title, message);
  };

  showSystemAlert = (title, message, options) => {
    this.showAlert('custom', title, message, options);
  };


  showErrorAlert = (message, title = Translate('ERROR')) => {
    this.showAlert('error', title, message);
  };

  showSuccessAlert = (message, title = Translate('SUCCESS')) => {
    this.showAlert('success', title, message);
  };

  showInfoAlert = (message, title = Translate('INFO')) => {
    this.showAlert('info', title, message);
  };

  render() {
    return <DropdownAlert ref={ref => this.dropdown = ref}/>;
  }
}
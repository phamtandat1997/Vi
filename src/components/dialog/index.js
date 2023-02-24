import React from 'react';
import DialogComponent from './Dialog';

class DialogClass {
  show: (options, callback) => void;
  dismiss: (callback) => void;
  alert: (content, title, onCloseCallback, overlap, options) => void;
  alertError: (content, title, onCloseCallback, overlap, options) => void;
  alertSuccess: (content, title, onCloseCallback, overlap, options) => void;
  alertWarning: (content, title, onCloseCallback, overlap, options) => void;
  alertInfo: (content, title, onCloseCallback, overlap, options) => void;
  confirm: (message, callback, title, overlap, options) => void;
  confirmCustomActions: (message, actions, title, overlap, options) => void;
}

// Public API
const api = {};
export const Dialog: DialogClass = api;

export default class DialogComp extends React.Component {
  componentDidMount() {
    api.show = this.dialog.show;
    api.alert = this.dialog.alert;
    api.alertError = this.dialog.alertError;
    api.alertSuccess = this.dialog.alertSuccess;
    api.alertWarning = this.dialog.alertWarning;
    api.alertInfo = this.dialog.alertInfo;
    api.confirm = this.dialog.confirm;
    api.confirmCustomActions = this.dialog.confirmCustomActions;
    api.dismiss = this.dialog.dismiss;
  }

  render() {
    return <DialogComponent ref={ref => this.dialog = ref}/>;
  }
}

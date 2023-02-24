import { Store } from '../store';
import fromReport from '../store/report';
import HttpService from '../utils/HttpService';

export default class ReportFactory {

  static getReport(data) {
    Store.dispatch(fromReport.actions.getReport(data));
  }

  static getNewReport(data) {
    Store.dispatch(fromReport.actions.getNewReport(data));
  }

  static getOldReport(data) {
    Store.dispatch(fromReport.actions.getOldReport(data));
  }

  static async fetchReport(data) {
    return await HttpService.get('/purchases', data);
  }
}
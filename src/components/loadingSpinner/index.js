import React from 'react';
import LoadingSpinnerComponent from './LoadingSpinner';

// Public API
const api = {};
export const LoadingSpinner = api;

export default class LoadingSpinnerComp extends React.Component {
    componentDidMount() {
        api.show = this.loadingSpinner.show;
        api.hide = this.loadingSpinner.hide;
        api.toggle = this.loadingSpinner.toggle;
    }

    render() {
        return <LoadingSpinnerComponent ref={ref => this.loadingSpinner = ref} />;
    }
}
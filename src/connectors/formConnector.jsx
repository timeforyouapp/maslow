import React from 'react';
import PropTypes from 'prop-types';

import { checkFetchState } from './utils';

export const formConnectDecorator = (connect, customMapStateToProps, customMapDispatchToProps) => namespace => (Component) => {
  const stateName = namespace.toLowerCase();

  const mapStateToProps = (state) => ({
    fetchState: state[stateName].fetchState,
    errors: state[stateName].errors,
    detailData: state[stateName].detail.extractValues ? state[stateName].detail.extractValues() : null,
    ...(customMapStateToProps ? customMapStateToProps(state) : {})
  });

  const mapDispatchToProps = (dispatch) => ({
    save: dispatch.action('save', namespace),
    getDetail: dispatch.action('getDetail', namespace),
    setErrors: dispatch.action('setErrors', namespace),
    clearFieldError: dispatch.action('clearFieldError', namespace),
    clearAllErrors: dispatch.action('clearAllErrors', namespace),
    setFetchState: dispatch.action('setFetchState', namespace),
    validate: dispatch.validate(namespace),
    ...(customMapDispatchToProps ? customMapDispatchToProps(dispatch) : {})
  });

  const ComponentWrap = ({
    getDetail,
    identifier,
    fetchState,
    detailData,
    setFetchState,
    setInitialValues,
    clearFetchStateAfterSuccess,
    fetchStateSuccessProp,
    fetchStateSuccessValue,
    ...props
  }) => {
    if (
      !checkFetchState(fetchState, [ 'valuesOnForm', 'detailFetched', 'fetching' ])
      && identifier
    ) {
      setTimeout(() => {
        getDetail(identifier);
      }, 100);
    }

    if (!!detailData && fetchState === 'detailFetched' && setInitialValues) {
      setTimeout(() => {
        setFetchState('valuesOnForm');
        setInitialValues(detailData);
      }, 200);
    }

    if (
      (fetchStateSuccessProp && fetchStateSuccessProp == fetchStateSuccessValue) ||
      fetchState === 'saveFetched'
    ) {
      setTimeout(() => {
        if (clearFetchStateAfterSuccess) {
          props.clearAllErrors()
        }

        if (props.afterFetchSuccess) {
          props.afterFetchSuccess(props.values)
        }
      }, 100);
    }

    return (<Component {...{ getDetail, fetchState, ...props }} />);
  };

  ComponentWrap.propTypes = {
    identifier: PropTypes.any,
    errors: PropTypes.object,
    getDetail: PropTypes.func.isRequired,
    fetchState: PropTypes.string.isRequired,
  }

  ComponentWrap.defaultProps = {
    identifier: null,
    errors: {},
  }

  return connect(mapStateToProps, mapDispatchToProps)(ComponentWrap);
};

export default formConnectDecorator;

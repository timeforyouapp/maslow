import React from 'react';
import PropTypes from 'prop-types';

export const formConnectDecorator = (connect, customMapStateToProps, customMapDispatchToProps) => namespace => (Component) => {
  const stateName = namespace.toLowerCase();

  const mapStateToProps = (state, { initialValues }) => ({
    fetchState: state[stateName].fetchState,
    errors: state[stateName].errors,
    values: {
      ...initialValues,
      ...(state[stateName].detail.extractValues ? state[stateName].detail.extractValues() : {}),
    },
    ...(customMapStateToProps ? customMapStateToProps(state) : {})
  });

  const mapDispatchToProps = (dispatch) => ({
    save: dispatch.action('save', namespace),
    getDetail: dispatch.action('getDetail', namespace),
    setErrors: dispatch.action('setErrors', namespace),
    clearFieldError: dispatch.action('clearFieldError', namespace),
    clearAllErrors: dispatch.action('clearAllErrors', namespace),
    validate: dispatch.validate(namespace),
    ...(customMapDispatchToProps ? customMapDispatchToProps(dispatch) : {})
  });

  const ComponentWrap = ({
    getDetail,
    identifier,
    fetchState,
    clearFetchStateAfterSuccess,
    fetchStateSuccessProp,
    fetchStateSuccessValue,
    ...props}) => {
    if (fetchState !== 'fresh' && identifier) {
      getDetail(identifier);
    }

    if (
      (
        (fetchStateSuccessProp && fetchStateSuccessProp == fetchStateSuccessValue) ||
        fetchState === 'saveFetched'
      )
      && props.afterFetchSuccess
    ) {
      setTimeout(() => {
        if (clearFetchStateAfterSuccess) {
          props.clearAllErrors()
        }

        props.afterFetchSuccess(props.values)
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

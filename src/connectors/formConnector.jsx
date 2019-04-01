import React from 'react';
import PropTypes from 'prop-types';

export const formConnectDecorator = connect => namespace => (Component) => {
  const stateName = namespace.toLowerCase();

  const mapStateToProps = (state, { initialValues }) => ({
    fetchState: state[stateName].fetchState,
    errors: state[stateName].errors,
    initialValues: {
      ...initialValues,
      ...(state[stateName].detail.extractValues ? state[stateName].detail.extractValues() : {}),
    },
  });

  const mapDispatchToProps = dispatch => ({
    save: dispatch.action('save', namespace),
    getDetail: dispatch.action('getDetail', namespace),
    clearFieldError: dispatch.action('clearFieldError', namespace),
    clearAllErrors: dispatch.action('clearAllErrors', namespace),
  });

  const ComponentWrap = ({ getDetail, identifier, fetchState, ...props}) => {
    if (fetchState !== 'fresh' && identifier) {
      getDetail(identifier);
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

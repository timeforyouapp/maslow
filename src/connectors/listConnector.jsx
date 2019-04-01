import React from 'react';
import PropTypes from 'prop-types';

export const listConnectorDecorator = connect => namespace => (Component) => {
  const stateName = namespace.toLowerCase();

  const mapStateToProps = (state) => ({
    fetchState: state[stateName].fetchState,
    errors: state[stateName].errors.non_field_error,
    items: state[stateName].list,
  });

  const mapDispatchToProps = dispatch => ({
    getList: dispatch.action('getList', namespace),
    getDetail: dispatch.action('getDetail', namespace),
    clearAllErrors: dispatch.action('clearAllErrors', namespace),
  });

  const ComponentWrap = ({ getDetail, fetchState, ...props}) => {
    if (fetchState !== 'fresh') {
      getList();
    }

    return (<Component {...{ getDetail, fetchState, ...props }} />);
  };

  ComponentWrap.propTypes = {
    errors: PropTypes.object,
    getDetail: PropTypes.func.isRequired,
    getList: PropTypes.func.isRequired,
    clearAllErrors: PropTypes.func.isRequired,
    fetchState: PropTypes.string.isRequired,
  }

  ComponentWrap.defaultProps = {
    errors: {},
  }

  return connect(mapStateToProps, mapDispatchToProps)(ComponentWrap);
};

export default listConnectorDecorator;

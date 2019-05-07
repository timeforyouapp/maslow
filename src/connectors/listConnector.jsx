import React from 'react';
import PropTypes from 'prop-types';

export const listConnectorDecorator = (
  connect,
  customMapStateToProps,
  customMapDispatchToProps,
) => namespace => (Component) => {
  const stateName = namespace.toLowerCase();

  const mapStateToProps = state => ({
    fetchState: state[stateName].fetchState,
    errors: state[stateName].errors.non_field_error,
    items: state[stateName].list,
    ...(customMapStateToProps ? customMapStateToProps(state) : {}),
  });

  const mapDispatchToProps = dispatch => ({
    getList: dispatch.action('getList', namespace),
    getDetail: dispatch.action('getDetail', namespace),
    clearAllErrors: dispatch.action('clearAllErrors', namespace),
    ...(customMapDispatchToProps ? customMapDispatchToProps(dispatch) : {}),
  });

  const ComponentWrap = ({ getList, fetchState, ...props }) => {
    if (fetchState === 'fresh') {
      getList();
    }

    return <Component {...{ getList, fetchState, ...props }} />;
  };

  ComponentWrap.propTypes = {
    errors: PropTypes.object,
    getDetail: PropTypes.func.isRequired,
    getList: PropTypes.func.isRequired,
    clearAllErrors: PropTypes.func.isRequired,
    fetchState: PropTypes.string.isRequired,
  };

  ComponentWrap.defaultProps = {
    errors: {},
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ComponentWrap);
};

export default listConnectorDecorator;

import React from 'react';

export const formConnectDecorator = (connect) => (namespace) => (Component) => {
    const stateName = namespace.toLowerCase();

    const mapStateToProps = (state, { initialValues }) => ({
        fetchState: state[stateName].fetchState,
        errors: state[stateName].errors,
        initialValues: {
            ...initialValues,
            ...(state[stateName].detail.extractValues ? state[stateName].detail.extractValues() : {})
        },
    });

    const mapDispatchToProps = (dispatch) => ({
        save: dispatch.action('save', namespace),
        getDetail: dispatch.action('getDetail', namespace),
    })

    const ComponentWrap = (props) => {
        if (props.loading !== 'fresh' && props.identifier) {
            props.getDetail(props.identifier)
        }

        if (props.fetchState === 'saveFetched' && props.afterSubmitSuccess) {
            props.afterSubmitSuccess(props.detail);
        }

        return (<Component {...props} />)
    }

    return connect(mapStateToProps, mapDispatchToProps)(ComponentWrap);
}

export default formConnectDecorator;
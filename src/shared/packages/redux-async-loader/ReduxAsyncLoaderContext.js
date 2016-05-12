/* eslint-disable react/no-set-state */
import React, { Component, PropTypes } from 'react';
import computeChangedRoutes from 'react-router/lib/computeChangedRoutes';
import { beginAsyncLoad, endAsyncLoad, skipAsyncLoad } from './actions';
import flattenComponents from './flattenComponents';
import loadAsync from './loadAsync';
import { reducerName } from './names';

export default class ReduxAsyncLoaderContext extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  static propTypes = {
    children: PropTypes.node.isRequired,
    components: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    getAsyncLoaderState: PropTypes.func,
    onError: PropTypes.func,
  };

  static defaultProps = {
    getAsyncLoaderState(state) {
      return state[reducerName];
    },
    onError(error) {
      // ignore
    },
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      children: null,
    };
    this.loadCount = 0;
  }

  componentDidMount() {
    const { loading, loaded, onServer } = this.getAsyncLoaderState();
    if (loading) {
      return;
    }

    if (loaded && onServer) {
      const { dispatch } = this.context.store;
      dispatch(skipAsyncLoad(false));
      return;
    }

    this.loadAsync(this.props);
  }

  componentWillReceiveProps(nextProps) {
    // based on async-props@0.3.2
    // https://github.com/ryanflorence/async-props
    if (nextProps.location === this.props.location) {
      return;
    }

    const { enterRoutes } = computeChangedRoutes(
      { routes: this.props.routes, params: this.props.params },
      { routes: nextProps.routes, params: nextProps.params },
    );

    const indexDiff = nextProps.components.length - enterRoutes.length;
    const components = [];
    for (let i = 0, l = enterRoutes.length; i < l; i++) {
      components.push(nextProps.components[indexDiff + i]);
    }

    this.loadAsync({ ...nextProps, components });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { loading } = this.getAsyncLoaderState();
    return !loading;
  }

  getAsyncLoaderState() {
    const { getAsyncLoaderState } = this.props;
    const { getState } = this.context.store;
    return getAsyncLoaderState(getState());
  }

  loadAsync(props) {
    const { children, components } = props;

    const flattened = flattenComponents(components);
    if (!flattened.length) {
      return;
    }

    const { store } = this.context;
    const { dispatch } = store;
    this.beginLoad(dispatch, children)
      .then(() => loadAsync(flattened, { ...props, store }))
      .then(
        () => this.endLoad(dispatch),
        (error) => this.endLoad(dispatch, error),
      );
  }

  beginLoad(dispatch, children) {
    if (this.loadCount === 0) {
      dispatch(beginAsyncLoad());
    }

    ++this.loadCount;
    return new Promise((resolve) => {
      this.setState({ children }, () => resolve());
    });
  }

  endLoad(dispatch, error) {
    if (error) {
      this.props.onError(error);
    }

    --this.loadCount;
    if (this.loadCount === 0) {
      dispatch(endAsyncLoad());
      this.setState({ children: null });
    }
  }

  render() {
    const { loading } = this.getAsyncLoaderState();
    return loading ? this.state.children : this.props.children;
  }
}

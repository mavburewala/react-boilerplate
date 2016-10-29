// import has from 'lodash/has';
import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, RouterContext, applyRouterMiddleware } from 'react-router';
// import GoogleAnalytics from 'react-ga';

export default class Root extends Component {
  constructor(props) {
    super(props);
    this.onUpdate = this.onUpdate.bind(this);
  }

  onUpdate() {
    const { store, type } = this.props;
    if (type !== 'server') {
      const state = store.getState();
      // if (has(state, 'router.pathname')) {
      //   GoogleAnalytics.pageview(state.router.pathname);
      // }
    }
  }
  render() {
    const { store, history, routes, messages, type, renderProps } = this.props;
    return (
      <Provider store={store}>
        <LanguageProvider messages={messages}>
        {type === 'server'
          ? <RouterContext {...renderProps} />
          : <Router
            history={history}
            routes={routes}
            render={
              // Scroll to top when going to a new page, imitating default browser
              // behaviour
              applyRouterMiddleware(useScroll())
            }
          />}
        </LanguageProvider>
      </Provider>
    );
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  routes: PropTypes.node.isRequired,
  type: PropTypes.object,
  renderProps: PropTypes.object
};

/* eslint-disable global-require */
import 'babel-polyfill';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory, match } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import Fetchr from 'fetchr';
import createStore from 'shared/redux/createStore';
import App from 'client/components/App';

const store = configStore();
const history = syncHistoryWithStore(browserHistory, store, { adjustUrlOnReplay: __DEVELOPMENT__ });
const root = document.getElementById('root');

renderApp().then(() => {
  if (__DEVELOPMENT__) {
    configHotLoader();

    if (!window.devToolsExtension) {
      renderDevTool();
    }
  }
});

function configStore() {
  const getJson = (id) => JSON.parse(document.getElementById(id).getAttribute('data-json'));
  const initialState = getJson('initial-state');
  const clientConfig = getJson('client-config');

  return createStore(initialState, {
    cookie: [],
    fetchr: new Fetchr(clientConfig.fetchr),
    fetchrCache: clientConfig.fetchrCache,
    history: browserHistory,
    devTools: __DEVELOPMENT__,
  });
}

function renderApp() {
  const routes = getRoutes();

  return new Promise((resolve) => {
    // 非同期のonEnter()がある画面がサーバサイドレンダリングされるとクライアント
    // サイドの最初のレンダリングも非同期 (画面の一部が未完成) となってハッシュが
    // 合わなくなり、サーバサイドレダリングの結果が破棄されてしまう。
    // 回避策としてクライアントサイドでも最初の表示はmatch()を使用して非同期処理が
    // 終わった後にレンダリングする。
    // matchの引数にbrowserHistoryがベースのhistoryを渡している (renderPropsを
    // 通じて <Router> に渡る) ため、最初の表示後はhistoryの変化により通常通り
    // レンダリングされる。
    match({ routes, history }, (error, redirectLocation, renderProps) => {
      render(<App store={store} {...renderProps} />, root);
      resolve();
    });
  });
}

function getRoutes() {
  const routes = require('../shared/routes').default;
  return routes(store);
}

function configHotLoader() {
  module.hot.accept('../shared/routes', () => {
    unmountComponentAtNode(root);
    renderApp();
  });

  module.hot.accept('../shared/redux/modules/reducer', () => {
    const nextReducer = require('../shared/redux/modules/reducer').default;
    store.replaceReducer(nextReducer);
  });
}

function renderDevTool() {
  if (__DEVELOPMENT__) {
    window.React = React; // enable debugger
    const DevTools = require('../shared/components/utils/DevTools').default;
    const content = (
      <Provider store={store} key="provider">
        <DevTools />
      </Provider>
    );
    render(content, document.getElementById('devtools'));
  }
}

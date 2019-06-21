import React from 'react'
import { hydrate, render } from 'react-dom'

import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'

import { FalcorProvider } from 'utils/redux-falcor'
import { falcorGraph } from 'store/falcorGraph'

import store, { history } from './store'
import App from './App';

import registerServiceWorker from './registerServiceWorker';

const rootElement = document.getElementById('root')

const app =
	<Provider store={store}>
		<FalcorProvider store={store} falcor={falcorGraph}>
			<ConnectedRouter history={history}>
				<App />
			</ConnectedRouter>
		</FalcorProvider>
	</Provider>

if (rootElement.hasChildNodes()) {
	hydrate(app, rootElement);
}
else {
	render(app, rootElement);
}

registerServiceWorker();

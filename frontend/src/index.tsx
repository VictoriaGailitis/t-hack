import React from 'react';
import ReactDOM, {Root} from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './app/App';
import { BrowserRouter } from 'react-router-dom'
import store from './app/providers/store';

const root: Root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
);
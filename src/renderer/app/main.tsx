import { render } from 'preact';
import { App } from './App';
import { installNativeBridge } from '../platform/nativeBridge';
import './global.css';

// On a phone or tablet the page makes its own bridge to the app around it;
// on the desktop this does nothing, the preload script has already done it.
void installNativeBridge().then(() => {
  render(<App />, document.getElementById('root')!);
});

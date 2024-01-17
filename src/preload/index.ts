import './communication';
import { loading } from './loading';
import { domReady } from './utils/dom';

domReady().then(loading);

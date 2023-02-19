// Import stylesheets
import './style.css';

// Write TypeScript code!
import { isSecretMode } from './secretMode';

const callback = (isSecret) => console.log('isSecretMode >>> ', isSecret);
isSecretMode(callback);

const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h1>TypeScript Starter</h1>`;

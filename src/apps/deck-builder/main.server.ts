import {
	type BootstrapContext,
	bootstrapApplication,
} from '@angular/platform-browser';
import { App } from './app/app.ts';
import { config } from './app/app.config.server.ts';

const bootstrap = (context: BootstrapContext) =>
	bootstrapApplication(App, config, context);

export default bootstrap;

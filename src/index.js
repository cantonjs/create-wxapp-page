import yargs from 'yargs';
import { createBuilder, createHandler } from './create';
import pkg, { version } from '../package.json';
import updateNotifier from 'update-notifier';
import { dir, init } from './config';

const app = async () => {
	// eslint-disable-next-line
	const argv = yargs
		.command({
			command: '*',
			builder: createBuilder,
			handler: createHandler,
		})
		.command({
			command: 'reset',
			handler: init,
		})
		.command({
			command: 'dir',
			handler: () => console.log(dir),
		})
		.alias('h', 'help')
		.alias('v', 'version')
		.help()
		.version(version)
		.argv;
};

app().catch((err) => console.error('[错误]', err.message));
updateNotifier({ pkg }).notify();

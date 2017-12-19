import yargs from 'yargs';
import { createBuilder, createHandler } from './create';
import pkg, { version } from '../package.json';
import updateNotifier from 'update-notifier';
import { dir, init } from './config';
import opn from 'opn';

const app = async () => {
	// eslint-disable-next-line
	const argv = yargs
		.usage('\n create-wxapp-page <command> [args]')
		.command({
			command: ['create', '*'],
			builder: createBuilder,
			handler: createHandler,
			desc: '创建page或者compnent',
		})
		.command({
			command: 'reset',
			handler: init,
			desc: '重置模板'
		})
		.command({
			command: 'open',
			handler: () => opn(dir, { wait: false }),
			desc: '打开模板目录'
		})
		.command({
			command: 'dir',
			handler: () => console.log(dir),
			desc: '显示模板目录位置'
		})
		.alias('h', 'help')
		.alias('v', 'version')
		.help()
		.version(version)
		.argv;
};

app().catch((err) => console.error('[错误]', err.message));
updateNotifier({ pkg }).notify();

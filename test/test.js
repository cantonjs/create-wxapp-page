import { resolve } from 'path';
import { bin } from '../package.json';
import fs from 'fs';
import Kapok from 'kapok-js';
import rimraf from 'rimraf';

describe('test create page', () => {
	const appJsonPath = resolve('test/src/app.json');
	const hasAppJsonFile = fs.existsSync(appJsonPath);
	let appJSON;
	let kapok;

	it('create page with no args', async () => {
		const binFile = Object.keys(bin)[0];
		const command = resolve(`bin/${binFile}`);
		kapok = new Kapok(command, []);

		await kapok
			.assert(`? 请输入小程序源代码根目录 (app.json 所在目录) (${process.cwd()})`, {
				action: () => {
					kapok.write('test/src\n');
				}
			})
			.ignoreUntil('? 请输入小程序源代码根目录 (app.json 所在目录) test/src')
			.assert('? 请选择需要创建的类型 (Use arrow keys)', {
				action: () => {
					kapok.write('\n');
				}
			})
			.ignoreUntil('? 请选择需要创建的类型 page')
			.assert('? 请输入页面名称 (可包含路径) (index)', {
				action: () => {
					kapok.write('test\n');
				}
			})
			.ignoreUntil('? 请输入页面名称 (可包含路径) test')
			.assert('? 请输入文件缩进的方式 (tab)', {
				action: () => {
					kapok.write('\n');
				}
			})
			.ignoreUntil('? 请输入文件缩进的方式 tab')
			.assert('? 是否需要生成配置文件 (.json) (y/N)', {
				action: () => {
					kapok.write('y\n');
				}
			})
			.ignoreUntil('? 是否需要生成配置文件 (.json) Yes')
			.assert('? 请选择样式文件的类型 (Use arrow keys)', {
				action: () => {
					kapok.write('\n');
				}
			})
			.assertUntil(/创建结束/)
			.done();
	});

	it('create page with yes mode', async () => {
		const binFile = Object.keys(bin)[0];
		const command = resolve(`bin/${binFile}`);
		kapok = new Kapok(
			command,
			['-d', './src/', '--name', 'test', '--yes'],
			{ cwd: __dirname }
		);

		await kapok
			.assertUntil(/创建结束/)
			.done();
	});


	it('create page when name is path', async () => {
		const binFile = Object.keys(bin)[0];
		const command = resolve(`bin/${binFile}`);
		kapok = new Kapok(
			command,
			['-d', './src/', '--name', 'test/detail',  '--yes'],
			{ cwd: __dirname }
		);

		await kapok
			.assertUntil(/创建结束/)
			.done();
	});

	beforeEach(() => {
		if (hasAppJsonFile) {
			const filePath = resolve('test/src/pages/');
			rimraf.sync(filePath);
			appJSON = fs.readFileSync(appJsonPath, 'utf8');
		}
	});

	afterEach((done) => {
		if (hasAppJsonFile) {
			fs.writeFileSync(appJsonPath, appJSON);
		}
		kapok.exit(done);
	});

});

describe('test create component', () => {
	const appJsonPath = resolve('test/src/app.json');
	const hasAppJsonFile = fs.existsSync(appJsonPath);
	let kapok;

	it('create component with no args', async () => {
		const binFile = Object.keys(bin)[0];
		const command = resolve(`bin/${binFile}`);
		kapok = new Kapok(command, []);

		await kapok
			.assert(`? 请输入小程序源代码根目录 (app.json 所在目录) (${process.cwd()})`, {
				action: () => {
					kapok.write('test/src\n');
				}
			})
			.ignoreUntil('? 请输入小程序源代码根目录 (app.json 所在目录) test/src')
			.assert('? 请选择需要创建的类型 (Use arrow keys)', {
				action: () => {
					kapok.write('\u001b[B');
					kapok.write('\n');
				}
			})
			.ignoreUntil('? 请选择需要创建的类型 component')
			.assert('? 请输入组件名称 (可包含路径) (index)', {
				action: () => {
					kapok.write('test\n');
				}
			})
			.ignoreUntil('? 请输入组件名称 (可包含路径) test')
			.assert('? 请输入文件缩进的方式 (tab)', {
				action: () => {
					kapok.write('\n');
				}
			})
			.ignoreUntil('? 请输入文件缩进的方式 tab')
			.assert('? 请选择样式文件的类型 (Use arrow keys)', {
				action: () => {
					kapok.write('\n');
				}
			})
			.assertUntil(/创建结束/)
			.done();
	});

	it('create component with yes mode', async () => {
		const binFile = Object.keys(bin)[0];
		const command = resolve(`bin/${binFile}`);
		kapok = new Kapok(
			command,
			['-d', './src/', '--name', 'test', '--type', 'component', '--yes'],
			{ cwd: __dirname }
		);

		await kapok
			.assertUntil(/创建结束/)
			.done();
	});

	it('create component with yes mode and name is path', async () => {
		const binFile = Object.keys(bin)[0];
		const command = resolve(`bin/${binFile}`);
		kapok = new Kapok(
			command,
			['-d', './src/', '--name', './component/text', '--type', 'component', '--yes'],
			{ cwd: __dirname }
		);

		await kapok
			.assertUntil(/创建结束/)
			.done();
	});

	beforeEach(() => {
		if (hasAppJsonFile) {
			const componentsfilePath = resolve('test/src/components/');
			const componentfilePath = resolve('test/src/component/');
			rimraf.sync(componentsfilePath);
			rimraf.sync(componentfilePath);
		}
	});

});

describe('reset template', () => {
	it('create component with yes mode', async () => {
		const binFile = Object.keys(bin)[0];
		const command = resolve(`bin/${binFile}`);
		const	kapok = new Kapok(
			command,
			['reset'],
			{ cwd: __dirname }
		);

		await kapok
			.assertUntil(/Init Templates Success/)
			.done();
	});
});

describe('show template dir', () => {
	it('create component with yes mode', async () => {
		const binFile = Object.keys(bin)[0];
		const command = resolve(`bin/${binFile}`);
		const	kapok = new Kapok(
			command,
			['dir'],
			{ cwd: __dirname }
		);

		await kapok
			.assertUntil(/.config\/create-wxapp-page/)
			.done();
	});
});



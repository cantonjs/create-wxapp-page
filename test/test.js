// import { spawn } from 'child_process';
import { resolve } from 'path';
import { bin } from '../package.json';
import fs from 'fs';
import Kapok from 'kapok-js';
// import assert from 'assert';
import rimraf from 'rimraf';


describe('test', () => {
	const appJsonPath = resolve('test/src/app.json');
	const hasAppJsonFile = fs.existsSync(appJsonPath);
	let appJSON;
	let kapok;

	it('Create files with no args', async () => {
		const binFile = Object.keys(bin)[0];
		const command = resolve(`bin/${binFile}`);
		// const kapok = new Kapok(command, ['-d', './src/'], { cwd: __dirname });
		kapok = new Kapok(command, []);

		await kapok
			.assert('? 请输入生成的文件所放置的根目录 (/Users/JC/Documents/Git/create-wxapp-page)', {
				action: () => {
					kapok.write('test/src\n');
				}
			})
			.ignoreUntil('? 请输入生成的文件所放置的根目录 test/src')
			.assert('? 请输入页面名称 (index)', {
				action: () => {
					kapok.write('test\n');
				}
			})
			.ignoreUntil('? 请输入页面名称 test')
			.assert('? 请输入文件缩进的方式 (tab)', {
				action: () => {
					kapok.write('\n');
				}
			})
			.ignoreUntil('? 请输入文件缩进的方式 tab')
			.assert('? 是否需要生成配置文件(.json) (y/N)', {
				action: () => {
					kapok.write('y\n');
				}
			})
			.ignoreUntil('? 是否需要生成配置文件(.json) Yes')
			.assert('? 请选择样式文件的类型 (Use arrow keys)', {
				action: () => {
					kapok.write('\n');
				}
			})
			// .ignoreUntil('请选择样式文件的类型 wxss')
			// .ignoreUntil(4)
			.assertUntil(/files create complete/)
			.done();
	});

	it('Create files with yes mode', async () => {
		const binFile = Object.keys(bin)[0];
		const command = resolve(`bin/${binFile}`);
		kapok = new Kapok(
			command,
			['-d', './src/', '--name', 'test', '--yes'],
			{ cwd: __dirname }
		);

		await kapok
			.assertUntil(/files create complete/)
			.done();
	});

	beforeEach(() => {
		if (hasAppJsonFile) {
			const filePath = resolve('test/src/pages/test');
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

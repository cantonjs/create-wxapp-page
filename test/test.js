// import { spawn } from 'child_process';
import { resolve } from 'path';
import { bin } from '../package.json';
import fs from 'fs';
import Kapok from 'kapok-js';
// import assert from 'assert';
import rimraf from 'rimraf';

//测试用例完善

describe('test', () => {
	const appJsonPath = resolve('test/src/app.json');
	const hasAppJsonFile = fs.existsSync(appJsonPath);
	let appJSON;

	it('create files ', (done) => {
		const binFile = Object.keys(bin)[0];
		const command = resolve(`bin/${binFile}`);

		const kapok = new Kapok(command, ['-d', './src/'], { cwd: __dirname });

		kapok
			.assert('? Input the page name (index)', {
				action: () => {
					kapok.write('test\n');
				}
			})
			.ignoreUntil('? Input the page name test')
			.assert('? Do you need a configuration file (y/N)', {
				action: () => {
					kapok.write('Y\n');
				}
			})
			.ignoreUntil('? Do you need a configuration file Yes')
			.assert('? Select a style framework (Use arrow keys)', {
				action: () => {
					kapok.write('\n');
				}
			})
			.ignoreUntil('? Select a style framework scss')
			.ignoreUntil(4)
			.assert('files create complete')
			.done((error) => {
				if (error) { done.fail(error); }
				else { done(); }
			})
		;
	});

	beforeEach(() => {
		if (hasAppJsonFile) {
			const filePath = resolve('test/src/pages/test');
			rimraf.sync(filePath);
			appJSON = fs.readFileSync(appJsonPath, 'utf8');
		}
	});

	afterEach(() => {
		if (hasAppJsonFile) {
			fs.writeFileSync(appJsonPath, appJSON);
		}
	});

});

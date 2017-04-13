import { spawn } from 'child_process';
import { resolve } from 'path';
import { bin } from '../package.json';
import fs from 'fs';

//测试用例完善

const delay = (t = 1) => new Promise((done) => setTimeout(done, t * 1000));

describe('test', async () => {
	const filename = resolve('test/src/app.json');
	let appJSON;

	it('🌚 ', async () => {
		const binFile = Object.keys(bin)[0];
		const command = resolve(`bin/${binFile}`);
		const child = spawn(`${command}`, ['-d', './src/'], { stdio: 'pipe', cwd: __dirname });

		child.stdin.setEncoding('utf-8');
		child.stdout.setEncoding('utf-8');

		child.stdout.on('data', (data) => {
			const info = data.trim();
			console.log(info);
		});

		await delay();
		child.stdin.write('test\n');

		await delay();
		child.stdin.write('n\n');

		await delay();
		child.stdin.write('\n');

		child.stdin.end();
	});

	beforeEach(() => {
		appJSON = fs.readFileSync(filename, 'utf8');
	});

	afterEach(() => {
		fs.writeFileSync(filename, appJSON);
	});

});

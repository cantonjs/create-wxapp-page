import { spawn } from 'child_process';
import { resolve } from 'path';
import { bin } from '../package.json';

const delay = (t = 1) => new Promise((done) => setTimeout(done, t * 1000));

describe('test', async () => {
	it('🌚 ', async () => {
		const binFile = Object.keys(bin)[0];
		const command = resolve(`bin/${binFile}`);
		const child = spawn(`${command}`, ['-d', './src/'], { stdio: 'pipe', cwd: __dirname });

		child.stdin.setEncoding('utf-8');
		child.stdout.setEncoding('utf-8');

		// child.stdout.on('data', (data) => {
		// 	const info = data.trim();
		// 	console.log(info);
		// });

		await delay();
		child.stdin.write('test\n');

		await delay();
		child.stdin.write('y\n');

		await delay();
		child.stdin.write('\n');

		child.stdin.end();
	});

});

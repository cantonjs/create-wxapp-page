import { name } from '../package.json';
import xdgBasedir from 'xdg-basedir';
import fs from 'fs-extra';
import { join } from 'path';

const configPath = xdgBasedir.config;
export const dir = join(configPath, name);

export const init = () => {
	try {
		fs.copySync(join(__dirname, 'templates'), dir);
		console.log(`[Init Templates Success]: ${dir}`);
	}
	catch (err) {
		console.error(`[Init Templates Error] ${err}`);
	}
};

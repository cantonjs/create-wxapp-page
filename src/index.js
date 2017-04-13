import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import inquirer from 'inquirer';
import yargs, { argv } from 'yargs';

// import jsTemplate from './templates/js';
// import wxmlTemplate from './templates/wxml';
// import styleTemplate from './templates/style';
// import jsonTemplate from './templates/json';


const generateJson = (root, name) => {
	const filename = root + '/app.json';
	const content = fs.readFileSync(filename, 'utf8');
	const json = JSON.parse(content);
	json.pages.push(`pages/${name}/${name}`);
	const result = JSON.stringify(json, null, 2);
	fs.writeFileSync(filename, result);
};

export const createPage = (options) => {
	const cwd = process.cwd();

	if (typeof options !== 'object') {
		throw new Error('options must be a object.');
	}

	options = Object.assign({
		dir: cwd,
		name: 'index',
		json: false,
		styleType: 'wxss'
	}, options);

	const { dir, name } = options;
	const root = path.isAbsolute(dir) ? dir : path.resolve(cwd, dir);

	const pageRoot = path.resolve(options.root, 'pages', name);

	if (fs.existsSync(pageRoot)) {
		throw new Error('file already exited');
	}

	mkdirp.sync(pageRoot);

	const filesType = ['js', 'wxml', options.styleType, options.json ? 'json' : null];

	filesType.forEach((type) => {
		if (!type) { return; }
		const filePath = path.resolve(pageRoot, name + `.${type}`);
		const { default: template } = require(`./templates/${type}`);
		fs.writeFileSync(filePath, template(options));
		console.log('file created:', filePath);
	});
	generateJson(root, name);
};

inquirer.prompt([
	{
		type: 'input',
		name: 'name',
		message: 'Input the page name',
		default: 'index'
	},
	{
		type: 'confirm',
		name: 'isNeedConfig',
		message: 'Do you need a configuration file',
		default: false
	},
	{
		type: 'list',
		name: 'styleType',
		message: 'Select a style framework',
		choices: ['wxss', 'scss', 'less'],
		default: 'scss'
	}
])
.then((options) => {
	yargs.alias('d', 'dir');
	const { name, styleType, isNeedConfig } = options;
	createPage({
		name,
		styleType,
		dir: argv.dir,
		json: isNeedConfig
	});
})
.catch((err) => {
	throw new Error('create page fail: ', err);
});


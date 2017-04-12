import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import inquirer from 'inquirer';
import yargs, { argv } from 'yargs';

import jsTemplate from './templates/js';
import wxmlTemplate from './templates/wxml';
import scssTemplate from './templates/scss';
import wxssTemplate from './templates/wxss';
import lessTemplate from './templates/less';
import jsonTemplate from './templates/json';

yargs.alias('d', 'dir');
const rootPath = argv.dir;

export const createPage = (options) => {
	if (typeof options !== 'object') {
		throw new Error('options must be a object.');
	}

	options = Object.assign({
		name: 'index',
		json: false,
		less: false,
		scss: false,
		css: false
	}, options);

	if (!options.root) {
		throw new Error('You must specify a root directory.');
	}

	const pageRoot = path.resolve(options.root, options.name);

	if (fs.existsSync(pageRoot)) {
		throw new Error('file already exited');
	}

	mkdirp.sync(pageRoot);

	const results = [];

	// js
	const jsPath = path.resolve(pageRoot, options.name + '.js');
	fs.writeFileSync(jsPath, jsTemplate(options));
	results.push(jsPath);

	// wxml
	const wxmlPath = path.resolve(pageRoot, options.name + '.wxml');
	fs.writeFileSync(wxmlPath, wxmlTemplate(options));
	results.push(wxmlPath);

	// less
	if (options.less) {
		const lessPath = path.resolve(pageRoot, options.name + '.less');
		fs.writeFileSync(lessPath, lessTemplate(options));
		results.push(lessPath);
	}
	// scss
	if (options.scss) {
		const scssPath = path.resolve(pageRoot, options.name + '.scss');
		fs.writeFileSync(scssPath, scssTemplate(options));
		results.push(scssPath);
	}

	// wxss
	if (options.wxss) {
		const wxssPath = path.resolve(pageRoot, options.name + '.wxss');
		fs.writeFileSync(wxssPath, wxssTemplate(options));
		results.push(wxssPath);
	}
	// json
	if (options.json) {

		const jsonPath = path.resolve(pageRoot, options.name + '.json');
		fs.writeFileSync(jsonPath, jsonTemplate(options));
		results.push(jsonPath);
	}
	return results;
};

function generateJson (options) {
	const cwd = process.cwd();
	const filename = path.resolve(cwd, rootPath + '/app.json');
	const content = fs.readFileSync(filename, 'utf8');
	const json = JSON.parse(content);
	json.pages.push(`pages/${options.pageName}/${options.pageName}`);
	const result = JSON.stringify(json, null, 2);
	fs.writeFileSync(filename, result);
}

// utils functions
function generateFile (options) {
	const cwd = process.cwd();
	const files = createPage({
		root: path.resolve(cwd, rootPath + 'pages/'),
		name: options.pageName,
		less: options.styleType === 'less',
		scss: options.styleType === 'scss',
		wxss: options.styleType === 'wxss',
		json: options.needConfig
	});
	files.forEach && files.forEach((file) => console.log('file created:', file));
	return files;
}


inquirer.prompt([
	{
		type: 'input',
		name: 'pageName',
		message: 'Input the page name',
		default: 'index'
	},
	{
		type: 'confirm',
		name: 'needConfig',
		message: 'Do you need a configuration file',
		default: false
	},
	{
		type: 'list',
		name: 'styleType',
		message: 'Select a style framework',
		choices: ['wxss', 'scss', 'less'],
		default: 'wxss'
	}
])
.then((options) => {
	try {
		const res = generateFile(options);
		if (res) {
			generateJson(options);
		}
	}
	catch (err) {
		throw err;
	}
})
.catch((err) => {
	throw new Error('create page fail: ', err);
});


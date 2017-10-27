import fs from 'fs';
import { resolve } from 'path';
import mkdirp from 'mkdirp';
import inquirer from 'inquirer';
import yargs from 'yargs';
import pkg, { version } from '../package.json';
import updateNotifier from 'update-notifier';

const cwd = process.cwd();

const defaultValue = {
	name: 'index',
	indent: 'tab',
	dir: cwd,
	json: false,
	style: 'wxss',
};

const formatTemplate = (template, pathname, basename, indent) => {
	let templateStr = template({ pathname, basename });
	if (indent !== defaultValue.indent) {
		const intNum = ~~indent;
		const spaces = new Array(intNum).fill(' ').join('');
		templateStr = templateStr.replace(/\t/g, spaces);
	}
	return templateStr;
};

const parseName = (name) => {
	name = name.split(/[\\\/]/);
	const len = name.length;
	if (len === 1) name.push(name[0]);
	if (!name[len - 1]) name[len - 1] = name[len - 2];
	if (name[0]) name.unshift('pages');
	else name.shift();

	return {
		basename: name.pop(),
		pathname: name.join('/')
	};
};

const getRootDir = (dir) => resolve(cwd, dir);

const validateAppJson = (rootDir) => {
	const exists = fs.existsSync(resolve(rootDir, 'app.json'));
	if (!exists) { throw new Error(`${rootDir} 目录找不到 app.json 文件！`); }
	return true;
};

const addRoute = (rootDir, pathname, basename, indent) => {
	const filename = rootDir + '/app.json';
	const content = fs.readFileSync(filename, 'utf8');
	const json = JSON.parse(content);
	const newPath = [pathname, basename].filter(Boolean).join('/');
	if (json.pages.indexOf(newPath) < 0) { json.pages.push(newPath); }
	const formatedIndent = indent === 'tab' ? '\t' : ~~indent;
	const result = JSON.stringify(json, null, formatedIndent);
	fs.writeFileSync(filename, result);
};

export const createPage = (options) => {
	if (typeof options !== 'object') {
		throw new Error('参数必须是一个JSON对象。');
	}

	options = Object.assign({}, defaultValue, options);

	const { dir, name, indent, json, style } = options;
	const rootDir = getRootDir(dir);
	const { pathname, basename } = parseName(name);

	validateAppJson(rootDir);

	const pageRoot = resolve(rootDir, pathname);

	if (!fs.existsSync(pageRoot)) {
		mkdirp.sync(pageRoot);
	}

	const filesTypes = ['wxml', 'js', style];
	if (json) { filesTypes.push('json'); }

	filesTypes.forEach((fileType) => {
		fileType = fileType.replace(/^\./g, '');

		const filePath = resolve(pageRoot, `${basename}.${fileType}`);

		if (fs.existsSync(filePath)) {
			throw new Error(`${filePath} 已存在！`);
		}

		const notStyleFiles = ['js', 'wxml', 'json'];
		const templateExt = notStyleFiles.includes(fileType) ? fileType : 'wxss';
		const { default: template } = require(`./templates/${templateExt}`);

		const content = formatTemplate(template, pathname, basename, indent);
		fs.writeFileSync(filePath, content);
		console.log(`${filePath} 创建成功；`);
	});

	addRoute(rootDir, pathname, basename, indent);
	console.log('创建结束。');
};

const app = async () => {
	// eslint-disable-next-line
	const argv = yargs
		.options({
			i: {
				alias: 'indent',
				describe: '文件缩进的方式',
			},
			d: {
				alias: 'dir',
				describe: '小程序源代码根目录 (app.json 所在目录)',
				type: 'string',
			},
			n: {
				alias: 'name',
				describe: '生成页面的名称 (可包含路径)',
				type: 'string',
			},
			j: {
				alias: 'json',
				describe: '是否需要生成配置文件 (.json)',
				type: 'boolean',
			},
			s: {
				alias: 'style',
				describe: '样式文件的类型 (如 wcss, scss 等)',
				type: 'string',
			},
			y: {
				alias: 'yes',
				describe: '使用默认值生成相关文件',
				type: 'boolean',
			},
		})
		.alias('h', 'help')
		.alias('v', 'version')
		.help()
		.version(version)
		.argv;

	const createPromptItems = (options) => ([
		{
			message: '请输入小程序源代码根目录 (app.json 所在目录)',
			default: defaultValue.dir,
			type: 'input',
			name: 'dir',
			when: !options.dir,
			validate: (answer) => {
				const rootDir = getRootDir(answer);
				try { return validateAppJson(rootDir); }
				catch (err) { return err.message; }
			},
		},
		{
			message: '请输入页面名称 (可包含路径)',
			default: defaultValue.name,
			type: 'input',
			name: 'name',
			when: !options.name,
		},
		{
			message: '请输入文件缩进的方式',
			default: defaultValue.indent,
			type: 'input',
			name: 'indent',
			when: !options.indent,
		},
		{
			message: '是否需要生成配置文件 (.json)',
			default: defaultValue.json,
			type: 'confirm',
			name: 'json',
			when: !options.json,
		},
		{
			type: 'list',
			message: '请选择样式文件的类型',
			default: defaultValue.style,
			choices: [
				'wxss',
				'scss',
				'less',
				'pcss',
				'styl',
				'自定义',
			],
			name: 'style',
			when: !options.style,
		},
		{
			message: '请输入自定义样式文件的类型',
			type: 'input',
			default: defaultValue.style,
			name: 'style',
			when: (answers) => !options.style && answers.style === '自定义',
		},
	]);

	if (argv.yes) {
		Object.assign({}, defaultValue, argv);
	}
	else {
		const promptItems = createPromptItems(argv);
		const answers = await inquirer.prompt(promptItems);
		Object.keys(answers).forEach((key) => {
			argv[key] = answers[key];
		});
	}
	createPage(argv);
};

app().catch((err) => console.error('[错误]', err.message));
updateNotifier({ pkg }).notify();

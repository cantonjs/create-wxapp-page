import fs from 'fs';
import { resolve, join, parse, isAbsolute, sep } from 'path';
import mkdirp from 'mkdirp';
import inquirer from 'inquirer';
import { template } from 'lodash';
import { dir as templatePath, init } from './config';

const cwd = process.cwd();
const pageTemplatePath = join(templatePath, 'page');
const componentTemplatePath = join(templatePath, 'component');

const defaultValue = {
	name: 'index',
	indent: 'tab',
	dir: cwd,
	json: false,
	style: 'wxss',
	type: 'page',
};

const formatTemplate = (templateFile, pathname, basename, indent) => {
	let templateStr = template(templateFile)({ basename });
	if (indent !== defaultValue.indent) {
		const intNum = ~~indent;
		const spaces = new Array(intNum).fill(' ').join('');
		templateStr = templateStr.replace(/\t/g, spaces);
	}
	return templateStr;
};

// 如果name只提供页面名称（例如name: 'myPage'），则最终生成的目录，和目前版本的行为一样，是 {project}/pages/myPage/myPage ({project}为app.json所在目录)。
// 如果name是相对路径（例如name: 'path/myPage'），则最终生成的目录是 {project}/pages/path/myPage。
// 如果name是绝对路径（例如name: '/some/path/myPage'），则最终生成的目录是 {project}/some/path/myPage。
// 如果name只填写了路径（例如name: '/some/path/'），则自动把最后的路径当做页面名称，最终生成的目录是{project}/some/path/path。

const parseName = (name, type) => {
	const { dir, name: basename, root } = parse(name);
	const defaultRoot = type === 'page' ? 'pages' : 'components';
	const isAbsolutePath = isAbsolute(name);
	const hasChildPath = !name.split(sep).slice(-1)[0];
	const isPath = !!dir;
	let pathname = name;

	pathname = isAbsolutePath ? name.replace(root, '') : join(defaultRoot, name);

	if (!hasChildPath && isPath) {
		pathname = pathname.replace(basename, '');
	}

	return { basename, pathname };
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

const create = (options) => {
	if (typeof options !== 'object') {
		throw new Error('参数必须是一个JSON对象。');
	}

	options = Object.assign({}, defaultValue, options);

	const { dir, name, indent, json, style, type } = options;
	const rootDir = getRootDir(dir);

	validateAppJson(rootDir);

	const { pathname, basename } = parseName(name, type);

	const fileRoot = resolve(rootDir, pathname);

	if (!fs.existsSync(fileRoot)) {
		mkdirp.sync(fileRoot);
	}

	const filesTypes = ['wxml', 'js', style];
	if (json || type === 'component') {
		filesTypes.push('json');
	}

	filesTypes.forEach((fileType) => {
		fileType = fileType.replace(/^\./g, '');

		const filePath = resolve(fileRoot, `${basename}.${fileType}`);

		if (fs.existsSync(filePath)) {
			throw new Error(`${filePath} 已存在！`);
		}

		const notStyleFiles = ['js', 'wxml', 'json'];
		const templateExt = notStyleFiles.includes(fileType) ? fileType : 'wxss';
		const templatePath = type === 'page' ? pageTemplatePath : componentTemplatePath;
		const templateFile = fs.readFileSync(`${templatePath}/template.${templateExt}`, 'utf8');
		const content = formatTemplate(templateFile, pathname, basename, indent);
		fs.writeFileSync(filePath, content);
		console.log(`${filePath} 创建成功；`);
	});

	if (type === 'page') {
		addRoute(rootDir, pathname, basename, indent);
	}
	console.log('创建结束。');
};

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
		message: '请选择需要创建的类型',
		default: defaultValue.type,
		type: 'list',
		choices: ['page', 'component'],
		name: 'type',
		when: !options.dir,
		validate: (answer) => {
			const rootDir = getRootDir(answer);
			try { return validateAppJson(rootDir); }
			catch (err) { return err.message; }
		},
	},
	{
		message: (answers) => {
			const { type } = answers;
			const typeText = type === 'page' ? '页面' : '组件';
			return `请输入${typeText}名称 (可包含路径)`;
		},
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
		when: (answers) => {
			const { type } = answers;
			return type !== 'component' && !options.json;
		}
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

export const createBuilder = (yargs) => {
	yargs
		.usage('\n create-wxapp-page [args] | create-wxapp-page create [args]')
		.options({
			t: {
				alias: 'type',
				desc: '创建类型',
				choices: ['page', 'component'],
				type: 'string'
			},
			i: {
				alias: 'indent',
				desc: '文件缩进的方式',
			},
			d: {
				alias: 'dir',
				desc: '小程序源代码根目录 (app.json 所在目录)',
				type: 'string',
			},
			n: {
				alias: 'name',
				desc: '生成页面的名称 (可包含路径)',
				type: 'string',
			},
			j: {
				alias: 'json',
				desc: '是否需要生成配置文件 (.json)',
				type: 'boolean',
			},
			s: {
				alias: 'style',
				desc: '样式文件的类型 (如 wcss, scss 等)',
				type: 'string',
			},
			y: {
				alias: 'yes',
				desc: '使用默认值生成相关文件',
				type: 'boolean',
			},
		})
		.help()
		.argv
	;
};

export const createHandler = async (argv) => {
	if (!fs.existsSync(templatePath)) {
		init();
	}

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
	create(argv);
};

# create-wxapp-page

## 功能

- 自动化生成微信小程序页面，样式支持less, scss, wxss
- 自动更新`app.json`,添加生成页面

## 安装

```bash
$ yarn add creat-wxapp-page
```


## 用法

#### 查看帮助
```bash
$ create-wxapp-page --help
```


#### 示例一
（使用yes模式，没有配置的内容使用默认值进行配置）
```bash
$ create-wxapp-page --name test --indent 2 --yes
```

#### 示例二
（不使用yes模式，没有配置的内容，需要通过回答问题，进行配置）
```bash
$ create-wxapp-page --name test
#回答问题
#自动生成...
```

#### 参数
- dir: 文件路径
- name: page的名称，支持带相对/绝对路径(`/path/my-page`, `path/my-page`, `your/path/` `my-page`)
- style: 样式的格式，支持less, scss, wxss
- json: 是否需要生成配置文件
- indent: 缩进的方式，默认tab，支持数字
- yes: 使用默认值生成相关文件
- help: 查看帮助

## 更新历史
2017.9.24
- name支持使用相对/绝对路径
- 样式统一用wxss单个模板处理
2017.8.10 
- 增加可配置内容(indent，dir)
- 增加命令行参数

## License

MIT

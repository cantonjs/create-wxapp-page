# create-wxapp-page

## 功能

- 自动化生成微信小程序页面，样式支持less, scss, wxss
- 自动更新app.json,添加生成页面

## 安装

```bash
$ yarn add creat-wxapp-page
```


## 用法

### 一、命令行参数
```bash
$ create-wxapp-page --help //查看帮助
```

```bash
$ create-wxapp-page --name test --indent 2 --yes
```

#### 参数
- dir: 文件路径
- name: page的名称
- style: 样式的格式，支持less, scss, wxss
- isNeedConfig: 是否需要生成配置文件
- indent: 缩进的方式，默认tab，支持数字
- yes: 开启默认读取默认值的配置

### 二、prompt
```bash
$ cd ./my-wxapp-project
$ create-wxapp-page -d ./src/
#回答问题
#自动生成...
```




## 更新历史
2017.8.10 
- 增加可配置内容(indent，dir)
- 增加命令行参数的功能

## License

MIT

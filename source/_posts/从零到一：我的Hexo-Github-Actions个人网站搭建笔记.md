---
title: 从零到一：我的Hexo+Github Actions个人网站搭建笔记
date: 2025-12-30 16:06:10
tags:
---

## 从零到一：我的Hexo+Github Actions个人网站搭建笔记

### 0.前言

事先声明，本人基本上可以算是一个电脑小白，本篇笔记所有内容都是基于知乎、b站、官网资料、Gemini及本人的网站搭建经验撰写的，我（实则是Gemini）会尽力将每一步的过程和作用讲清楚。当然如果诸位发现本文有任何错漏的地方，欢迎大家批评指正！

以下是在搭建过程中需要用到的工具的简要介绍，如果不感兴趣的话可以直接移步正文：

1. `Github`：个人网站在云端的永久房产
想象你在互联网这个大城市里买了一块地，`GitHub`就是提供这块地的房产商。它不仅帮你存着网站的所有代码，还免费提供了一个名为`GitHub Pages`的橱窗，让全世界的人都能通过网址看到你的装修成果。

2. `Node.js`：电脑和程序之间的翻译官
`Hexo`是使用`JavaScripts`语言编写的计算机程序，而计算机的底层逻辑是二进制语言。当你在`Hexo`执行某个操作后就需要`Node.js`将`JavaScripts`语言翻译成计算机能理解的二进制语言。

3. `Git`：本地和云端存档间的搬运工
`Git`的工作主要有两件：一是把你本地写好的文章上传到`GitHub`的仓库里去；二是它会像录像机一样记下你每次的改动。如果你哪天把网站改坏了，`Git`能帮你“一键回滚”到还没坏的时候。

4. `Hexo`：把蓝图变成实物的装修工
我们写博客需要使用`Markdown`文本，但是这种文本直接放在网上并不好看。而`Hexo`能把这些纯文字变成带菜单、带排版、带样式的精美网页（不会`Markdown`的网上随便搜索点教程，半小时就能学会）。

---

### 1.环境准备

①进入[Github官网]创建一个账号并登录，找到`Repositories`点击`New`新建一个名为`username.github.io`的个人仓库，这里的`username`必须是你的Github账户名，仓库可见性必须设置为`Public`。


②参考[Node.js视频安装配置教程]安装Node.js，当然你也可以尝试[Hexo官方文档]的方法安装（如果你使用官方文档的方法成功搭建了个人网站恳请评论告知，我会更新这一步安装方法，因为相比之下视频的安装方法实在是太麻烦了）


③进入[Git官网下载页面]下载并安装对应版本的`Git`（选择自己想要的安装目录，其余保持默认即可）。


④若初次使用`Git`请在开始菜单栏中搜索`cmd`选择以管理员身份运行，在弹出的终端中依次执行以下命令配置用户名和邮箱信息（这里的`username`和`useremail`需要和你的`Github`账户一样）

```cmd
git config --global user.name "username"
git config --global user.email "useremail"
```

⑤在命令行执行以下命令弹出相关信息后直接回车，在`C:\Users\Username\.ssh`目录下会生成ssh密钥文件，复制`id_rsa.pub`文件中的所有内容。

```cmd
ssh-keygen -t rsa -C "useremail"
```


⑥找到`Github`个人仓库的`Deploy keys`界面将复制的内容粘贴到`Key`框中，`Title`随意即可，点击`Add key`。


---

### 2.Hexo搭建本地博客

①以管理员身份打开终端，执行以下命令安装`Hexo`

```cmd
npm install hexo-cli -g
```

②在自己想要的路径下创建一个文件夹作为站点本地源文件的上级目录，在该目录下执行命令`hexo init sitename`从`Hexo`官网下载最基础的博客模板，这里`sitename`是你自己想要取的站点目录的名字。


③进入站点目录执行命令`npm install`安装博客运行所需的依赖包


④执行命令`hexo s`启动本地服务器进行测试，默认网址为`http://localhost:4000/`，可以打开浏览器搜索该网址检查本地博客是否搭建成功（按`Ctrl+C`中断测试）


---

### 3.网站部署

①在站点目录下找到并打开站点配置文件`_config.yml`，找到`url`字段的值，修改为`https://username.github.io`
②在站点目录下依次执行以下命令，分别实现：将站点源码纳入`git`版本控制系统中成为本地仓库、添加文件到暂缓区、进行第一次提交使其产生`master`分支、将本地分支名改为与`Github`相同的`main`、将`GitHub`仓库`username.github.io`设为默认远程仓库

```cmd
git init
git add .
git commit -m "initial commit"
git branch -m master main
git remote add origin https://github.com/username/username.github.io.git
```

③找到`Github`个人仓库的`Pages`页面，将`Source`改为`Github Actions`


④在进入站点目录下`.sitename`文件夹中创建文件夹`workflows`，在该文件夹下创建文件`pages.yml`并写入以下内容

```yml
name: Pages

on:
  push:
    branches:
      - main # default branch

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          submodules: recursive
      - name: Use Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: "20"
      - name: Cache NPM dependencies
        uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.OS }}-npm-cache
          restore-keys: |
            ${{ runner.OS }}-npm-cache
      - name: Install Dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public
  deploy:
    needs: build
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

⑤依次执行以下命令保存提交并推送到远程仓库，推送会触发`Actions`，可以在远程仓库的Actions页面查看自动部署进度

```cmd
git add .
git commit -m "init site"
git push -u origin main
```

⑥打开浏览器输入你的网站地址`https://username.github.io/`检查网站部署是否成功

---

### 4.撰写文章

在终端执行命令`hexo n "blogname"`这将在你的站点目录下的`_posts`文件夹下生成名为`blogname.md`的Markdown文件，在这个md文件中编写完你的博客后提交保存并推送到远程仓库即可。对于新手小白而言个人更推荐[Git基础教程]的方式在VsCode中进行创作。

### 5.网站优化

#### 5.1 更换主题

#### 5.2 插入图片

#### 5.3 插入公式

---

### 6.参考资料

本文主要参考资料：
知乎**青羽**的《一小时搭建自己的个人网站》：https://zhuanlan.zhihu.com/p/78467553?share_code=15EEKNf6f26on&utm_psn=1988735836959809917
其他参考资料：
**Hexo**官方文档：https://hexo.io/zh-cn/docs/
b站**爬虫孙大圣**的《Nodejs安装零基础教程2025》：https://www.bilibili.com/video/
b站**HDAlex_Jhon**的《给傻子的Git教程》：https://www.bilibili.com/video/BV1Hkr7YYEh8?
最后感谢Gemini！感谢伟大的互联网精神！

![2025-12-31-03-42-09.png](2025-12-31-03-42-09.png)

[Github官网]:https://github.com/
[Node.js视频安装配置教程]:https://www.bilibili.com/video/BV1sbjgzwEBX?vd_source=1b606c48397af663676c9ef6bea963a2
[Hexo官方文档]:https://hexo.io/zh-cn/docs/
[Git官网下载页面]:https://git-scm.com/install/
[Git基础教程]:【给傻子的Git教程】https://www.bilibili.com/video/BV1Hkr7YYEh8?vd_source=1b606c48397af663676c9ef6bea963a2

---
title: 从零到一：我的Hexo+Github Actions个人网站搭建笔记
date: 2025-12-30 16:06:10
tags:
mathjax: true
---

## 0.前言

事先声明，鄙人基本上可以算是一个电脑小白，本篇笔记所有内容都是基于知乎、b站、官网资料、Gemini及本人的网站搭建经验撰写的，我（实则是Gemini）会尽力将每一步的过程和作用讲清楚。当然如果诸位发现本文有任何错漏的地方，欢迎大家批评指正！这是搭建完成后[我的个人网站主页]。

以下是在搭建过程中需要用到的工具的简要介绍，如果不感兴趣的话可以直接移步正文：

1. Github：个人网站在云端的永久房产
想象你在互联网这个大城市里买了一块地，GitHub就是提供这块地的房产商。它不仅帮你存着网站的所有代码，还免费提供了一个名为`GitHub Pages`的橱窗，让全世界的人都能通过网址看到你的装修成果。

2. Node.js：电脑和程序之间的翻译官
Hexo是使用`JavaScript`语言编写的计算机程序，而计算机的底层逻辑是二进制语言。当你在`Hexo`执行某个操作后就需要Node.js将`JavaScript`语言翻译成计算机能理解的二进制语言。

3. Git：本地和云端存档间的搬运工
Git的工作主要有两件：一是把你本地写好的文章上传到GitHub的仓库里去；二是它会像录像机一样记下你每次的改动。如果你哪天把网站改坏了，Git能帮你“一键回滚”到还没坏的时候。

4. Hexo：把蓝图变成实物的装修工
我们写博客需要使用`Markdown`文本，但是这种文本直接放在网上并不好看。而Hexo能把这些纯文字变成带菜单、带排版、带样式的精美网页（不会`Markdown`的网上随便搜索点教程，半小时就能学会）。

---

## 1.环境准备

①进入[Github官网]创建一个账号并登录，找到`Repositories`点击`New`新建一个名为`username.github.io`的个人仓库，这里的`username`必须是你的Github账户名，仓库可见性必须设置为`Public`。

![2025-12-31-04-08-47.png](2025-12-31-04-08-47.png)

>注：这里Description和Add READMD可选可不选

②参考[Node.js视频安装配置教程]安装Node.js，当然你也可以尝试[Hexo官方文档]的方法安装

![2025-12-31-04-09-38.png](2025-12-31-04-09-38.png)

>注：如果你使用官方文档的方法成功搭建了个人网站恳请评论告知，我会更新这一步安装方法，因为相比之下视频的安装方法实在是太麻烦了

③进入[Git官网下载页面]下载并安装对应版本的Git

![2025-12-31-04-09-56.png](2025-12-31-04-09-56.png)

>注：安装过程中只需修改安装目录，其余保持默认即可

④若初次使用Git请在开始菜单栏中搜索`cmd`选择以管理员身份运行，在弹出的终端中依次执行以下命令配置用户名和邮箱信息，这里的`username`和`useremail`需要和你的Github账户一样

```cmd
git config --global user.name "username"
git config --global user.email "useremail"
```

⑤在命令行执行以下命令弹出相关信息后直接回车，在`C:\Users\Username\.ssh`目录下会生成ssh密钥文件，复制`id_rsa.pub`文件中的所有内容。

```cmd
ssh-keygen -t rsa -C "useremail"
```

![2025-12-31-04-10-26.png](2025-12-31-04-10-26.png)

⑥找到`Github`个人仓库的`Deploy keys`界面将复制的内容粘贴到`Key`框中，`Title`随意即可，点击`Add key`。

![2025-12-31-04-11-01.png](2025-12-31-04-11-01.png)

---

## 2.Hexo搭建本地博客

①以管理员身份打开终端，执行以下命令安装`Hexo`

```cmd
npm install hexo-cli -g
```

>注：本节按理说应该不用管理员身份，不过保险点用管理员身份应该也不会出现什么大错

②在自己想要的路径下创建一个文件夹作为站点本地源文件的上级目录，在该目录下执行命令`hexo init sitename`从`Hexo`官网下载最基础的博客模板，这里`sitename`是你自己想要取的站点目录的名字。

![2025-12-31-04-11-38.png](2025-12-31-04-11-38.png)

③进入站点目录执行命令`npm install`安装博客运行所需的依赖包

![2025-12-31-04-11-51.png](2025-12-31-04-11-51.png)

④执行命令`hexo s`启动本地服务器进行测试，默认网址为`http://localhost:4000/`，可以打开浏览器搜索该网址检查本地博客是否搭建成功（按`Ctrl+C`中断测试）

![2025-12-31-04-12-30.png](2025-12-31-04-12-30.png)

>注：科学上网的时候应该是打不开这个页面的

---

## 3.网站部署

①在站点目录下找到并打开站点配置文件`_config.yml`，找到`url`字段的值，修改为`https://username.github.io`
②在站点目录下依次执行以下命令，分别实现：将站点源码纳入git版本控制系统中成为本地仓库、添加文件到暂缓区、进行第一次提交使其产生master分支、将本地分支名改为与Github相同的main、将GitHub仓库`username.github.io`设为默认远程仓库

```cmd
git init
git add .
git commit -m "initial commit"
git branch -m master main
git remote add origin https://github.com/username/username.github.io.git
```

>注：
a. 在以前Github的默认分支名也是master，但是后来改为了main，所以这里为了统一把Hexo本地master分支改为main
b. 因为在你进行第一次提交前你的本地仓库不会生成master分支，所以在修改分支名前需要先进行一次提交

③找到Github个人仓库的`Pages`页面，将`Source`的内容改为`Github Actions`

![2025-12-31-04-12-54.png](2025-12-31-04-12-54.png)

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

## 4.更新文章

由于本人习惯用VScode来编写`Markdown`文档，所以后面的很多配置都是针对VScode的，另外为了更好地编写我们的`Markdown`文档请在VScode中自行安装好`Markdown Preview Enhance`、`Markdown All in One`和`Paste Image`插件。首先我们需要打开cmd依次执行类似以下命令，这样能保证后续文章能顺利上传到github仓库，这里的`http://127.0.0.1:7890`需要替换为你自己的代理工具的端口（不会科学上网的自己简单去搞一下）。

```cmd
git config --global http.proxy http://127.0.0.1:7890 
git config --global https.proxy http://127.0.0.1:7890 
```

>注：如果你开启了全局代理，你完全不需要这一步就能顺利上传文件，但是个人还是推荐设置一下反正也就两行代码的事，不怕一万就怕万一好吧。如果以后不用代理了，或者更换了代理端口，需要执行`git config --global --unset http.proxy`来取消设置，否则Git会报错。

完成了代理设置就可以撰写文章了，以下介绍鄙人撰写文章的一般流程：
①用VScode打开本地站点文件夹，找到`sitename/source/_posts/`文件夹，在目录下新建文件`articlename.md`，开头写入类似以下内容，后面正常用`Markdown`通用语法撰写文章即可，如果你的文章里需要有图片或公式那还需要另外的配置，详见本文第五节网站优化。

```md
---
title: articlename
---
```

>注：这部分内容为Hexo中的`Front-matter`，你可以在`Front-matter`中添加更多的内容以实现更多的功能，详见[Hexo官方文档Front-matter页面]。

②编写并保存完文章后在VScode终端调出`cmd`窗口，执行`hexo s`命令，在浏览器打开`http://localhost:4000/`网页检查文章是否符合预期。

>注：虽然VScode终端默认是powershell，但是cmd可以绕过很多权限问题，所以这里推荐的是cmd。

③打开侧边栏`源代码管理`，在更改框中可以任意填写你想要的的`commitname`点击提交，提交成功后按钮变成推送，点击推送待Github部署成功后即可刷新自己的个人网页查看是否成功上传

![2025-12-31-05-45-13.png](2025-12-31-05-45-13.png)

>注：VScode的汉化我记得是安装一个名为`Chinese (Simplified) (简体中文) Language Pack for Visual Studio Code`的插件后重启软件即可

## 5.网站优化

### 5.1 更换主题

在Hexo中有许多国内外大佬上传的主题模板，你可以在Hexo主题页面找到自己喜欢的主题，进入对应的Github网址查看如何将使用这个主题（操作基本都差不多），以下以鄙人用的`Bamboo`为例讲解如何更换主题。
①用VScode打开本地站点文件夹，然后调出cmd终端
②执行命令`npm install hexo-theme-bamboo`安装主题包
③执行以下命令将主题配置文件复制为站点目录下名为`_config.bamboo.yml`的文件

```cmd
copy node_modules/hexo-theme-_config.yml _config.bamboo.yml
```

④打开站点配置文件`_config.yml`，找到`theme`字段将其值改为`true`
⑤（可选）找到`title`字段将其值改为你想要的`sitetitle`，找到`author`字段将其值改为你想要的`authorname`，找到`language`字段将其值改为`zh-CN`，找到`timezone`字段将其值改为`Asia/Shanghai`
⑥执行命令`hexo clean`和`clean s`清理内存并预览

>注：
a. 第二步你也可以使用git clone安装主题包，不过后续的操作就不同了。个人觉得npm更稳定一点，所以推荐使用npm。
b. 第三步的复制操作你也可以直接在文件夹下通过互联网神技CV工程技术来完成

### 5.2 插入图片

①打开站点配置文件，找到`post_asset_folder: false`将其改为以下内容

```yml
post_asset_folder: true
marked:
  prependRoot: true
  postAsset: true
```

>注：
a. `post_asset_folder: true`开启资源文件夹，当你运行hexo n "articlename" 时Hexo除了生成articlename.md文件，还会同步生成一个同名的文件夹articlename/用于存放文档资源
b. `prependRoot: true`会根据你在`_config.yml`中配置的url和root路径，自动在所有相对地址前加上前缀，保证了无论你的博客部署在哪里，资源路径始终是绝对正确的。
c. `postAsset: true`默认情况下，标准`Markdown`语法`![](imagename.png)`只是简单的`HTML`转换。如果你开启了资源文件夹，Hexo在该路径下找不到图片。开启此项后，Hexo会自动去文章同名的资源文件夹里寻找`imagename.png`
d. Hexo的标准图片引用格式为`{% asset_img imagepath/imagename.png %}`，而`Markdown`的标准图片引用格式为`![](imagepath/imagename.png)`，开启资源文件夹功能后Hexo就能自动将`Markdown`的标准图片引用格式转换为自己的引用格式

②在VScode中按`Ctrl+Shift+P`搜索选择`首选项：打开用户设置(JSON)`打开VScode的配置文件在最外层大括号内添加如下内容（注意缩进）

```json
    //----------------------Paste Image配置（迎合Hexo图片格式，Ctrl+Alt+V）----------------------
    "pasteImage.path": "${currentFileNameWithoutExt}/",
    "pasteImage.insertPattern": "![${imageFileName}](${imageFileName})",

    //----------------------VSCode原生图片粘贴功能配置（Ctrl+V）----------------------
    "markdown.copyFiles.destination": {
        "**/_posts/*.md": "${documentBaseName}/"
    }
```

>注：
a. 如果配置文件大括号中已经有内容了记得在已有内容末尾加上英文逗号
b. 以上`Paste Image配置`实现两个功能，第一当你使用`Ctrl+Alt+V`在你的Markdown中粘贴图片时，它会自动在文档所在目录下新建文档同名目录并将图片放入该目录内；第二因为开启了`postAsset: true`，所以你的图片引用格式只需要写成`![](imagename.png)`而不是`![](articlename/imagename.png)`，而`Image Paste`会粘贴图片为后者的形式，所以第二行的配置就是让`Image Paste`将图片粘贴为前者的形式
c. `VSCode原生图片粘贴功能配置`其实就是实现`Paste Image配置`中的第一个功能，遗憾的是我并没有找到该如何实现第二个功能，所以如果你用`Ctrl+V`粘贴图片它将不会被Hexo识别。聪明的你也许会想到可以关闭`postAsset`这样Hexo不会在进入文档同名文件夹再根据我们提供的路径来寻找图片，这样的话`Paste Image配置`还可以少一行配置，但事实上因为`HTML`转换的问题这是不行的具体这里就不解释了

③在VScode中按`Ctrl+Shift+P`搜索选择`MPE：扩展Parser（工作区）`，打开MPE的parser.js配置文件，将其中

```js
  onWillParseMarkdown: async function(markdown) {
    return markdown;
  },
```

改为

```js
  onWillParseMarkdown: async function(markdown) {
    let folderName = "";

    // 1. 提取标题并模拟Hexo的连字符逻辑 (Slugify)
    const titleMatch = markdown.match(/^title:\s*["']?(.*?)["']?\s*$/m);
    if (titleMatch) {
      folderName = titleMatch[1].trim()
        .replace(/[\s\+]+/g, '-')  // 把空格和+变成-
        .replace(/-+/g, '-');      // 连续的-合并为一个
    }

    // 2. 执行替换
    // 添加^锚点并开启多行模式(m标志)，这样它只会匹配【以!开头】或者【空格后紧跟!】的行
    const newMarkdown = markdown.replace(
      /^(\s*!\[.*?\]\()(?!(?:http|https|\/|[.][\\/]|.*[\\/]))(.+?)(\))/gm,
      (match, p1, p2, p3) => {
        // Windows 环境下本地预览，直接拼接通常比编码更稳
        return `${p1}${folderName}/${p2}${p3}`;
      }
    );

    return newMarkdown;
  },
```

>注：
a. 在你完成了前两步的配置后你会发现一个很恶心的问题：当你开启文件夹资源后Hexo要求你的`Markdown`图片引用格式里路径省略`articlename/`，但是你要在VScode预览成功加载图片的话你的路径里就不能省略这个东西，也就是说你无法兼顾Hexo的图片渲染和VScode图片预览。虽然说你可以直接抛弃VScode的图片预览，这并不会对我们的网站造成任何影响，但是我个人还是无法接受。所以我们就需要这一步对MPE（Markdown Preview Enhanced）的配置，这样配置的话在预览前MPE会自动获取我们在`Front-matter`中`title`的值然后与图片名拼接成完整路径`titlename/imagename.png`，所以你需要保证`title`里的值和文件名（无后缀）是一样的。不过如果你直接把光标悬停在图片引用代码上它还是无法加载，只有打开右侧预览界面才能正常加载。如果各位有更好的方法欢迎评论交流。
b. Hexo对标题转换成文件夹名时会进行slugify（即你脚本里写的把空格和加号变横杠）。如果用户在标题里用了中文符号，Hexo通常会默认保留。

### 5.3 插入公式

相较而言Hexo的公式插入就简单的多了，在每篇文档的`Front-matter`中设置`mathjax: true`即可用latex语法添加公式了，以下是一个示例。
公式代码：

```latex
$$i\hbar\frac{\partial}{\partial t}\psi({\bf r},t)=(-\frac{\hbar^2}{2m}\nabla^2+V)\psi({\bf r},t)$$
```

公式效果：
$$i\hbar\frac{\partial}{\partial t}\psi({\bf r},t)=(-\frac{\hbar^2}{2m}\nabla^2+V)\psi({\bf r},t)$$

---

## 6.参考资料

本文主要参考资料：
知乎**青羽**的《一小时搭建自己的个人网站》：<https://zhuanlan.zhihu.com/p/78467553>
其他参考资料：
**Hexo**官方文档：<https://hexo.io/zh-cn/docs/>
b站**爬虫孙大圣**的《Nodejs安装零基础教程2025》：<https://www.bilibili.com/video/>
b站**HDAlex_Jhon**的《给傻子的Git教程》：<https://www.bilibili.com/video/BV1Hkr7YYEh8?>
最后感谢Gemini！感谢伟大的互联网精神！

[我的个人网站主页]:https://mcxyzmc.github.io
[Github官网]:https://github.com/
[Node.js视频安装配置教程]:https://www.bilibili.com/video/BV1sbjgzwEBX?vd_source=1b606c48397af663676c9ef6bea963a2
[Hexo官方文档]:https://hexo.io/zh-cn/docs/
[Hexo官方文档Front-matter页面]:https://hexo.io/zh-cn/docs/front-matter
[Git官网下载页面]:https://git-scm.com/install/

---
title: LaTeX 学习笔记（一）
mathjax: true
swiper: false
top: false
date: 2026-03-27 15:22:04
updated:
tags:
categories:
---

## 前言

&emsp;&emsp;本文为笔者的 $\LaTeX$ 学习笔记，笔记内容主要来源于 B 站 up 主 无限三十年 的视频教程[简明 LaTeX 教程]，环境配置为：`Window 11` + `TexLive` + `VSCode`，`VSCode` 安装插件 `LaTeX Workshop`、`LaTeX Utilities`，安装配置教程参见知乎博主 Ali-Ioner 的文章[Visual Studio Code (vscode)配置LaTeX]。

## 1. $\LaTeX$ 简介

&emsp;&emsp;在学习 LaTeX 的过程中经常会碰到一些和 TeX 相关的词，所以首先明确以下几个概念：

1. TeX 与 LaTeX

   - TeX：TeX 是由斯坦福大学教授 Donald Knuth 于 1978 年开发的底层排版引擎和宏语言，它是一套极度精确的算法和底层指令。
   - LaTeX：LaTeX 则是建立在 TeX 之上的宏集，它通过封装 TeX 的底层指令提供了一系列高层排版指令。

2. PDFLaTeX、XeLaTeX、LuaTeX

    &emsp;&emsp;这三者是当前最主流的 LaTeX 编译器，它们决定了如何处理字体、编码及输出格式。
   - PDFLaTeX：PDFLaTeX 是目前最成熟、速度最快的编译器，它可以跳过 DVI 步骤直接生成 PDF。
   - XeLaTeX：XeLaTeX 原生支持 Unicode 和 OpenType/TrueType 字体，使用该编辑器可以编译代码中的中文字符并直接调用电脑里的字体库。
   - LuaTeX：LuaTeX 是 TeX 家族的官方继任者，它在引擎中嵌入了 Lua 脚本引擎。通过 Lua ，开发者可以干预排版的底层过程，这使得它比 XeLaTeX 灵活得多。

3. TeXLive 与 MiKTeX

    &emsp;&emsp;TeXLive 和 MiKTeX 是目前 Windows 系统下最主流的两个 $\LaTeX$ 软件包，这个软件包里包含了几千个宏包、各种字体、所有编译引擎以及文献管理工具。
   - TeXLive：TeXLive 会把 CTAN（TeX 宏包官方仓库）上几乎所有的宏包、字体和文档全部下载下来。这意味着安装后即使处于离线环境也能搞定任何复杂的排版，不用担心缺包。这使得它在 Windows、Linux、macOS 上的表现出高度一致，非常适合多人协作，能保证不同设备编译出的结果完全相同。相应的它的缺点就是占据的空间比较大，安装过程比较缓慢。
   - MiKTeX：MiKTeX 只安装最基础的组件，编译文档发现缺少某个宏包时，会弹出提示下载安装后再继续编译。MiKTeX 的优缺点与 TeXLive 恰恰相反,MiKTeX 的初次安装非常快且占用空间小，非常适合硬盘空间有限或网络环境较好的用户。但是，在没有网络的情况下，遇到缺包就会编译失败；此外，在大规模自动化部署或多人协作时，由于各人安装的宏包版本不一，偶尔会产生兼容性问题。

4. BibTeX

    &emsp;&emsp;BibTeX 既是一种工具也是一种文件格式（.bib），它专门负责处理文档末尾的参考文献。只需要在一个 `.bib` 文件中维护文献数据库并在 LaTeX 源码中通过相应的命令引用，BibTeX 就会自动根据指定的央视提取并格式化这些文献。

5. LaTeXmk

    &emsp;&emsp;LaTeXmk 是一个 Perl 脚本，排版一个复杂的 LaTeX 文档通常需要多次编译，而LaTeXmk 能自动检测文档依赖，然后根据需要自动运行多次 LaTeX、BibTeX 等，直到所有交叉引用和参考文献都正确对齐。它极大简化了用户的工作流，现在的编辑器底层通常都默认调用 LaTeXmk。

&emsp;&emsp;简而言之，$\LaTeX$ 是一种基于 $\TeX$ 的文档排版系统，把标记语言编译成 pdf 文档。相较于“所见即所得”模式的 Word 来说，使用 $\LaTeX$ 撰写并排版文章的难度会高很多，排版格式的修改也比较复杂。但是对于熟练掌握 $\LaTeX$ 的人来说，使用 $\LaTeX$ 能够精确、快速地对长文本格式进行批量处理，产出更加专业、精美的文档。$\LaTeX$ 可以通过网页在线编译也可以通过配置好的本地环境进行使用。在线环境的优点在于简单、开箱即用，不用关心环境问题，不受设备限制，而且可以在线协同；其缺点在于受网络限制，需要注册，资源受限，可能存在数据安全问题等。学习或者只写一些简单文档可以使用在线环境，比如 [overleaf]、[texpage]等，目前比较推荐是 overleaf。在实际使用中往往不需要从零开始排版文章，可以寻找模板，掌握模板的使用后向其中填充内容就好了。模板可以在 overleaf 上找到，也可以在 [ctan] 上找到，甚至可以直接浏览器搜索。

&emsp;&emsp;目前网络上有大量的 LaTeX 学习资料，这里给出四本推荐书籍：Tobias Oetiker 等人编著的《一份（不太）简短的 $\LaTeX 2\epsilon$ 介绍》（ CTEX 开发小组翻译的中文版）、包太雷的《$\LaTeX$ NOTES 雷太赫排版系统简介》、刘海洋的《$\LaTeX$ 入门》及胡伟编著的《$\LaTeX 2\epsilon$ 完全学习手册》。以下是相关网络资料：

```bash
LaTex-Project：https://www.latex-project.org/
LaTex 工作室：https://www.latexstudio.net/
文档网址：https://texdoc.org/
英文社区：https://tex.stackexchange.com/
英文教程：https://www.learnlatex.org/en/
清华大学开源镜像网站：https://mirrors.tuna.tsinghua.edu.cn/CTAN/
```

&emsp;&emsp;此外，配置好本地环境后还可以在终端执行命 `texdoc <package name>` 查看本地文档。

## 2. 文字基础排版与控制

### 2.1 源代码结构

```latex
\documentclass{<class name>}    % 本文中<>内为需要替换的参数内容

\begin{document}

\end{document}
```

&emsp;&emsp;$\LaTeX$ 源代码以一个 `\documentclass` 命令作为开头，它制定了文档使用的文档类，`document` 环境中的内容是文档正文。在 `\documentclass` 和 `\begin{document}` 之间的位置称为导言区，在导言区中常使用 `\usepackage` 命令调用宏包，还会进行文档的全局设置。

|class name|解释|
|:---:|---|
|article|文章格式文档类，没有 chapter 的概念，最高层级是 section|
|report|长报告格式文档类，支持 chapter|
|book|书籍文档类，包含章节结构、前言、正文、后记等，且默认采用双面打印布局|
|ctexart|article 的中文版文档类|
|ctexrep|report 的中文版文档类|
|ctexbook|book 的中文版文档类|
|beamer|幻灯片文档类，功能极其强大，支持动态显示、各种主题排版|

&emsp;&emsp;中文环境的设置有两种方法：

1. 使用支持中文的文档类
2. 导入支持中文的宏包，如 `ctex`

&emsp;&emsp;$\LaTeX$ 中 `& % $ # _ { } ~ ^ \` 都具有特殊含义无法直接在文档中输出，其中前六个可以通过在前面加转义字符 `\` 来输出，比如注释字符 `%` 可以通过 `\%` 输出，剩下的的四个则需要通过特殊方式输出：

| 字符 | 错误写法 | 错误原因 | 正确写法） |
| :---: | :---: | :---: | :---: |
| 反斜杠 `\` | `\\` | 这是“换行”命令 | `\textbackslash` |
| 波浪号 `~` | `\~` | 这是给字母加变音符号（如 `\~n` 得到 ñ） | `\textasciitilde` 或 `\~{}` |
| 插入符号 `^` | `\^` | 这是给字母加变音符号（如 `\^e` 得到 ê） | `\textasciicircum` 或 `\^{}` |
| 竖线 `\|` | `\|` | 在数学模式下是双竖线，文本中有时失效 | `\textbar` |

### 2.2 标题、作者、日期

&emsp;&emsp;文档类中已经定义了标题、作者及日期的格式，只需要在导言区使用相应命令定义内容，在正文区中使用命令 `maketitle` 指定位置即可：

1. 标题：

    ```latex
    \title{<title name>}
    ```

2. 作者：

    ```latex
    \author{<author name>}
    \author{<author name1> \and <author name2>}     % 多个作者并列
    \author{<author name>\thanks{text}}           % 附加信息（显示在页脚）
    ```

3. 时间：其中 value 可以是某个日期或者 `\today` 自动获取当天日期

    ```latex
    \date{value}
    ```

### 2.3 换行、分段、空格

&emsp;&emsp;在 $\LaTeX$ 中通过 `Space` 或 `Enter` 键来实现换行和空格是无法实现的需要通过以下方式实现：

1. 换行：在行末添加 `\\` 或 `\newline`
2. 分段：在段落之间添加至少一个空行或 `\par`
3. 空格：

   - 水平空格：

    ```latex
    \hspace{value + unit}
    \quad               % 等价于 \hspace{1em}
    \qquad              % 等价于 \hspace{2em}
    ```

   - 垂直空格：

    ```latex
    \vspace{value + unit}
    ```

    > 注：`unit` 可以是 `em`、`pt`、`cm`、`ex` 等，如果 `value` 为 1 则分别代表在中文环境下一个字符的宽度、一磅字号大小、1 厘米、英文环境下一个字符 `x` 的高度

### 2.4 对齐方式、取消缩进、行距

1. 对齐方式：

    ```latex
    \begin{center} ... \end{center}         % 居中对齐
    \begin{flashleft} ... \end{flashleft}   % 左对齐
    \begin{flashright} ... \end{flashright} % 右对齐
    ```

2. 取消缩进

    ```latex
    \parindent=0pt                  % 放在导言区取消全局缩进
    \setlength{\parindent}{0pt}     % 放在导言区取消全局缩进
    \noindent                       % 放在正文区取消局部缩进
    ```

3. 行距

    1. `linespread` 命令设置行距

        ```latex
        \linespread{value}                      % 放在导言区设置全局行距，value 默认为 1.3
        \linespread{value}\setfont             % 放在正文区设置从当前行开始的行距
        {\linespread{value}\setfont ... \par}  % 放在正文区设置该花括号内行距，行距设置需要分段才能生效所以末尾需要 \par
        ```

    2. `setspace` 宏包设置行距：需先在导言区 `\usepackage{setspace}` 导入宏包

        ```latex
        \singlespacing                              % 放在导言区设置全局单倍“行距”
        \onehalfspacing                             % 放在导言区设置全局 1.5 倍“行距”
        \doublespacing                              % 放在导言区设置全局双倍“行距”
        \setstretch{value}                          % 放在导言区设置全局行距
        \begin{spacing}{value} ... \end{spacing}    % 放在正文区设置该花括号内行距
        ```

        &emsp;&emsp;一般情况下，N 倍行距 = N * 基础行距，word 基础行距 = 1.3 * 字号大小，latex 基础行距 = 1.2 * 字号大小；但使用 `\singlespacing`、`\onehalfspacing`、`\doublespacing` 设置行距时，N 倍行距 = N * 字号大小。

### 2.5 字号与字体

1. 字号
   1. 文档类命令选项设置基础字号

        ```latex
        \documentclass[value + pt]{<class name>}  % 这里的 value 只能取 10/11/12，默认为 11
        ```

   2. 尺寸命令设置字号

        ```latex
        \<fontsize name>                               % 在正文区使用设置在此之后字号，如果放在某个小环境里则只影响小环境字号
        {\<fontsize name> ... }                        % 在正文区使用设置该花括号内字号
        \begin{<fontsize name>} ... \end{<fontsize name>} % 在正文区使用设置该环境内字号
        ```

        &emsp;&emsp;`fontsize name` 实际大小与文档类选项中定义的基础字号有关，可取值及对应关系见下表：

        ![ ](image.png)

   3. `fontsize` 命令设置字号

        ```latex
        \fontsize{value1 + unit}{value2 + unit}\selectfont  % 在正文区使用设置在此之后字号
        {\fontsize{value1 + unit}{value2 + unit}\selectfont ... }   % 在正文区使用设置该花括号内字号
        ```

        &emsp;&emsp;`value1` 设置字号大小，`value2` 设置基础行距。

   4. `zihao` 命令设置中文字号：需使用中文文档类或引入中文宏包

        ```latex
        \zihao{value}           % 在正文区使用设置在此之后字号
        {\zihao{value} ... }    % 在正文区使用设置该花括号内字号
        ```

        &emsp;&emsp;`value` 可取值及对应关系见下表：

        ![ ](image-1.png)

2. 字体
    1. LaTeX 内置英文字体设置

        ```latex
        \<firstlinefont name>                                       % 在正文区使用设置在此之后字体，如果放在某个小环境里则只影响小环境字体
        {\<firstlinefont name> ... }                                % 在正文区使用设置该花括号内字体
        \begin{<firstlinefont name>} ... \end{<firstlinefont name>} % 在正文区使用设置该环境内字体
        \<secondlinefont name>{ ... }                               % 在正文区使用设置该花括号内字体
        ```

        &emsp;&emsp;`firstlinefont name` 可取值见下表第一列，`secondlinefont name` 可取值见下标第二列（默认为衬线字体）：

        ![ ](image-2.png)

    2. 系统英文字体设置：需导入 `fontspec` 宏包

        ```latex
        \setmainfont{<font name>}        % 在导言区使用将衬线字体替换成 font name 字体
        \setsansfont{<font name>}        % 在导言区使用将无衬线字体替换成替换成 font name 字体 
        \setmonofont{<font name>}        % 在导言区使用将等宽字体替换成 font name 字体
        \fontspect{<font name>}          % 在正文区使用设置在此之后字体
        {\fontspect{<font name>} ... }   % 在正文区使用设置该花括号内字体
        ```

        &emsp;&emsp;除此之外，在导言区通过 `\newfontfamily{<cmd name>}{<font name>}` 自定义字体命令后就可以在正文区使用自定义命令设置字体，其中 `cmd name` 为自定义命令名，`font name` 为对应字体名，如：

        ```latex
        \documentclass{article}

        \usepackage{fontspec}
        \newfontfamily{\newroman}{Times New Roman}
        \newfontfamily{\arial}{Arial}

        \begin{document}
        \newroman
        I am happy to join with you today in what will go down in history as the greatest demonstration for freedom in the history of our nation.

        {\arial
        Five score years ago, a great American, in whose symbolic shadow we stand today, signed the Emancipation Proclamation. This momentous decree came as a great beacon light of hope to millions of Negro slaves who had been seared in the flames of withering injustice. It came as a joyous daybreak to end the long night of their captivity.}

        But one hundred years later, the Negro still is not free. One hundred years later, the life of the Negro is still sadly crippled by the manacles of segregation and the chains of discrimination. One hundred years later, the Negro lives on a lonely island of poverty in the midst of a vast ocean of material prosperity. One hundred years later, the Negro is still languished in the corners of American society and finds himself an exile in his own land. And so we've come here today to dramatize a shameful condition.
        \end{document}
        ```

        &emsp;&emsp;编译结果如图：

        ![ ](image-3.png)

        >注： \
        ① `font name` 必须以 `\` 为开头并避免与已有命令冲突 \
        ② 在终端执行命令 `fc-list "%{family}\n"` 查看系统所有字体

    3. 中文字体设置（中文文档类或宏包会自动加载系统字体，所以不需要额外引入宏包）

        ```latex
        \setCJKmainfont{<font name>}        % 在导言区使用将衬线字体替换成 font name 字体
        \setCJKsansfont{<font name>}        % 在导言区使用将无衬线字体替换成替换成 font name 字体 
        \setCJKmonofont{<font name>}        % 在导言区使用将等宽字体替换成 font name 字体
        \CJKfontspect{<font name>}          % 在正文区使用设置在此之后字体
        {\CJKfontspect{<font name>} ... }   % 在正文区使用设置该花括号内字体
        ```

        &emsp;&emsp;除此之外，在导言区通过 `\newCJKfontfamily{<cmd name>}{<font name>}` 自定义字体命令后就可以在正文区使用自定义命令设置字体，其中 `cmd name` 为自定义命令名，`font name` 为对应字体名，如：

        ```latex
        \documentclass{ctexart}

        \newCJKfontfamily{\huawenxingkai}{华文行楷}
        \newCJKfontfamily{\huawencaiyun}{STCaiyun}

        \begin{document}

        \huawenxingkai
        永和九年，岁在癸丑，暮春之初，会于会稽山阴之兰亭，修禊事也。群贤毕至，少长咸集。此地有崇山峻岭，茂林修竹；又有清流激湍，映带左右，引以为流觞曲水，列坐其次。虽无丝竹管弦之盛，一觞一咏，亦足以畅叙幽情。

        {\huawencaiyun
        是日也，天朗气清，惠风和畅，仰观宇宙之大，俯察品类之盛，所以游目骋怀，足以极视听之娱，信可乐也。}

        夫人之相与，俯仰一世，或取诸怀抱，悟言一室之内；或因寄所托，放浪形骸之外。虽趣舍万殊，静躁不同，当其欣于所遇，暂得于己，快然自足，不知老之将至。及其所之既倦，情随事迁，感慨系之矣。向之所欣，俯仰之间，已为陈迹，犹不能不以之兴怀。况修短随化，终期于尽。古人云：“死生亦大矣。”岂不痛哉！

        \fangsong
        每览昔人兴感之由，若合一契，未尝不临文嗟悼，不能喻之于怀。固知一死生为虚诞，齐彭殇为妄作。后之视今，亦犹今之视昔。悲夫！故列叙时人，录其所述，虽世殊事异，所以兴怀，其致一也。后之览者，亦将有感于斯文。

        \end{document}
        ```

        编译结果如图：

        ![ ](image-4.png)

        >注： \
        ① 部分字体不需要自定义字体命令就可和自定义字体命令一样简便地使用，包括`\songti`、`\heiti`、`yahei`、`\fangsong`、`\kaishu`、`\lishu`、`\youyuan` 等，分别代表宋体、黑体、微软雅黑、仿宋、楷书、隶书、幼圆等 \
        ② `font name` 一般可以直接写字体中文名，如果出现问题换成对应英文名即可 \
        ③ 在终端执行命令 `fc-list "%{family}\n" :lang=zh` 查看系统所有中文字体，不过由于终端通常默认使用 GBK 编码输出，中文会变成乱码。可以先执行命令 `chcp 65001` 切换为 UTF-8 编码再执行命令就可正常输出；或者直接执行命令 `fc-list -f "%{family}\n" :lang=zh > fonts.txt` 将结果输出到文本文件然后用记事本打开

### 2.6 下划线与颜色

1. 下划线
   1. 宏包 `ulem` 设置下划线（下划线内容无法自动换行）

        ```latex
        \uline{ ... }       % 单下划线
        \uuline{ ... }      % 双下划线
        \uwave{ ... }       % 波浪线
        \dotuline{ ... }    % 点线
        \sout{ ... }        % 删除线
        \xout{ ... }        % 斜删除线
        ```

        >注：使用命令 `\usepackage[normal]{ulem}` 导入宏包

   2. 宏包 `CJKfntef` 设置下划线（下划线内容可以自动换行，跳过标点符号）

        ```latex
        \CJKunderline{ ... }    % 单下划线
        \CJKunderdblline{ ... } % 双下划线
        \CJKunderwave{ ... }    % 波浪线
        \CJKunderdot{ ... }     % 字下加点
        \CJKsout{ ... }         % 删除线
        \CJKxout{ ... }         % 斜删除线
        ```

2. 颜色：需引入宏包 `xcolor`

    ```latex
    {\color{<color name>} ... }                     % 用颜色名设定花括号内字体颜色
    {\color[rgb]{r,g,b} ... }                       % 用 0~1 取值 rgb 设定花括号内字体颜色
    {\color[HTML]{RRGGBB} ... }                     % 用十六进制 rgb 设定花括号内字体颜色
    \textcolor{<color name>}{ ... }                 % 用颜色名设定花括号内字体颜色
    \textcolor[rgb]{r,g,b}{ ... }                   % 用 0~1 取值 rgb 设定花括号内字体颜色
    \colorbox{<color name>}{ ... }                  % 用颜色名设定设定花括号内背景颜色
    \colorbox[rgb]{r,g,b}{ ... }                    % 用 0~1 取值 rgb 设定设定花括号内字体颜色
    \fcolorbox{<color name1>}{<color name2>}{ ... } % color name1 设定边框颜色，color name2 设定背景颜色
    \fxolorbox[rgb]{r1,g1,b1}{r2,g2,b2}{ ... }      % r1,g1,b1 设定边框颜色;r2,g2,b2 设定背景颜色
    ```

    >注： \
    ① 含 `box` 的命令内容无法自动换行 \
    ② 以上命令可以嵌套设置

### 2.7 纸张与页边距

&emsp;&emsp;需要导入宏包 `geometry`

```latex
\geometry{a4paper, left=2cm, right=1cm, top=1cm, bottom=2cm}    % a4 纸，左边距 2 cm，右边距 1 cm，上边距 1 cm，下边距 2 cm
\geometry{b5paper，hmargin=2cm, vmargin=1cm}                    % b5 纸，左右边距 2 cm，上下边距 1 cm
\geometry{a3paper, margin=2cm}                                  % a3 纸，边距 2 cm
```

>注：`\usepackage[landscape]{geometry}` 可以设置纸张横排

### 2.8 分页和分栏

1. 全局分栏

    ```latex
    \documentclass[twocolumn]{ctexart}  % 两栏
    ```

2. 局部分栏

    ```latex
    \twocolumn      % 在此之后的页面分两栏
    \onecolumn      % 在此之后的页面只有一栏
    ```

3. 分页

    ```latex
    \newpage        % 新开一栏（再一栏页面中等价于 \clearpage）
    \clearpage      % 新开一页
    ```

### 2.9 摘要摘录脚注边注

1. 摘要环境

    ```latex
    \begin{abstract}
    摘要内容

    \noindent{\textbf{关键词：}关键词1；关键词2；关键词3}
    \end{abstract}
    ```

2. 摘录环境（头尾缩进两个字符）

    ```latex
    \begin{quote} ... \end{quote}           % 适用于摘录短句
    \begin{quotation} ... \end{quotation}   % 适用于摘录段落，段落首行额外缩进两个字符
    \begin{verse} ... \end{verse}           % 适用于摘录诗歌，除段落首行外均额外缩进两个字符
    ```

3. 代码环境

    ```latex
    \begin{verbatim} ... \end{verbatim}     % 该环境下空格是参与排版的
    ```

4. 脚注

    ```latex
    \footnote{ ... }
    \setcounter{footnote}{0}    % 重置脚注编号
    ```

5. 边注

    ```latex
    \marginpar{ ... }
    \marginpar{\tiny ... }          % 将边注字号调整位 \tiny
    \marginpar{\footnotesize ... }  % 将边注字号调整为和脚注同样大小
    ```

### 2.10 盒子

1. `fbox`

    ```latex
    \fbox{ ... }    % 无法自动换行
    ```

    &emsp;&emsp;在此之前可以用以下命令设置盒子线宽和内边距：

    ```latex
    \setlength{\fboxrule}{value + unit}  % 设置线宽
    \setlength{\fboxsep}{value + unit}   % 设置内边距
    ```

2. `framebox` 可设置盒子宽度和对齐方式

    ```latex
    \framebox{ ... }                        % 此时等价于 \fbox{ ... }
    \framebox[<width>][<alignment>]{ ... }  % width 设置盒子宽度，alignment 设置对齐方式
    ```

    &emsp;&emsp;`alignment` 可取值包括 `l`、`c`、`r`、`s` 分别表示左对齐、居中对齐、右对齐、分散对齐。

3. `minipage` 环境可设置内外对齐方式、盒子宽度和高度

    ```latex
    \begin{minipage}[<oalign>][<height>][<ialign>]{<width>}
    ...
    \end{minipage}
    ```

    （1）`minipage` 环境本身是不带边框的，通过把它套在 `\fbox{}` 来实现边框；\
    （2）当宽度不够时盒子内容会自动换行，如果宽度足够会根据换行命令换行；\
    （3）`oalign`、`ialign` 分别为外对齐和内对齐，可取值包括 `t`、`m`、`b` 分别表示顶部对齐、居中对齐、底部对齐。

4. `rule` 设置实心盒子

    ```latex
    \rule{<width>}{<height>}
    \rule[<lift height>]{<width>}{<height>}
    ```

    &emsp;&emsp;`lift height` 设置的是盒子升降高度，正值为升、负值为降，可以实现填空下划线的效果

5. `rotatebox` 设置旋转盒子（需引入宏包 `graphicx`）

    ```latex
    \rotatebox[origin=<fixed end>]{<angle>}{ ... }
    ```

    （1）`fixed end` 为旋转固定端，可取值包括 `l`、`c`、`r` 分别表示左端固定、中心固定、右端固定；\
    （2）`angle` 表示旋转角度，逆时针旋转;\
    （3）`rotatebox` 没有边框。

6. `rlap` 与 `llap` 重叠文本

    ```latex
    \rlap{ ... }                            % 括号内文本与命令右边文本重叠
    \llap{ ... }                            % 括号内文本与命令左边文本重叠
    \rlap{\rule[]{<width>}{<height>}}       % 嵌套 \rule 遮盖右边文字
    ```

### 2.11 自定义命令

1. `newcommand` 定义原本不存在的命令

    ```latex
    \newcommand{<cmd name>}{<cmd>}
    \newcommand{<cmd name>}[N]{<cmd1>{#1} <cmd2>{#2} ... <cmdN>{#N}}
    ```

    （1）`cmd name` 必须以 `\` 开头；\
    （2）参数 `N` 表示传入命令的个数，可取值为 1~9；\
    （3）`<cmdN>{#N}` 表示命令 `cmdN` 作用于自定义命令的第 N 个参数（次序可调换）；\
    （4）多参数命令的使用方式：`<cmd name>{arg1}{arg2}...{argN}`

2. `renewcommand` 可强行重新定义已有命令，用法与 `newcommand` 相同。

## 3. 图片与列表环境

### 3.1 插入图片

&emsp;&emsp;需引入宏包 `graphicx`

```latex
\includegraphics[<option>=value]{<image path>}
```

&emsp;&emsp;`option` 可选项有 `width` 和 `scale`：\
&emsp;&emsp;（1）当取 `width` 时，`value` 可以是具体的尺寸大小，也可以是 `\linewidth` 的关系式，`\linewidth` 为当前环境的行宽；\
&emsp;&emsp;（2）当取 `scale` 时，`value` 可以是某个数值，表示缩放为原图的多少倍。`image path` 为图片所在路径，路径包含图片名（后缀名可有可无），可以是相对路径也可以是绝对路径。

>注：\
① 如果使用 `\usepackage[draft]{graphicx}` 命令导入宏包，插入图片后编译时不会加载图片但能占据图片的位置，可以加快编译速度；等文档编辑完成后在去掉 `draft` \
② 填写 `image path` 时，Windows 文件路径中 `\` 需要替换成 `/`

### 3.2 浮动体与图片排版

&emsp;&emsp;直接使用3.1节命令插入图片，图片只能出现在对应代码所在位置，而浮动提可以让图片脱离代码对应的位置而出现在合适的位置。

1. `figure` 浮动环境

    ```latex
    \begin{figure}[<option1>]
        \centering                                      % 居中对齐
        \includegraphics[<option2>=value]{<image path>}
        \caption{<caption name>}                        % 图注
        \label{<label name>}                            % 标签
    \end{figure}
    ```

    （1）`caption name` 为图注名（会自动编号），可以在 `\includegraphics` 上方或下方，图注也会出现在对应的位置；\
    （2）`label name` 为图片标签名，与图片的引用有关，每个图片的 `label name` 必须是唯一的；\
    （3）`option1` 控制图片优先出现的位置，但无法完全控制因为 LaTeX 对浮动环境有严格限制，可选项有 `h`、`t`、`b`、`p`、`!`，分别代表代码所在位置、页面顶部、页面底部、新的一页、忽略某些限制，在实际使用中通常混合使用如 `htbp!`（位置前后存在优先关系）。

    >注：双栏排版时 `\begin{figure} ... \end{figure}` 插入图片只会出现在单栏，如果需要图片跨栏排版则需要使用 `\begin{figure*} ... \end{figure*}`，此时 `option1` 只能取 `t`、`p`。

2. 多图并排共用标题格式排版

    ```latex
    \begin{figure}
        \centering
        \includegraphics[width=0.4\linewidth]{img/2018春节} \hfill
        \includegraphics[width=0.4\linewidth]{img/2020中秋节} \\
        \vspace{1em}
        \includegraphics[width=\linewidth]{img/2022端午节}
        \caption{多图并排共用标题}
        \label{fig:fig}
    \end{figure}
    ```

    &emsp;&emsp;其中 `\hfill` 表示将第一行两图之间位置填满，`\vspace{1em}` 设置两行图片间距（前面需要有换行），编译结果如图：

    ![ ](image-5.png)

3. 多图并排单独标题格式排版

    ```latex
    \begin{figure}
        \centering
        \begin{minipage}{0.4\linewidth}
            \includegraphics[width=\linewidth]{img/2018春节}
            \caption{多图并排单独标题1}
            \label{fig:fig1}
        \end{minipage}
        \hfill
        \begin{minipage}{0.4\linewidth}
            \includegraphics[width=\linewidth]{img/2020中秋节}
            \caption{多图并排单独标题2}
            \label{fig:fig2}
        \end{minipage}                                   
    \end{figure}    
    ```

    &emsp;&emsp;该格式排版通过 `minipage` 环境实现，编译结果如图：

    ![ ](image-6.png)

4. 多图并排主标题格式排版：需引入宏包 `subcaption`

    ```latex
    \begin{figure}
        \centering
        \begin{subfigure}{0.4\linewidth}
            \includegraphics[width=\linewidth]{img/2018春节}
            \caption{多图并排子标题1}
            \label{fig:fig3_1}
        \end{subfigure}
        \hfill
        \begin{subfigure}{0.4\linewidth}
            \includegraphics[width=\linewidth]{img/2020中秋节}
            \caption{多图并排子标题2}
            \label{fig:fig3_2}
        \end{subfigure}  \\
        \vspace{1em}
        \begin{subfigure}{\linewidth}
            \includegraphics[width=\linewidth]{img/2022端午节}
            \caption{多图并排子标题3}
            \label{fig:fig3_3}
        \end{subfigure}
        \caption{多图并排主标题}
        \label{fig:fig3}
    \end{figure}      
    ```

    &emsp;&emsp;该格式排版通过 `subfigure` 环境实现，编译结果如图：

    ![ ](image-7.png)

### 3.3 图片引用

1. 简单引用

    ```latex
    \ref{<label name>}          % 引用对应图编号
    \pageref{<label name>}      % 引用对应图所在页码
    ```

2. 自定义引用：需引入宏包 `hyperref`

    ```latex
    \autoref{<label name>}
    ```

    &emsp;&emsp;使用该命令引用图片时应用格式为 `Figure + 编号`，可以在引言去使用命令 `\renewcommand{\figureautorefname}{图}` 替换为 `图 + 编号`

    >注：使用 `\usepackage[hidelinks]{hyperref}` 引入宏包可隐藏引用时出现的红框

### 3.4 有序列表无序列表描述环境

### 3.5 一些空格与填充

## 4. 表格进阶专题

### 4.1 简单表格-tabular

### 4.2 表格浮动环境与表格引用

### 4.3 一些表格样式

### 4.4 三线表

### 4.5 自动变宽表格-tabularx

### 4.5 新式表格-tabularray

### 4.6 表格-换行与 Q 格式

### 4.7 表格-变宽

### 4.8 表格-行列设置分离

### 4.9 表格-框线样式颜色

### 4.10 表格-按行列绘制边框线

### 4.11 表格-多边框线

### 4.12 表格-自由绘制边框线

### 4.13 表格-设置行列样式

### 4.14 表格-单元格合并与样式

### 4.15 tabularray 与三线表

### 4.16 长表格-longtblr

### 4.17 横向表格（宽表）

### 4.18 关于表格的一些补充

## 5. 数学公式排版

### 5.1 数学模式与公式引用

### 5.2 分式与根式

### 5.3 公式-上下标

### 5.4 公式-上下线

### 5.5 公式-求和与公式样式调整

### 5.6 公式-积分

### 5.7 公式-矩阵

### 5.8 公式-多行公式

### 5.9 公式-分支公式

### 5.10 公式-定理环境与 cleveref 引用

## 6. 长文档管理与学术规范

### 6.1 章节标题与目录

### 6.2 文档结构-前言正文附录后记

### 6.3 文档拆分

### 6.4 页眉页脚

### 6.5 参考文献

### 6.6 索引

## 7. TikZ 矢量绘图

### 7.1 TikZ-绘图 直线 坐标

### 7.2 TikZ-基本图形绘制

### 7.3 TikZ-线条样式

### 7.4 TikZ-scope 环境、样式复用

### 7.5 TikZ-形变

### 7.6 TikZ-绘制与填充

### 7.7 TikZ-文字节点

### 7.8 TikZ-循环绘制与坐标轴

### 7.9 TikZ-绘制函数图像

## 8. 幻灯片制作与特殊扩展

### 8.1 初识 beamer 幻灯片

### 8.2 CTeX 补充内容（文档阅读）

### 8.3 一些目录样式

### 8.4 为页面设置背景图片

### 8.5 cutwin 文字环绕排版

[简明 LaTeX 教程]:https://b23.tv/7DeIqsV
[Visual Studio Code (vscode)配置LaTeX]:https://zhuanlan.zhihu.com/p/166523064?share_code=IrqiRIxVXJiH&utm_psn=2020536351498453984
[overleaf]:https://cn.overleaf.com/
[texpage]:https://www.texpage.com/zh/
[ctan]:https://ctan.org/
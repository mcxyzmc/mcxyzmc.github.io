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

        &emsp;&emsp;一般情况下，N 倍行距 = N  基础行距，word 基础行距 = 1.3  字号大小，latex 基础行距 = 1.2  字号大小；但使用 `\singlespacing`、`\onehalfspacing`、`\doublespacing` 设置行距时，N 倍行距 = N  字号大小。

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
    \newpage        % 新开一栏（在一栏页面中等价于 \clearpage）
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

    >注：双栏排版时 `\begin{figure} ... \end{figure}` 插入图片只会出现在单栏，如果需要图片跨栏排版则需要使用 `\begin{figure} ... \end{figure}`，此时 `option1` 只能取 `t`、`p`。

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

    &emsp;&emsp;使用该命令引用图片时引用格式为 `Figure + 编号`，可以在引言区使用命令 `\renewcommand{\figureautorefname}{图}` 替换为 `图 + 编号`

    >注：使用 `\usepackage[hidelinks]{hyperref}` 引入宏包可隐藏引用时出现的红框

### 3.4 有序列表无序列表描述环境

1. 无序列表

    ```latex
    \begin{itemize}
        \item ...
        \item ...
        \item ...
    \end{itemize}
    ```

    &emsp;&emsp;`\item[<modifier>]` 可以修改无序列表修饰符，`modifier` 可以是 `-`、`+`、`` 等自定义图标

2. 有序列表

    ```latex
    \begin{enumerate}
        \item ...
        \item ...
        \item ...       
    \end{enumerate}
    ```

3. 描述环境

    ```latex
    \begin{description}
        \item[value] ...
    \end{description}
    ```

    &emsp;&emsp;`value` 文本会被设置为黑体，后面的内容一般是对该文本的解释性语句。

### 3.5 空格与填充

1. 空格

    ```latex
    \hspace{value + unit}     % 水平空格，value 可以为负值
    \vspace{value + unit}     % 垂直空格（需要换行起效），value 可以为负值
    \quad                     % 等价于 \hspace{1em}
    \qquad                    % 等价于 \hspace{2em}
    \enskip                   % 等价于 \hspace{0.5em}
    \ + 空格                  % 通过 \ 的转义作用实现空格
    ```

    >注：`\thinspace`、`\,`、`\negthinspace`、`\enspace`、`\nobreakspace`、`~` 也可以实现空格，了解即可

2. 填充

    ```latex
    \hfil       % 空白填充水平方向剩余内容
    \vfil       % 空白填充垂直方向剩余内容
    \hrulefill  % 横线填充水平方向剩余内容
    \dotfill    % 点线填充水平方向剩余内容
    ```

    &emsp;&emsp;`\stretch{}` 和 `\hspace` 配合使用可以实现按比例空白填充水平方向剩余内容，如以下命令实现按 `1:2:3` 的比例空白填充水平方向剩余内容：

    ```latex
    \fbox{123}\hspace{\stretch{1}}\fbox{456}\hspace{\stretch{2}}\fbox{789}\hspace{\stretch{3}}\fbox{+-0}
    ```

## 4. 表格进阶专题

### 4.1 简单表格-tabular

&emsp;&emsp;简单表格基本语法为： `\begin{tabular}[<oalignment>]{<column format>} ... \end{tabular}` ，下面结合一个简单的例子讲解：

```latex
\begin{tabular}[b]{|c|c|c|c|c|}
    \hline
    姓名 & 语文 & 数学 & 英语 & 总成绩 \\
    \hline
    张三 & 10 & 20 & 30 & 60 \\
    \hline
    李四 & 40 & 50 & 60 & 150 \\
    \hline
    王五 & 70 & 80 & 90 &2 40 \\
    \hline
\end{tabular}
```

（1）`oalignment` 为外对齐方式，可取值包括 `t`、`m`、`b` 顶部对齐、居中对齐、底部对齐；\
（2）`column format` 为列格式，上例 `|c|c|c|c|c|` 中的 `|` 表示表格的一根竖框线，若去掉则没有框线。而 `c` 表示对应列内容居中对齐，可以替换为 `l`、`r`、`p<value + unit>` 分别代表左对齐、右对齐、表格自动换行宽度（默认情况下表格内容不会自动换行）；\
（3）`|c|c|c|c|c|` 可以用正则表达式 `{5}{|c}|` 表示，其语法为 `{重复次数}{重复内容}`；\
（4）`\hline` 表示表格横框线；\
（5）`&` 将相邻单元格内容隔开

### 4.2 表格浮动环境与表格引用

1. `table` 浮动环境

    &emsp;&emsp;表格浮动环境与图片浮动环境类似，只不过需要把 `figure` 替换成

    ```latex
    \begin{table}[<option>]
        \centering                                      % 居中对齐
        \begin{tabular}[<oalignment>]{<column format>} ... \end{tabular}
        \caption{<caption name>}                        % 表注
        \label{<label name>}                            % 标签
    \end{table}
    ```

2. 表格引用

    &emsp;&emsp;表格引用方法和图片引用方法相同，唯一需要注意的是使用 `\hyperref` 包引用时默认格式为 `Table + 编号`，可以在引言区使用命令 `\renewcommand{\tableautorefname}{表}` 替换为 `表 + 编号`

### 4.3 一些表格样式

1. `cline` 自定义横框线

   ```latex
   \cline{value1-value2}
   ```

   &emsp;&emsp;该命令可以替换 `\hline` 绘制指定单元格位置的横框线，如 `\cline{2-4}` 表示绘制从第 2-4 列单元格的横框线。

2. `\diagbox` 单元格分割：需导入宏包 `diagbox`

    ```latex
    \diagbox{ ... }{ ... }
    ```

    &emsp;&emsp;`{}` 的数量根据需要添加，花括号内为要填写的内容

3. `multirow` 合并列单元格：需导入宏包 `multirow`

    ```latex
    \multirow{value}{<width>}{ ... }
    ```

    （1）`value` 表示合并单元格的数量；\
    （2）`width` 表示合并后单元格的宽度，可以是 `value + unit`，也可以是 `` 表示根据单元格内容子项决定；

4. `multicolumn` 合并行单元格

    ```latex
    \multicolumn{value}{<alignment>}{ ... }
    ```

    （1）`value` 表示合并单元格的数量；\
    （2）`alignment` 表示单元格合并后的格式，可取值包括 `r`、`c`、`l`、`p<value + unit>`，添加 `|` 可绘制竖框线

### 4.4 三线表

&emsp;&emsp;需导入宏包 `booktabs`，三线表语法和简单表格基本相同，下面结合一个简单的例子讲解：

```latex
\begin{tabular}[b]{{5}{c}}
    \toprule
    姓名 & 语文 & 数学 & 英语 & 总成绩 \\
    \midrule
    张三 & 10 & 20 & 30 & 60 \\
    李四 & 40 & 50 & 60 & 150 \\
    王五 & 70 & 80 & 90 &2 40 \\
    \bottomrule
\end{tabular}
```

（1）`\toprule`、`\midrule`、`\bottomrule` 代替 `\hline` 绘制三线表中顶部、中间、底部横框线，后面都可以跟 `[value + unit]` 设置线宽；\
（2）可以使用 `cmidrule{value1-value2}` 绘制中间自定义横框线，`\cmidrule{value1-valuew} \morecmidrules \cmidrule{value1-value2}` 可以绘制双框线；\
（3）`\specialrule{value1 + unit1}{value2 + unit2}{value3 + unit3}` 也可以设置横框线，三个花括号内分别设置线宽、上方空白、下方空白

### 4.5 自动变宽表格-tabularx

&emsp;&emsp;使用 `tabular` 绘制表格时表格宽度根据表格内容而定，使用 `tabularx` 绘制表格可以自定义表格宽度（需导入宏包 `tabular`），基本语法为 `\begin{tabularx}[<width>]{<alignment>} ... \end{tabularx}`，下面结合一个例子讲解：

```latex
\begin{tabularx}{\linewidth}{
    |>{\centering\arraybackslash}X|
    >{\raggedleft\arraybackslash}X|
    >{\raggedright\arraybackslash}X|
    >{\raggedright\arraybackslash}X|
    c|
    }
    \hline
    姓名 & 语文 & 数学 & 英语 & 总成绩 \\
    \hline
    张三 & 10 & 20 & 30 & 60 \\
    \hline
    李四 & 40 & 50 & 60 & 150 \\
    \hline
    王五 & 70 & 80 & 90 &2 40 \\
    \hline
\end{tabularx}
```

（1）`width` 设置整个表格的宽度；\
（2）`>{\centering\arraybackslash}` 中 `\centering` 设置居中对齐，还有两个取值 `\raggedleft`、`raggedright` 分别表示左不齐、右不齐，也就是对应右对齐和左对齐；\
（3）`\arraybackslash` 为修正格式 bug 的代码

### 4.5 新式表格-tabularray

&emsp;&emsp;`tabularray` 被称为“来自未来的表格”，需要导入宏包 `tabularray`，格式设置和文本内容完全分离，推荐使用该表格替代 `tabular`，下面是一个简单的例子：

```latex
\begin{table}[htbp]
    \centering
    \caption{考评成绩}
    \SetTblrInner{rowsep=0pt}
    \begin{tblr}{|c|c|c|c|c|}
        \hline
        姓名 & 语文 & 数学 & 英语 & 总成绩 \\
        \hline
        张三 & 10 & 20 & 30 & 60 \\
        \hline
        李四 & 40 & 50 & 60 & 150 \\
        \hline
        王五 & 70 & 80 & 90 &2 40 \\
        \hline
    \end{tblr}
\end{table}
```

&emsp;&emsp;该表格相比 `tabular` 表格会自带一些空格区域使表格看起来更美观，使用 `\SetTblrInner{rowsep=0pt}` 命令取消空格就可以得到和 `tabular` 一样的表格。

### 4.6 tabularray 表格-换行与 Q 格式

```latex
\begin{table}[htbp]
    \centering
    \caption{考评成绩}
    \begin{tblr}{|Q[c,m,5em]|Q[l,h]|Q[r,f]|Q[c,h,3em]|Q[c,f]|}
        \hline
        姓名 & 语文 & 数学 & 英语 & 总成绩 \\
        \hline
        {张三 \\ 张三} & 10 & 20 & 30 & 60 \\
        \hline
        李四 & 40 & 50 & 60 & 150 \\
        \hline
        王五 & 70 & 80 & 90 &2 40 \\
        \hline
    \end{tblr}
\end{table}
```

（1）`Q[c,m,5em]` 中三个参数分别设置水平对其格式、垂直对齐格式和列宽；其中水平对齐格式和此前相同可设置为 `c`、`r`、`l`，但垂直对齐格式取值是 `h`、`m`、`f` 表示顶部（head）对齐、居中对齐、底部（foot）对齐;\
（2）该表格可直接使用 `\\` 进行换行，如 `{张三 \\ 张三}`，而不需要像 `tabular` 通过设置单元格宽度来实现换行

### 4.7 tabularray 表格-变宽

```latex
\begin{table}[htbp]
    \centering
    \caption{考评成绩}
    \begin{tblr}{
        colspec = {|X[c,2]|X[l,3]|X[c,-1]|c|c|}，
        width = 0.8\linewidth
    }
        \hline
        姓名 & 语文 & 数学 & 英语 & 总成绩 \\
        \hline
        张三 & 10 & 20 & 30 & 60 \\
        \hline
        李四 & 40 & 50 & 60 & 150 \\
        \hline
        王五 & 70 & 80 & 90 &2 40 \\
        \hline
    \end{tblr}
\end{table}
```

（1）`\begin{tblr}{<fotmat settings>} ... \end{tblr}` 在 `format settings` 中可以完成所有表格设置，为了方便本文后面将这个区域称为格式区；\
（2）格式区中除最后一项外，每项格式设置后面都需要跟一个英文逗号 `,`；\
（2）该表格可以实现和 `tabularx` 表格一样的功能且更简洁，如 `colspec = {|X[c,2]|X[l,3]|X[c,-1]|c|c|}` 让表格第一和第二列按设定的表格宽度变宽且两列表格宽度比例为 2:3，第三列 `X[c,-1]` 中 `-1` 是让表格按表格内容自行调整宽度；\
（3）`width = 0.8\linewidth` 设置整个表格宽度为 0.8 倍行宽

### 4.8 tabularray 表格-行列设置分离

```latex
colspec = {|Q[c]|Q[l]|Q[r]|c|c|}    % 写在格式区，设置列格式
rowspec = {|Q[m]|Q[h]|Q[f]|Q[m]|}   % 写在格式区，设置行格式
```

（1）`colspec` 设置列格式，`rowspec` 设置行格式，但事实上 `colspec` 可以写多个参数像前面一样设置垂直对齐格式和列宽（但不太推荐），且可以直接写 `c`、`r`、`l`；但 `rowspec` 只能通过 `Q` 来设置对齐格式；\
（2）`rowspec` 中通过 `|` 来实现了像 `colspec` 中一样的框线绘制，让文本内容与格式设置实现了分离

### 4.9 tabularray 表格-框线样式颜色

```latex
hlines = {2pt,solid,blue6}      % 写在格式区，设置横框线
vlines = {3pt,dotted,red4}      % 写在格式区，设置竖框线
```

（1）框线设置中花括号中三个参数可任意组合，`hlines = {2pt,solid,blue6}` 设置横框线线宽 `2pt`，线型为实线，颜色为蓝色色阶 6；\
（2）线型可选项有 `solid`、`dashed`、`dotted`分别表示实线、虚线、点线；\
（3）设置框线颜色需要先导入宏包 `xcolor`，该宏包为每种常见颜色提供了九个色阶，如 `bule6` 表示蓝色色阶 6

### 4.10 tabularray 表格-按行列绘制边框线

```latex
hlines = {2-4}{3pt,green9}   % 写在格式区，设置横框线
vlines = {-}{blue3}          % 写在格式区，设置竖框线
```

&emsp;&emsp;`hlines` 和 `vlines` 绘制框线可以指定列或行范围，范围可以是单个数字、用逗号分隔的多个数字、用 `-` 连接的两个数字，也可以是 `-` 表示所有横（或竖）框线，还可以是 `odd`、`even` 代表奇数、偶数横（或竖）框线；如 `hlines = {2-4}{3pt,green9}` 表示绘制 2-4 列的横框线，线宽 `3pt`，颜色为绿色色阶 9

### 4.11 tabularray 表格-多边框线

```latex
\begin{table}[htbp]
    \centering
    \caption{考评成绩}
    \begin{tblr}{
        colspec = {ccccc},
        hlines = {1}{2-4}{3pt,green9},
        hlines = {2}{1-3}{2pt}
    }
        姓名 & 语文 & 数学 & 英语 & 总成绩 \\
        张三 & 10 & 20 & 30 & 60 \\
        李四 & 40 & 50 & 60 & 150 \\
        王五 & 70 & 80 & 90 &2 40 \\
    \end{tblr}
\end{table}
```

&emsp;&emsp;`hlines` 和 `vlines` 可以绘制多边框线，并通过第一个花括号选择设置那条边框线的格式，如 `hlines = {2}{1-3}{2pt}` 设置第二条边框线的格式

### 4.12 tabularray 表格-自由绘制边框线

```latex
\begin{table}[htbp]
    \centering
    \caption{考评成绩}
    \begin{tblr}{
        colspec = {ccccc},
        hline{3,4} = {2-4}{3pt,green9},
        vline{2,5} = {3}{1pt,blue6}
    }
        姓名 & 语文 & 数学 & 英语 & 总成绩 \\
        张三 & 10 & 20 & 30 & 60 \\
        李四 & 40 & 50 & 60 & 150 \\
        王五 & 70 & 80 & 90 &2 40 \\
    \end{tblr}
\end{table}
```

&emsp;&emsp;`hlines` 设置绘制指定列的横边框线，`hline` 使用同样的语法指定列且还需指定第几条边框线从而可以实现指定单元格的横边框线的绘制；类似的 `vline` 可以事先制定单元格竖边框线的绘制。如，` hline{3,4} = {2-4}{3pt,green9}` 绘制 2-4 列的第 3、4 条横边框线，`vline{2,5} = {3}{1pt,blue6}` 绘制第三列的第 2、5 条竖边框线。

### 4.13 tabularray 表格-设置行列样式

```latex
\begin{table}[htbp]
    \centering
    \caption{考评成绩}
    \begin{tblr}{
        colspec = {ccccc},
        hlines,vlines,
        row{1} = {bg=cyan,font=\heiti\large},
        column{2} = {font=\kaiti,fg=red}
    }
        姓名 & 语文 & 数学 & 英语 & 总成绩 \\
        张三 & 10 & 20 & 30 & 60 \\
        李四 & 40 & 50 & 60 & 150 \\
        王五 & 70 & 80 & 90 &2 40 \\
    \end{tblr}
\end{table}
```

（1）使用 `row` 和 `column` 可以设置行和列的样式，`bg` 设置背景颜色，`fg` 设置字体颜色，`\font` 设置字体；如 `row{1} = {bg=cyan,font=\heiti\large}` 将第一行背景颜色设置为 `cyan`，字体设置为 `\large` 黑体；\
（2）`rows` 和 `columns` 设置整个表格的样式，如 `columns = {font=\songti,fg=green}` 将表格字体设置为宋体、颜色绿色

### 4.14 tabularray 表格-单元格合并与样式

1. `cells` 设置整个表格样式

    ```latex
    cells = {cyan}      % 写在格式区，用法和 rows、columns 一样
    ```

2. `cell` 设置指定单元格格式

    ```latex
    cell{<row>}{<column>}={<style>}     % 写在格式区
    ```

    &emsp;&emsp;其中 `row`、`column` 为需要设置单元格的行、列，`style` 为单元格样式，设置方法和前面都一样。

3. `cell` 合并列单元格，基本语法为：`cell{<row>}{<column>}={<merge settings>}{<style>}`，以下是一个例子：

    ```latex
    \begin{table}
        \centering
        \caption{考评成绩}
        \begin{tblr}{
            colspec = {ccccc},
            hlines,vlines,
            cell{1}{1} = {r=2}{}，
            cell{1}{2} = {c=3}{},
            cell{3}{2} = {r=3,c=3}{}
        }
            姓名 & 语文 & 数学 & 英语 & 总成绩 \\
            姓名 & 语文 & 数学 & 英语 & 总成绩 \\
            张三 & 10 & 20 & 30 & 60 \\
            李四 & 40 & 50 & 60 & 150 \\
            王五 & 70 & 80 & 90 &2 40 \\
        \end{tblr}
    \end{table}
    ```

（1）`{<row>}{<column>}` 设置要合并的起始单元格；\
（2）`merge settings` 可以为 `r=M`、`c=N`，分别表示向下合并 M 个单元格、向右合并 N 个单元格；\
（3）`style` 为单元格样式

### 4.15 tabularray 与三线表

&emsp;&emsp;`tabularray` 绘制三线表方法和前面一样，只需要环境换成 `\begin{tblr}{<format settings> ... \end{tblr}`；另外需要注意的是此时导入 `booktabs` 宏包的命令是 `UseTblrLibrary{booktabs}`

### 4.16 长表格-longtblr

```latex

\DefTblrTemplate{contfoot-text}{chs}{接下页\dots}
\SetTblrTemplate{contfoot-text}{chs}
\DefTblrTemplate{conthead-text}{chs}{（续表）\dots}
\SetTblrTemplate{conthead-text}{chs}

\begin{longtblr}[
    caption = {一个很长的表格}
    label = {tab:long_tab}
]{
    colspec = {cccc},
    hlines,vlines,
    rowhead = 1
}

员工号  & 工资  & 起始日期  & 终止日期  \\
10001  & 60117  & 26/6/1986  & 26/6/1987  \\
10001  & 62102  & 26/6/1987  & 25/6/1988  \\
10001  & 66074  & 25/6/1988  & 25/6/1989  \\
10001  & 66596  & 25/6/1989  & 25/6/1990  \\
10001  & 66961  & 25/6/1990  & 25/6/1991  \\
10001  & 71046  & 25/6/1991  & 24/6/1992  \\
10001  & 74333  & 24/6/1992  & 24/6/1993  \\
10001  & 75286  & 24/6/1993  & 24/6/1994  \\
10001  & 75994  & 24/6/1994  & 24/6/1995  \\
10001  & 76884  & 24/6/1995  & 23/6/1996  \\
10001  & 80013  & 23/6/1996  & 23/6/1997  \\

...

\end{longtblr}
```

（1）`\DefTblrTemplate` 重新定义表格头、尾注释内容，`\SetTblrTemplate` 应用设置，`chs` 可换成任意内容（貌似没什么影响）；\
（1）`rowhead` 设置标题行行数

### 4.17 横向表格（宽表）

&emsp;&emsp;需导入宏包 `rotating`

```latex
\begin{sidewaystable}[htbp]
    \centering
    \caption{宽表格}
    \begin{tblr}{
        colspec = {{23}{c}}
        hlines
    }
    & 2000 & 2001 & 2002 & 2003 & 2004 & 2005 &
    2006 & 2007 & 2008 & 2009 & 2010 & 2011 & 2012
    & 2013 & 2014 \\
    张三 & 699 & 355 & 264 & 313 & 623 & 488 & 192 &
    436 & 137 & 400 & 500 & 987 & 464 & 824 & 270 \\
    李四 & 745 & 453 & 559 & 328 & 281 & 264 & 415 &
    850 & 459 & 231 & 948 & 859 & 795 & 393 & 207 \\
    王五 & 237 & 608 & 802 & 822 & 601 & 585 & 953 &
    562 & 801 & 378 & 845 & 609 & 586 & 918 & 525 \\
    赵六 & 135 & 841 & 838 & 104 & 542 & 441 & 278 & 326
    & 653 & 464 & 515 & 531 & 739 & 750 & 981
    \end{tblr}
    \label{tab:my_label}
\end{sidewaystable}
```

### 4.18 LaTeX 表格生成工具

1. Tables Generator (最推荐，经典之选)\
    网址：[https://www.tablesgenerator.com/](https://www.tablesgenerator.com/)\
    核心功能：\
    - 可视化操作：像 Excel 一样点击按钮添加行列、合并单元格。
    - 多种格式转换：除了 LaTeX，还支持 Markdown、HTML、CSV。
    - 支持 Excel 导入：可以直接把 Excel 里的内容复制粘贴进来，它会自动生成表格。
    - 定制化：支持设置字体加粗、斜体、边框样式，以及是否使用 `booktabs` 宏包。
    - 缺点：无法处理非常复杂的 LaTeX 自定义样式。

2. TableConvert (功能最全面)\
    网址：[https://tableconvert.com/latex-generator](https://tableconvert.com/latex-generator)\
    核心功能：\
    - 数据源广泛：支持从 JSON, SQL, CSV, Excel, XML 甚至 URL 直接抓取数据生成表格。
    - 实时预览：编辑数据时，下方会实时显示生成的 LaTeX 代码。
    - Latex 表格美化：提供了非常简洁的 UI，支持自动修复和优化代码。
    - 适用人群：需要将现有数据库或复杂数据文件转换为 LaTeX 表格的用户。

3. Overleaf 内置可视化编辑器 (最方便)\
    操作方法：在 Overleaf 的编辑界面，将顶部的 "Source" 切换到 "Visual" 模式。此时点击表格，你可以直接在界面上添加行列、调整边框。\
    优点：无需离开写作环境，直接在文档中编辑。\
    缺点：功能相对简单，复杂的合并单元格操作不如 Tables Generator。

4. Mathpix Snip (图片转表格)\
    网址：[https://mathpix.com/](https://mathpix.com/)\
    核心功能：\
    - OCR 识别：截图一个复杂的表格，它能自动识别结构并直接生成 LaTeX 代码。
    - 精度极高：处理带有数学公式的表格效果极佳。
    缺点：免费额度有限（每个月有免费扫描次数）。

5. Excel2LaTeX (Excel 插件)\
    下载地址：[CTAN - excel2latex](https://ctan.org/pkg/excel2latex)\
    核心功能：这是一个 Excel 宏文件（.xla），安装后在 Excel 菜单栏会出现“Export table to LaTeX”按钮。\
    适用人群：处理超大型实验数据，且不希望频繁使用在线工具的用户。

## 5. 数学公式排版

### 5.1 数学模式与公式引用

1. 数学模式
   1. 行内公式：`$ ... $`
   2. 无编号行间公式：`\[ ... \]`
   3. 带编号行间公式：

        ```latex
        \begin{equation}
        \label{eq:gongshi}
            ...
        \end{equation}
        ```

2. 公式引用
   1. 简单引用：`\ref{<label name>}`
   2. 专业引用（自带括号，需导入宏包 `amsmath`）：`\eqref{<label name>}`
   3. `hyperref` 引用：用法和前面相同，自定义命令 `\renewcommand{\equationautorefname}{公式}`

### 5.2 分式与根式

1. 分式

    ```latex
    $\frac{1}{2}$
    $\dfrac{1}{2}$    % 需导入宏包 amsmath
    ```

    &emsp;&emsp;为了匹配行高，分式放在行内环境是高度会被压缩，导入宏包 `amsmath` 后用 `\dfrac{}{}` 来写分式可以避免这种压缩。

2. 根式

    ```latex
    $\sqrt{3}$
    $\sqrt[3]{2}$
    ```

### 5.3 公式-上下标

```latex
$A_n^m$
$A_{ij}$
$f(x)=e^{x^2+x+3}$
```

&emsp;&emsp;LaTeX 常用符号表（蓝色符号需导入宏包 `amsmath`，更多符号看查询《一份(不太)简短的 LATEX 2ε 介绍》4.9 节）：

![ ](image-8.png)
![ ](image-9.png)
![ ](image-10.png)
![ ](image-11.png)
![ ](image-12.png)
![ ](image-13.png)
![ ](image-14.png)

### 5.4 公式-上下线

```latex
\[
\vec{a} \codt \vec{b} \quad
\boldsymbol{a} \times \boldsymbol{b} \quad
\overrightarrow{AB} \cdot \overrightarrow{CD} \quad
\overline{AB} \quad
\underline{CD} \quad
\bar{x}_0 \quad
\hat{a} \quad
\]

\[ \overbrace{(a + a + \cdots + a)}^{\text{$n$ 个 $a$}} \times \underbrace{b + b + \cdots + b}_{\text{$m$ 个 $b$}} \]
```

&emsp;&emsp;编译结果如图：

![ ](image-15.png)

### 5.5 公式-求和与公式样式调整

&emsp;&emsp;需导入宏包 `amsmath` 和 `mathtools`（后面均默认已导入这两个宏包）

```latex
求和 $S_{n} = \sum_{i=0}^{\infty} a_n$ \\
求和 $S_{n} = \sum\limits_{i=0}^{\infty} a_n$ \\
求和 $\displaystyle S_{n} = \sum_{i=0}^{\infty} a_n$

\[ \sum_{\substack{0<i<n \\ 0<j<m \\ 0<k<m+n}} A_{ij} \qquad
\smashoperator{\sum_{\substack{0<i<n \\ 0<j<m \\ 0<k<m+n}}} A_{ij} \]

\[ \hat{b}=\dfrac{\sum_{i=1}^{n}(x_i-\bar{x})(y_i-\bar{y})}{\sum_{i=1}^{n}(x_i-\bar{x})^2} \qquad
\hat{b}=\dfrac{\displaystyle \sum_{i=1}^{n}(x_i-\bar{x})(y_i-\bar{y})}{\displaystyle \sum_{i=1}^{n}(x_i-\bar{x})^2} \]

\[ \hat{a} \hat{b} \hat{c} \quad \sqrt{a} \sqrt{b} \sqrt{c} \quad \vec{a} \vec{b} \vec{c} \]
\[
\hat{\mathstrut a} \hat{\mathstrut b} \hat{\mathstrut c} \quad \sqrt{\mathstrut a} \sqrt{\mathstrut b} \sqrt{\mathstrut c} \quad \vec{\mathstrut a} \vec{\mathstrut b} \vec{\mathstrut c}
\]

\[ \sqrt[3]{\dfrac{x+y}{x-y}} \quad \sqrt[\uproot{12}\leftroot{-3}3]{\dfrac{x+y}{x-y}} \]
```

&emsp;&emsp;编译结果如图：

![ ](image-16.png)

（1）求和符号在行内环境也会因行高被压缩，使用 `\limits`、`\displaystyle` 可以解决这个问题；\
（2）求和符号上（下）标需要换行时需借助 `\substack` 命令；\
（3）当求和符号上（下）标太长时，求和内容和求和符号相隔太远，使用 `\smashoperator` 可以解决这个问题；\
（4）多个 `\hat`、`\sqrt`、`\vec` 放在一起时顶部不对齐，使用 `\mathstrut` 可以解决这个问题；\
（5）`\sqrt` 内公式比较复杂时根指数位置不太对，使用 `\uproot{value}` 调节根指数上下移动，`\leftroot{value}` 调节根指数左右移动

### 5.6 公式-积分

```latex
极限 $\lim_{x \to 0} \dfrac{\sin x}{x} = 1$ \\
极限 $\lim\limits_{x \to 0} \dfrac{\sin x}{x} = 1$ \\

\[ \int x \mathrm{d}x \]
\[ \iint\limits_{S} \sqrt{x^2 + y^2} \mathrm{d}x\mathrm{d}y \]

\[\boxed{
\oint_{\Gamma} P(x,y,z) \mathrm{d}x + Q(x,y,z) \mathrm{d}y +R(x,y,z) \mathrm{d}z
}\]

\[ \oint_L P\mathrm{d}x +Q\mathrm{d}y = \iint\limits_D (\dfrac{\partial Q}{\partial x}-\dfrac{\partial P}{\partial y}) \]

\[\left (
\dfrac{\partial Q}{\partial x} - \dfrac{\partial P}{\partial y} \right )
\]
\[\left \{
\dfrac{\partial Q}{\partial x} - \dfrac{\partial P}{\partial y} \right .
\]
```

编译结果如图：

![ ](image-17.png)

（1）极限符号在行内环境也会被压缩，使用 `\limits`、`\displaystyle` 可以解决这个问题；\
（2）直接在公式环境内写 `dx` 的话 `d` 会是斜体，一般使用 `\mathrm{d}` 实现正常字体 `d`；\
（3）多重积分符号使用 `\limits` 命令使上（下）标显示在积分号正上（下）方；\
（4）使用 `\boxed{}` 可将公式包裹在盒子内；\
（5）在复杂符号中写 `()` 无法实现完全包裹，可以通过将公式包裹在 `\left (  \right )` 来实现括号的完全包裹，除此之外 `[]`、`||`、`{}` 也是一样的，不过 `{}` 比较特别需要用 `\left \{ \right \}`（转义）；\
（6）`\left ( \right )` 只能成对存在，如果只需要左半边括号，使用命令 `\left ( \right .` 实现，类似的可以实现右半边括号，这种用法同样适用于 `[]`、`||`、`{}`

### 5.7 公式-矩阵

```latex
\[
A = \left [
\begin{array}{ccc}
    11.21 & 12 & 13 \\
    21 & -22 & 23 \\
    31 & 32 & 3.3
\end{array} \right ]
\]

\[
M = 
\begin{matrix}
    11 & 12 & 13 \\
    21 & 22 & 23 \\
    31 & 32 & 33
\end{matrix}
\quad
bM = 
\begin{bmatrix}
    11 & 12 & 13 \\
    21 & 22 & 23 \\
    31 & 32 & 33
\end{bmatrix}
\quad
vM = 
\begin{vmatrix}
    11 & 12 & 13 \\
    21 & 22 & 23 \\
    31 & 32 & 33
\end{vmatrix}
\quad
pM = 
\begin{pmatrix}
    11 & 12 & 13 \\
    21 & 22 & 23 \\
    31 & 32 & 33
\end{pmatrix}
\quad
BM = 
\begin{Bmatrix}
    11 & 12 & 13 \\
    21 & 22 & 23 \\
    31 & 32 & 33
\end{Bmatrix}
\quad
VM = 
\begin{Vmatrix}
    11 & 12 & 13 \\
    21 & 22 & 23 \\
    31 & 32 & 33
\end{Vmatrix}
\]

\[
pM = 
\begin{pmatrix}
    \dfrac{1}{1} & \dfrac{1}{2} & \dfrac{1}{3} \\
    \dfrac{2}{1} & \dfrac{2}{2} & \dfrac{2}{3} \\
    \dfrac{3}{1} & \dfrac{3}{2} & \dfrac{3}{3}
\end{pmatrix}
\quad
pM = 
\begin{+pmatrix}[cells=r,row{2}={green8}]
    \dfrac{1}{1} & \dfrac{1}{2} & \dfrac{1}{3} \\
    \dfrac{2}{1} & \dfrac{2}{2} & \dfrac{2}{3} \\
    \dfrac{3}{1} & \dfrac{3}{2} & \dfrac{3}{3}
\end{+pmatrix}
\]

\[
pM = 
\begin{pmatrix}
    a_{11} & a_{12} & \cdots & a_{1n} \\
    a_{11} & a_{12} & \cdots & a_{1n} \\
    \vdots & \vdots & \ddots & \vdots \\
    a_{n1} & a_{n2} & \cdots & a_{nn}

\end{pmatrix}
\]
```

&emsp;&emsp;编译结果如图：

![ ](image-18.png)

（1）使用 `array` 环境绘制矩阵可以像 `tabular` 表格一样在相应位置绘制横、竖框线；\
（2）使用 `array` 环境绘制矩阵时可以用 `\left \right` 来添加`()`、`[]`、`||`、`{}`；\
（3）`matrix`、`bmatrix`、`vmatrix`、`pmatrix`、`Bmatrix`、`Vmatrix` 可以快速实现矩阵的绘制，但无法调整对齐格式等，使用 `array` 环境可以实现复杂调整；\
（4）直接绘制分式矩阵会使矩阵显得非常拥挤，此时可以导入新式表格 `\usepackage{tabularray}` ，同时另外用 `\UseTblrLibrary{amsmath}` 命令导入 `msmath` 宏包，在 `matrix`、`bmatrix`、`vmatrix`、`pmatrix`、`Bmatrix`、`Vmatrix` 环境命令前加 `+` 就可以让整个矩阵变得疏朗，且此时可以像 `tabularray` 表格一样调整格式

### 5.8 公式-多行公式

1. `split` 环境

    ```latex
    \[
    \begin{split}
        (a+b)^3 &= (a+b)^2(a+b) \\
                &= (a^2 + 2ab + b^2)(a + b) \\
                &= (a^3 + \cdots)
    \end{split}
    \]
    ```

    （1）该环境需要套在公式环境内，使用 `\\` 手动换行，且用 `&` 设置对齐位置；\
    （2）在该环境下 `&` 换行符只能放在 `=`、`+` 等符号旁边；\
    （3）该环境只能处理列数比较少的公式

2. `dmath` 环境：需导入 `breqn` 宏包

    ```latex
    \begin{dmath}
        (a+b)^3 = (a+b)^2(a+b) 
                = (a^2 + 2ab + b^2)(a + b)
                = (a^3 + \cdots)
    \end{dmath}
    ```

    （1）该环境会自动根据 `=`、`+` 等符号根据内置逻辑自动换行；\
    （2）该环境下公式会自动编号，在 `dmath` 后加 `*` 可以去掉编号

3. `array` 排版多行公式

    ```latex
    \[
    \left \{
    \begin{array}{lcr}
        x + y + z & = & 10 \\
        x -y - z & = & -5 \\
        2x + 3y +4z & = & 35 
    \end{array} \right .
    \]
    
    ```

    （1）该环境需要套在公式环境内；
    （2）使用该环境可以像矩阵一样实现复杂的多行公式换行、对齐操作

编译结果如图：

![ ](image-19.png)

### 5.9 公式-分支公式

1. `cases` 环境

    ```latex
    \[
    f(x) =
    \begin{cases}
        \dfrac{1}{2} x^2, & x \leq 0 \\
        \dfrac{1}{3} \ln x, & 0 < x < 10 \\
        \dfrac{1}{10} \sqrt{x}, & x \geq 10
    \end{cases}
    \]
    ```

    （1）该环境需要套在公式环境内；\
    （2）该环境排版分式分支公式时也会出现拥挤的情况，此时可以同矩阵一样通过 `tabularray` 包来优化

2. `dcases` 环境：需导入宏包 `mathtools`

    ```latex
    \[
    f(x) =
    \begin{dcases}
        \dfrac{1}{2} x^2, & x \leqslant 0 \\
        \dfrac{1}{3} \ln x, & 0 < x < 10 \\
        \dfrac{1}{10} \sqrt{x}, & x \geqslant 10
    \end{dcases}
    \]
    ```

    （1）该环境需要套在公式环境内；\
    （2）该环境能直接解决排版分式分支公式时的拥挤问题；\
    （3）`\leq`、`\geq` 生成的小于等于、大于等于，可以替换为宏包 `amssymb` 中更美观的`leqslant`、`geqslant`

3. `drcases` 环境：需导入宏包 `mathtools`

    ```latex
    \[
    \begin{drcases}
        S \subset T \\
        S \supset T
    \end{drcases}
    \quad\Rightarrow
    S = T
    \]
    ```

    （1）该环境需要套在公式环境内；\
    （2）该环境绘制右括号分支公式

编译结果如图：

![ ](image-20.png)

### 5.10 公式-定理环境与 cleveref 引用

1. `newtheorem` 定理环境

    &emsp;&emsp;使用 `newtheorem` 可以定义不同的定理环境，定义语法为：`\newtheorem{<environment name>}[<counter>]{<display name>}[<number level>]`。`environment name` 为代码中环境名，根据需要写即可，该项为必填项；`counter` 为计数器，可以填写定义了的环境名，表示和某个环境共用编号计数器（如果同时有多个环境共用几个计数器，则需填写最开始的那个环境名），默认值为本环境名，该项为选填项；`display name` 就是编译后显示的环境名，根据需要填写即可，该项为选填项；`number level` 设置编号层次，根据文档类不同而有不同的选项，如 `book` 文档类就可以填 `chapter`、`section`、`subsection`等，该项为选填项。

    ```latex
    \documentclass[12pt]{ctexart}

    \usepackage{amsmath}
    \usepackage{mathtools}

    \newtheorem{definition}{定义}
    \newtheorem{theorem}[definition]{定理}
    \newtheorem{lemma}[definition]{引理}
    \newtheorem{corollary}{推论}[section]

    \begin{document}

    \section{定理环境一}

    \begin{definition}
        对数学术语的精准明确的描述。
    \end{definition}
    \begin{theorem}
        用严格的数学推理证明的数学命题。
    \end{theorem}
    \begin{lemma}
        辅助证明定理的次级结论。
    \end{lemma}
    \begin{corollary}
        依赖给定的定理引出的（通常简短的）结论。
    \end{corollary}

    \section{定理环境二}

    \begin{definition}
        对数学术语的精准明确的描述。
    \end{definition}
    \begin{corollary}
        依赖给定的定理引出的（通常简短的）结论。
    \end{corollary}
    \end{document}
    ```

    编译结果如图：

    ![ ](image-21.png)

2. `proof` 证明环境：需导入宏包 `amsthm`

    ```latex
    \begin{proof}[拉格朗日中值定理证明]
        引进辅助函数
        \[\phi(x) = f(x) - f(a) - \dfrac{f(b) - f(a)}{b-x}(x-a).\]
        容易验证函数$\phi(x)$适合罗尔定理的条件:$\phi(a)=\phi(b)= 0$,$\phi(x)$在闭区间$[a,b]$上连续,在开区间$(a,b)$上可导
        \cdots
    \end{proof}
    ```

    &emsp;&emsp;该证明环境在可以定义证明开始的字符串，在证明结束会有结束符，如图：

    ![ ](image-22.png)

3. 简单引用

    &emsp;&emsp;简单引用需在使用 `newtheorem` 定理环境时在 `\begin{}` 后面跟上 `\label{<label name>}`，引用方法和前面相同。

4. `hyperref` 引用

    &emsp;&emsp;这里引用方法和前面也是一样的，但需要注意的是只有引用的 `\newtheorem{theorem}[definition]{定理}` 才会自带文字，因为 `hyperref` 只支持如下引用：

    ```latex
    \renewcommand{\equationautorefname}{式}
    \renewcommand{\footnoteautorefname}{脚注}
    \renewcommand{\itemautorefname}{项}
    \renewcommand{\figureautorefname}{图}
    \renewcommand{\tableautorefname}{表}
    \renewcommand{\partautorefname}{篇}
    \renewcommand{\appendixautorefname}{附录}
    \renewcommand{\chapterautorefname}{章}
    \renewcommand{\sectionautorefname}{节}
    \renewcommand{\subsectionautorefname}{小小节}
    \renewcommand{\subsubsectionautorefname}{subsubsection}
    \renewcommand{\paragraphautorefname}{段落}
    \renewcommand{\subparagraphautorefname}{子段落}
    \renewcommand{\FancyVerbLineautorefname}{行} 
    \renewcommand{\theoremautorefname}{定理}
    ```

5. `cleveref` 引用：需导入 `cleveref` 宏包

    （1）`cleveref` 引用命令：`cref{<label name>}`，自定义引用命令为：`\crefname{<style name>}{<singular>}{<plural>}`。
    （2）`style name` 为需要定义的类型，如 `table`、`figure` 和前面定义了的 `definition` 等，`singular` 和 `plural` 为自定义的单数和复数情况下名字，对于中文来说这两种情况没有区别，写成一样的就行。
    （3）单纯的 `cleveref` 引用没有点击跳转功能，但通过和 `hyperref` 联用可以解决这个问题。导入所需要的包后使用如 `\hyperref[def:1]{\cref{def:1}}` 的命令就可以实现带跳转功能的引用了，其中 `[]` 内就是标签名，`{}` 内是需要显示的文字，这里会读取 `\cref{def:1}` 所代表的文字。

## 6. 长文档管理与学术规范

### 6.1 章节标题

&emsp;&emsp;一篇结构化的、条理清晰文档一定是层次分明的，通过不同的命令分割为章、节、小节。三个标准文档类 article、report 和 book 提供了划分章节地命令：

```latex
\chapter{<title>}   \section{<title>}   \subsection{<title>}
\subsubsection{<title>} \paragraph{<title>} \subparagraph{<title>}
```

其中 `\chapter` 只在 report 和 book 文档类有定义。这些命令生成章节标题，并能够自动编号。除此之外 $LaTeX$ 还提供了 `\part` 命令，用来将整个问昂分割为大的分块，但不影响 `\chapter` 或 `section` 等的编号。`\paragraph` 和 `\subparagraph` 生成的标题默认不带编号。

### 6.2 文档结构-前言正文附录后记

&emsp;&emsp;在正文区使用命令 `\tableofcontents` 可以在对应位置生成标题目录，另外使用命令 `\listoftables` 和 `\listoffigures` 还可分别生成表格清单、图片清单。这些命令生成的目录项默认不带目录，可以在这些命令后面添加 `\addcontentsline{toc}{<level>}{<title}` 将目录项写入进去。其中 `level` 代表章节层次，`title` 为要显示的目录项的名字。

&emsp;&emsp;所有标准文档类都提供了一个 `\appendix` 命令将正文和附录分开，使用 `\appendix` 后，最高一级章节改为使用拉丁字母编号，从  A 开始。book 文档类还提供了前言、正文、后记结构的划分命令：

- `\frontmatter` 前言部分，页码使用小写罗马数字；其后的 `\chapter` 不变好。
- `\mainmatter` 正文部分，页码使用阿拉伯数字，从 1 开始计数；其后的章节编号正常。
- `\backmatter` 后继部分，页码格式不变，继续正常计数；其后的 `\chapter` 不变好。

&emsp;&emsp;以上三个命令还可和 `\appendix` 命令结合，生成有前言、正文、附录、后记四部分的文档。

### 6.3 文档拆分

&emsp;&emsp;为了避免编写长文档时源代码文件太过臃肿，可以将源代码文件拆分为一个主文档和多个子文档，然后再主文档中引用子文档来优化结构。一般按章来进行文档拆分，然后在主文档指定位置使用命令 `\include{<file name>}` 或 `\input{<file name>}` 来引用，`\include` 会为子文档在前后新开一页，而 `\input` 会与后面的内容直接接续在一起。

![ ](image-23.png)

### 6.4 页眉页脚

1. `pagenumbering` 重置页码，基本语法 `\pagenumbering{<style>}`，`style` 可取值见下表：

    ![ ](image-24.png)

2. 内置页眉页脚设置命令

    ```latex
    \pagestyle{<style>}         % 设置全文页眉页脚样式
    \thispagestyle{<style>}     % 设置当前页页眉页脚样式
    ```

    &emsp;&emsp;`style` 为要设置的页眉页脚样式，可取值见下表：

    ![ ](image-25.png)

    &emsp;&emsp;在定义文档类时可通过类似 `\documentclass[oneside]{ctexbook}` 的命令将文档设置为单面排版（默认为双面排版），单面排版和双面排版时文档类默认的页眉页脚样式不同：

    - article文档类，twoside选项偶数页为页码和节标题，奇数页为小节标题和页码；
    - article文档类，oneside选项页眉为节标题和页码；
    - report和 book文档类，twoside选项偶数页为页码和章标题，奇数页为节标题和页码；
    - report 和 book文档类，oneside选项页眉为章标题和页码。

3. `fancyhdr` 宏包设置页眉页脚

    &emsp;&emsp;`fancyhdr` 的 fancy 页面风格把页面的页眉和页脚都分成左、中、右3个部分，因而一个页面就有6个部分。对于双面文档，则还分奇数页和偶数页，即有12个部分，如图：

    ![ ](image-26.png)

    &emsp;&emsp;图中各个部分可以用下列命令进行设置修改：

    ```latex
    \lhead{<内容>}              % 设置页眉左
    \chead{<内容>}              % 设置页眉中
    \rhead{<内容>}              % 设置页眉右
    \lfoot{<内容>}              % 设置页脚左
    \chead{<内容>}              % 设置页脚中
    \rhead{<内容>}              % 设置页脚右
    \fancyhead[<位置>]{<内容>}  % 设置页眉，位置可以是 E、O 与 L、C、R 的组合
    \fancyfoot[<位置>]{<内容>}  % 设置页脚，位置可以是 E、O 与 L、C、R 的组合
    \fancyhf[<位置>]{<内容>}    % 设置页眉及页脚，位置可以是 H、F 与 E、O 与 L、C、R 的组合
    ```

    &emsp;&emsp;这里，`\fancyhead`、`\fancyfoot` 和 `\fancyhf` 命令可以带表示位置的可选参数，其中 H、F 分别表示页眉（header）和页脚（footer）；E、O分别表示双面文档的偶数页（even page）和奇数页（odd page），单面文档仅奇数页有效；L、C、R分别表示左（left）、中（center）、右（right）。位置参数可以任意组合，多个参数用逗号分隔。如果省略位置参数，则表示所有的页眉、页脚。以下是使用范例：

    ```latex
    \documentclass{ctexbook}
    
    \usepackage{fancyhdr}
    \pagestyle{fancy}
    \fancyhf{}                  % 清空所有页眉页脚
    \chead{\kaishu XX大学毕业论文（设计）}
    \rhead{\leftmark}           % 页眉右设置为章标题
    \lhead{\rightmark}          % 页眉左设置为节标题
    \cfoot{\thepage}            % 页脚中设置为当前页码
    \fancyfoot[EL]{\thepage}    % 偶数页脚左设置为当前页码
    % fancyhf[]{\thepage}       % [] 为空，设置所有页眉页脚

    \begin{document}
        ...
    \end{document}
    ```

    &emsp;&emsp;默认情况下`fancyhdr` 会在页眉下方画一根横线，可使用命令 `\renewcommand{\headrulewidth}{0pt}` 取消，同样的可以使用命令 `\renewcommand{\footrulewidth}{2pt}` 在页脚上方画一根横线。

    >注：book 文档类默认排版偶数页章标题、奇数页节标题，在一般情况下偶数页在左边、奇数页在右边，所以 `\leftmark` 和 `rightmark` 就分别代表了节标题和章标题。

### 6.5 参考文献

&emsp;&emsp;LaTeX 提供了最基本的 `\cite` 命令用于在正文中引用参考文献，基本语法为：`\cite{<citation>}`。其中，`citation` 为引用的参考文献的标签，类似 `\ref` 里的参数。

&emsp;&emsp;LaTeX 中提供了手动排版参考文献的格式，但在实际使用当中通常使用 BibTeX 自动生成。BibTeX 是最为流行的草靠文献数据组织格式之一。它的出现让我们摆脱手写参考文献条目的麻烦。我们还可以通过参考文献样式的支持，让同一份 BibTeX 数据库生成不同样式的参考文献列表。
&emsp;&emsp;BibTeX 数据库以 `.bib` 作为扩展名，其内容是若干个文献条目，每个条目的格式为：

```latex
@<type>{<citation>,
    <key1> = {<value1>},
    <key2> = {<value2>},
    ...    
}
```

&emsp;&emsp;其中 `type` 为文献的类别，如 `article` 为学术论文，`book` 为数据，`incollection` 为论文集中的某一篇，等等。`citation` 为 `\cite` 命令使用的文献标签。在 `citation` 之后为条目里各个字段，以 `<key> = {<value>}` 的形式组织。以下为一个 `article` 类别的参考文献数据条目示例：

```latex
@article{Alice13,
title = {Demostration of bibliography items},
author = {Alice Axford and Bob Birkin and Charlie Copper and Danny Dannford},year = {2013},
month = {Mar} ,
journal = {Journal of \TeX perts},volume = {36},
number = {7},
pages = {114-120}}
```

所有类别的文献条目格式请参考<CTAN://biblio/bibtex/base/btxdoc.pdf>。\
&emsp;&emsp;多数时候，我们无需自已手写 BibTeX 文献条目。从Google Scholar 或者期刊/数据库的网站上都能够导出 BibTeX 文献条目，Zotero、Endnote 等文献管理工具都具有 BibTeX 文献数据库生成功能。

&emsp;&emsp;参考文献的写法在不同文献里千差万别，包括作者、标题、年份等各项的顺序和字体样式、文献在列表里的排序规则等。BibTEe 用样式来管理参考文献的写法。BibTeX 提供了几个预定义的样式，如plain，unsrt，alpha等。

&emsp;&emsp;设置参考文献样式需要在导言区使用命令：`\bibliographystyle{<style>}`，这里 `style` 为样式名，以下是常见的几种样式排版效果：

![ ](image-27.png)

&emsp;&emsp;其中 `GB/T 7714` 是中国国家标准化管理委员会发布的《信息与文献参考文献著录规则》。它是中国学术界最权威、使用最广泛的学术论文参考文献格式标准。无论是在国内发表中文核心期刊论文、撰写本科/硕博毕业论文，还是编写学术专著，基本都要遵循这个标准。在 LaTeX 中使用该样式需先在导言区使用命令 `\usepackage{gbt7714}` 导入宏包，然后使用命令 `\bibliographystyle{gbt7714-nemerical}` 设置样式，在正文区使用命令 `\cite` 引用了，最后在需要排版参考文献的位置使用命令 `bibliography{<file name>}`（其中 `file name` 为数据库文件名，不需要带 `.bib` 扩展名）。

&emsp;&emsp;除此之外，因为 `biblatex`宏包对 `UTF-8` 和中文参考文献的支持良好，所以也经常用 `biblatex` 宏包排版参考文献。使用该宏包排版 `GB/T 7714` 样式参考文献需要在导言区使用命令 `\usepackage[style=gb7714-2015]{biblatex}` 导入宏包，然后使用命令 `\addbibresource{<file name>}` 添加参考文献数据库，最后在正文区需要排版参考文献的位置使用命令 `\printbibliography` 即可。

&emsp;&emsp;使用 `biblatex` 宏包排版参考文献，在正文区不仅可以使用 `\cite` 命令引用参考文献，还可以使用以下命令实现不同的引用效果：

```latex
\citeauthor     % 单独引用作者
\citeyear       % 单独引用年份
\textcite       % 姓名 + 编号（如：张三 [1]），用于把作者当主语时
\parencite      % 纯编号（如：[1]），用于句末补充说明
\footcite       % 脚注引用，在页面底部显示文献信息
```

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
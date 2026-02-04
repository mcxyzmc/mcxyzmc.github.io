---
title: Ubuntu子系统下LAMMPS的安装
mathjax: true
swiper: false
top: true
date: 2026-01-14 22:52:28
updated:
tags:
    - LAMMPS
    - Ubuntu
categories:
    - [scientific research, software]
---

**写在前面**：本文包含比较多的基础知识讲解、注解及多个版本LAMMPS的安装，主要面向刚接触LAMMPS的小白，如果有时间笔者建议把本文认真读完再进行实操。如果只是想快速安装LAMMPS跑代码笔者建议直接下载windows版LAMMPS或者直接阅读本文第二节和第四节再Ubuntu子系统下安装纯CPU版的LAMMPS，**笔者强烈建议使用cmake安装LAMMPS**

## 一. 基础知识

### 1.1 Linux基础命令

1. **`ls`显示当前目录下所有的文件及文件夹**
在work目录及其子目录下，文件数较多时尽量不要使用`ls`，防止死机

2. **`cd`从当前目录切换到指定目录**

    ```bash
    cd 目录名
    cd ..                       % 退回到上级目录
    cd                          % 切换到用户目录
    ```

3. **`pwd`显示当前目录绝对路径**

4. **`mkdir`创建目录**

    ```bash
    mkdir 目录名
    ```

5. `rmdir`删除目录

    ```bash
    rmdir 目录名                % 删除该目录（空目录）
    ```

6. **`cp`复制文件**

    ```bash
    cp 源文件 目标文件          % 复制单个文件
    cp -r 源目录 目标目录       % 复制整个目录及其内容
    ```

7. `mv`移动文件

    ```bash
    mv 源文件 目标文件          % 移动单个文件
    mv 源目录 目标目录          % 移动整个目录及其内容
    ```

8. `rm`删除文件

    ```bash
    rm 文件名                   % 不要在~下使用该命令，可能删除根目录中隐藏文件
    rm -rf 目录名               % 强制删除目录及其内容（非空目录）
    ```

9. `cat`显示文件/合并文件

    ```bash
    cat 文件名                  % 查看文件内容
    cat 文件1 文件2 > 新文件    % 合并文件内容并输出到新文件
    cat 文件1 文件2 >> 原文件   % 合并文件内容并追加到原文件
    ```

10. `more`分页显示文件

    ```bash
    more 文件名                 % 按页显示文件内容，空格翻页，q退出
    ```

11. `head`显示头部文件

    ```bash
    head 文件名                 % 查看文件开头内容（默认为前10行）
    head -n 行数 文件名         % 查看文件开头前n行内容
    ```

12. `tail`显示尾部文件

    ```bash
    tail 文件名                 % 查看文件末尾内容（默认为最后10行）
    tail -n 行数 文件名         % 查看文件末尾后n行内容 
    ```

>①本文采用`%`作为注释符，执行命令时请略去`%`及其后面的内容
②更多Linux命令请参考[CSDN|Linux常用操作命令大全][网址一]及[菜鸟教程|Linux命令大全][网址二]

### 1.2 WSL基础命令

1. **`wsl --install`采用默认设置（WSL2 + Ubuntu）安装WSL**

    ```bash
    wsl --install <Distribution Name>       %安装指定的Linux发行版
    wsl --install --web-download            %从联机源（github）而不是通过Microsoft Store安装
    wsl --install --no-distribution         %不安装Linux发行版，只安装WSL
    ```

2. **`wsl --update`将 WSL 版本更新为最新版本（同样可加`--web-download`更改下载源）**

3. `wsl --version`检查WSL版本

4. `wsl --status`检查WSL状态 

5. **`wsl --list --online`列出可用的Linux发行版（可简写为`wsl -l -o`）**

6. `wsl --list --verbose`列出已安装的Linux发行版及其状态、版本（可简写为`wsl -l -v`）

7. `wsl --set-version <Distribution Name> <versionNumber> `将运行指定的Linux发行版的WSL版本设置为指定版本

8. `wsl --set-default <Distribution Name>`使用指定Linux发行版运行WSL命令

9. `wsl --shutdown`立即终止所有正在运行的Linux发行版进程

10. `wsl --help`Help命令

>更多WSL基础命令请参考[Microsoft官方|WSL的基本命令][网址三]

### 1.3 进程、线程与GPU加速

1. 硬件基础概念
    - CPU（中央处理器）：计算机的总指挥。在LAMMPS中，CPU负责逻辑控制、积分计算和大部分力场计算。
    - 物理核心：CPU硬件上独立的处理单元。比如一个8核CPU，就有8个真实的计算核心。**在绝大多数情况下，LAMMPS运行的最优策略是：将MPI进程数（-np）设置为等于你的物理核心数。**
    - 逻辑处理器：通过“超线程（Hyper-Threading）”技术，将一个物理核心虚拟成两个。**对于分子动力学这种计算密集型任务，超线程通常没有帮助，因为这两个“逻辑核”会争抢同一个物理计算单元，导致相互等待，通常会比只开物理核慢10%-30%**。
2. 并行计算与软件架构
    1. 进程与MPI
        - 进程：操作系统中运行的一个独立程序实例，拥有独立的内存空间。
        - MPI：不同进程之间通信的标准。
        - MPICH/OpenMPI：这是 MPI 的两种主流实现库。
        - 在LAMMPS中：当你运行`mpirun -np 4 lmp`时，你启动了4个相互独立的进程。LAMMPS会将模拟体系切割成4个空间区域，每个进程负责一个区域。
    2. 线程与OpenMP：
        - 线程：进程内部的更小执行单位，共享同一个进程的内存。
        - OpenMP：实现多线程并行的标准。
        - 在LAMMPS中，通常通过启用USER-OMP或KOKKOS包使用。**一个MPI进程可以下辖多个线程，适用于节点内核心非常多但内存带宽受限的情况。这种情况下的最佳策略一般为：进程数x线程数=物理核心数。**
3. GPU加速
    - GPU（图形处理器/显卡）：擅长执行大规模重复性计算（如成千上万个原子间的相互作用力）。在LAMMPS中，可以启用GPU包或Kokkos包将计算量最大的“非键结力（Pair Forces）”卸载到GPU上，大幅加速模拟。LAMMPS的GPU包和Kokkos包主要针对NVIDIA显卡，虽然也支持AMD/Intel（使用OpenCL或其他接口），但目前NVIDIA+CUDA是最主流、最稳定的组合。
    - 驱动：负责操作系统与显卡硬件之间的沟通，告诉显卡什么时候该干活，并管理硬件资源。**在终端输入`nvidia-smi`，右上角可以看到你的驱动版本和它支持的最高CUDA版本。**
    - CUDA-Toolkit：提供了各种数学库和编程接口，让开发者知道如何编写程序才能让显卡听得懂，并把任务分配给显卡。当你从源码编译LAMMPS时，编译器需要CUDA-Toolkit里的库文件来生成支持GPU的可执行文件。此外，LAMMPS运行时也需要调用这些库来把原子坐标传给显卡并取回计算结果。
    - 协作流程：  
        ①LAMMPS程序：发起请求，说“我要计算这 10 万个原子的相互作用力”。  
        ②CUDA-Toolkit：根据代码指令，把这些复杂的数学公式拆解成GPU能处理的成千上万个小任务。  
        ③驱动：接收这些任务，确认显卡当前有空，然后把数据从内存搬运到显存中。  
        ④显卡：疯狂并行计算。  
        ⑤驱动：计算完后，把结果从显存搬回内存交给CPU进行下一步的原子位置更新。

### 1.4 LAMMPS主要命令行选项

LAMMPS的命令行选项是“运行前配置”的核心入口，支持在不修改输入脚本的前提下，快速调整输入输出路径、硬件资源分配、多模拟任务分区、重启文件转换等关键行为，尤其适合批量模拟、性能调优、调试等场景。

1. 输入输出控制
    - `in filename`：指定要运行的脚本文件
    - `-log filename`：指定日志文件的名称（默认值为`log.lammps`，设置为`none`则不输出日志）
    - `-screen filename/none`：指定屏幕输出存到哪个文件（在超算上提交任务时，通常设置`-screen none`，这样可以减少不必要的I/O操作，提高一点点效率）
    - `echo screen/log/both/none`：决定是否在屏幕/日志里复读你的输入脚本（如果你的脚本运行报错，开启`-echo screen`能让你看清程序运行到哪一行代码时挂掉的）
2. 变量传递
    - `-var name value`（简写为`-v`）：在启动时定义一个变量，它会覆盖脚本中同名的`variable`定义
3. 并行与分区控制
    - `partition NxM`：将总的MPI进程划分为多个“分区”（例子`mpirun -np 16 lmp -partition 4x4 -in in.run`，16个核被分成4组，每组4个核，同时跑4个模拟）
    - `-plog filename`/`-pscreen filename`：为每个分区生成独立的日志/屏幕输出，文件名会自动加上分区编号（如log.lammps.0,log.lammps.1）
4. 性能优化与软件包
    - `suffix style`（简写为`-sf`）：告诉LAMMPS优先调用某种优化过的算法（即给所有支持的命令加上后缀），常用值有`gpu`,`omp`,`intel`,`kk`（Kokkos）,例如`lmp -sf omp`相当于自动把脚本里的`pair_style lj/cut`变成了`pair_style lj/cut/omp`
    - `package style args`（简写为`-pk`）：配置上述优化包的具体参数，可以设置OpenMP线程数或GPU数量，例如`-sf gpu -pk gpu 1`开启GPU后缀并指定使用1块GPU
5. 硬件抽象层（Kokkos专用）
    - `-k on/off`：开启或关闭Kokkos模式，Kokkos是一个现代并行框架，可以让同一份代码在CPU、GPU上都能跑
    - `-k on device N`：指定Kokkos使用多少个GPU或是如何分配线程
6. 帮助与元数据
    - `h`或`-help`：可以显示用法，还会列出当前这个LAMMPS可执行文件编译进了哪些功能，如果你不确定你的LAMMPS是否支持某个势函数，运行`lmp -h`查一下列表
    - `-version`：显示版本日期，报Bug或发论文引用时需要
    - `-cite filename`：运行结束后，LAMMPS会把你用到的算法对应的参考文献列出来，存到这个文件里

---

## 二. Ubuntu子系统的安装

### 2.1 Linux功能的启用

1. 按下`Win + S`，输入启用或关闭Window功能，回车
2. 在弹出的界面勾选上`Virtual Machine Platform`和`适用于Linux的Windows子系统`，重启电脑

### 2.2 Ubuntu的安装

#### 2.2.1 WSL的安装

**方法一**

1. 按下`Win + R`，输入`cmd`回车打开PowerShell窗口
2. 在`PowerShell`窗口中输入以下命令安装WSL

    ```bash
    wsl --install
    ```

    >执行`wsl --install`命令在安装WSL的同时还会默认安装一个Linux发行版Ubuntu（按理说这个也能用，可以不用下载其他版本的Ubuntu）

**方法二**

1. 按下`Win + I`，打开系统-系统信息，查看系统类型
2. 前往[github|WSL稳定版][网址六]下载最新的对应版本的WSL2并安装（建议科学上网）

    >执行`wsl --install`命令在安装WSL的同时还会默认安装一个Linux发行版Ubuntu（按理说这个也能用，可以不用下载其他版本的Ubuntu）

#### 2.2.2 Ubuntu的安装

**方法一**

1. 按下`Win + S`，输入`Microsoft Store`，回车
2. 在弹出的界面搜索栏中输入`ubuntu`回车，下载最新版的Linux发行版Ubuntu

**方法二**

1. 按下`Win + I`，打开系统-系统信息，查看系统类型（`x64`/`arm64`/其它）
2. 前往[Microsoft官方|旧版WSL的手动安装步骤][网址七]下载并安装最新版的Linux发行版Ubuntu

    >注意：不是Microsoft Store跳转链接而是下载链接

    ![ ](image.png)

**方法三**

1. 在`PowerShell`窗口执行命令`wsl -l -o`查看可下载的Linux发行版
2. 在`PowerShell`窗口执行类似`wsl --install Ubuntu-24.04`（要安装哪个版本根据自己需要更改就行）

#### 2.2.3 Ubuntu账号注册

1. 按下`Win + R`，输入`cmd`回车打开PowerShell窗口
2. 通过下拉箭头选择最新版的Ubuntu并打开，首次打开会提示创建用户名和密码，输入即可

    >输入密码时不会有任何显示，这是正常现象

    ![ ](image-1.png)

---

## 三.传统make安装LAMMPS

### 3.1 CPU并行版LAMMPS的安装

#### 3.1.1 安装CUDA Toolkit（可选但推荐）

1. 在Ubuntu终端执行`nvidia-smi`命令检查显卡驱动，由下图可知，该电脑显卡配置为NVIDIA，显卡驱动版本为：527.83，CUDA版本为：12.8，因此可安装的CUDA最高版本为12.8
    ![ ](image-2.png)

    >①本节仅针对需要安装GPU/KOKKOS版本LAMMPS，CPU版本LAMMPS可跳过  
    ②如果执行命令`nvidia-smi`显示没有找到命令请自行检索NVIDIA驱动安装方法，请注意不要在Linux子系统内部安装显卡驱动，子系统内只装CUDA-Toolkit

2. 在Ubuntu终端执行`uname -m`命令查询系统架构
3. 前往[CUDA官网][网址八]根据电脑配置选择对应版本，在Ubuntu终端执行对应版本CUDA的安装命令（这一步建议科学上网下载快些，命令执行过程中请耐心等待）
    ![ ](image-3.png)

    >以下对图中三种安装方式进行讲解：  
    ①deb(local)——离线安装包：下载的是一个非常大的文件（通常几个GB），里面包含了CUDA Toolkit的所有组件和驱动。由于使用了系统的包管理器(apt)，它会自动处理依赖关系，安装过程相对标准、稳健。  
    ②deb(network)——在线/网络安装包：下载的是一个非常小的引导文件（几百KB）。当你运行安装命令时，它会实时从NVIDIA官网下载你需要的组件。它只下载你勾选或需要的组件，而且它会将NVIDIA的官方仓库添加到你的系统软件源中，以后你可以通过 `sudo apt upgrade`像更新普通软件一样更新CUDA。但是使用这种方式在安装过程中必须保持网络畅通且稳定，如果网络不好，安装会频繁报错。  
    ③runfile(local)——通用脚本安装：这是一个以.run结尾的自解压脚本文件（也是离线的，包含所有组件）。它不使用操作系统的包管理器，而是直接运行一个交互式的安装界面。它允许你非常方便地选择“装Toolkit但不装显卡驱动”，如果你已经手动装好了显卡驱动，用`runfile`可以避免被`deb`安装包强制覆盖掉当前驱动，从而导致黑屏或系统崩溃。但是安装后，你通常需要手动配置环境变量，且卸载时比较麻烦。

4. 在Ubuntu终端执行命令`vim ~/.bashrc`将添加类似以下内容到环境变量，确认无误后执行命令`source ~/.bashrc`使更改生效；执行`which nvcc`命令检查环境变量是否添加成功

    ```bash
    export PATH=/usr/local/cuda-12.8/bin:$PATH
    export LD_LIBRARY_PATH=/usr/local/cuda-12.8/lib64:$LD_LIBRARY_PATH
    ```

    >①使用vim编辑器按`i`键进入编辑模式，按`Esc`键退出编辑模式，再输入`:wq`回车即可保存退出  
    ②`cuda-12.8`根据你的实际情况修改（安装过程中会弹出相关信息）

    ![ ](image-4.png)

#### 3.1.2 安装基础包

打开Ubuntu子系统，执行以下命令安装基础包

```bash
sudo apt-get update                     %更新系统中安装的包的列表，以确保安装时使用的是最新版本的包
sudo apt-get install build-essential    %安装g++、gcc及vim编辑器
sudo apt-get install cmake
sudo apt-get install gfortran
```

>可以通过输入which gcc、which g++、which vim、which gfortran、which cmake来检验是否安装成功，若安装成功会显示该命令所在路径

#### 3.1.3 下载并安装OPENMPI和FFTW

1. 前往[OPENMPI官网][网址九]和[FFTW官网][网址十]下载稳定版软件压缩包
    >①OPENMPI也可换成[MPICH][网址十一]，OPENMPI对于集群环境、GPU加速有更好的支持而MPICH在WSL环境中更稳定  
    ②事实上LAMMPS仅对MPI有硬性要求，安装FFTW是因为其性能比LAMMPS自带的性能要好

    ![ ](image-5.png)
    ![ ](image-6.png)

2. 在Ubuntu终端依次执行类似以下命令，将安装包从下载目录拷贝到目标目录

    >`mnt`是linux通往Windows文件夹的“入口”，后面的c代表的就是c盘，`mnt`后面的路径需要换成你自己安装包所在路径

    ```bash
    mkdir lmp                                               %在当前目录创建一个lmp文件夹
    cd lmp                                                  %进入lmp文件夹
    mkdir fftw                                              %在当前目录创建fftw文件夹
    mkdir openmpi                                           %在当前目录创建openmpi文件夹
    cp /mnt/c/Users/xyy/Downloads/fftw-3.3.10.tar.gz ./     %将fftw安装包拷贝到当前文件夹
    cp /mnt/c/Users/xyy/Downloads/openmpi-5.0.8.tar.gz ./   %将openmpi安装包拷贝到当前文件夹
    ls                                                      %查看当前目录下文件，确保都已正确拷贝
    ```

3. 在Ubuntu终端依次执行类似以下命令，解压、编译、安装OPENMPI

    >①`\`是换行符，等同于将`\`删去并将下一行与当前行合并  
    ②如果未安装CUDA则需删去命令中的`--with-cuda=/usr/local/cuda-12.8`  
    ③`make -j`进程数越多编译越快，可在Ubuntu终端执行命令`nproc`查看当前系统可用进程数,或者直接执行命令`make -j $(nproc)`可自动根据硬件配置设置并行任务的数量，最大化利用系统资源

    ```bash
    tar -xvzf openmpi-5.0.8.tar.gz                          %tar -xvzf是tar.gz类压缩文件的解压缩命令
    cd openmpi-5.0.8                                        %进入解压缩后生成的文件夹
    ./configure --prefix=/home/xyy/lmp/openmpi \
    --with-cuda=/usr/local/cuda-12.8                        %将openmpi安装到创建的openmpi文件夹
    make –j 32                                              %采用32进程并行编译
    make install                                            %安装OPENMPI
    cd ..                                                   %回退到上一级目录
    cd openmpi                                              %进入创建的openmpi文件夹
    ls                                                      %查看当前目录下文件，确保安装无误
    ```

4. 在Ubuntu终端执行`vim ~/.bashrc`命令，在bashrc文件中添加类似以下内容，确认无误后执行`source ~/.bashrc`命令使更改生效，执行`which mpirun`检查是否添加成功

    ```bash
    export PATH=/home/xyy/lmp/openmpi/bin:$PATH
    ```

5. 在Ubuntu终端依次执行类似以下命令，解压、编译、安装FFTW

    ```bash
    cd /home/xyy/lmp                            %进入lmp目录
    tar -xvzf fftw-3.3.10.tar.gz                %解压fftw安装包
    cd fftw-3.3.10                              %进入解压生成的文件夹
    ./configure --prefix=/home/xyy/lmp/fftw     %将fftw安装到创建的fftw文件夹
    make –j 32                                  %采用32进程并行编译
    make install                                %安装fftw
    cd ..                                       %回到上一级目录
    cd fftw                                     %进入fftw文件夹
    ls                                          %查看当前目录下文件，检查是否正确安装
    ```

#### 3.1.4 下载并安装LAMMPS

##### 3.1.4.1 下载并解压LAMMPS

1. 前往[LAMMPS官网][网址十二]下载最新稳定版软件安装包
![ ](image-7.png)

2. 在Ubuntu终端依次执行类似以下命令，将ammp安装包从下载目录拷贝到目标目录并解压

    ```bash
    cd /home/xyy/lmp                                            %退到lmp目录
    cp /mnt/c/Users/xyy/Downloads/lammps-stable.tar.gz ./       %将lammps安装包拷贝到当前文件夹
    tar -xvzf lammps-stable.tar.gz                              %解压lammps
    ```

##### 3.1.4.2 生成LAMMPS可执行文件

1. 在Ubuntu终端依次执行类似以下命令自定义Makefile
    >若此前安装的是MPICH，则需要修改的文件为Makefile.g++_mpich

    ```bash
    cd /home/xyy/lmp/lammps-22Jul2025/src/MAKE/OPTIONS
    ls                              %查看当前目录下文件，其中Makefile.g++_openmpi即为需要修改的文件
    vim Makefile.g++_openmpi        %编辑Makefile.g++_openmpi文件
    ```

    ![ ](image-8.png)
    在打开的Makefile文件相应位置添加类似以下内容

    ```bash
    -I/home/xyy/lmp/openmpi/include
    -L/home/xyy/lmp/openmpi/lib
    -I/home/xyy/lmp/fftw/include
    -L/home/xyy/lmp/fftw/lib
    ```

    ![ ](image-9.png)

2. 在Ubuntu终端执行类似以下命令配置所需要的包并编译生成可执行文件

    >①若此前安装的是MPICH，则`make -j 32 g++_openmpi`应改为`make -j 32 g++_mpich`  
    ②在make编译时，安装/卸载包直接添加命令`yes-包名/no-包名`即可，每次更新配置的包都需要重新编译可执行文件

    ```bash
    cd /home/xyy/lmp/lammps-22Jul2025/src       %进入lammps的src文件夹
    make ps                                     %查看当前所有包的状态，初始所有包均为no，ps即package status
    make yes-molecule yes-kspace yes-rigid yes-manybody \
    yes-meam yes-class2 yes-extra-pair yes-extra-fix \
    yes-extra-dump yes-extra-compute yes-extra-molecule \
    yes-dpd-basic yes-dpd-meso yes-misc yes-mc \
    yes-reaxff yes-qeq                          %这里提供的配置能满足大部分模拟需求
    make –j 32 g++_openmpi                      %编译可执行文件，这里g++_openmpi为刚才修改的Makefile文件的后缀
    ```

3. 在Ubuntu终端执行命令`vim ~/.bashrc`将类似以下内容添加到环境变量，确认无误后执行命令`source ~/.bashrc`使更改生效；执行命令`lmp_g++_openmpi`检查环境变量是否添加成功；最后按`Ctrl + C`中断程序运行

    >若此前下载的是MPICH，则执行命令`lmp_g++_mpich`检查环境变量是否添加成功

    ```bash
    export PATH=/home/xyy/lmp/lammps-22Jul2025/src:$PATH
    ```

4. 在Ubuntu终端依次执行以下命令检验CPU并行版LAMMPS能否正常运行

    >`lmp_g++_openmpi`为刚才编译的可执行文件，`in.flow.couette`是LAMMPS自带的一个示例文件，关于示例文件讲解可看本文第五节LAMMPS官方example讲解

    ```bash
    cd ..                                               %返回上一级目录
    cd examples                                         %进入lammps自带的示例文件夹
    cd flow                                             %进入flow例子文件夹
    mpirun -np 32 lmp_g++_openmpi -in in.flow.couette   %采用32MPI进程进行运行lammps
    ```

    ![ ](image-10.png)

### 3.2 GPU加速版LAMMPS的安装

1. 在Ubuntu终端执行类似以下命令修改Makefile.linux文件，将`CUDA_HOME = /usr/local/cuda`修改为`CUDA_HOME = /usr/local/cuda-12.8`

    ```bash
    cd /home/xyy/lmp/lammps-22Jul2025/lib/gpu   %进入lammps的gpu文件夹
    vim Makefile.linux                          %使用vim编辑Makefile.linux文件
    ```

2. 根据计算机配置在[维基百科|CUDA][网址十三]中找到对应算力，如`GeForce GTX 1080`为6.1，则将Makefile.linux文件中`CUDA_ARCH = -arch=sm_60`注释，将`CUDA_ARCH = -arch=sm_61`取消注释

    ![ ](image-11.png)

3. 根据电脑配置修改Makefile.linux文件中计算精度设置
一般游戏本单精度计算能力较强可修改为`CUDA_PRECISION = -D_SINGLE_DOUBLE`为`CUDA_PRECISION = -D_SINGLE_SINGLE`；  
专业计算卡双精度计算能力较强可修改为`CUDA_PRECISION = -D_DOUBLE_DOUBLE`；  
若是不确定保持混合精度即可
4. 修改完成后保存退出，执行命令`make –f Makefile.linux`命令进行编译
5. 在Ubuntu终端执行类似以下命令重新编译可执行文件并运行GPU版本LAMMPS

    ```bash
    cd /home/xyy/lmp/lammps-22Jul2025/src       %进入lammps的src文件夹
    make yes-gpu                                %启用gpu包
    make -j 32 g++_openmpi                      %重新编译可执行文件
    cd ..                                       %返回上一级目录
    cd examples                                 %进入lammps自带的示例文件夹
    cd flow                                     %进入flow例子文件夹
    mpirun -np 1 lmp_g++_openmpi -sf gpu -pk gpu 1 -in in.flow.couette
    ```

### 3.3 KOKKOS加速版LAMMPS的安装

1. 在Ubuntu终端执行类似以下命令根据计算机配置修改Makefile.kokkos_cuda_mpi文件，如`GeForce GTX 1080`为Pascal6.1，则将`KOKKOS_ARCH = Volta70`改为`KOKKOS_ARCH = Pascal61`，保存退出

    ```bash
    cd /home/xyy/lmp/lammps-22Jul2025/src/MAKE/OPTIONS      %进入OPTIONS文件夹
    vim Makefile.kokkos_cuda_mpi                            %编辑Makefile.kokkos_cuda_mpi文件
    ```

2. 在Ubuntu终端执行类似以下命令重新编译可执行文件并运行KOKKOS版本LAMMPS

    >使用`make`编译lammps可执行文件时gpu包和kokkos包是冲突的，所以这里需要将gpu包禁用

    ```bash
    cd /home/xyy/lmp/lammps-22Jul2025/src       %进入lammps的src文件夹
    make no-gpu                                 %禁用gpu包
    make yes-kokkos                             %启用kokkos包
    make -j 32 kokkos_cuda_mpi                  %重新编译可执行文件
    cd ..                                       %返回上一级目录
    cd examples                                 %进入lammps自带的示例文件夹
    cd flow                                     %进入flow例子文件夹
    mpirun -np 1 lmp_kokkos_cuda_mpi -sf kk -k on g 1 -in in.flow.couette
    ```

---

## 四.推荐cmake安装LAMMPS

### 4.1 CPU并行版LAMMPS的安装

#### 4.1.1 安装CUDA Toolkit（可选但推荐）

1. 在Ubuntu终端执行以下命令，添加NVIDIA官方CUDA仓库
    >这部分在第三节已经讲解的比较详细，所以这里不再赘述，笔者再次提醒这里请务必注意检查驱动支持的最高的CUDA版本

    ```bash
    wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2404/x86_64/cuda-keyring_1.1-1_all.deb
    sudo dpkg -i cuda-keyring_1.1-1_all.deb
    sudo apt update
    ```

2. 在Ubuntu终端执行以下命令，安装CUDA Toolkit 12.8

    ```bash
    sudo apt install -y cuda-toolkit-12-8
    ```

3. 在Ubuntu终端执行以下命令，将CUDA写入环境变量并验证是否安装成功

    ```bash
    echo 'export PATH=/usr/local/cuda-12.8/bin:$PATH' >> ~/.bashrc
    echo 'export LD_LIBRARY_PATH=/usr/local/cuda-12.8/lib64:$LD_LIBRARY_PATH' >> ~/.bashrc
    source ~/.bashrc
    nvidia-smi
    nvcc --version
    ```

#### 4.1.2 安装前置依赖

打开Ubuntu子系统，执行以下命令安装基础包

```bash
sudo apt update
sudo apt install -y \
build-essential cmake git gfortran pkg-config \
libopenmpi-dev openmpi-bin \
libfftw3-dev libzstd-dev \
libopenblas-dev liblapack-dev \
libhdf5-dev libnetcdf-dev \
libvoro++1 voro++-dev \
libjpeg-dev libpng-dev zlib1g-dev \
python3 python3-dev python3-numpy \
ffmpeg libpnetcdf-dev
```

>以下是安装的依赖库作用讲解：  
**构建工具和cmake**  
`build-essential`：安装编译软件所需的工具和库，包括gcc,g++,make等  
`cmake`：安装CMake，这是LAMMPS的构建系统，用于配置、生成Makefile进行编译  
`git`:安装Git，用于版本控制，通常用于从GitHub或其他代码库下载LAMMPS的源代码  
`gfortran`：安装GNU Fortran编译器，对于某些LAMMPS功能（如FFTW3的Fortran接口）是必须的  
`pkg-config`：用于查询已安装的库和它们的编译选项，常用于确认是否有正确的依赖  
**MPI和并行运算支持（等价于3.1.3节OPENMPI的安装）**  
`libopenmpi-dev`：安装OpenMPI的开发库，这对于启用MPI并行计算（多节点分布式计算）是必需的  
`opempi-bin`：安装OpenMPI的二进制文件和工具，允许在多节点环境下运行LAMMPS  
**数学库（等价于3.1.3节FFTW的安装）**  
`libfftw3-dev`：安装FFTW3库，这是一个快速傅里叶变换库，用于计算长程库伦相互作用  
`libzstd-dev`：安装Zstandard（ZSTD）压缩库，LAMMPS在某些情况下会用它来进行数据压缩  
**线性代数和数值库**  
`libopenblas-dev`：安装OpenBLAS，一个开源的BLAS（基本线性代数子程序）库，提供高效的矩阵运算功能  
`liblapack-dev`：安装LAPACK，用于线性代数运算（例如解线性方程、特征值问题等），在分子动力学中用于计算力学操作  
**HDF5和NetCDF支持**  
`libhdf5-dev`：安装HDF5数据格式的开发库，支持高效存储和读取大数据集。LAMMPS可以用它来存储模拟数据  
`libnetcdf-dev`：安装NetCDF库，用于存储和共享科学数据，特别是在气候、气象学和流体动力学中使用。LAMMPS支持使用NetCDF格式输出轨迹数据  
**Voronoi和几何库**  
`libvoro++1`：安装Voro++库，这是一种用于计算Voronoi图和邻接图的库。LAMMPS可以使用它来进行空间分配或颗粒接触分析  
`voro++-dev`：安装Voro++的开发版本，包含库和头文件  
**图像处理库**  
`libjpeg-dev`：安装JPEG图像格式库，通常用于图像处理和压缩。LAMMPS可能需要它来读取或写入JPEG图像文件  
`libpng-dev`：安装PNG图像格式库，类似于libjpeg，用于图像格式支持  
`zlib1g-dev`：安装zlib库，用于数据压缩和解压缩，很多LAMMPS的数据处理和文件存储都可能会用到它  
**Python库**  
`python`：安装Python3解释器。LAMMPS提供了Python接口，允许在LAMMPS模拟中使用Python脚本  
`python2-dev`：安装Python3的开发文件，包含Python的头文件和开发工具，必要时用于编译包含Python接口的包  
`python3-numpy`：安装NumPy库，这是Python中用于数值计算的基础库，LAMMPS与Python的接口通常需要它  
**FFmpeg和PNetCDF**  
`ffmpeg`：安装FFmpeg，一个开源的音视频处理库，LAMMPS可能会使用它来处理视频文件，尤其是生成模拟过程的视频  
`libpnetcdf-dev`：安装PnetCDF库，用于并行NetCDF文件的读写。用于处理大规模模拟输出数据的并行读取  

#### 4.1.3 正式安装LAMMPS

1. 在Ubuntu终端执行类似以下命令获取lammps源码并构建目录

    >笔者尝试这种安装方式时不知道为什么失败了（后面发现好像是因为科学上网），所以是前往官网下载并解压出来的，采用这种方式解压出来的文件夹好像是`lammps`，请注意修改

    ```bash
    mkdir lmp
    cd lmp
    git clone -b stable https://github.com/lammps/lammps.git
    cd lammps-22Jul2025
    mkdir build
    cd build
    ```

2. 在Ubuntu终端依次执行类似以下命令配置所需要的包

    ```bash
    cmake ../cmake \
    -D PKG_MOLECULE=on \
    -D PKG_KSPACE=on \
    -D PKG_RIGID=on \
    -D PKG_MANYBODY=on \
    -D PKG_MEAM=on \
    -D PKG_CLASS2=on \
    -D PKG_EXTRA-PAIR=on \
    -D PKG_EXTRA-FIX=on \
    -D PKG_EXTRA-DUMP=on \
    -D PKG_EXTRA-COMPUTE=on \
    -D PKG_EXTRA-MOLECULE=on \
    -D PKG_DPD=on \
    -D PKG_MISC=on \
    -D PKG_MC=on \
    -D PKG_REAXFF=on \
    -D PKG_QEQ=on \
    -D PKG_ELECTRODE=on \
    -D PKG_OPENMP=on \
    \
    -D LAMMPS_MACHINE=mpi \
    -D CMAKE_INSTALL_PREFIX=/home/xyy/lmp/lammps-22Jul2025/build
    ```

    >①`cmake`安装创建新目录并在新目录下进行编译能够保证`src`目录的“纯洁”，这也意味着通过这种方式我们能够同时拥有多个配置的lammps可执行文件，而不需要像传统的`make`因包之间的冲突反复编译一个可执行文件  
    ②`cmake`会自动检测需要的配置支持（MPI，OpenMP，FFTW，gzip，JPEG，PNG），请注意`cmake`时出现的missing或not found，可以在网上查询这些缺失的依赖是什么作用？你是否需要？然后再决定是否将这些依赖补上  
    ③`-D LAMMPS_MACHINE=`是可选项，指定生成的可执行文件，也可自定义可执行文件名称，在你配置了多种可执行文件时你可以通过选择不同的可执行文件名来选择用哪种配置来运行lammps  
    ④`-D CMAKE_INSTALL_PREFIX=`指定生成可执行文件的路径，默认值为`${HOME}/.local`，当然你也可以在`make install`后面加上`DESTDIR=路径名`来修改默认路径  
    ⑤`make`和`cmake`不能混用，因为`cmake`要求`src`目录必须保持“纯洁”，而`make`会`src`目录下生成一系列文件  
    ⑥`cmake`编译包的名字是大写的，`make`编译大写小写都行

3. 在Ubuntu终端依次执行以下命令编译可执行文件并将其添加到环境变量

    ```bash
    make -j "$(nproc)"                        
    make install
    echo 'export PATH=/home/xyy/lmp/lammps-22Jul2025/build:$PATH' >> ~/.bashrc
    source ~/.bashrc
    ```

### 4.2 GPU加速版LAMMPS的安装

1. 在Ubuntu终端执行类似以下命令配置所需要的包

    ```bash
    cd /home/xyy/lmp/lammps-22Jul2025
    mkdir gpu_build
    cd gpu_build
    cmake ../cmake \
    -D CMAKE_BUILD_TYPE=Release \
    -D LAMMPS_MACHINE=gpu \
    -D CMAKE_INSTALL_PREFIX=/home/xyy/lmp/lammps-22Jul2025/gpu_build \
    -D LAMMPS_EXCEPTIONS=on \
    -D FFT=FFTW3 \
    -D BUILD_MPI=on \
    -D BUILD_OMP=on \
    -D BLA_VENDOR=OpenBLAS \
    -D CMAKE_Fortran_COMPILER=gfortran \
    \
    -D PKG_GPU=on \
    -D GPU_API=cuda \
    -D GPU_ARCH=sm_61 \
    -D PKG_OPENMP=on \
    -D PKG_OPT=on \
    \
    -D PKG_KOKKOS=off \
    -D PKG_INTEL=off \
    \
    -D PKG_MOLECULE=on \
    -D PKG_KSPACE=on \
    -D PKG_RIGID=on \
    -D PKG_MANYBODY=on \
    -D PKG_MEAM=on \
    -D PKG_CLASS2=on \
    -D PKG_EXTRA-PAIR=on \
    -D PKG_EXTRA-FIX=on \
    -D PKG_EXTRA-DUMP=on \
    -D PKG_EXTRA-COMPUTE=on \
    -D PKG_EXTRA-MOLECULE=on \
    -D PKG_DPD=on \
    -D PKG_MISC=on \
    -D PKG_MC=on \
    -D PKG_REAXFF=on \
    -D PKG_QEQ=on \
    -D PKG_ELECTRODE=on 
    ```

2. 在Ubuntu终端依次执行以下命令编译可执行文件并将其添加到环境变量

    ```bash
    make -j "$(nproc)"                        
    make install
    echo 'export PATH=/home/xyy/lmp/lammps-22Jul2025/gpu_build:$PATH' >> ~/.bashrc
    source ~/.bashrc
    ```

### 4.3 GPU+KOKKOS加速版LAMMPS的安装

1. 在Ubuntu终端执行命令`cd /home/xyy/lmp/lammps/cmake/presets`编辑`kokkos-cuda.cmake`文件，添加类似以下内容

    ```bash
    set(Kokkos_ARCH_PASCAL61 ON CACHE BOOL "" FORCE)
    ```

    >这个PASCAL61需要根据自己电脑架构修改，架构查询请参考[3.2 GPU加速版LAMMPS的安装](#32-gpu加速版lammps的安装)

2. 在Ubuntu终端执行类似以下命令配置所需要的包

    ```bash
    cd /home/xyy/lmp/lammps-22Jul2025
    mkdir kokkos_build
    cd kokkos_build
    cmake -C ../cmake/presets/basic.cmake -C ../cmake/presets/kokkos-cuda.cmake ../cmake \
    -D CMAKE_BUILD_TYPE=Release \
    -D LAMMPS_MACHINE=kokkos \
    -D CMAKE_INSTALL_PREFIX=/home/xyy/lmp/lammps-22Jul2025/kokkos_build \
    \
    -D PKG_GPU=on \
    -D GPU_API=cuda \
    -D GPU_ARCH=sm_61 \
    -D PKG_OPENMP=on \
    \
    -D PKG_MOLECULE=on \
    -D PKG_KSPACE=on \
    -D PKG_RIGID=on \
    -D PKG_MANYBODY=on \
    -D PKG_MEAM=on \
    -D PKG_CLASS2=on \
    -D PKG_EXTRA-PAIR=on \
    -D PKG_EXTRA-FIX=on \
    -D PKG_EXTRA-DUMP=on \
    -D PKG_EXTRA-COMPUTE=on \
    -D PKG_EXTRA-MOLECULE=on \
    -D PKG_DPD=on \
    -D PKG_MISC=on \
    -D PKG_MC=on \
    -D PKG_REAXFF=on \
    -D PKG_QEQ=on \
    -D PKG_ELECTRODE=on 
    ```

    >①这里`-D GPU_ARCH=sm_61`同样需要根据自己电脑架构修改  
    ②笔者在编译过程中出现一条warning提示：未来版本的CUDA将不再支持低于sm_75（即Turing架构）的GPU进行“离线编译”，所以还是建议用好点的显卡吧

3. 在Ubuntu终端依次执行以下命令编译可执行文件并将其添加到环境变量

    ```bash
    make -j "$(nproc)"                        
    make install
    echo 'export PATH=/home/xyy/lmp/lammps-22Jul2025/kokkos_build:$PATH' >> ~/.bashrc
    source ~/.bashrc
    ```

### 4.4 性能测试

电脑配置：32核64线程CPU+GPU0
**lmp_mpi**
测试文件：`in.flow.coutte/in.CHO`
命令：`mpirun -np N lmp_mpi -sf omp -pk omp M -in in.example`

![ ](cpu.svg)

<table>
  <tr>
    <th colspan="3">in.flow.coutte</th><th colspan="3">in.flow.coutte(replicate:5x5x1)</th><th colspan="3">in.CHO</th>
  </tr>
  <tr>
    <th>MPI</th><th>Threads</th><th>timesteps/s</th><th>MPI</th><th>Threads</th><th>timesteps/s</th><th>MPI</th><th>Threads</th><th>timesteps/s</th>
  </tr>
  <tr>
    <td>32</td><td>1</td><td>28369.162</td><td>32</td><td>1</td><td>13646.803</td><td>32</td><td>1</td><td>339.768</td>
  </tr>
  <tr>
    <td>16</td><td>2</td><td>17945.783</td><td>16</td><td>2</td><td>6166.208</td><td>16</td><td>2</td><td>285.349</td>
  </tr>
  <tr>
    <td>8</td><td>4</td><td>14212.798</td><td>8</td><td>4</td><td>4179.327</td><td>8</td><td>4</td><td>324.010</td>
  </tr>
  <tr>
    <td>4</td><td>8</td><td>12593.356</td><td>4</td><td>8</td><td>2687.443</td><td>4</td><td>8</td><td>265.461</td>
  </tr>
  <tr>
    <td>2</td><td>16</td><td>1278.808</td><td>2</td><td>16</td><td>971.952</td><td>2</td><td>16</td><td>39.338</td>
  </tr>
  <tr>
    <td>1</td><td>32</td><td>715.109</td><td>1</td><td>32</td><td>389.255</td><td>1</td><td>32</td><td>52.559</td>
  </tr>
  <tr>
    <td>2</td><td>2</td><td>43442.340</td><td>2</td><td>2</td><td>8681.193</td><td>2</td><td>2</td><td>786.416</td>
  </tr>
  <tr>
    <td>1</td><td>1</td><td>64245.999</td><td>1</td><td>1</td><td>3939.784</td><td>1</td><td>1</td><td>644.137</td>
  </tr>
</table>

**lmp_gpu**
测试文件：`in.flow.coutte/in.CHO`
命令：`mpirun -np N lmp_gpu -sf gpu -pk gpu 1 -in in.example`

![ ](gpu.svg)

<table>
  <tr>
    <th colspan="2">in.flow.coutte</th><th colspan="2">in.flow.coutte(replicate:5x5x1)</th><th colspan="2">in.CHO</th>
  </tr>
  <tr>
    <th>MPI</th><th>timesteps/s</th><th>MPI</th><th>timesteps/s</th><th>MPI</th><th>timesteps/s</th>
  </tr>
  <tr>
    <td>1</td><td>4764.389</td><td>1</td><td>2714.876</td><td>1</td><td>719.745</td>
  </tr>
  <tr>
    <td>2</td><td>2575.471</td><td>2</td><td>2111.932</td><td>2</td><td>881.092</td>
  </tr>
  <tr>
    <td>4</td><td>1435.890</td><td>4</td><td>1317.898</td><td>4</td><td>1050.827</td>
  </tr>
  <tr>
    <td>8</td><td>670.340</td><td>8</td><td>672.751</td><td>8</td><td>859.213</td>
  </tr>
  <tr>
    <td>16</td><td>310.219</td><td>16</td><td>317.952</td><td>16</td><td>533.130</td>
  </tr>
  <tr>
    <td>32</td><td>139.547</td><td>32</td><td>146.910</td><td>32</td><td>395.524</td>
  </tr>
</table>

**lmp_kokkos**
测试文件：`in.CHO`

![ ](kokkos.svg)

<table>
    <tr>
        <th>模式</th><th>命令</th><th>MPI</th><th>GPU</th><th>timesteps/s</th>
    </tr>
    <tr>
        <td rowspan="6">MPI</td><td rowspan="6">mpirun -np N lmp_kokkos -in in.CHO</td><td>32</td><td>0</td><td>380.576</td>
    </tr>
    <tr>
        <td>16</td><td>0</td><td>522.408</td>
    </tr>
    <tr>
        <td>8</td><td>0</td><td>804.820</td>
    </tr>
    <tr>
        <td>4</td><td>0</td><td>778.406</td>
    </tr>    <tr>
        <td>2</td><td>0</td><td>858.195</td>
    </tr>
    <tr>
        <td>1</td><td>0</td><td>683.496</td>
    </tr>
    <tr>
        <td rowspan="6">GPU</td><td rowspan="6">mpirun -np N lmp_kokkos -sf gpu -pk gpu 1 -in in.CHO</td><td>32</td><td>1</td><td>373.061</td>
    </tr>
    <tr>
        <td>16</td><td>1</td><td>519.170</td>
    </tr>
    <tr>
        <td>8</td><td>1</td><td>717.446</td>
    </tr>
    <tr>
        <td>4</td><td>1</td><td>1009.129</td>
    </tr>    <tr>
        <td>2</td><td>1</td><td>862.731</td>
    </tr>
    <tr>
        <td>1</td><td>1</td><td>692.893</td>
    </tr>   
     <tr>
        <td rowspan="6">KOKKOS</td><td rowspan="6">mpirun -np N lmp_kokkos -pk kokkos neigh half <br>newton on -sf kk -k on g 1 -in in.CHO</td><td>32</td><td>1</td><td></td>
    </tr>
    <tr>
        <td>16</td><td>1</td><td></td>
    </tr>
    <tr>
        <td>8</td><td>1</td><td>17.695</td>
    </tr>
    <tr>
        <td>4</td><td>1</td><td>32.484</td>
    </tr>    <tr>
        <td>2</td><td>1</td><td>54.014</td>
    </tr>
    <tr>
        <td>1</td><td>1</td><td>28.780</td>
    </tr>   
</table>

---

## 五.LAMMPS官方example讲解

LAMMPS官方example中包含以下三类目录（本节内容来源于lammps examples文件夹下的README文件）：

1. **小写字母命名的目录**：用于测试LAMMPS及其扩展包的简单示例问题  
    每个子目录中都包含一个可通过 LAMMPS 运行的示例问题。大多数示例为二维模型，运行速度较快，在台式机上运行仅需几秒到几分钟。  
    每个示例问题都包含一个输入脚本（in.*格式），运行后会生成一个日志文件（log.* 格式），还可能生成一个 dump 文件（dump.*格式）、图像文件（image.* 格式）或视频文件（movie.mpg 格式）。部分示例需要额外输入初始坐标数据文件（data.* 格式），还有部分示例要求你安装一个或多个 LAMMPS 可选扩展包。  
    部分目录中还包含少量在不同机器、不同处理器数量下运行得到的示例日志文件，供你对比自己的运行结果。例如，名为 “log.crack.date.foo.P” 的日志文件，表示它是在 “foo” 机器上、使用指定日期版本的 LAMMPS、通过 P 个处理器运行得到的。需要注意的是，这些示例问题在不同机器或不同处理器数量下运行时，得到的结果应在统计上相似，但与此处提供的日志文件或 dump 文件中的结果不完全相同。更多相关说明可参考 LAMMPS 文档的 “错误（Errors）” 部分。  
    大多数示例输入脚本中都有被注释掉的代码行，这些代码行可用于生成三种格式的模拟运行快照。  
    - 若取消对 “dump” 命令的注释，会生成一个文本格式的 dump 文件，该文件可通过多种可视化程序（参考网址：<https://www.lammps.org/viz.html> ）进行动画演示，如 Ovito、VMD 或 AtomEye。
    - 若取消对 “dump image” 命令的注释，且你构建的 LAMMPS 已集成 JPG 库，那么模拟运行时会生成 JPG 格式的快照图像。你可通过 “dump image” 文档页面中描述的命令，快速将这些图像处理成视频。
    - 若取消对 “dump movie” 命令的注释，且你构建的 LAMMPS 已集成 FFmpeg 库，那么模拟运行时会生成 MPG 格式的视频文件。该视频文件可通过多种播放器打开，如 MPlayer 或 QuickTime。

    你可在 LAMMPS 官网的 “视频（Movies）” 板块中查看许多示例的动画演示。

2. **大写字母命名的目录**：更复杂的示例问题
    - ASPHERE 目录：包含使用 LAMMPS 提供的三种样式模拟非球形粒子的示例（含溶剂和不含溶剂两种情况），即点椭圆粒子、刚体、由线段 / 三角形表面面片构建的二维 / 三维广义非球形物体。开始操作前可参考 ASPHERE 目录下的 README 文件。
    - COUPLE 目录：包含将 LAMMPS 作为库使用的示例（可单独使用，也可与其他代码或库协同使用）。开始操作前可参考 COUPLE 目录下的 README 文件。
    - ELASTIC 目录：包含一个在零温下计算弹性刚度张量（弹性常数）的示例脚本，以硅（Si）为例。更多信息可参考 ELASTIC 目录下的 in.elastic 文件。
    - ELASTIC_T 目录：包含在有限温度下计算弹性刚度张量的示例脚本，演示了两种不同方法。其中 “DEFORMATION” 方法通过对多个模拟系统施加小的有限形变，估算平均应力张量的变化；“BORN_MATRIX” 方法通过单次模拟，对玻恩矩阵和应力涨落进行平均。第二种方法是 LAMMPS 中较新的功能，通常效率更高、可靠性更强。
    - HEAT 目录：包含两种不同热交换算法（如用于建立温度梯度的算法）的示例脚本。更多信息可参考 HEAT 目录下的 README 文件。
    - KAPPA 目录：包含使用五种不同方法计算 LJ 液体热导率（kappa）的示例脚本。更多信息可参考 KAPPA 目录下的 README 文件。
    - LEPTON 目录：包含使用 fix efield/lepton 命令的示例。
    - MC-LOOP 目录：包含将 LAMMPS 作为能量评估引擎，用于迭代蒙特卡洛能量弛豫循环的示例脚本。
    - QUANTUM 目录：包含通过 MDI 代码耦合库将 LAMMPS 与多个量子化学代码协同使用的示例。
    - SPIN 目录：包含使用 SPIN 扩展包的示例。
    - UNITS 目录：包含模拟同一 LJ 液体模型的输入脚本示例，这些脚本分别采用三种不同的单位制（lj 单位制、real 单位制、metal 单位制）。通过这些示例，你可以了解如何对 LAMMPS 读写的输入输出值进行缩放 / 反缩放，以验证在不同单位制下是否在执行相同的模拟。
    - VISCOSITY 目录：包含使用四种不同方法计算 LJ 液体黏度的示例脚本。更多信息可参考 VISCOSITY 目录下的 README 文件。

3. **PACKAGES目录**：包含多个子目录，每个子目录中是对应单个扩展包或额外单个样式的示例脚本。这些示例大多由对应扩展包或样式的开发者提供。更多信息可参考各子目录下的 README 文件（若有）或手册中对应的文档页面。关于扩展包的安装与构建，可参考网址：<https://docs.lammps.org/Build_package.html>

| 目录名称       | 核心模型/功能                                                                 | 依赖扩展包（若有）       | 关键输出/用途                                                                 |
|----------------|-------------------------------------------------------------------------------|--------------------------|-------------------------------------------------------------------------------|
| airebo         | 聚乙烯模型（使用AIREBO势函数）                                               | AIREBO                   | 日志文件、可选dump文件，可演示聚合物结构动力学                               |
| amoeba         | 小型水模型、生物模型（使用AMOEBA/HIPPO势函数）                                | AMOEBA、HIPPO            | 日志文件、可视化快照，适用于生物分子模拟测试                                 |
| atm            | Axilrod-Teller-Muto势函数验证模型                                             | 无（基础功能）           | 日志文件，用于三体势函数正确性测试                                           |
| balance        | 二维系统动态负载均衡演示                                                     | 无（基础功能）           | 日志文件，验证多处理器下负载分配效率                                         |
| body           | 二维体粒子（body particles）模拟                                             | 无（基础功能）           | 日志文件、dump文件，演示体粒子运动特性                                       |
| cmap           | CHARMM力场CMAP五体作用项测试                                                 | CHARMM                   | 日志文件，验证复杂力场五体作用计算                                          |
| colloid        | 二维“大胶体粒子-小粒子溶剂”混合体系                                           | 无（基础功能）           | dump文件、可视化图像，观察胶体分散行为                                       |
| comb           | COUPLE势函数相关模型（如金属/陶瓷体系）                                       | COMB                     | 日志文件，测试COMB势函数适用性                                               |
| controller     | fix controller命令实现恒温控制                                               | 无（基础功能）           | 日志文件，验证自定义恒温器效果                                               |
| coreshell      | 绝热核-壳（core/shell）模型（如纳米颗粒、介电材料）                           | Core/Shell               | dump文件，观察核壳结构动力学                                                 |
| crack          | 二维固体裂纹扩展模拟                                                         | 无（基础功能）           | dump文件、视频，演示裂纹萌生与扩展过程                                       |
| deposit        | 原子/分子在三维基底上的沉积过程                                               | Deposit                  | 3D dump文件，观察薄膜生长或涂层形成                                         |
| dipole         | 二维点偶极子粒子体系（如极性分子、磁性颗粒）                                 | Dipole                   | dump文件，验证偶极相互作用下的体系行为                                       |
| dreiding       | 甲醇模型（使用Dreiding力场）                                                 | Dreiding                 | 日志文件，测试有机分子力场参数                                               |
| eim            | 氯化钠（NaCl）模型（使用EIM势函数）                                           | EIM                      | 日志文件，验证离子晶体势函数正确性                                           |
| ellipse        | 二维“椭圆粒子-球形溶剂”混合体系                                               | Asphere                  | dump文件，观察非球形粒子的分散与运动                                         |
| fire           | fire/quickmin能量最小化算法测试                                               | 无（基础功能）           | 日志文件，对比不同最小化方法的效率与精度                                     |
| flow           | 二维通道内Couette（库埃特）、Poiseuille（泊肃叶）流动                         | 无（基础功能）           | dump文件，演示流体剪切与压力驱动流动特性                                     |
| friction       | 二维表面球形粗糙面的摩擦接触模拟                                             | Granular                 | 日志文件，输出摩擦力与接触力数据                                             |
| gjf            | fix gjf命令实现Gronbech-Jensen/Farago恒温器                                   | 无（基础功能）           | 日志文件，验证特殊恒温器对体系温度的控制效果                                 |
| granregion     | fix wall/region/gran命令构建颗粒体系边界                                       | Granular                 | dump文件，观察颗粒在受限空间内的运动                                         |
| grid           | 模拟域网格叠加功能测试（如网格插值、场计算）                                 | Grid                     | 日志文件、网格数据文件，验证网格相关命令正确性                               |
| hugoniostat    | Hugoniostat冲击动力学模拟（如材料冲击响应）                                   | Hugoniostat              | 日志文件、冲击波dump文件，分析冲击压力与粒子速度                             |
| hyper          | 铂（Pt）表面扩散的全局/局部超动力学（hyperdynamics）                           | Hyperdynamics            | 日志文件，加速计算慢扩散过程的动力学参数                                     |
| indent         | 球形压头压入二维固体的过程（如硬度测试、材料变形）                           | 无（基础功能）           | dump文件、视频，观察压痕形成与材料屈服行为                                   |
| kim            | 使用KIM（原子间势知识库）中的势函数                                           | KIM                      | 日志文件，验证第三方势函数调用正确性                                         |
| mc             | 蒙特卡洛（MC）模拟（GCMC、Widom插入、mol/swap）                               | MC                       | 日志文件，输出吸附量、化学势等MC关键参数                                     |
| mdi            | MDI扩展包与MolSSI MDI耦合库协同计算（如多尺度耦合）                           | MDI                      | 日志文件，验证跨代码数据交互正确性                                           |
| meam           | SiC的MEAM势函数测试、剪切模拟                                                 | MEAM                     | 日志文件，对比剪切行为与理论值                                               |
| melt           | 三维LJ（伦纳德-琼斯）体系快速熔融过程                                         | 无（基础功能）           | dump文件，观察固体熔融与液体结构形成                                         |
| mesh           | create_atoms mesh命令构建网格状原子结构                                       | 无（基础功能）           | dump文件，验证网格原子生成精度                                               |
| micelle        | 类脂质分子自组装成二维双层膜（如胶束形成）                                     | 无（基础功能）           | dump文件、视频，观察自组装动力学过程                                         |
| min            | 二维LJ熔融体系能量最小化                                                     | 无（基础功能）           | 日志文件，输出最小化后的能量与结构参数                                       |
| mliap          | 内置机器学习原子间势（ML-IAP）测试                                           | ML-IAP                   | 日志文件，对比ML势与传统势函数的计算结果                                     |
| msst           | MSST冲击动力学模拟（如冲击波传播）                                             | MSST                     | 日志文件、冲击波dump文件，分析冲击温度与密度变化                             |
| nb3b           | 非键三体简谐成对样式测试                                                     | 无（基础功能）           | 日志文件，验证三体非键相互作用计算                                          |
| neb            | NEB（弹性带）方法计算能垒（如反应路径优化）                                   | NEB                      | 日志文件、能垒曲线数据，输出反应活化能                                       |
| nemd           | 二维剪切体系的非平衡分子动力学（NEMD）                                         | 无（基础功能）           | 日志文件，计算剪切黏度等非平衡参数                                           |
| numdiff        | 力、维里（virial）、玻恩矩阵的数值差分计算                                   | 无（基础功能）           | 日志文件，验证数值计算精度与理论值偏差                                       |
| obstacle       | 二维通道内流体绕两个空隙流动（如障碍物绕流）                                   | 无（基础功能）           | dump文件，观察流场分布与涡流形成                                             |
| peptide        | 小型溶剂化五聚肽链动力学                                                     | MOLECULAR                | dump文件，观察肽链构象变化与溶剂相互作用                                     |
| peri           | 近场动力学（Peridynamic）模型：压头撞击圆柱体                                 | Peri                     | dump文件，分析非局部力学行为下的材料损伤                                     |
| pour           | 颗粒倒入三维盒子+ chute流动（如颗粒输运）                                     | Granular                 | 3D dump文件、视频，观察颗粒堆积与流动特性                                   |
| prd            | 体硅（bulk Si）空位扩散的并行复本动力学（PRD）                                 | PRD                      | 日志文件，加速计算空位扩散系数                                               |
| python         | PYTHON扩展包调用Python代码（如自定义分析、控制）                               | PYTHON                   | 日志文件、Python输出数据，实现LAMMPS与Python协同                             |
| qeq            | QEQ扩展包实现电荷平衡（如极性分子、离子体系）                                 | QEQ                      | 日志文件，输出原子电荷分布                                                   |
| rdf-adf        | 计算水的径向分布函数（RDF）、角度分布函数（ADF）                               | 无（基础功能）           | 日志文件、RDF/ADF曲线数据，分析液体结构有序性                                 |
| reaxff         | ReaxFF势函数模型（RDX、TATB等含能材料、催化剂）                               | ReaxFF                   | 日志文件、键级分析数据，模拟化学反应或材料分解                               |
| replicate      | replicate命令扩展模拟体系（如超胞构建）                                       | 无（基础功能）           | dump文件，验证体系扩展后的结构完整性                                         |
| rerun          | rerun、read_dump命令重新分析模拟结果（如补算物理量）                           | 无（基础功能）           | 日志文件、补充计算数据，避免重复运行模拟                                     |
| rigid          | 独立/耦合刚体模拟（如分子刚体、颗粒团聚）                                     | RIGID                    | dump文件，观察刚体运动与相互作用                                             |
| rheo           | RHEO模拟流体流动与相变（如流变特性测试）                                       | RHEO                     | 日志文件，输出黏度、相变温度等流变参数                                       |
| shear          | 二维固体横向剪切（含/无空隙）                                                 | 无（基础功能）           | dump文件，观察剪切变形与空隙对力学行为的影响                                 |
| snap           | 内置SNAP势函数测试（如金属、合金）                                             | SNAP                     | 日志文件，对比SNAP势与实验数据的一致性                                       |
| srd            | SRD（随机旋转动力学）粒子作为溶剂（如粗粒化流体）                             | SRD                      | dump文件，模拟溶剂流动与溶质扩散                                             |
| steinhardt     | 计算Steinhardt-Nelson Qₗ/Wₗ参数（如晶体结构有序性）                           | 无（基础功能）           | 日志文件、有序性参数数据，判断体系晶型（如FCC、BCC）                         |
| streitz        | Streitz-Mintmire势函数模型（Al₂O₃等陶瓷）                                     | Streitz                  | 日志文件，验证陶瓷材料势函数正确性                                           |
| stress_vcm     | 从分箱应力分布中去除刚体运动干扰                                             | 无（基础功能）           | 日志文件，输出修正后的应力数据                                               |
| tad            | 体硅空位扩散的温度加速动力学（TAD）                                           | TAD                      | 日志文件，加速计算低温下的慢扩散过程                                         |
| template       | atom_style template使用+与molecular样式对比                                   | 无（基础功能）           | 日志文件，验证template样式的灵活性与兼容性                                   |
| tersoff        | Tersoff势函数变体回归测试（如Si、Ge半导体）                                   | Tersoff                  | 日志文件，对比不同Tersoff参数集的计算结果                                   |
| threebody      | 多种三体势函数回归测试                                                       | 无（基础功能）           | 日志文件，验证三体势函数计算稳定性                                           |
| triclinic      | 广义三斜晶系盒子与正交晶系盒子对比                                           | 无（基础功能）           | dump文件，验证非正交盒子的模拟兼容性                                         |
| ttm            | 双温度模型（TTM）模拟（如激光加热、电子-晶格耦合）                             | TTM                      | 日志文件，输出电子/晶格温度演化曲线                                         |
| vashishta      | Vashishta势函数模型（如SiO₂玻璃、半导体）                                     | Vashishta                | 日志文件，验证复杂氧化物/半导体的势函数适用性                               |
| voronoi        | compute voronoi/atom命令实现沃罗诺伊（Voronoi）镶嵌                           | Voronoi                  | dump文件、Voronoi网格数据，分析粒子空间分布                                   |
| wall           | 不同随机模型的反射壁（reflective walls）测试                                   | 无（基础功能）           | 日志文件，验证壁面边界条件对体系的影响                                       |
| yaml           | YAML格式的thermo/dump输出测试                                                 | YAML                     | YAML格式日志/dump文件，方便跨软件数据读取与分析                             |
| ASPHERE        | 非球形粒子模拟（点椭圆、刚体、广义面片构建）                                   | Asphere                  | 2D/3D dump文件，演示多种非球形粒子建模方法                                   |
| COUPLE         | LAMMPS作为库使用（单独/与其他代码协同）                                       | COUPLE                   | 日志文件、跨代码交互数据，验证库模式兼容性                                   |
| ELASTIC        | 零温下计算弹性刚度张量（以Si为例）                                             | 无（基础功能）           | 日志文件，输出弹性常数（如C₁₁、C₁₂）                                         |
| ELASTIC_T      | 有限温度下弹性刚度张量计算（DEFORMATION/BORN_MATRIX两种方法）                  | 无（基础功能）           | 日志文件，对比不同温度下的弹性参数变化                                       |
| HEAT           | 热交换算法（如温度梯度建立）两种方法演示                                       | Heat                     | 日志文件、温度分布数据，验证热输运模拟正确性                                 |
| KAPPA          | 五种方法计算LJ液体热导率（kappa）                                             | Kappa                    | 日志文件，对比不同热导率计算方法的精度与效率                                 |
| LEPTON         | fix efield/lepton命令实现自定义电场                                           | Lepton                   | 日志文件，验证自定义电场对体系的影响                                         |
| MC-LOOP        | LAMMPS作为能量评估引擎用于蒙特卡洛能量弛豫循环                                 | MC                       | 日志文件，输出循环过程中的能量收敛曲线                                       |
| PACKAGES       | 单个扩展包/样式的示例脚本（开发者贡献）                                       | 对应子目录扩展包         | 日志文件，针对性测试各扩展包功能                                             |
| QUANTUM        | LAMMPS与量子化学代码通过MDI耦合（如QM/MM多尺度模拟）                           | MDI、QUANTUM             | 日志文件、跨代码计算数据，验证量子-经典耦合正确性                             |
| SPIN           | SPIN扩展包模拟自旋体系（如磁性材料）                                           | SPIN                     | 日志文件，输出自旋取向与磁学参数                                             |
| UNITS          | 同一LJ液体在lj/real/metal三种单位制下的模拟对比                               | 无（基础功能）           | 日志文件，验证单位制缩放的一致性                                             |
| VISCOSITY      | 四种方法计算LJ液体黏度                                                       | Viscosity                | 日志文件，对比不同黏度计算方法的结果差异                                     |

---

## 六.moltemplate的安装

1. 在Ubuntu终端执行类似以下命令安装moltemplate

    ```bash
    cd /home/xyy/lmp
    git clone https://github.com/jewettaij/moltemplate moltemplate
    ```

2. 在Ubuntu终端执行命令`vim ~/.bashrc`将类似一下内容添加到环境变量，确认无误后执行命令`source ~/.bashrc`使环境变量生效

    ```bash
    export PATH=/home/xyy/lmp/moltemplate/moltemplate:/home/xyy/lmp/moltemplate/moltemplate/scripts:$PATH
    ```

3. 在Ubuntu终端执行命令`moltemplate.sh`检查环境变量是否添加成功

---

## 七.packmol的安装

1. 在Ubuntu终端执行类似以下命令安装packmol

    ```bash
    cd /home/xyy/lmp
    git clone https://github.com/m3g/packmol packmol
    cd packmol
    make
    ```

2. 在Ubuntu终端执行命令`vim ~/.bashrc`将类似一下内容添加到环境变量，确认无误后执行命令`source ~/.bashrc`使环境变量生效

    ```bash
    export PATH=/home/xyy/lmp/packmol:$PATH
    ```

3. 在Ubuntu终端执行命令`packmol`检查环境变量是否添加成功，确认无误后`Ctrl + C`中断程序

---

## 八.参考资料

本文参考了网上很多前辈、老师的资料，非常感谢各位的免费分享！！！以下是一些主要参考资料来源：  
第三、六、七节主要参考的是鲍路瑶老师的网盘资料，以下是相关推荐：

```bash
讲义和相关资料链接：https://pan.baidu.com/s/1o3WLWV0FuiHlF3kDwhbwUQ
提取码：ugus
欢迎推广我的公众号：LAMMPS与AI材料设计和微信：lmp_zhushou
你的推广和支持是我教程更新的动力
感谢🙏
```

第四节主要是来自几位前辈的公开资料：

```bash
https://pa.ci/417.html
https://zhuanlan.zhihu.com/p/357099689
https://blog.mushroomfire.com/2023/11/15/lammps-cmake-an-zhuang-ji-lu/
```

除此之外当然还有很多官方资料如：LAMMPS Manual、Microsoft的WSL安装教程等  
由于安装过程中查阅了挺多资料，如果有本文参考但未提到的作者请及时联系笔者处理  
安装过程出现任何报错请将报错信息粘贴到浏览器搜索，你遇到过的问题别人也可能遇到过，请合理利用网络资源！！！此外，本文在很多地方都提供了多种安装方式，如果出现报错可以尝试其他方法
本人只是一个小白，很多地方也都不懂只是尽可能地将一些自己知道的东西写出来，如果有大佬发现有错漏的地方欢迎指正！！！不胜感激！！！

[网址一]:https://blog.csdn.net/m0_46422300/article/details/104645072
[网址二]:https://www.runoob.com/linux/linux-command-manual.html
[网址三]:https://learn.microsoft.com/zh-cn/windows/wsl/basic-commands
[网址六]:https://github.com/microsoft/WSL/releases
[网址七]:https://learn.microsoft.com/zh-cn/windows/wsl/install-manual
[网址八]:https://developer.nvidia.com/cuda-downloads
[网址九]:https://www.open-mpi.org/software/ompi/v5.0/
[网址十]:https://fftw.org/download.html
[网址十一]:https://www.mpich.org/downloads/
[网址十二]:https://www.lammps.org/download.html
[网址十三]:https://en.wikipedia.org/wiki/

---
title: Linux安装与远程控制
mathjax: true
swiper: false
top: false
date: 2026-01-13 20:30:52
updated:
tags:
    - linux
    - tailscale
    - ssh
categories:
    - [scientific research, software]
---

## 一. 前期准备

### 1.1 配置检查

1. 数据备份
不管是哪个系统，重装系统都有风险。请把你的重要照片、文档、存档拷贝到网盘或移动硬盘。
2. 关闭Windows的快速启动
在`Windows控制面板->电源选项->选择电源按钮的功能->更改当前不可用的设置->取消勾选“启用快速启动”`。如果不关，Linux可能无法访问你的硬盘。
3. 关闭BitLocker
在搜索栏搜“BitLocker”，如果是开启状态，建议先关闭（解密），否则Linux识别不到硬盘分区。
4. BIOS快捷键查询
在网上查询进入BIOS/引导菜单的快捷键（通常是`F12,F2,Delete或Esc`）

### 1.2 制作系统镜像启动盘

由于导师直接甩给了我一个Debian13的系统镜像启动盘，所以笔者并没有这一步的实操经验，所以这里只给出一个参考资料：[卸载Windows重装Ubuntu系统]

## 二. 安装Linux系统

1. 用数据线连接手机和电脑，开启手机热点并在更多热点设置里找到并开启`通过USB共享网络`，这一步建议连接机箱背面USB接口
    >注：这一步其实是可选的，为了防止网络自动配置失败
2. 把制作好的系统镜像启动盘插入电脑，重启电脑并在电脑重新亮起时狂点BIOS快捷键进入BIOS界面
    ![2026-01-13-16-22-35.png](2026-01-13-16-22-35.png)
3. 按`F7`键进入`Advanced Mode`，在`启动->启动设置->OS Type`中把`Windows UEFI mode`改成`Other OS`，在`启动->Boot Option Priorities`中将U盘选项`UEFI: SanDisk Extreme 0001, Partition 1`移到第一位，最后按`F10`保存退出重启电脑后选择`Graphical install`图形化安装。
    ![2026-01-13-16-35-03.png](2026-01-13-16-35-03.png)
    >注：后面几步的顺序可能是乱的我也记不清了，不过大致就是这些内容
4. `Select a language`: 拉到下面选`Chinese(Simplified)-中文(简体)`
5. 选择您的区域: 选择`中国`
6. 配置键盘: 选择`汉语`
7. 配置网络：主网络接口选择如图手机USB共享网络，“主机名”可随意填写，“域名”留空直接点继续即可
![2026-01-13-16-46-52.png](2026-01-13-16-46-52.png)
8. 设置用户名和密码：
    - Root密码：Debian会让你设置一个Root（超级管理员）密码，请务必记住这个密码！
    - 设置普通用户：输入你的名字和你喜欢的用户名，并设置一个登录密码
9. 磁盘分区：这一步非常关键请务必小心
   1. 因为打算彻底放弃Windows，把Linux安装在最快的SSD上，所以笔者选择了第二项`向导-使用整个磁盘`
    ![2026-01-13-17-00-28.png](2026-01-13-17-00-28.png)
   2. 由于这台电脑有两块硬盘：第一块是1TB的致态 (ZHITAI) SSD（原Windows系统盘），第二块是4TB的西数 (WD) HDD（数据盘），所以下一步选中1Tb的ZHITAI硬盘
   3. 分区方案选择`将所有文件放在同一个分区中（推荐新手使用）`
   4. 最后一步会显示一个总结界面，确认无误后选中`完成分区操并将修改写入磁盘`进入下一步
    ![2026-01-13-17-08-42.png](2026-01-13-17-08-42.png)
10. 配置包管理器：使用网络镜像，国家选择`中国`，站点选择`mirrors.tuna.tsinghua.edu.cn`（清华大学）或是`mirrors.aliyun.com`（阿里云），代理服务器留空
11. 软件选择：笔者建议勾选以下几项
    - Debian desktop environment
    - GNOME (这是目前最主流、最稳定的选择)
    - SSH server (为了以后远程计算方便，必装)
    - standard system utilities (标准系统工具，必装)
![2026-01-13-17-16-27.png](2026-01-13-17-16-27.png)

12. 拔掉系统镜像启动盘后重启电脑，这样就会自动进入Linux系统桌面了

## 三. Linux配置优化

### 3.1 修改软件源清单

Debian默认非常保守，只包含开源软件。为了装 NVIDIA 官方驱动，我们需要修改“软件源清单”。

1. 在终端执行命令`su -`切换到管理员权限（它会提示你输入密码，输入时屏幕不会显示星号，输完直接回车）
2. 在终端执行命令`nano /etc/apt/sources.list`备份并修改软件源：
3. 你会看到几行以deb开头的文字，请在每一行的末尾加上` contrib non-free non-free-firmware`
![2026-01-13-17-30-52.png](2026-01-13-17-30-52.png)
4. 按`Ctrl+O`保存，按`Enter`确认，按`Ctrl+X`退出

### 3.2 安装NVIDIA显卡驱动

1. 在终端输入以下命令查看系统推荐安装的驱动，通常它会建议安装`nvidia-driver`

    ```bash
    apt install nvidia-detect -y
    nvidia-detect
    ```

2. 执行以下命令安装高性能计算常用环境

    ```bash
    apt install build-essential dkms linux-headers-amd64 -y
    ```

3. 执行以下安装命令安装驱动

    ```bash
    apt install nvidia-driver -y
    ```

### 3.3 D盘自动挂载

目标：让4TB数据盘像Windows的D盘一样自动出现。

1. 查询硬盘ID
在终端输入`sudo blkid`，找到4TB数据盘（通常是/dev/sda2，格式是ntfs）的UUID
2. 在终端执行命令`sudo mkdir -p /mnt/data`创建挂载点
3. 在终端执行命令`sudo apt install ntfs-3g -y`安装NTFS支持工具
4. 在终端执行命令`sudo nano /etc/fstab`打开账本，在文件最后一行添加类似以下内容（请替换自己电脑的UUID）：

    ```bash
    UUID=6C023DD3023DA34E  /mnt/data  ntfs-3g  defaults,uid=1000,gid=1000,umask=022  0  0
    ```

5. 在终端执行命令`sudo mount -a`让系统立刻按照刚才更改的账本去挂在若没有报错说明挂载成功

### 3.4 安装中文输入法

1. 在终端依次执行以下命令安装输入法软件并将Fcitx5设置为默认输入法：

    ```bash
    sudo apt update
    sudo apt install fcitx5 fcitx5-chinese-addons fcitx5-frontend-gtk3 fcitx5-frontend-qt5 -y
    im-config -n fcitx5
    ```

2. 重启电脑搜索并打开`Fcitx 5配置`，在右侧搜索框输入`pinyin`找到拼音后点击中间的`->`添加到左边，最后确定然后就可以按`Ctrl+空格`就可以切换中英文了

## 四.tailscale远程控制

### 4.1 禁用Wifi自动休眠

在终端执行以下命令在打开的文件中找到`wifi.powersave = 3`将其值改为2（2代表禁用省电模式），按`Ctrl+O`保存,`Ctrl+X`退出

```bash
sudo nano /etc/NetworkManager/conf.d/default-wifi-powersave-on.conf
```

>注：如果你连接的是无线网那么这一步可以直接跳过

### 4.2 安装tailscale

1. 在工作站电脑终端执行以下命令安装tailscale

    ```bash
    curl -fsSL https://tailscale.com/install.sh | sh
    ```

2. 在终端执行命令`sudo tailscale up`，终端会给出一个网址，用浏览器打开网址注册并登录你的账号
3. 登陆后在终端执行命令`tailscale ip -4`，终端就会给出一个`100.x.x.x`形式的地址，这个地址不会随网络的变化而变化非常稳定
4. 在个人笔记本电脑中搜索并安装tailscale，登录刚刚的账号
5. 在Vscode中安装Remote-SSH插件，打开侧边栏远程资源管理器找到`SSH`新建远程输入类似以下命令，其中`username`是安装系统时的起的用户名，`tailscaleip`是刚刚工作站终端输出的tailscale分配的ip地址最后输入对应的用户密码即使用个人笔记本电脑远程控制工作站Linux电脑

    ```bash
    ssh username@tailscaleip
    ```

## 五.参考资料

由于笔者在写这篇文章的时候距离安装系统已经过了一段时间了而且当初很多操作并没有拍照记录，所以文章中可能会有缺漏的地方，欢迎大家批评指正！此外，以下是本篇文章主要参考资料：
1.卸载Windows重装Ubuntu系统:<https://zhuanlan.zhihu.com/p/667673008>

[卸载Windows重装Ubuntu系统]:https://zhuanlan.zhihu.com/p/667673008
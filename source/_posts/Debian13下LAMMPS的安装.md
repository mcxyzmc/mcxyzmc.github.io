---
title: Debian13下LAMMPS的安装
mathjax: true
swiper: false
top: false
date: 2026-01-22 13:44:47
updated:
tags:
    - Debian
    - LAMMPS
categories:
    - [scientific research, MD]
---

鉴于笔者在此前的博客[Ubuntu子系统下LAMMPS的安装]中将大多数操作的原理和作用已经解释的很清楚，本文仅简要解释不同操作的部分。

## 一. 驱动,CUDA及LAMMPS的安装

### 1.1 驱动的安装

```bash
sudo apt update
sudo apt install nvidia-driver
```

执行以上命令时会弹出提示nvidia模块冲突，按提示Enter执行完命令后`sudo reboot`重启电脑即可

### 1.2 CUDA的安装

起初笔者尝试通过NVIDIA官网命令下载CUDA但后面编译GPU加速版的LAMMPS时发现总是出现报错，根据gemini的说法是“Debian13自带的glibc 2.40与手动安装的CUDA12.4 存在极其严重的底层定义冲突”，尝试了很多方案最终改用Debian官方仓库版的CUDA才解决问题（如果你遇到了类似的问题可以尝试按照1.4节卸载原本的CUDA再安装Debian官方仓库版的CUDA）

```bash
sudo apt update
sudo apt install nvidia-cuda-toolkit nvidia-cuda-dev
nvcc -V
```

### 1.3 驱动及CUDA的卸载（本节不是安装LAMMPS所需要的步骤）

1. 清理通过apt安装的包（如果你安装的时候是通过apt包管理器安装的请执行这一步）

    ```bash
    sudo apt-get purge nvidia* cuda*
    sudo apt-get autoremove
    sudo apt-get autoclean
    ```

2. 清理通过runfile安装的程序（如果你安装的时候是通过runfile安装的请执行这一步）

    ```bash
    sudo /usr/bin/nvidia-uninstall
    sudo /usr/local/cuda-*/bin/cuda-uninstaller
    ```

    >注：这里`cuda-*`中\*是通配符会将所有cuda卸载，如果你只想卸载指定版本cuda请将\*替换为卸载的版本

3. 手动删除残留目录

    ```bash
    sudo rm -rf /usr/local/cuda*
    sudo rm -rf /etc/X11/xorg.conf.d/99-nvidia.conf
    ```

    >注：第二行代码会删除相关的配置文件，请慎重执行，如果没装过其他NVIDIA工具可全删

4. 清理环境变量
    执行命令`vim ~/.bashrc`删除cuda相关环境变量，保存退出后执行命令`source ~/.bashrc`使其生效

5. 重启检查
    执行命令`sudo reboot`重启电脑后执行命令`nvcc --version`和`nvidia-smi`若无输出或显示未知命令则成功卸载

## 二. CPU并行版LAMMPS的安装

1. 获取lammps源码并构建目录

    ```bash
    mkdir lmp
    cd lmp
    git clone -b stable https://github.com/lammps/lammps.git lammps
    cd lammps
    ```

2. 配置所需要的包

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
    -D LAMMPS_MACHINE=cpu \
    -D CMAKE_INSTALL_PREFIX=/home/xyy/MD/lmp/lammps/cpu_build
    ```

3. 编译可执行文件并将其添加到环境变量

    ```bash
    make -j "$(nproc)"                        
    make install
    echo 'export PATH=/home/xyy/MD/lmp/lammps/cpu_build:$PATH' >> ~/.bashrc
    source ~/.bashrc
    ```

## 三. GPU加速版LAMMPS的安装

1. 配置所需要的包

    ```bash
    cd /home/xyy/MD/lmp/lammps
    mkdir gpu_build
    cd gpu_build
    cmake ../cmake \
    -D CMAKE_BUILD_TYPE=Release \
    -D LAMMPS_MACHINE=gpu \
    -D CMAKE_INSTALL_PREFIX=/home/xyy/MD/lmp/lammps/gpu_build \
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

    >注：传统GPU包只加速了特定的Pair,Bond,Kspace等样式，如果你的脚本里用到了某个冷门的Fix或Compute，GPU包不支持它就会回退到CPU计算。此时如果你的CPU开启了OpenMP加速，能显著提升这些“漏网之鱼”的计算速度。依然建议MPI进程数=GPU数，但可以适当给每个MPI进程分配2-4个OpenMP线程。

2. 编译可执行文件并将其添加到环境变量

    ```bash
    make -j "$(nproc)"                        
    make install
    echo 'export PATH=/home/xyy/MD/lmp/lammps/gpu_build:$PATH' >> ~/.bashrc
    source ~/.bashrc
    ```

## 四. KOKKOS加速版LAMMPS的安装

1. 配置所需的包

    ```bash
    cd /home/xyy/MD/lmp/lammps
    mkdir kokkos_build
    cd kokkos_build
    cmake -C ../cmake/presets/basic.cmake \
    -C ../cmake/presets/kokkos-cuda.cmake ../cmake \
    -D CMAKE_BUILD_TYPE=Release \
    -D CMAKE_INSTALL_PREFIX=/home/xyy/MD/lmp/lammps/kokkos_build \
    -D LAMMPS_MACHINE=kokkos \
    \
    -D PKG_KOKKOS=on \
    -D Kokkos_ENABLE_CUDA=on \
    -D Kokkos_ARCH_PASCAL61=on \
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

    >注：通常建议Kokkos Cuda模式下Host端使用Serial也就是单线程，因为同时开启OMP容易导致GPU没跑满CPU却满了。除非你的模拟中大部分算力消耗在一个还未移植到GPU的LAMMPS命令，只能由CPU算，此时开启OpenMP可能加速这部分的计算。

2. 编译可执行文件并将其添加到环境变量

    ```bash
    make -j "$(nproc)"                        
    make install
    echo 'export PATH=/home/xyy/MD/lmp/lammps/kokkos_build:$PATH' >> ~/.bashrc
    source ~/.bashrc
    ```

[Ubuntu子系统下LAMMPS的安装]:https://mcxyzmc.github.io/2026/01/14/ubuntu-zi-xi-tong-xia-lammps-de-an-zhuang/
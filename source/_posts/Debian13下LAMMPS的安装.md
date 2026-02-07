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
    - [scientific research, software]
---

鉴于笔者在此前的博客[Ubuntu子系统下LAMMPS的安装]中将大多数操作的原理和作用已经解释的很清楚，本文仅简要解释不同操作的部分。

## 一. 驱动与CUDA的安装

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

### 1.3 驱动及CUDA的卸载（本节为补充内容）

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

    >这里`cuda-*`中\*是通配符会将所有cuda卸载，如果你只想卸载指定版本cuda请将\*替换为卸载的版本

3. 手动删除残留目录

    ```bash
    sudo rm -rf /usr/local/cuda*
    sudo rm -rf /etc/X11/xorg.conf.d/99-nvidia.conf
    ```

    >第二行代码会删除相关的配置文件，请慎重执行，如果没装过其他NVIDIA工具可全删

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
    mkdir cpu_build
    cd cpu_build
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
    -D PKG_GRANULAR=on \
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
    -D GPU_PREC=mixed \
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
    -D PKG_ELECTRODE=on \
    -D PKG_GRANULAR=on 
    ```

    >传统GPU包只加速了特定的Pair,Bond,Kspace等样式，如果你的脚本里用到了某个冷门的Fix或Compute，GPU包不支持它就会回退到CPU计算。此时如果你的CPU开启了OpenMP加速，能显著提升这些“漏网之鱼”的计算速度。依然建议MPI进程数=GPU数，但可以适当给每个MPI进程分配2-4个OpenMP线程。

2. 编译可执行文件并将其添加到环境变量

    ```bash
    make -j "$(nproc)"                        
    make install
    echo 'export PATH=/home/xyy/MD/lmp/lammps/gpu_build:$PATH' >> ~/.bashrc
    source ~/.bashrc
    ```

    >`make -j` 并行编译的时候如果出现了报错不妨用单进程再进行编译能够更好的看清报错信息，这里讲一个可能导致报错的原因：CUDA 的编译器 nvcc 在处理 C++ 头文件时，实际上会调用系统的 gcc。但是 nvcc 的内部解析器更新通常滞后于 gcc，所以请确保那你的 gcc 版本与 CUDA 匹配。如果确实是这个问题，可以装一个低版本的 gcc 并在配置的时候加上对应的内容，如：
    -D CMAKE_C_COMPILER=gcc-12 \
    -D CMAKE_CXX_COMPILER=g++-12 \
    -D CUDA_HOST_COMPILER=/usr/bin/g++-12 \

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
    -D PKG_ELECTRODE=on \
    -D PKG_GRANULAR=on 
    ```

    >通常建议Kokkos Cuda模式下Host端使用Serial也就是单线程，因为同时开启OMP容易导致GPU没跑满CPU却满了。除非你的模拟中大部分算力消耗在一个还未移植到GPU的LAMMPS命令，只能由CPU算，此时开启OpenMP可能加速这部分的计算。

2. 编译可执行文件并将其添加到环境变量

    ```bash
    make -j "$(nproc)"                        
    make install
    echo 'export PATH=/home/xyy/MD/lmp/lammps/kokkos_build:$PATH' >> ~/.bashrc
    source ~/.bashrc
    ```

## 五. 性能测试

### 5.1 硬件信息查询

执行命令`lscpu`和`nvidia-smi`查看当前cpu和gpu信息：单cpu，cpu物理核心数32，逻辑处理器数64；单gpu

### 5.2 测试文件

LAMMPS发行版的bench目录中提供了5个基准测试问题的输入、输出文件和一个包含针对LAMMPS中各种势函数的基准测试脚本的POTENTIALS目录，所有这些基准测试的结果均在LAMMPS官方网站的基准测试页面上展示和讨论：<https://www.lammps.org/bench.html>。bench目录中每个问题都可以作为串行基准测试或在并行模式下运行。在并行模式下，每个基准测试可以作为固定规模或扩展规模问题运行。

- 对于固定规模基准测试：在不同的处理器数量上运行同一个32K原子的模型。
- 对于扩展规模基准测试：模型大小随处理器数量的增加而增加。例如，在8个处理器上，运行一个256K原子的模型；在1024个处理器上，运行一个3200万原子的模型，依此类推。

以下是五个基准测试问题：

1. Lennard-Jones liquid benchmark
    - 32,000 atoms for 100 timesteps
    - reduced density = 0.8442 (liquid)
    - force cutoff = 2.5 sigma
    - neighbor skin = 0.3 sigma
    - neighbors/atom = 55 (within force cutoff)
    - NVE time integration
2. Polymer chain melt benchmark
    - 32,000 atoms for 100 timesteps
    - reduced density 0.8442 (liquid)
    - force cutoff of 2^(1/6) sigma
    - neighbor skin = 0.4 sigma
    - neighbors/atom = 5 (within force cutoff)
    - NVE time integration
3. EAM metallic solid benchmark
    - 32,000 atoms for 100 timesteps
    - force cutoff of 4.95 Angstroms
    - neighbor skin = 1.0 Angstrom
    - neighbors/atom = 45 (within force cutoff)
    - NVE time integration
4. Granular chute flow benchmark
    - 32,000 atoms for 100 timesteps
    - force cutoff of 1.0 sigma
    - neighbor skin of 0.1 sigma
    - neighbors/atom = 7
    - NVE time integration
5. Rhodopsin protein benchmark
    - 32,000 atoms for 100 timesteps
    - LJ force cutoff of 10.0 Angstroms
    - neighbor skin of 1.0 sigma
    - neighbors/atom = 440 (within force cutoff)
    - NPT time integration

### 5.3 测试结果

#### 5.3.1 LJ

**lmp_cpu**  
运行命令：`mpirun -np N lmp_cpu -sf omp -pk omp M -in in.lj -var x Nx -var y Ny -var z Nz`

>虽然测试电脑有64个逻辑核心，但MPI默认可能只识别物理核心，导致MPI认为只有32个物理插槽可用。所以`mpirun -np 64`时会出错，这时需要在`mpirun`后面加上`--use-hwthread-cpus`参数

![ ](lj1.svg)

<table>
  <tr>
    <th colspan="3">Nx Ny Nz：4 4 2</th>
    <th colspan="3">Nx Ny Nz：4 4 2</th>
    <th colspan="3">Nx Ny Nz：4 4 4</th>
  </tr>
  <tr>
    <th>MPI</th>
    <th>Threads</th>
    <th>timestep/s</th>
    <th>MPI</th>
    <th>Threads</th>
    <th>timestep/s</th>
    <th>MPI</th>
    <th>Threads</th>
    <th>timestep/s</th>
  </tr>
  <tr>
    <td>32</td>
    <td>1</td>
    <td>42.424</td>
    <td>64</td>
    <td>1</td>
    <td>45.013</td>
    <td>64</td>
    <td>1</td>
    <td>20.656</td>
  </tr>
  <tr>
    <td>16</td>
    <td>2</td>
    <td>31.056</td>
    <td>32</td>
    <td>2</td>
    <td>29.923</td>
    <td>32</td>
    <td>2</td>
    <td>14.481</td>
  </tr>
  <tr>
    <td>8</td>
    <td>4</td>
    <td>13.262</td>
    <td>16</td>
    <td>4</td>
    <td>12.69</td>
    <td>16</td>
    <td>4</td>
    <td>6.469</td>
  </tr>
  <tr>
    <td>4</td>
    <td>8</td>
    <td>8.829</td>
    <td>8</td>
    <td>8</td>
    <td>7.65</td>
    <td>8</td>
    <td>8</td>
    <td>4.321</td>
  </tr>
  <tr>
    <td>2</td>
    <td>16</td>
    <td>5.058</td>
    <td>4</td>
    <td>16</td>
    <td>4.908</td>
    <td>4</td>
    <td>16</td>
    <td>2.503</td>
  </tr>
  <tr>
    <td>1</td>
    <td>32</td>
    <td>2.627</td>
    <td>2</td>
    <td>32</td>
    <td>2.551</td>
    <td>2</td>
    <td>32</td>
    <td>1.314</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td>1</td>
    <td>64</td>
    <td>1.534</td>
    <td>1</td>
    <td>64</td>
    <td>0.784</td>
  </tr>
</table>

**lmp_gpu**  
运行命令：`mpirun -np N lmp_gpu -sf gpu -pk gpu 1 -in in.lj -var x Nx -var y Ny -var z Nz`

>可以看到下表中出现多个error，报错信息都是`ERROR on proc 0: Insufficient memory on accelerator`，一般也就是我们常说的显存炸了。这不是算力问题，而是内存容量(RAM)不足或MPI通信开销过大：①Geforce GTX 1080显存只有8GB，在Nx Ny Nz：8 8 4的情况下，要计算800万原子的LJ体系加上邻居列表，如果MPI没有把内存分配优化好，每个进程都试图分配大量ghost atom的缓冲区，就会导致总内存溢出。②在内存带宽本来就捉襟见肘的情况下，过多的进程还要处理800万原子的通讯，就会导致MPI守护进程响应超时或崩溃。所以一般遇到这种问题我们可以通过减小体系或者减少进程数来解决。

![ ](lj2.svg)

<table>
  <tr>
    <th colspan="2">Nx Ny Nz：4 4 2</th>
    <th colspan="2">Nx Ny Nz：4 4 4</th>
    <th colspan="2">Nx Ny Nz：8 8 4</th>
  </tr>
  <tr>
    <th>MPI</th>
    <th>timestep/s</th>
    <th>MPI</th>
    <th>timestep/s</th>
    <th>MPI</th>
    <th>timestep/s</th>
  </tr>
  <tr>
    <td>1</td>
    <td>36.415</td>
    <td>1</td>
    <td>18.786</td>
    <td>1</td>
    <td>4.723</td>
  </tr>
  <tr>
    <td>2</td>
    <td>41.712</td>
    <td>2</td>
    <td>20.978</td>
    <td>2</td>
    <td>5.358</td>
  </tr>
  <tr>
    <td>4</td>
    <td>48.36</td>
    <td>4</td>
    <td>22.181</td>
    <td>4</td>
    <td>5.66</td>
  </tr>
  <tr>
    <td>8</td>
    <td>44.269</td>
    <td>8</td>
    <td>25.241</td>
    <td>8</td>
    <td>5.768</td>
  </tr>
  <tr>
    <td>16</td>
    <td>76.908</td>
    <td>16</td>
    <td>38.99</td>
    <td>16</td>
    <td>error</td>
  </tr>
  <tr>
    <td>32</td>
    <td>76.597</td>
    <td>32</td>
    <td>39.126</td>
    <td>32</td>
    <td>error</td>
  </tr>
  <tr>
    <td>64</td>
    <td>61.259</td>
    <td>64</td>
    <td>error</td>
    <td>64</td>
    <td>error</td>
  </tr>
</table>

**lmp_kokkos**  
运行命令：`mpirun -np N lmp_kokkos -pk kokkos -sf kk -k on g 1 -in in.lj -var x Nx -var y Ny -var z Nz`

![ ](lj3.svg)

<table>
  <tr>
    <th colspan="2">Nx Ny Nz：4 4 2</th>
    <th colspan="2">Nx Ny Nz：4 4 4</th>
    <th colspan="2">Nx Ny Nz：8 8 4</th>
  </tr>
  <tr>
    <th>MPI</th>
    <th>timestep/s</th>
    <th>MPI</th>
    <th>timestep/s</th>
    <th>MPI</th>
    <th>timestep/s</th>
  </tr>
  <tr>
    <td>1</td>
    <td>57.808</td>
    <td>1</td>
    <td>29.194</td>
    <td>1</td>
    <td>7.157</td>
  </tr>
  <tr>
    <td>2</td>
    <td>37.028</td>
    <td>2</td>
    <td>18.599</td>
    <td>2</td>
    <td>4.704</td>
  </tr>
  <tr>
    <td>4</td>
    <td>35.819</td>
    <td>4</td>
    <td>18.467</td>
    <td>4</td>
    <td>4.785</td>
  </tr>
  <tr>
    <td>8</td>
    <td>35.151</td>
    <td>8</td>
    <td>18.012</td>
    <td>8</td>
    <td>4.694</td>
  </tr>
  <tr>
    <td>16</td>
    <td>37.033</td>
    <td>16</td>
    <td>20.01</td>
    <td>16</td>
    <td>5.196</td>
  </tr>
  <tr>
    <td>32</td>
    <td>32.238</td>
    <td>32</td>
    <td>18.627</td>
    <td>32</td>
    <td>error</td>
  </tr>
</table>

**性能对比**  
在LJ基准测试中，Kokkos凭借单进程下极高的数据驻留效率占据起跑优势，性能远超传统GPU包及起步极慢的纯CPU版本，但其性能随MPI增加因资源争抢而急剧下跌；传统GPU包则通过多MPI协同调用CPU核心辅助计算，在MPI=16时反超所有版本达到全场最高峰值；而纯CPU版本虽起步性能垫底，但凭借稳定的线性扩展能力在MPI=32时成功反超了衰减后的Kokkos，这证明了在小体系下，GPU算力爆发虽强，但若并行策略不当，其效率甚至会跌至多核CPU水平以下。

![ ](lj4.svg)
![ ](lj5.svg)

#### 5.3.2 Chain

**lmp_cpu**  
运行命令：`mpirun -np N lmp_cpu -sf omp -pk omp 1 -in in.chain.scaled -var x Nx -var y Ny -var z Nz`  
**lmp_gpu**  
运行命令：`mpirun -np N lmp_gpu -sf gpu -pk gpu 1 neigh no -in in.chain.scaled -var x Nx -var y Ny -var z Nz`

>`-pk gpu 1 neigh no`会让 GPU 专门负责算力最繁重的力的计算，而把逻辑复杂的邻居列表构建留给CPU。这样可以规避GPU处理Cutoff时的崩溃(类似`WARNING: Communication cutoff 1.52 is shorter than a bond length based estimate of 1.855.`)，通常性能损失很小。

**lmp_kokkos**  
运行命令：`mpirun -np N lmp_kokkos -pk kokkos -sf kk -k on g 1 -in in.chain.scaled -var x Nx -var y Ny -var z Nz`

**性能对比**  
在Chain基准测试中，Kokkos在单进程下凭借极高的GPU驻留效率实现了近10倍的初始加速，但在多核并行下由于内核启动开销过大而迅速溃败；反观纯CPU运算在MPI=32时利用超高缓存命中率实现了惊人的20倍性能飙升，最终以绝对优势反超所有加速版本。这证明了对于包含复杂键合作用的中小规模体系，多核心CPU的强逻辑处理能力远比目前的GPU并行模式更具效率优势。

![ ](chain1.svg)
![ ](chain2.svg)

<table>
  <tr>
    <th></th>
    <th colspan="3">Nx Ny Nz：2 2 2</th>
    <th colspan="3">Nx Ny Nz：4 2 2</th>
  </tr>
  <tr>
    <th></th>
    <th colspan="3">timestep/s</th>
    <th colspan="3">timestep/s</th>
  </tr>
  <tr>
    <th>MPI</th>
    <th>cpu</th>
    <th>gpu</th>
    <th>kokkos</th>
    <th>cpu</th>
    <th>gpu</th>
    <th>kokkos</th>
  </tr>
  <tr>
    <td>1</td>
    <td>15.643</td>
    <td>11.741</td>
    <td>148.053</td>
    <td>7.504</td>
    <td>5.903</td>
    <td>72.376</td>
  </tr>
  <tr>
    <td>2</td>
    <td>28.512</td>
    <td>21.595</td>
    <td>93.83</td>
    <td>14.269</td>
    <td>10.829</td>
    <td>47.127</td>
  </tr>
  <tr>
    <td>4</td>
    <td>45.018</td>
    <td>35.294</td>
    <td>94.513</td>
    <td>22.577</td>
    <td>17.244</td>
    <td>47.394</td>
  </tr>
  <tr>
    <td>8</td>
    <td>84.717</td>
    <td>62.647</td>
    <td>84.807</td>
    <td>34.864</td>
    <td>26.662</td>
    <td>48.581</td>
  </tr>
  <tr>
    <td>16</td>
    <td>192.413</td>
    <td>122.135</td>
    <td>63.683</td>
    <td>81.046</td>
    <td>59.324</td>
    <td>46.525</td>
  </tr>
  <tr>
    <td>32</td>
    <td>331.166</td>
    <td>164.024</td>
    <td>40.681</td>
    <td>132.478</td>
    <td>86.85</td>
    <td>32.802</td>
  </tr>
</table>

#### 5.3.3 EAM

**lmp_cpu**  
运行命令：`mpirun -np N lmp_cpu -sf omp -pk omp 1 -in in.eam -var x Nx -var y Ny -var z Nz`  
**lmp_gpu**  
运行命令：`mpirun -np N lmp_gpu -sf gpu -pk gpu 1 -in in.eam -var x Nx -var y Ny -var z Nz`  
**lmp_kokkos**  
运行命令：`mpirun -np N lmp_kokkos -pk kokkos -sf kk -k on g 1 -in in.eam -var x Nx -var y Ny -var z Nz`

**性能对比**
在EAM基准测试中，传统GPU包凭借针对复杂势函数的手写CUDA优化，从起步阶段便全面压制了Kokkos，并在MPI=16时通过CPU协同达到了性能最值；Kokkos版本虽然初速尚可，但受限于通用模板在处理密集数学计算时的效率损失，且随MPI增加因严重的调度开销而性能塌方；与此同时，纯CPU运算依靠近乎完美的线性扩展性，在并行度提高后不仅轻松超越Kokkos，更展现出追平GPU包的潜力，这再次印证了在中小体系模拟中，手写优化的GPU代码与多核CPU并行是比Kokkos更务实的高效方案。

![ ](eam1.svg)
![ ](eam2.svg)

<table>
  <tr>
    <th></th>
    <th colspan="3">Nx Ny Nz：2 2 2</th>
    <th colspan="3">Nx Ny Nz：4 2 2</th>
  </tr>
  <tr>
    <th></th>
    <th colspan="3">timestep/s</th>
    <th colspan="3">timestep/s</th>
  </tr>
  <tr>
    <th>MPI</th>
    <th>cpu</th>
    <th>gpu</th>
    <th>kokkos</th>
    <th>cpu</th>
    <th>gpu</th>
    <th>kokkos</th>
  </tr>
  <tr>
    <td>1</td>
    <td>3.343</td>
    <td>81.998</td>
    <td>59.249</td>
    <td>1.682</td>
    <td>37.631</td>
    <td>30.284</td>
  </tr>
  <tr>
    <td>2</td>
    <td>6.484</td>
    <td>96.632</td>
    <td>42.025</td>
    <td>3.252</td>
    <td>46.989</td>
    <td>23.476</td>
  </tr>
  <tr>
    <td>4</td>
    <td>11.777</td>
    <td>92.262</td>
    <td>40.798</td>
    <td>5.869</td>
    <td>53.488</td>
    <td>20.995</td>
  </tr>
  <tr>
    <td>8</td>
    <td>21.87</td>
    <td>96.09</td>
    <td>40.131</td>
    <td>10.76</td>
    <td>48.167</td>
    <td>21.032</td>
  </tr>
  <tr>
    <td>16</td>
    <td>41.995</td>
    <td>109.576</td>
    <td>36.879</td>
    <td>20.948</td>
    <td>57.589</td>
    <td>20.935</td>
  </tr>
  <tr>
    <td>32</td>
    <td>69.862</td>
    <td>96.464</td>
    <td>32.329</td>
    <td>34.72</td>
    <td>54.937</td>
    <td>18.773</td>
  </tr>
</table>

#### 5.3.4 Chute

**lmp_cpu**  
运行命令：`mpirun -np N lmp_cpu -sf omp -pk omp 1 -in in.chute.scaled -var x Nx -var y Ny`  
**lmp_gpu**  
运行命令：`mpirun -np N lmp_gpu -sf gpu -pk gpu 1 -in in.chain.scaled -var x Nx -var y Ny`  
**lmp_kokkos**  
运行命令：`mpirun -np N lmp_kokkos -pk kokkos -sf kk -k on g 1 -in in.chain.scaled -var x Nx -var y Ny`  
**性能对比**  
在Chute基准测试中，Kokkos在单进程下凭借高效的内核合并技术跑出了全场最高的起步效率（领先GPU包12倍），但随并行度增加却因任务切分过细导致性能严重崩塌；而纯CPU运算凭借强大的分支预测能力和完美的扩展性，在MPI=32时以近7倍的压倒性优势反超Kokkos，并显著领先于始终处于瓶颈状态的传统GPU包。这再次证明了对于逻辑复杂的颗粒力学模拟，多核CPU的高并行效率依然是GPU难以企及的。

>对于Chute基准测试，必须设置Nz=1。

![ ](chute1.svg)
![ ](chute2.svg)

<table>
  <tr>
    <th></th>
    <th colspan="3">Nx Ny Nz：4 2 1</th>
    <th colspan="3">Nx Ny Nz：4 4 1</th>
  </tr>
  <tr>
    <th></th>
    <th colspan="3">timestep/s</th>
    <th colspan="3">timestep/s</th>
  </tr>
  <tr>
    <th>MPI</th>
    <th>cpu</th>
    <th>gpu</th>
    <th>kokkos</th>
    <th>cpu</th>
    <th>gpu</th>
    <th>kokkos</th>
  </tr>
  <tr>
    <td>1</td>
    <td>27.422</td>
    <td>11.816</td>
    <td>148.803</td>
    <td>13.993</td>
    <td>5.866</td>
    <td>73.544</td>
  </tr>
  <tr>
    <td>2</td>
    <td>42.521</td>
    <td>21.432</td>
    <td>94.778</td>
    <td>21.451</td>
    <td>10.661</td>
    <td>47.555</td>
  </tr>
  <tr>
    <td>4</td>
    <td>53.902</td>
    <td>35.231</td>
    <td>94.495</td>
    <td>27.388</td>
    <td>17.136</td>
    <td>47.597</td>
  </tr>
  <tr>
    <td>8</td>
    <td>70.513</td>
    <td>62.737</td>
    <td>85.677</td>
    <td>33.998</td>
    <td>27.51</td>
    <td>49.055</td>
  </tr>
  <tr>
    <td>16</td>
    <td>160.963</td>
    <td>125.791</td>
    <td>64.512</td>
    <td>68.937</td>
    <td>59.551</td>
    <td>47.086</td>
  </tr>
  <tr>
    <td>32</td>
    <td>276.988</td>
    <td>164.751</td>
    <td>40.878</td>
    <td>79.278</td>
    <td>86.787</td>
    <td>32.322</td>
  </tr>
</table>

#### 5.3.5 Rhodo

**lmp_cpu**  
运行命令：`mpirun -np N lmp_cpu -sf omp -pk omp 1 -in in.rhodo.scaled -var x Nx -var y Ny -var z Nz`  
**lmp_gpu**  
运行命令：`mpirun -np N lmp_gpu -sf gpu -pk gpu 1 -in in.rhodo.scaled -var x Nx -var y Ny -var z Nz`  
**lmp_kokkos**  
运行命令：`mpirun -np N lmp_kokkos -pk kokkos neigh half -sf kk -k on g 1 -in in.rhodo.scaled -var x Nx -var y Ny -var z Nz`

>在GPU上计算时，KOKKOS包通常默认开启Full List和newton off，因为这样可以避免GPU线程之间的原子竞争，性能通常更好。但是某些特定的势函数在Kokkos的代码实现中目前只支持“半列表”计算模式。就比如这个例子中的CHARMM力场中二面角的相关计算就只支持“半列表”计算模式，所以需要开启`neigh half`

**性能对比**  
在Rhodo基准测试中，传统GPU包凭借成熟的生物力场优化在低并行度下展现了较强的爆发力，但Kokkos版本却因复杂的内核调用和通讯开销在多进程下彻底崩溃，性能跌至冰点；而纯CPU运算凭借完美的线性扩展能力，在MPI=32时不仅轻松反超所有GPU加速版本，更跑出了数十倍于Kokkos的效率，这深刻揭示了在处理包含长程静电的复杂生物体系时，多核CPU依然是目前最稳定且最高效的计算中枢。
![ ](rhodo1.svg)
![ ](rhodo2.svg)

<table>
  <tr>
    <th>MPI</th>
    <th colspan="3">Nx Ny Nz：1 1 1</th>
    <th colspan="3">Nx Ny Nz：2 2 2</th>
  </tr>
  <tr>
    <th></th>
    <th colspan="3">timestep/s</th>
    <th colspan="3">timestep/s</th>
  </tr>
  <tr>
    <th></th>
    <th>cpu</th>
    <th>gpu</th>
    <th>kokkos</th>
    <th>cpu</th>
    <th>gpu</th>
    <th>kokkos</th>
  </tr>
  <tr>
    <td>1</td>
    <td>5.609</td>
    <td>72.427</td>
    <td>40.428</td>
    <td>0.698</td>
    <td>7.732</td>
    <td>5.891</td>
  </tr>
  <tr>
    <td>2</td>
    <td>10.878</td>
    <td>97.932</td>
    <td>26.964</td>
    <td>1.349</td>
    <td>11.995</td>
    <td>4.668</td>
  </tr>
  <tr>
    <td>4</td>
    <td>19.683</td>
    <td>102.448</td>
    <td>20.955</td>
    <td>2.498</td>
    <td>13.753</td>
    <td>4.32</td>
  </tr>
  <tr>
    <td>8</td>
    <td>36.397</td>
    <td>89.641</td>
    <td>10.634</td>
    <td>4.663</td>
    <td>14.8</td>
    <td>3.655</td>
  </tr>
  <tr>
    <td>16</td>
    <td>65.002</td>
    <td>75.057</td>
    <td>5.399</td>
    <td>8.703</td>
    <td>16.375</td>
    <td>3.024</td>
  </tr>
  <tr>
    <td>32</td>
    <td>96.506</td>
    <td>51.556</td>
    <td>2.212</td>
    <td>13.867</td>
    <td>15.702</td>
    <td>1.855</td>
  </tr>
</table>

按照各位前辈的说法，Kokkos版本加速效果应当要比CPU和GPU版本的要好得多，但是在本次测试中结果却并不尽人意。其原因应当在于显卡，Geforce GTX 1080是消费级单精度显卡，GPU包默认使用单精度计算，本文在编译GPU可执行文件时开启了`-D GPU_PREC=mixed`，即使用混合精度计算。而Kokkos是使用双精度计算的，Geforce GTX 1080的双精度计算能力只有单精度的1/32，因此很大程度上限制了Kokkos的发挥。

[Ubuntu子系统下LAMMPS的安装]:https://mcxyzmc.github.io/2026/01/14/ubuntu-zi-xi-tong-xia-lammps-de-an-zhuang/
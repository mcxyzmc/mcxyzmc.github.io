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

## 五. 性能测试

### 5.1 硬件信息查询

执行命令`lscpu`和`nvidia-smi`查看当前cpu和gpu信息：单cpu，cpu物理核心数32，逻辑处理器数64；单gpu

```bash
Architecture:                x86_64
  CPU op-mode(s):            32-bit, 64-bit
  Address sizes:             43 bits physical, 48 bits virtual
  Byte Order:                Little Endian
CPU(s):                      64
  On-line CPU(s) list:       0-63
Vendor ID:                   AuthenticAMD
  Model name:                AMD Ryzen Threadripper 2990WX 32-Core Processor
    CPU family:              23
    Model:                   8
    Thread(s) per core:      2
    Core(s) per socket:      32
    Socket(s):               1
    Stepping:                2
    Frequency boost:         enabled
    CPU(s) scaling MHz:      72%
    CPU max MHz:             3000.0000
    CPU min MHz:             2200.0000
    BogoMIPS:                5988.19
    Flags:                   fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat 
                             pse36 clflush mmx fxsr sse sse2 ht syscall nx mmxext fxsr_opt pdpe
                             1gb rdtscp lm constant_tsc rep_good nopl nonstop_tsc cpuid extd_ap
                             icid amd_dcm aperfmperf rapl pni pclmulqdq monitor ssse3 fma cx16 
                             sse4_1 sse4_2 movbe popcnt aes xsave avx f16c rdrand lahf_lm cmp_l
                             egacy svm extapic cr8_legacy abm sse4a misalignsse 3dnowprefetch o
                             svw skinit wdt tce topoext perfctr_core perfctr_nb bpext perfctr_l
                             lc mwaitx cpb hw_pstate ssbd ibpb vmmcall fsgsbase bmi1 avx2 smep 
                             bmi2 rdseed adx smap clflushopt sha_ni xsaveopt xsavec xgetbv1 clz
                             ero xsaveerptr arat npt lbrv svm_lock nrip_save tsc_scale vmcb_cle
                             an flushbyasid decodeassists pausefilter pfthreshold avic v_vmsave
                             _vmload vgif overflow_recov succor smca sev sev_es
Virtualization features:     
  Virtualization:            AMD-V
Caches (sum of all):         
  L1d:                       1 MiB (32 instances)
  L1i:                       2 MiB (32 instances)
  L2:                        16 MiB (32 instances)
  L3:                        64 MiB (8 instances)
NUMA:                        
  NUMA node(s):              4
  NUMA node0 CPU(s):         0-7,32-39
  NUMA node1 CPU(s):         16-23,48-55
  NUMA node2 CPU(s):         8-15,40-47
  NUMA node3 CPU(s):         24-31,56-63
Vulnerabilities:             
  Gather data sampling:      Not affected
  Indirect target selection: Not affected
  Itlb multihit:             Not affected
  L1tf:                      Not affected
  Mds:                       Not affected
  Meltdown:                  Not affected
  Mmio stale data:           Not affected
  Reg file data sampling:    Not affected
  Retbleed:                  Mitigation; untrained return thunk; SMT vulnerable
  Spec rstack overflow:      Mitigation; Safe RET
  Spec store bypass:         Mitigation; Speculative Store Bypass disabled via prctl
  Spectre v1:                Mitigation; usercopy/swapgs barriers and __user pointer sanitizati
                             on
  Spectre v2:                Mitigation; Retpolines; IBPB conditional; STIBP disabled; RSB fill
                             ing; PBRSB-eIBRS Not affected; BHI Not affected
  Srbds:                     Not affected
  Tsa:                       Not affected
  Tsx async abort:           Not affected
  Vmscape:                   Mitigation; IBPB before exit to userspace
```

```bash
Fri Jan 23 15:36:22 2026       
+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 550.163.01             Driver Version: 550.163.01     CUDA Version: 12.4     |
|-----------------------------------------+------------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
|                                         |                        |               MIG M. |
|=========================================+========================+======================|
|   0  NVIDIA GeForce GTX 1080        Off |   00000000:42:00.0 Off |                  N/A |
|  0%   24C    P8              9W /  210W |      68MiB /   8192MiB |      0%      Default |
|                                         |                        |                  N/A |
+-----------------------------------------+------------------------+----------------------+
                                                                                         
+-----------------------------------------------------------------------------------------+
| Processes:                                                                              |
|  GPU   GI   CI        PID   Type   Process name                              GPU Memory |
|        ID   ID                                                               Usage      |
|=========================================================================================|
|    0   N/A  N/A      1786      G   /usr/lib/xorg/Xorg                             57MiB |
|    0   N/A  N/A      1866      G   /usr/bin/gnome-shell                            6MiB |
+-----------------------------------------------------------------------------------------+
```

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

>注：虽然测试电脑有64个逻辑核心，但MPI默认可能只识别物理核心，导致MPI认为只有32个物理插槽可用。所以`mpirun -np 64`时会出错，这时需要在`mpirun`后面加上`--use-hwthread-cpus`参数

![](lj1.svg)

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

>注：可以看到下表中出现多个error，报错信息都是`ERROR on proc 0: Insufficient memory on accelerator`，一般也就是我们常说的显存炸了。这不是算力问题，而是内存容量(RAM)不足或MPI通信开销过大：①Geforce GTX 1080显存只有8GB，在Nx Ny Nz：8 8 4的情况下，要计算800万原子的LJ体系加上邻居列表，如果MPI没有把内存分配优化好，每个进程都试图分配大量ghost atom的缓冲区，就会导致总内存溢出。②在内存带宽本来就捉襟见肘的情况下，过多的进程还要处理800万原子的通讯，就会导致MPI守护进程响应超时或崩溃。所以一般遇到这种问题我们可以通过减小体系或者减少进程数来解决。

![](lj2.svg)

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

![](lj3.svg)

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
![Nx Ny Nz：4 4 2](lj4.svg)
![Nx Ny Nz：4 4 4](lj5.svg)

#### 5.3.2 Chain

**lmp_cpu**
运行命令：`mpirun -np N lmp_cpu -sf omp -pk omp 1 -in in.chain.scaled -var x Nx -var y Ny -var z Nz`
**lmp_gpu**
运行命令：`mpirun -np N lmp_gpu -sf gpu -pk gpu 1 neigh no -in in.chain.scaled -var x Nx -var y Ny -var z Nz`

>注：`-pk gpu 1 neigh no`会让 GPU 专门负责算力最繁重的力的计算，而把逻辑复杂的邻居列表构建留给CPU。这样可以规避GPU处理Cutoff时的崩溃(类似`WARNING: Communication cutoff 1.52 is shorter than a bond length based estimate of 1.855.`)，通常性能损失很小。

**lmp_kokkos**
运行命令：`mpirun -np N lmp_kokkos -pk kokkos -sf kk -k on g 1 -in in.chain.scaled -var x Nx -var y Ny -var z Nz`

**性能对比**
![Nx Ny Nz：2 2 2](chain1.svg)
![Nx Ny Nz：4 2 2](chain2.svg)

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
运行命令：`mpirun -np N lmp_gpu -sf gpu -pk gpu 1 neigh no -in in.eam -var x Nx -var y Ny -var z Nz`

>注：`-pk gpu 1 neigh no`会让 GPU 专门负责算力最繁重的力的计算，而把逻辑复杂的邻居列表构建留给CPU。这样可以规避GPU处理Cutoff时的崩溃(类似`WARNING: Communication cutoff 1.52 is shorter than a bond length based estimate of 1.855.`)，通常性能损失很小。

**lmp_kokkos**
运行命令：`mpirun -np N lmp_kokkos -pk kokkos -sf kk -k on g 1 -in in.eam -var x Nx -var y Ny -var z Nz`

**性能对比**

![Nx Ny Nz：2 2 2](eam1.svg)
![Nx Ny Nz：4 2 2](eam2.svg)

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

#### 5.3.5 Rhodo

[Ubuntu子系统下LAMMPS的安装]:https://mcxyzmc.github.io/2026/01/14/ubuntu-zi-xi-tong-xia-lammps-de-an-zhuang/
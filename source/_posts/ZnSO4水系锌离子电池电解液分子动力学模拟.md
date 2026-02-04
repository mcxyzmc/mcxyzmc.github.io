---
title: ZnSO4水系锌离子电池电解液分子动力学模拟
mathjax: true
swiper: false
top: false
date: 2026-01-25 19:16:42
updated:
tags:
    - ZIBS
    - MS
    - LAMMPS
categories:
    - [scientific research, simulation]
---

**参考文献**：  
[1] [Establishing Ultralow Self-Discharge Zn-I2 Battery by Optimizing ZnSO4 Electrolyte Concentration]  
[2] [Molecular Dynamics Simulation of Zn Aqueous Electrolyte Solutions: Structure and Dynamics]

## 一. 理论基础

### 1.1 COMPASS III力场

COMPASS III属于Class II力场，与传统的第一类力场相比，其核心区别在于引入了高阶非谐性项和交叉耦合项，旨在同时实现对孤立分子和凝聚相的高精度描述。COMPASS III势函数可以写成如下形式：
$$E_{total}=E_{non-bond}+E_{valence}$$

1. 非键相互作用
包含范德华相互作用和静电相互作用：

    $$
    \begin{array}{l}
    E_{vdW} = \sum_{i>j} [D_{0,ij} (2(\frac{R_{0,ij}}{R_{ij}})^9 - 3(\frac{R_{0,ij}}{R_{ij}})^6)] \\\\
    E_{elec} = \sum_{i>j} \frac{q_i q_j}{4\pi \epsilon_0 R_{ij}}
    \end{array}
    $$

2. 价键相互作用
包含对角项和交叉项，其中对角项描述单一坐标的形变能，使用了高阶多项式以包含非谐性；交叉耦合项是Class II力场的精髓，用于描述不同自由度之间的耦合（比如键拉长时键角通常会变小）。

    $$
    \begin{array}{l}
    E_{diagonal}=E_{bond}+E_{angle}+E_{torsion}+E_{inversion}\\\\
    =\sum_{R}\frac{1}{2}K_s(R-R_0^2)(1+C_s(R-R_0)+D_s(R-R_0)^2)\\\\
    +\sum_{\theta}\frac{1}{2}K_b(\theta-\theta_0)^2(1+C_b(\theta-\theta_0)+D_b(\theta-\theta_0)^2)\\\\
    +\sum_{\phi}\frac{1}{2}\sum_{j}B_j(1-d_jcosj\phi)\\\\
    +\sum_{\omega}\frac{1}{2}K_i\omega_{av}^2
    \end{array}
    $$
  
    $$
    \begin{array}{l}
    E_{cross}=\sum_{(R,R')}K_{ss}(R-R_0)(R'-R_0')\\\\
    +\sum_{(R,R'')}K_{ss}'(R-R_0)(R''-R_0'')\\\\
    +\sum_{(R,\phi)}(R-R_0)\sum_jU_jcosj\phi\\\\
    +\sum_{(\theta,\theta')}K_{bb}(\theta-\theta_0)(\theta'-\theta_0')\\\\
    +\sum_{(R,\theta,R')}(\theta-\theta_0)\left(K_{sbs}(R-R_0)+K_{sbs}'(R'-R_0')\right)\\\\
    +\sum_{(\theta,\theta',\phi)}K_{tbb}(\theta-\theta_0)(\theta'-\theta_0')cos\phi\\\\
    +\sum_{(\theta,\theta',\phi)}\sum_j\left(V_j(\theta-\theta_0)+V_j'(\theta'-\theta_0')\right)cosj\phi\\\\
    +\sum_{(R,R',\phi)}\sum_j\left(W_j(R-R_0)+W_j'(R'-R_0')\right)cosj\phi
    \end{array}
    $$

### 1.2 几何优化、能量最小化、模拟退火与结构弛豫

1. 几何优化（Geometry Optimization）与能量最小化（Energy Minimization）
一般来说在分子动力学模拟中可以认为几何优化和能量最小化是等价的，本质都是一种数学迭代过程。
   - 定义：几何优化/能量最小化是一种迭代数学过程，旨在通过调整体系中所有原子的空间坐标，使其在势能面（Potential Energy Surface, PES）上寻找势能的局部极小值点。在此状态下，原子所受的合力趋近于零。
   - 核心原理：使用最速下降法（Steepest Descent）、共轭梯度法（Conjugate Gradient）或牛顿-拉夫森法（Newton-Raphson）等数学算法，沿着能量梯度的反方向移动原子。注意这个过程不涉及动能即不考虑温度，仅与势能有关。
   - 目的：
        - 消除不合理的接触：修复初始建模时因原子随机堆积导致的原子核重叠或键长键角扭曲
        - 防止模拟崩溃：消除体系内极高的势能梯度，防止在后续动力学模拟开始瞬间产生巨大的原子受力而导致程序报错
        - 获得基态结构：在量子化学中，可以用于确定分子在静止状态下的本征几何参数
2. 模拟退火（Simulated Annealing）
    - 定义：模拟退火是一种受冶金学退火过程启发的全局优化算法，它通过赋予体系较高的热能（温度），使其能够跨越势能面上的能垒，并在随后的缓慢降温过程中收敛到全局最小点或更优的低能构型。
    - 核心原理：
        - 变温动力学：过程包含“升温-高温平衡-降温”三个阶段
        - 跨越能垒：在高温下，分子具有较高的动能，可以摆脱局部亚稳态的束缚；在降温过程中，分子逐渐失去动能，最终“沉降”到能量更低的构型中。
    - 目的：
        - 克服局部极小值：解决简单的“能量最小化”只能找到最近的坑、无法找到最优结构的问题
        - 优化无序结构：对于无定形体系或溶剂化体系，用于打乱初始的人工构建结构，促进溶剂分子重排，形成更合理的微观结构（如溶剂化层）
3. 结构弛豫（Structural Relaxation）
    - 定义：结构弛豫是指将微观体系置于特定的热力学系综下，通过长时间的动力学演化使体系的宏观物理量从非平衡初态逐渐收敛并稳定在热力学平衡态数值附近的过程。
    - 核心原理：
        - 牛顿运动方程：基于$F=ma$随时间积分，模拟原子的真实热运动
        - 热浴/压浴耦合：利用控温算法和控压算法与外界环境交换能量和体积
    - 目的：
        - 调整宏观性性质：修正初始人为设定的密度，使其符合真实物理条件下的密度（NPT系综）
        - 消除记忆效应：消除初始建模或退火过程残留的历史状态影响
        - 为采样做准备：确保体系已经处于稳定的热力学状态，从而保证后续采集的数据具有统计学意义和物理可靠性

>在分子动力学语境下，结构弛豫通常指代系统平衡的过程；而在量子化学中它通常指代“几何优化”

---

## 二. MS模拟流程

### 2.1 模型构建

1. 单分子/离子建模
    - 使用MS绘制$H_2O、Zn^{2+}、SO_4^{2-}$
    - 使用MS的Forcite模块，Forcefield选择`COMPASS III`为分子/离子分配原子类型和电荷（$Zn^{2+}$需手动更改电荷，这是COMPASS III力场的一个bug）
    - 使用MS的Dmol3模块，Task选择`Geometry Optimization`，Functional选择`m-GGA`和`M06-L`，Basis set选择`DNP`，Basis file选择`3.5`
2. 模拟盒子构建
    ![ ](image.png)
    使用MS的Amorphous Cell模块构建模拟盒子，按表格数据添加所需数量的分子、离子，根据Box volume计算盒子边长并调整密度使之相对应，力场类型选择`COMPASS III`。
    >根据gemini的说法这里的质量摩尔浓度和盒子大小是相互冲突的，与实验数据不符。出于后面会进行几何构型优化的考虑，这里直接按文献数据来。

### 2.2 正式模拟

1. 盒子几何构型优化
在MS中找到`Modify->Constraints->Lattice->Fix Angles`勾选固定三个角。使用MS的Forcite模块，Task选择`Geometry Optimization`，Quality选择`Fine`，Forcefield选择`COMPASS III`，Algorithm选择`Conjugate gradient`，Max iterations选择`5000`，勾选`Optimize Cell`。
2. 模拟退火
使用MS的Forcite模块，Task选择`Anneal`，Quality选择`Fine`，Annealing cycles设置为`5`，Initial temperature设置为`300`，Mid-cycle temperature设置为`500`，Heating ramps per cycle设置为`10`，Dynamics steps per ramp设置为`10000`，Ensemble设置为`NPT`，Initial velocities设置为`Random`，Pressure设置为`1.0e-4`，Time step设置为`1`，此时Total number of steps为1000000即1ns，勾选`Optimize after each cycle`。
3. NPT平衡
选择模拟退火中能量最低帧的xsd文件进行后续运算，使用MS的Forcite模块，Task选择`Dynamics`，Quality选择`Fine`，Ensemble设置为`NPT`，Initial velocities设置为`Random`，Temperatuer设置为`298`，Pressure设置为`1.0e-4`，Time step设置为`1`，Total simulation time设置为`500`，Thermostat设置为`Nose`，Barostat设置为`Berendsen`。
4. NVT采样
使用MS的Forcite模块，Task选择`Dynamics`，Quality选择`Fine`，Ensemble设置为`NVT`，Initial velocities设置为`Current`，Temperatuer设置为`298`，Time step设置为`1`，Total simulation time设置为`500`，Thermostat设置为`Nose`。

### 2.3 数据处理

---

## 三. LAMMPS模拟流程

[Establishing Ultralow Self-Discharge Zn-I2 Battery by Optimizing ZnSO4 Electrolyte Concentration]:https://onlinelibrary.wiley.com/doi/10.1002/smll.202306947
[Molecular Dynamics Simulation of Zn Aqueous Electrolyte Solutions: Structure and Dynamics]:https://curate.nd.edu/articles/thesis/Molecular_Dynamics_Simulation_of_Zn_Aqueous_Electrolyte_Solutions_Structure_and_Dynamics/25545640/1

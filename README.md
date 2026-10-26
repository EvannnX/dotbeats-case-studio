# dotBeats Case Studio

交互式外壳与按键设计、独立模型文件和按压演示。Interactive enclosure and button design, downloadable models and mechanism videos.

- [在线预览 / Live preview](https://evannnx.github.io/dotbeats-case-studio/)
- [合体版 / Combined C01](https://evannnx.github.io/dotbeats-case-studio/combined/)
- [下载与视频 / Downloads and videos](https://evannnx.github.io/dotbeats-case-studio/downloads.html)

## Versions / 版本

Original case: 28 mm. B03: standalone two-piece motor button. C01: separate 26 mm enclosure assembly with shorter 9.5 mm plungers. Original versions are preserved.

原壳体、独立 B03 按键与 C01 合体版分别保存。模型包在 `public/assets/dotbeats_three_versions.zip`。STL 单位 mm；GLB 单位 m。

## Run / 本地运行

```sh
npm ci
npm run dev
```

Open `/dotbeats-case-studio/`. To update GitHub Pages, run `npm run build`, replace `docs/` with `dist/`, add `docs/.nojekyll`, then commit and push. Pages serves `main:/docs`.

## Prototype status / 原型状态

Geometry and mesh checks do not establish physical reliability. The 0.25 mm actuation and 0.40 mm stop travel are design assumptions. Motor solder clearance, switch overtravel, wire routing, FDM fit and return need physical testing.

几何检查不代表实物可靠性。触发行程、限位、焊点空间、线束、打印配合与回弹均需试装验证。

PCB and ESP geometry are user-supplied references; no third-party licensing rights are asserted. Public access enables viewing and downloading; no blanket open-source license is granted.

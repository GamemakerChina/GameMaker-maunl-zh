# 参与贡献

## 开始贡献（文档贡献）

-----

### 在开始之前需要了解的事

 - 项目所使用的翻译工具是使用 aardio 编写，**仅支持 Windows 平台**，且在可预见的时间段内 aardio 的作者不会对跨平台提供任何支持，我们不会受理除 Windows 平台外的任何问题，包括但不限于 “为什么没有 macOS / Linux 平台版本？” 等问题。当然我们也欢迎对它移植，具体前往[开始贡献（工具贡献）](#%E5%BC%80%E5%A7%8B%E8%B4%A1%E7%8C%AE%E5%B7%A5%E5%85%B7%E8%B4%A1%E7%8C%AE)了解详情。
   （但它目前只能编译出 32 位程序，所以在 x86 和 ARM64 处理器上均可运行，在 ARM64 会由系统进行转译）
 - 由于去字和嵌字工作难度较大，我们短期内不会对文档内的图片进行翻译
 - [了解已知问题](knownissues.md)

### 推荐的辅助工具（可选）

- [Visual Studio Code](https://code.visualstudio.com/)
- [CC Compare](https://gitee.com/cxasm/cc-compare)
- [copytranslator](https://copytranslator.github.io/) / [QTranslator](http://quest-app.appspot.com/home)
- [Watt Toolkit](https://steampp.net/) / [FastGithub](https://github.com/dotnetcore/FastGithub)

### 1.克隆项目

https://github.com/GamemakerChina/gamemaker-maunl-zh.git

克隆该仓库,或派生或下载zip随你

### 2.准备要翻译的文档

解压文档压缩包到  `GMS2-Robohelp-en`  目录下

如果你有安装 `GameMaker` 那么你可以在以下目录找到文档压缩包

````
C:\ProgramData\GameMakerStudio2\Manual\GMS2-Robohelp-en.zip
C:\ProgramData\GameMakerStudio2-Beta\Manual\GMS2-Robohelp-en.zip
C:\ProgramData\GameMaker\Manual\GMS2-Robohelp-en.zip
C:\ProgramData\GameMaker-LTS\Manual\GMS2-Robohelp-en.zip
````

如果你没有安装,那你可以从rss订阅链接进行下载(为什么)
https://gms.yoyogames.com/update-manual.rss
https://gms.yoyogames.com/update-manual-beta.rss

### 3.设置group信息和申请获得翻译接口token

首先你需要打开 `setting.struct` 文件,修改group值到你们的语言缩写,它起到设置路径的作用



我在软件里集成了两个接口供我们组员使用,`彩云`与`languagex`,你需要打开`token.struct`设置token

下面是这两个接口的申请网址

https://dashboard.caiyunapp.com/user/sign_in/

http://app.languagex.com/ (注意,该接口的token需要从cookie获取,具体请按F12)



如果你所在的地区使用十分缓慢,建议在前端实现类似google之类的翻译接口

前端主要逻辑代码在`patch/main.js`,代码很简单,实现额外功能十分简单

### 4.开始翻译

打开 `GameMakerManualTranslator.exe` 对着想要翻译的元素右键即可

### 5,编译导出

你可以选择以下两种方式编译导出文档：

#### 外挂注入式

打开 `GameMakerManualTranslatorBuild.exe` 会将json注入到文件生成在`build`目录中

你可以将文件替换到原文档并压缩成zip替换`GameMaker`原文档zip文件,具体目录请看上面

#### 静态式

请确保系统内安装有 Node.js 环境后，在 `GameMakerManualExport` 下打开命令行，输入以下命令（假设是通过 Git 获取）：

```bash
# 获取 GameMakerManualExport
git submodule update --init --remote
cd GameMakerManualExport

# 安装依赖
npm config set registry https://registry.npmmirror.com # 如果速度慢执行该命令
npm install -g pnpm # 推荐使用 pnpm 加快安装
pnpm install

# （所有方式）复制需要准备的文件，无论使用哪种方式请必须先执行这个
pnpm run init:build

# （静态式）生成依赖
pnpm run static:gendep

# （静态式）同时导入文档、目录、词汇表并外挂CSS
pnpm run static:import

# （静态式）注入翻译译者信息
pnpm run static:team
```

若是通过下载zip的方式获取，请到 [GameMakerManualExport](https://github.com/GamemakerChina/GameMakerManualExport) 手动下载解压并放到 `GameMakerManualExport` 下

## 开始贡献（工具贡献）

-----

由于工具（除前端部分和 GameMakerManualExport 外）使用 aardio 编写，无法跨平台，也不会考虑跨平台，当然我们欢迎使用其他框架自行移植（如 Tauri，Neutralinojs 等）。

**注意：我们不接受使用 Electron、NW.js、CEF 进行移植的提交，敬请谅解**
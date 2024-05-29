# Game Maker 文档翻译器

**查看在线成品文档：[外挂式](https://manual-plugged.gm-cn.top/) [静态式](https://manual-static.gm-cn.top/)**

**直接下载成品文档：[外挂式](https://ghproxy.com/https://github.com/GamemakerChina/GameMaker-maunl-zh/archive/refs/heads/plugged.zip) [静态式](https://ghproxy.com/https://github.com/GamemakerChina/GameMaker-maunl-zh/archive/refs/heads/static.zip)** 

GameMaker文档翻译器,是为了方便的翻译文档而根据文档本身特别订制的工具,目的是解决一些痛点

具有以下特点

- 所见即所得,打开文档,对着你想翻译的元素点击鼠标右键就可以很方便的进行翻译,(讨厌的CAT)
- 基于字典进行翻译,不依赖于特定的文档版本,也不会修改文档本身,你可以很方便的替换文档进行升级
- 内嵌标签的简易化处理,将{}做为替代符,还可以使用数字重新排序,例如{2}{3}{0}{1},用来解决不同语言中的语序问题
- 因为字典是json文件,适合git协作(但仍需偶尔处理冲突)
- 一键编译字典到静态文件中,使其回到 GameMaker F1 (因为有跨域问题)

该工具基于webview2开发,据我所知,win10较高版本皆内置该环境,我讨厌生成electron那种动辄100M+的东西

## 你来自中国

吃人热线:GameMaker文档翻译(809290418)

[参与贡献](docs/contribution.md) [已知问题](docs/knownissues.md)

### 汉化组名单

- yunzl
- LiarOnce
- 红色激情
- 时间纪元
- Ceyase

## 许可协议

这是一个多协议的项目，可根据需要点击各个协议查看：

翻译内容 & 记忆库 - [CC-BY-SA 4.0 International](LICENSE)

GameMakerManualTranslator & GameMakerManualTranslatorBuild - [WTFPL](GameMakerManualTranslator-Project/LICENSE) [WTFPL](GameMakerManualTranslatorBuild-Project/LICENSE)

GameMakerManualExport - [MIT](GameMakerManualExport/LICENSE)

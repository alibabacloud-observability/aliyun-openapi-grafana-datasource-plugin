<!-- This README file is going to be the one displayed on the Grafana.com website for your plugin. Uncomment and replace the content here before publishing.

Remove any remaining comments before publishing as these may be displayed on Grafana.com -->
# POP
POP插件是一个专为Grafana设计的扩展工具，旨在通过可视化来自阿里云 OpenAPI 返回的 JSON 数据来增强 Grafana 仪表板的体验。它与 Grafana 无缝集成，允许您直接从 Grafana 仪表板进行阿里云服务的 API 调用，并可视化 JSON 响应。

## 使用要求
- Aliyun Grafana 实例（版本 9.0.x 或更高）。
- 具有适用权限设置的 API 访问阿里云账号和密钥。

## 特点
- 简易集成：在您现有的 Grafana 实例中轻松集成，配置最小化。
- 实时可视化：将来自阿里云 OpenAPI 的 JSON 响应实时转换为交互式图表和图形。
- 可定制仪表板：有效地创建量身定做的视觉表示，以监控和分析您的阿里云资源。
- 用户友好界面：轻松导航和配置插件，为用户带来强大的分析功能。
- 数据驱动的洞察：立即深入了解您的云环境，帮助您进行优化和故障排除的明智决策。

## 快速上手
1. 配置：在数据源管理面板, 添加 Pop数据源，在 settings 面板, 设置调用API的阿里云账号的AccessId 和 AccessKeySecret , 最好配置为子账号的AK，调用可能对账号发起线上资源操作，请小心操作，并确保账号具有对应操作的权限。为保证数据安全 , AK保存后清空 , 且不会回显。数据源中提供一些默认产品及参数配置，如果要使用未提供默认配置的产品，请参考对应产品的OpenAPI文档https://next.api.aliyun.com/document
2. 创建仪表板：通过添加 POP 插件面板并配置产品Product、API名称action、及查询参数，即可开始构建您的仪表板。
3. 数据可视化：自定义插件解析和显示数据的方式，确保始终能够快速获取相关信息。

## 支持
如果您遇到任何问题或需要帮助，请加入钉钉群34785590。
<img src="img/ding.png" alt="" title="Example Image Title" width="300" height="300" />


<!-- To help maximize the impact of your README and improve usability for users, we propose the following loose structure:

**BEFORE YOU BEGIN**
- Ensure all links are absolute URLs so that they will work when the README is displayed within Grafana and Grafana.com
- Be inspired ✨ 
  - [grafana-polystat-panel](https://github.com/grafana/grafana-polystat-panel)
  - [volkovlabs-variable-panel](https://github.com/volkovlabs/volkovlabs-variable-panel)

**ADD SOME BADGES**

Badges convey useful information at a glance for users whether in the Catalog or viewing the source code. You can use the generator on [Shields.io](https://shields.io/badges/dynamic-json-badge) together with the Grafana.com API 
to create dynamic badges that update automatically when you publish a new version to the marketplace.

- For the logo field use 'grafana'.
- Examples (label: query)
  - Downloads: $.downloads
  - Catalog Version: $.version
  - Grafana Dependency: $.grafanaDependency
  - Signature Type: $.versionSignatureType

Full example: ![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?logo=grafana&query=$.version&url=https://grafana.com/api/plugins/grafana-polystat-panel&label=Marketplace&prefix=v&color=F47A20)

Consider other [badges](https://shields.io/badges) as you feel appropriate for your project.

## Overview / Introduction
Provide one or more paragraphs as an introduction to your plugin to help users understand why they should use it.  

Consider including screenshots:
- in [plugin.json](https://grafana.com/developers/plugin-tools/reference-plugin-json#info) include them as relative links.
- in the README ensure they are absolute URLs.

## Requirements
List any requirements or dependencies they may need to run the plugin.

## Getting Started
Provide a quick start on how to configure and use the plugin.

## Documentation
If your project has dedicated documentation available for users, provide links here. For help in following Grafana's style recommendations for technical documentation, refer to our [Writer's Toolkit](https://grafana.com/docs/writers-toolkit/).

## Contributing
Do you want folks to contribute to the plugin or provide feedback through specific means? If so, tell them how!
-->

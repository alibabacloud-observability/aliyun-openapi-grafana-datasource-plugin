[English](README.md) | 简体中文

![](https://aliyunsdk-pages.alicdn.com/icons/AlibabaCloud.svg)


## Alibaba Cloud OpenApi Plugin for Grafana

# OpenAPI
OpenAPI插件是一个专为Grafana设计的扩展工具，旨在通过可视化来自阿里云 OpenAPI 返回的 JSON 数据来增强 Grafana 仪表板的体验。它与 Grafana 无缝集成，允许您直接从 Grafana 仪表板进行阿里云服务的 API 调用，并可视化 JSON 响应。

## 使用要求
- 版本 9.0.x 或更高。
- 具有适用权限设置的 API 访问阿里云账号和密钥。

## 特点
- 简易集成：在您现有的 Grafana 实例中轻松集成，配置最小化。
- 实时可视化：将来自阿里云 OpenAPI 的 JSON 响应实时转换为交互式图表和图形。
- 可定制仪表板：有效地创建量身定做的视觉表示，以监控和分析您的阿里云资源。
- 用户友好界面：轻松导航和配置插件，为用户带来强大的分析功能。
- 数据驱动的洞察：立即深入了解您的云环境，帮助您进行优化和故障排除的明智决策。

## 快速上手
1. 配置：在数据源管理面板, 添加OpenAPI数据源，在 settings 面板, 设置调用API的阿里云账号的AccessId 和 AccessKeySecret , 最好配置为子账号的AK，调用可能对账号发起线上资源操作，请小心操作，并确保账号具有对应操作的权限。为保证数据安全 , AK保存后清空 , 且不会回显。数据源中提供一些默认产品及参数配置，如果要使用未提供默认配置的产品，请参考对应产品的OpenAPI文档https://next.api.aliyun.com/document
2. 创建仪表板：通过添加OpenAPI插件面板并配置产品Product、API名称action、及查询参数，即可开始构建您的仪表板。
3. 数据可视化：自定义插件解析和显示数据的方式，确保始终能够快速获取相关信息。

## 支持
如果您遇到任何问题或需要帮助，请加入钉钉群34785590。

## License
[Apache-2.0](http://www.apache.org/licenses/LICENSE-2.0)
aliyun-openapi-grafana-datasource-plugin 是由阿里巴巴开发的grafana插件，使用Apache许可证（2.0版） 此产品包含其他开源许可证下的各种第三方组件。 有关详细信息，请参阅通知文件。


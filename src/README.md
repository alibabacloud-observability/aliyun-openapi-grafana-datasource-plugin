# OpenAPI
OpenAPI插件是一个专为Grafana设计的扩展工具，旨在通过可视化来自阿里云 OpenAPI 返回的 JSON 数据来增强 Grafana 仪表板的体验。它与 Grafana 无缝集成，允许您直接从 Grafana 仪表板进行阿里云服务的 API 调用，并可视化 JSON 响应。

## 使用要求
- Grafana 版本 9.0.x 或更高。
- 具有适用权限设置的 API 访问阿里云账号和密钥。

## 特点
- 简易集成：在您现有的 Grafana 实例中轻松集成，配置最小化。
- 实时可视化：将来自阿里云 OpenAPI 的 JSON 响应实时转换为交互式图表和图形。
- 可定制仪表板：有效地创建量身定做的视觉表示，以监控和分析您的阿里云资源。
- 用户友好界面：轻松导航和配置插件，为用户带来强大的分析功能。
- 数据驱动的洞察：立即深入了解您的云环境，帮助您进行优化和故障排除的明智决策。

## 快速上手
1. 配置：在数据源管理面板, 添加 OpenAPI数据源，在 settings 面板, 设置调用API的阿里云账号的AccessId 和 AccessKeySecret , 最好配置为子账号的AK，调用可能对账号发起线上资源操作，请小心操作，并确保账号具有对应操作的权限。为保证数据安全 , AK保存后清空 , 且不会回显。数据源中提供一些默认产品及参数配置，如果要使用未提供默认配置的产品，请参考对应产品的OpenAPI文档https://next.api.aliyun.com/document
2. 创建仪表板：通过添加OpenAPI插件面板并配置产品Product、API名称action、及查询参数，即可开始构建您的仪表板。
3. 数据可视化：自定义插件解析和显示数据的方式，确保始终能够快速获取相关信息。

## 支持
如果您遇到任何问题或需要帮助，请加入钉钉群34785590。

---

# OpenAPI
The OpenAPI plugin is an extension tool designed specifically for Grafana, aimed at enhancing the experience of the Grafana dashboard by visualizing JSON data returned from Alibaba Cloud OpenAPI. It seamlessly integrates with Grafana, allowing you to make API calls to Alibaba Cloud services directly from the Grafana dashboard and visualize JSON responses.

## Requirements
- Grafana version 9.0. x or higher.
- Access Alibaba Cloud accounts and keys through APIs with applicable permission settings.

## Featues
- Easy integration: Easily integrate within your existing Grafana instance with minimal configuration.
- Real time visualization: Convert JSON responses from Alibaba Cloud OpenAPI into interactive charts and graphics in real time.
- Customizable dashboard: Effectively create customized visual representations to monitor and analyze your Alibaba Cloud resources.
- User friendly interface: Easy navigation and plugin configuration, bringing powerful analysis functions to users.
- Data driven insights: Gain an immediate understanding of your cloud environment, helping you make wise decisions for optimization and troubleshooting.

## Getting Started
1. Configuration: In the data source management panel, add an OpenAPI data source. In the settings panel, set the Access Id and Access KeySecret of the Alibaba Cloud account that calls the API. It is best to configure it as the AK of the sub account. Calling may initiate online resource operations on the account. Please be careful and ensure that the account has the corresponding operation permissions. To ensure data security, AK is cleared after saving and will not echo. The data source provides some default products and parameter configurations. If you want to use products that do not provide default configurations, please refer to the corresponding product's OpenAPI documentation https://next.api.aliyun.com/document
2. Create a dashboard: You can start building your dashboard by adding an OpenAPI plugin panel and configuring the product, API name, action, and query parameters.
3. Data visualization: Customize the way plugins parse and display data, ensuring that relevant information can always be quickly obtained.

## Support
If you encounter any problems or need help, please join the DingTalk group 34785590.

## License
[Apache-2.0](http://www.apache.org/licenses/LICENSE-2.0)
aliyun-openapi-grafana-datasource-plugin  is a grafana plugin developed by Alibaba and licensed under the Apache License (Version 2.0)
This product contains various third-party components under other open source licenses.
See the NOTICE file for more information.


English | [简体中文](README-CN.md)
![](https://aliyunsdk-pages.alicdn.com/icons/AlibabaCloud.svg)

## Alibaba Cloud OpenApi Plugin for Grafana
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
1. Configuration: In the data source management panel, add a Pop data source. In the settings panel, set the Access Id and Access KeySecret of the Alibaba Cloud account that calls the API. It is best to configure it as the AK of the sub account. Calling may initiate online resource operations on the account. Please be careful and ensure that the account has the corresponding operation permissions. To ensure data security, AK is cleared after saving and will not echo. The data source provides some default products and parameter configurations. If you want to use products that do not provide default configurations, please refer to the corresponding product's OpenAPI documentation https://next.api.aliyun.com/document
2. Create a dashboard: You can start building your dashboard by adding a POP plugin panel and configuring the product, API name, action, and query parameters.
3. Data visualization: Customize the way plugins parse and display data, ensuring that relevant information can always be quickly obtained.

## Support
If you encounter any problems or need help, please join the DingTalk group 34785590.

## License
[Apache-2.0](http://www.apache.org/licenses/LICENSE-2.0)
aliyun-openapi-grafana-datasource-plugin  is a grafana plugin developed by Alibaba and licensed under the Apache License (Version 2.0)
This product contains various third-party components under other open source licenses.
See the NOTICE file for more information.


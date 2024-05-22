package plugin

import (
	"encoding/json"
	"fmt"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
)

type ProductConfig struct {
	Version  string `json:"version"`
	Protocol string `json:"protocol"`
	Method   string `json:"method"`
	AuthType string `json:"authType"`
	Style    string `json:"style"`
	PathName string `json:"pathName"`
	Endpoint string `json:"endpoint"`
}

type ProductConfigWithProduct struct {
	Product string `json:"product"`
	ProductConfig
}

type APISource struct {
	// Endpoint        string
	Region          string `json:"region"`
	ProductConfigs  map[string]ProductConfig
	ReqBodyType     string `json:"reqBodyType"`
	BodyType        string `json:"bodyType"`
	AccessKeyId     string
	AccessKeySecret string
}

type QueryInfo struct {
	//和前端给的查询页面一致
	//grafana自带的参数
	Datasource map[string]string `json:"datasource"`

	//先跟openapi保持一致
	Action   string                 `json:"action"`
	PathName string                 `json:"pathName"`
	Method   string                 `json:"method"`
	Params   map[string]interface{} `json:"params"`
	Product  string                 `json:"product"`
}

type Result struct {
	refId        string
	dataResponse backend.DataResponse
}

// LoadSettings Read datasource settings
func LoadSettings(ctx backend.PluginContext) (*APISource, error) {
	model := &APISource{}

	settings := ctx.DataSourceInstanceSettings
	tempStruct := struct {
		ProductConfigs []ProductConfigWithProduct `json:"productConfigs"`
	}{}
	err := json.Unmarshal(settings.JSONData, &tempStruct)
	if err != nil {
		return nil, fmt.Errorf("error reading settings: %s", err.Error())
	}

	// 创建map以存储ProductConfig信息
	productConfigsMap := make(map[string]ProductConfig)
	for _, pcwp := range tempStruct.ProductConfigs {
		productConfigsMap[pcwp.Product] = pcwp.ProductConfig
	}
	// model.Endpoint = settings.URL
	model.AccessKeyId = settings.DecryptedSecureJSONData["accessKeyId"]
	model.AccessKeySecret = settings.DecryptedSecureJSONData["accessKeySecret"]
	model.ProductConfigs = productConfigsMap

	return model, nil
}

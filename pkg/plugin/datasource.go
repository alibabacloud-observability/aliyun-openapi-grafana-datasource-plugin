package plugin

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	openapi "github.com/alibabacloud-go/darabonba-openapi/v2/client"
	openapiutil "github.com/alibabacloud-go/openapi-util/service"
	util "github.com/alibabacloud-go/tea-utils/v2/service"
	"github.com/alibabacloud-go/tea/tea"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/instancemgmt"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/data"
	"reflect"
	"regexp"
	"strings"
	"sync"
	"time"
)

// Make sure Datasource implements required interfaces. This is important to do
// since otherwise we will only get a not implemented error response from plugin in
// runtime. In this example datasource instance implements backend.QueryDataHandler,
// backend.CheckHealthHandler interfaces. Plugin should not implement all these
// interfaces - only those which are required for a particular task.
var (
	_ backend.QueryDataHandler      = (*APIDatasource)(nil)
	_ backend.CheckHealthHandler    = (*APIDatasource)(nil)
	_ instancemgmt.InstanceDisposer = (*APIDatasource)(nil)
)

// APIDatasource SampleDatasource is an example datasource which can respond to data queries, reports
// its health and has streaming skills.
// Datasource is an example datasource which can respond to data queries, reports
// its health and has streaming skills.
type APIDatasource struct {
	backend.DataSourceInstanceSettings
}

// NewAPIDatasource creates a new datasource instance.
func NewAPIDatasource(_ backend.DataSourceInstanceSettings) (instancemgmt.Instance, error) {
	return &APIDatasource{}, nil
}

// Dispose here tells plugin SDK that plugin wants to clean up resources when a new instance
// created. As soon as datasource settings change detected by SDK old datasource instance will
// be disposed and a new one will be created using NewSampleDatasource factory function.
func (apiDatasource *APIDatasource) Dispose() {
	// Clean up datasource instance resources.
}

// CreateApiInfo Create API params by query params and datasource setting
func CreateApiInfo(info *QueryInfo, setting *APISource) (_result *openapi.Params) {
	product := info.Product
	productConfig := setting.ProductConfigs[product]
	params := &openapi.Params{
		Version:     tea.String(productConfig.Version),
		Style:       tea.String(productConfig.Style),
		Pathname:    tea.String(info.PathName),
		Method:      tea.String(info.Method),
		Action:      tea.String(info.Action),
		Protocol:    tea.String("HTTPS"),
		AuthType:    tea.String("AK"),
		ReqBodyType: tea.String("json"),
		BodyType:    tea.String("json"),
	}
	_result = params
	return _result
}

// QueryData handles multiple queries and returns multiple responses.
// req contains the queries []DataQuery (where each query contains RefID as a unique identifier).
// The QueryDataResponse contains a map of RefID to the response for each query, and each response
// contains Frames ([]*Frame).
func (apiDatasource *APIDatasource) QueryData(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
	// create response struct
	response := backend.NewQueryDataResponse()
	//并发执行query
	queries := req.Queries
	ch := make(chan Result, len(queries))

	setting, err := LoadSettings(req.PluginContext)
	if err != nil {
		return nil, err
	}

	//函数返回的时候关闭ch
	defer func() {
		close(ch)
		if r := recover(); r != nil {
			var err error
			switch r.(type) {
			case string:
				err = errors.New(r.(string))
			case error:
				err = r.(error)
			}
			log.DefaultLogger.Error("QueryData recover", "error", err)
		}
	}()

	wg := sync.WaitGroup{}

	for _, query := range queries {
		wg.Add(1)
		go apiDatasource.QueryAPI(ch, query, setting)
	}
	go func(chan Result) {
		for res := range ch {
			response.Responses[res.refId] = res.dataResponse
			wg.Done()
		}
	}(ch)
	wg.Wait()
	return response, nil
}

type Cache struct {
	data sync.Map
}

// Set 将给定的键值对存储到缓存中，并根据指定的持续时间设置过期机制。
func (cache *Cache) Set(key *openapi.Config, value interface{}, duration time.Duration) {
	cache.data.Store(key, value)

	if duration > 0 {
		time.AfterFunc(duration, func() {
			cache.data.Delete(key)
		})
	}
}

// Get 从缓存中获取给定配置键对应的 openapi 客户端。
// 如果缓存中存在该键，则直接返回对应的客户端实例；
// 如果缓存中不存在，则创建一个新的客户端实例，并加入缓存。
func (cache *Cache) Get(key *openapi.Config) (*openapi.Client, error) {
	value, ok := cache.data.Load(key)
	if ok {
		log.DefaultLogger.Debug("Get Cached Client!yeah!")
		return value.(*openapi.Client), nil
	}

	client, err := openapi.NewClient(key)
	if err != nil {
		return nil, err
	}
	cache.Set(key, client, 5*time.Minute)
	return client, nil
}

var GlobalCache = &Cache{}

func (apiDatasource *APIDatasource) BuildClient(setting *APISource, param map[string]interface{}, product string) (*openapi.Client, error) {
	regex := regexp.MustCompile(`\[([^\]]+)\]`)
	endpoint := setting.ProductConfigs[product].Endpoint
	flag := regex.MatchString(endpoint)
	if flag {
		log.DefaultLogger.Debug("通配符模式")
	} else {
		log.DefaultLogger.Debug("字符串中不包含方括号")
	}
	config := &openapi.Config{}
	client := &openapi.Client{}
	if !flag {
		config = &openapi.Config{
			Endpoint:        &endpoint,
			AccessKeyId:     &setting.AccessKeyId,
			AccessKeySecret: &setting.AccessKeySecret,
		}
	} else {
		keys := []string{"RegionId", "Region"}
		region1, exists := GetValueIgnoreCase(param, keys)
		region, _ := region1.(string)
		var endpoint string
		if exists {
			endpoint = regex.ReplaceAllString(setting.ProductConfigs[product].Endpoint, region)
		} else {
			endpoint = regex.ReplaceAllString(setting.ProductConfigs[product].Endpoint, "cn-hangzhou")
		}
		config = &openapi.Config{
			Endpoint:        &endpoint,
			AccessKeyId:     &setting.AccessKeyId,
			AccessKeySecret: &setting.AccessKeySecret,
		}
	}
	client, err := GlobalCache.Get(config)
	return client, err
}

// 多层参数处理，eg array map
func mapToQueryParams(data map[string]interface{}, prefix string, queries map[string]string, time backend.TimeRange) {
	for key, value := range data {
		newPrefix := key
		if prefix != "" {
			newPrefix = prefix + "." + key
		}
		processValue(value, newPrefix, queries, time)
	}
}

func processValue(value interface{}, prefix string, queries map[string]string, time backend.TimeRange) {
	// log.DefaultLogger.Debug("processValue", "value", value, "prefix", prefix, "queries", queries)
	rValue := reflect.ValueOf(value)
	switch rValue.Kind() {
	case reflect.Map:
		// 如果是map，则递归处理
		for _, key := range rValue.MapKeys() {
			newPrefix := fmt.Sprintf("%s.%v", prefix, key.String())
			processValue(rValue.MapIndex(key).Interface(), newPrefix, queries, time)
		}
	case reflect.Slice, reflect.Array:
		// 如果是切片或数组，则遍历元素
		for i := 0; i < rValue.Len(); i++ {
			newPrefix := fmt.Sprintf("%s.%d", prefix, i+1)
			processValue(rValue.Index(i).Interface(), newPrefix, queries, time)
		}
	default:
		// 其他类型，直接将值转换为字符串
		formatStr := fmt.Sprintf("%v", value)
		if strings.Contains(formatStr, "${__time_from") || strings.Contains(formatStr, "${__time_to") {
			formatStrTime, err := FormatDateTimeForQuery(formatStr, time)
			if err != nil {
				log.DefaultLogger.Error("Time format error", err)
				break
			}
			formatStr = formatStrTime
		}
		queries[prefix] = formatStr
		log.DefaultLogger.Debug("processValue", "prefix", prefix, "value", formatStr)
	}
}

func (apiDatasource *APIDatasource) QueryAPI(ch chan Result, query backend.DataQuery, setting *APISource) {
	// 解析参数
	response := backend.DataResponse{}
	refId := query.RefID
	queryInfo := &QueryInfo{}

	defer func() {
		queryInfo = nil
		if r := recover(); r != nil {
			switch r.(type) {
			case string:
				response.Error = errors.New(r.(string))
			case error:
				response.Error = r.(error)
			}
			log.DefaultLogger.Error("QueryLogs recover", "refId", refId, "error", response.Error)
			ch <- Result{
				refId:        refId,
				dataResponse: response,
			}
		}
	}()

	// 前端的query解析为查询的参数
	err := json.Unmarshal([]byte(query.JSON), &queryInfo)
	if err != nil {
		log.DefaultLogger.Error("Unmarshal queryInfo", "refId", refId, "error", err)
		response.Error = err
		ch <- Result{
			refId:        refId,
			dataResponse: response,
		}
		return
	}

	if !strings.HasSuffix(setting.ProductConfigs[queryInfo.Product].Endpoint, "aliyuncs.com") {
		err = errors.New("endpoint is not end with aliyuncs.com, Illegal Endpoint")
		log.DefaultLogger.Info("Endpoint is not end with aliyuncs.com, Illegal Endpoint")
		ch <- Result{
			refId:        refId,
			dataResponse: response,
		}
		return
	}

	//创建client
	client, err := apiDatasource.BuildClient(setting, queryInfo.Params, queryInfo.Product)
	if err != nil {
		log.DefaultLogger.Info("Create Client Failed", err)
	}

	//创建查询参数
	params := CreateApiInfo(queryInfo, setting)

	queries := make(map[string]string)
	mapToQueryParams(queryInfo.Params, "", queries, query.TimeRange)

	log.DefaultLogger.Info("query params,", queries)
	log.DefaultLogger.Info("API params,", params)
	// runtime options
	runtime := &util.RuntimeOptions{}
	request := &openapi.OpenApiRequest{
		Query: openapiutil.Query(queries),
	}
	//返回值为 Map 类型，可从 Map 中获得三类数据：响应体 body、响应头 headers、HTTP 返回的状态码 statusCode。
	APIResponse, err := client.CallApi(params, request, runtime)
	if err != nil {
		log.DefaultLogger.Error("GetLogs ", "query : ", queryInfo.Params, "error ", err)
		response.Error = err
		ch <- Result{
			refId:        refId,
			dataResponse: response,
		}
		return
	}

	// apidatas是byte[],需要转换成能解析的格式
	APIdatas, _ := json.Marshal(APIResponse["body"])

	jsonData := json.RawMessage(APIdatas)
	messages := []json.RawMessage{jsonData}

	frames := make(data.Frames, 0)
	frames = append(frames, data.NewFrame("response", data.NewField("value", nil, messages)))
	response.Frames = frames

	ch <- Result{
		refId:        refId,
		dataResponse: response,
	}
	return
}

// CheckHealth handles health checks sent from Grafana to the plugin.
// The main use case for these health checks is the test button on the
// datasource configuration page which allows users to verify that
// a datasource is working as expected.
func (apiDatasource *APIDatasource) CheckHealth(_ context.Context, req *backend.CheckHealthRequest) (*backend.CheckHealthResult, error) {
	var status = backend.HealthStatusOk
	var message = "Data source is working"

	setting, _ := LoadSettings(req.PluginContext)
	for product, config := range setting.ProductConfigs {
		if !strings.HasSuffix(config.Endpoint, "aliyuncs.com") {
			message = product + " endpoint is not end with aliyuncs.com, Illegal Endpoint"
			status = backend.HealthStatusError
			break
		}
	}

	return &backend.CheckHealthResult{
		Status:  status,
		Message: message,
	}, nil
}

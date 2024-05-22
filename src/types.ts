import { DataQuery, DataSourceJsonData, FieldType } from '@grafana/data';
// 定义query和create时可输入的数据

export type Pair<T, K> = [T, K];

export type QueryLanguage = 'jsonpath' | 'jsonata';
export interface OpenAPIField {
  name?: string;
  jsonPath: string;
  type?: FieldType;
  language?: QueryLanguage;
}

export interface OpenAPIQuery extends DataQuery {
  product?: string;
  pathName?: string; //可选属性
  method?: string;
  action: string; //必须属性
  params: {
    [key: string]: string;
  };
  fields: OpenAPIField[];
}

//默认值
export const DEFAULT_QUERY: Partial<OpenAPIQuery> = {
  product: '',
  pathName: '/',
  method: 'POST',
  action: '',
  fields: [{ jsonPath: '' }],
  params: {},
};

export interface ProductConfigItem {
  product?: string;
  endpoint?: string;
  version?: string;
  protocol?: string;
  method?: string;
  authType?: string;
  style?: string;
}
export type ProductConfigItemKey = 'product' | 'endpoint' | 'version' | 'protocol' | 'method' | 'authType' | 'style';
/**
 * These are options configured for each DataSource instance
 */
//创建数据源要填的非保密数据
export interface OpenAPIDataSourceOptions extends DataSourceJsonData {
  // endpoint?: string;
  // product?: string;
  // region?: string;
  // version?: string;
  // protocol?: string;
  // method?: string;
  // authType?: string;
  // style?: string;
  productConfigs: ProductConfigItem[];
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
//创建数据源要填的保密数据
export interface OpenAPISecureJsonData {
  accessKeyId: string;
  accessKeySecret: string;
}


export interface OpenApiVariableQuery {
  namespace: string;
  query: string;
}

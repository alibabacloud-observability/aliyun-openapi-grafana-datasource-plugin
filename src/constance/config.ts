interface Option{
  label: string; // 展示的名称
  value: string; // 实际的取值
}
export const ProductOptions: Option[] = [
  {
    label: 'ECS',
    value: 'ecs',
  },
  {
    label: 'ARMS',
    value: 'arms',
  },
  {
    label: '容器服务',
    value: 'cs',
  },
]

export const RegionOptions: Option[] = [
  {
    label: '杭州',
    value: 'cn-hangzhou',
  },
  {
    label: '张家口',
    value: 'cn-zhangjiakou'
  },
  {
    label: '上海',
    value: 'cn-shanghai'
  }
]

export interface ProductInfo{
  version: string;
  protocol: string;
  // method: string;
  // authType: string;
  style: string;
  pathName: string;
  reqBodyType: string;
  bodyType: string;
  endpoint: string;
}
export type IProductConfig = {
  [key: string]: ProductInfo;
}; 

export const ProductConfig: IProductConfig = {
  "ecs": {
    "version": "2014-05-26",
    "endpoint": "ecs.[regionId].aliyuncs.com",
    "style": "RPC",
    "protocol": "HTTPS",
    "pathName": "/",
    "reqBodyType": "json",
    "bodyType": "json"
  },
  "arms": {
    "version": "2019-08-08",
    "endpoint": "arms.[regionId].aliyuncs.com",
    "style": "V3",
    "protocol": "HTTPS",
    "pathName": "/",
    "reqBodyType": "json",
    "bodyType": "json"
  },
  "rds":{
    "version": "2014-08-15",
    "endpoint": "rds.aliyuncs.com",
    "style": "RPC",
    "protocol": "HTTPS",
    "pathName": "/",
    "reqBodyType": "json",
    "bodyType": "json"
  },
  "slb": {
    "version": "2014-05-15",
    "endpoint": "slb.[regionId].aliyuncs.com",
    "style": "RPC",
    "protocol": "HTTPS",
    "pathName": "/",
    "reqBodyType": "json",
    "bodyType": "json"
  },
  "cs": {
    "version": "2015-12-15",
    "endpoint": "cs.[regionId].aliyuncs.com",
    "style": "ROA",
    "protocol": "HTTPS",
    "pathName": "/api/v1/clusters",
    "reqBodyType": "json",
    "bodyType": "json"
  },
  "vpc":{
    "version": "2016-04-28",
    "endpoint": "vpc.[regionId].aliyuncs.com",
    "style": "RPC",
    "protocol": "HTTPS",
    "pathName": "/",
    "reqBodyType": "json",
    "bodyType": "json"
  },
  "cms": {
    "version": "2019-01-01",
    "endpoint": "metrics.[regionId].aliyuncs.com",
    "style": "RPC",
    "protocol": "HTTPS",
    "pathName": "/",
    "reqBodyType": "json",
    "bodyType": "json"
  },
  "schedulerx": {
    "version": "2019-04-30",
        "endpoint": "schedulerx.aliyuncs.com",
        "style": "RPC",
        "protocol": "HTTPS",
        "pathName": "/",
        "reqBodyType": "json",
        "bodyType": "json"
  }
}

import { DataSourceInstanceSettings, CoreApp, DataQueryRequest,  getDataSourceRef, 
  // dataFrameToJSON, parseLiveChannelAddress
 } from '@grafana/data';
import { DataSourceWithBackend, GrafanaBootConfig, getBackendSrv, getDataSourceSrv, getGrafanaLiveSrv, getTemplateSrv, toDataQueryResponse } from '@grafana/runtime';

import { OpenAPIQuery, OpenAPIDataSourceOptions, DEFAULT_QUERY } from './types';
import {
  of,
  //  merge 
  } from 'rxjs';
import * as operators from 'rxjs/operators';
import _ from 'lodash';
import { DataSourceRef } from '@grafana/schema';

const ExpressionDatasourceRef = Object.freeze({
  type: "__expr__",
  uid: "__expr__",
  name: "Expression"
});
function isExpressionReference(ref: DataSourceRef | null | undefined) {
  if (!ref) {
    return false;
  }
  const v = typeof ref === "string" ? ref : ref.type;
  return v === ExpressionDatasourceRef.type || v === ExpressionDatasourceRef.name || v === "-100";
}


const __defProp$2 = Object.defineProperty;
const __defProps$1 = Object.defineProperties;
const __getOwnPropDescs$1 = Object.getOwnPropertyDescriptors;
// const __getOwnPropSymbols$2 = Object.getOwnPropertySymbols;
const __hasOwnProp$2 = Object.prototype.hasOwnProperty;
// const __propIsEnum$2 = Object.prototype.propertyIsEnumerable;
const __defNormalProp$2 = (obj: any, key: any, value: any) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
const __spreadValues$2 = (a: any, b: any) => {
  for (const prop in b || (b = {})){
    if (__hasOwnProp$2.call(b, prop)){
      __defNormalProp$2(a, prop, b[prop]);
    }
  }
  return a;
};

function getValueByAttrV2(data: any, attr: string) {
  // 使用正则表达式来匹配路径中的数组和通配符
  const pathRegex = /(\w+|\*)+(\[\*\])?/g;
  
  // 将路径分解成段，包括处理数组索引
  const paths: any[] = [];
  let match;
  while ((match = pathRegex.exec(attr)) !== null) {
    if (match[2] === '[*]') {
      paths.push(match[1]);
      paths.push('*');
    } else {
      paths.push(match[1]);
    }
  }

  function traverse(currentData: any, currentPathIndex: number): any {
    if (currentPathIndex === paths.length) {
      return currentData;
    }

    const currentPath = paths[currentPathIndex];
    if (currentPath === '*') {
      if (Array.isArray(currentData)) {
        return currentData.map((item: any) => traverse(item, currentPathIndex + 1));
      } else {
        return _.flatMapDeep(_.values(currentData), (value: any) =>
          traverse(value, currentPathIndex + 1)
        );
      }
    } else {
      const nextData = _.get(currentData, currentPath, "");
      return traverse(nextData, currentPathIndex + 1);
    }
  }

  return traverse(data, 0);
}


const bootData = (window as any).grafanaBootData || {
  settings: {},
  user: {},
  navTree: []
};
const options = bootData.settings;
options.bootData = bootData;
const config = new GrafanaBootConfig(options);

const __spreadProps$1 = (a: any, b: any) => __defProps$1(a, __getOwnPropDescs$1(b));

export class OpenAPIDataSource extends DataSourceWithBackend<OpenAPIQuery, OpenAPIDataSourceOptions> {
  private __data: any = {};
  constructor(instanceSettings: DataSourceInstanceSettings<OpenAPIDataSourceOptions>) {
    super(instanceSettings);
  }

  getDefaultQuery(_: CoreApp): Partial<OpenAPIQuery> {
    return DEFAULT_QUERY;
  }

  query(request: DataQueryRequest<OpenAPIQuery>): any {
  
    const { intervalMs, maxDataPoints, queryCachingTTL, range, requestId, hideFromInspector = false } = request;
    let targets = request.targets;

    targets.forEach(target => {
      Object.keys(target.params).forEach(key => {
        target.params[key] = getTemplateSrv().replace(target.params[key]);
      })
    })
    // if (this.filterQuery) {
    //   targets = targets.filter((q) => this.filterQuery(q));
    // }
    let hasExpr = false;
    const pluginIDs = /* @__PURE__ */ new Set();
    const dsUIDs = /* @__PURE__ */ new Set();
    const queries = targets.map((q) => {
      let _a, _b, _c;
      let datasource = this.getRef();
      let datasourceId = this.id;
      let shouldApplyTemplateconstiables = true;
      if (isExpressionReference(q.datasource)) {
        hasExpr = true;
        return __spreadProps$1(__spreadValues$2({}, q), {
          datasource: ExpressionDatasourceRef
        });
      }
      if (q.datasource) {
        // const ds = getDataSourceSrv().getInstanceSettings(q.datasource, request.scopedconsts);
        const ds = getDataSourceSrv().getInstanceSettings(q.datasource);
        if (!ds) {
          throw new Error(`Unknown Datasource: ${JSON.stringify(q.datasource)}`);
        }
        const dsRef = (_a = ds.rawRef) != null ? _a : getDataSourceRef(ds);
        const dsId = ds.id;
        if (dsRef.uid !== datasource.uid || datasourceId !== dsId) {
          datasource = dsRef;
          datasourceId = dsId;
          shouldApplyTemplateconstiables = false;
        }
      }
      if ((_b = datasource.type) == null ? void 0 : _b.length) {
        pluginIDs.add(datasource.type);
      }
      if ((_c = datasource.uid) == null ? void 0 : _c.length) {
        dsUIDs.add(datasource.uid);
      }
      return __spreadProps$1(__spreadValues$2({}, shouldApplyTemplateconstiables ? this.applyTemplateVariables(q, 
        // request.scopedconsts
        ) : q), {
        datasource,
        datasourceId,
        // deprecated!
        intervalMs,
        maxDataPoints,
        queryCachingTTL
      });
    });
    if (!queries.length) {
      return of({ data: [] });
    }
    const body: any = { queries };
    if (range) {
      body.range = range;
      body.from = range.from.valueOf().toString();
      body.to = range.to.valueOf().toString();
    }
    if (config.featureToggles.queryOverLive) {
      return getGrafanaLiveSrv().getQueryData({
        request,
        body
      }) as any;
    }
    const headers: any = {};
    headers["X-Plugin-Id" /* PluginID */] = Array.from(pluginIDs).join(", ");
    headers["X-Datasource-Uid" /* DatasourceUID */] = Array.from(dsUIDs).join(", ");
    let url = "/api/ds/query?ds_type=" + this.type;
    if (hasExpr) {
      headers["X-Grafana-From-Expr" /* FromExpression */] = "true";
      url += "&expression=true";
    }
    if (requestId) {
      url += `&requestId=${requestId}`;
    }
    if (request.dashboardUID) {
      headers["X-Dashboard-Uid" /* DashboardUID */] = request.dashboardUID;
    }
    if (request.panelId) {
      headers["X-Panel-Id" /* PanelID */] = `${request.panelId}`;
    }
    if (request.queryGroupId) {
      headers["X-Query-Group-Id" /* QueryGroupID */] = `${request.queryGroupId}`;
    }
    return getBackendSrv().fetch({
      url,
      method: "POST",
      data: body,
      requestId,
      hideFromInspector,
      headers
    }).pipe(
      // @ts-ignore
      operators.switchMap(((raw: any) => {
        const dataArr: any = this.getDataArr(raw.data.results, request.targets);
        this.setPrivateData(dataArr);
        const rsp: any = {
          data: dataArr,
          state: 'Done'
        };
        return of(rsp as any);
      })),
      operators.catchError((err) => {
        return of(toDataQueryResponse(err) as any);
      })
    );
  }

  applyTemplateVariables(query: any, scopedVars?: any) {
    return query;
  }

  getFieldsByRef(targets: any[], key: any) {
    for(let target of targets) {
      if (target.refId === key) {
        return target.fields.filter((item: any) => item.jsonPath.startsWith("$."));
      }
    }
    return [];
  }

  getDataArr(data: any, targets: any[]): any[] {
    const arr: any[] = [];
    for(const key of Object.keys(data)) {
      const originData = data[key].frames[0].data.values[0][0];
      const fields = this.getFieldsByRef(targets, key);
      if (fields.length === 0) {
        arr.push({
          name: key,
          refId: key,
          fields: [{
            values: [originData]
          }],
        })
      } else {
        const newFileds: any[] = [];
        for(let i = 0; i < fields.length; i++) {
          const attr = fields[i].jsonPath.replace("$.", "");
          const value = getValueByAttrV2(originData, attr);
          newFileds.push({
            name: fields[i]?.name || `${i}`,
            type: fields[i]?.type || "string",
            values: (Array.isArray(value) ? value : [value]).map(item => {
              if (item.toString() === '[object Object]') {
                return JSON.stringify(item);
              } else {
                return item
              }
            }),
          });
        }
        const filedObj = {
          name: key,
          refId: key,
          fields: [...newFileds],
        }
        arr.push(filedObj);
      }
    }
    return arr;
  }

  getPrivateData(){
    return this.__data;
  }

  setPrivateData(data: any){
    this.__data = data;
  }



  // async metricFindQuery(query: IVariableQuery, options?: any) {
  //   // Retrieve DataQueryResponse based on query.
  //   const response = await this.fetchMetricNames(query.namespace, query.rawQuery);
  
  //   // Convert query results to a MetricFindValue[]
  //   const values = response.data.map(frame => ({ text: frame.name }));
  
  //   return values;
  // }

}

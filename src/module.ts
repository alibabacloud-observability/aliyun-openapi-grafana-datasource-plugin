import { DataSourcePlugin } from '@grafana/data';
import { OpenAPIDataSource } from './datasource';
import { OpenAPIConfigEditor } from './components/ConfigEditor';
import { OpenAPIQueryEditor } from './components/QueryEditor';
import { OpenAPIQuery, OpenAPIDataSourceOptions } from './types';

export const plugin = new DataSourcePlugin<OpenAPIDataSource, OpenAPIQuery, OpenAPIDataSourceOptions>(OpenAPIDataSource)
  .setConfigEditor(OpenAPIConfigEditor)
  .setQueryEditor(OpenAPIQueryEditor);

import { QueryEditorProps } from '@grafana/data';
import React from 'react';
import { OpenAPIDataSourceOptions, OpenAPIQuery } from '../types';
import { FieldEditor } from './FieldEditor';
import { TabbedQueryEditor } from './TabbedQueryEditor';
// import { OpenAPIDataSource } from 'datasource';
import { Alert } from 'antd';


interface Props extends QueryEditorProps<any, OpenAPIQuery, OpenAPIDataSourceOptions>{
  editorContext?: string;
}

export  const  OpenAPIQueryEditor: React.FC<Props> = (props) => {
  const { query, editorContext, onChange, onRunQuery } = props;

  return (<>
    <Alert message="本次调用可能对数据源账号发起线上资源操作，请小心操作，谨防误删资源" type="warning" showIcon closable />
    <TabbedQueryEditor
      {...props}
      editorContext={editorContext || 'default'}
      fieldsTab={
        <FieldEditor
          value={query.fields}
          onChange={(value) => {
            onChange({ ...query, fields: value });
            onRunQuery();
          } }
          limit={10} 
          onComplete={() => props.datasource.getPrivateData()}
        />
      }
    />
    </>
  );
};


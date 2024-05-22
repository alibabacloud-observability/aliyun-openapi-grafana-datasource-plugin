import { TimeRange } from '@grafana/data';
import { InlineField, InlineFieldRow, RadioButtonGroup } from '@grafana/ui';
import { OpenAPIDataSource } from 'datasource';
// import { css } from '@emotion/css';
import defaults from 'lodash/defaults';
import React, { useState } from 'react';
// import AutoSizer from 'react-virtualized-auto-sizer';
import { DEFAULT_QUERY, OpenAPIQuery } from '../types';
import { KeyValueEditor } from './KeyValueEditor';
import { ActionEditor } from './ActionEditor';
// import { PathEditor } from './PathEditor';

// Display a warning message when user adds any of the following headers.
// const sensitiveHeaders = ['authorization', 'proxy-authorization', 'x-api-key'];

interface Props {
  onChange: (query: OpenAPIQuery) => void;
  onRunQuery: () => void;
  editorContext: string;
  query: OpenAPIQuery;
  limitFields?: number;
  datasource: OpenAPIDataSource;
  range?: TimeRange;

  fieldsTab: React.ReactNode;
  experimentalTab?: React.ReactNode;
}

export const TabbedQueryEditor = (props: Props) => {
  const { 
    query, onChange, onRunQuery, fieldsTab, 
  } = props;
  const [tabIndex, setTabIndex] = useState(0);

  const q = defaults(query, DEFAULT_QUERY as any);

  const onProductChange = (product: string) => {
    onChange({ ...q, product });
    onRunQuery();
  };

  const onParamsChange = (params: any) => {
    onChange({ ...q, params });
    onRunQuery();
  };

  const onActionChange = (action: string) => {
    onChange({...q, action})
    onRunQuery();
  }

  const onPathNameChange = (pathName: string) => {
    onChange({...q, pathName})
    onRunQuery();
  }

  const onMethodChange = (method: string) => {
    onChange({...q, method})
    onRunQuery();
  }

  const tabs = [
    {
      title: 'Action',
      content: (
        <ActionEditor 
          product={q.product ?? ''}
          onProductChange={onProductChange}
          action={q.action ?? ''}
          onActionChange={onActionChange}
          pathName={q.pathName ?? ''}
          onPathNameChange={onPathNameChange}
          method={q.method ?? 'POST'}
          onMethodChange={onMethodChange}
        />
      ),
    },
    {
      title: 'Params',
      content: (
        <KeyValueEditor
          addRowLabel={'Add param'}
          columns={['Key', 'Value']}
          values={q.params ?? {}}
          onChange={onParamsChange}
          onBlur={() => onRunQuery()}
        />
      ),
    },
    {
      title: 'Fields',
      content: fieldsTab,
    },
  ];

  return (
    <>
      <InlineFieldRow>
        <InlineField>
          <RadioButtonGroup
            onChange={(e) => setTabIndex(e ?? 0)}
            value={tabIndex}
            options={tabs.map((tab, idx) => ({ label: tab.title, value: idx }))}
          />
        </InlineField>
      </InlineFieldRow>
      {tabs[tabIndex].content}
    </>
  );
};

export const formatCacheTimeLabel = (s: number) => {
  if (s < 60) {
    return s + 's';
  } else if (s < 3600) {
    return s / 60 + 'm';
  }

  return s / 3600 + 'h';
};

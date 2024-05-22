import { BracesPlugin, QueryField, SlatePrism, TypeaheadInput } from '@grafana/ui';
import React from 'react';

interface Props {
  query: string;
  onBlur: () => void;
  onChange: (v: string) => void;
  onData: () => Promise<any>;
}

/**
 * JsonPathQueryField is an editor for JSON Path.
 */
export const JsonPathQueryField: React.FC<Props> = (props) => {

  const { query, onBlur, onChange, onData } = props;
  /**
   * The QueryField supports Slate plugins, so let's add a few useful ones.
   */
  const plugins = [
    BracesPlugin(),
    SlatePrism({
      onlyIn: (node: any) => node.type === 'code_block',
      getSyntax: () => 'js',
    }),
  ];

  // This is important if you don't want punctuation to interfere with your suggestions.
  const cleanText = (s: string) => s.replace(/[{}[\]="(),!~+\-*/^%\|\$@\.]/g, '').trim();

  const onTypeahead = (input: TypeaheadInput) => {
    let  value: any = onData();
    if (value && Array.isArray(value) && value?.length > 0 && value[0].fields[0].values) {
      try {
        value = JSON.parse(value[0].fields[0].values);
      } catch (e){
        console.warn('json parse error', e);
        value = {}
      }
    } else {
      value = {};
    }
    // onSuggest(input, onData);
    return {
      suggestions: [
        {
          label: 'Elements', // Name of the suggestion group
          items: Object.entries(value).map(([key, value]) => {
            return Array.isArray(value)
              ? {
                  label: key, // Text to display in the suggestion list
                  insertText: key + '[]', // When selecting an array, we automatically insert the brackets ...
                  move: -1, // ... and put the cursor between them
                  documentation: `_array (${value.length})_`, // Markdown documentation for the suggestion
                }
              : {
                  label: key,
                  documentation: `_${typeof value}_\n\n**Preview:**\n\n\`${value}\``,
                };
          }),
        },
      ],
    }
  };

  return (
    <QueryField
      additionalPlugins={plugins}
      query={query}
      cleanText={cleanText}
      onTypeahead={onTypeahead as any}
      onRunQuery={onBlur}
      onChange={onChange}
      portalOrigin="jsonapi"
      placeholder="$.items[*].name"
    />
  );
};

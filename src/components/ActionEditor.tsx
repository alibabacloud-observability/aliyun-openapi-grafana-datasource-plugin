import { InlineField, InlineFieldRow, Input } from "@grafana/ui";
import React from "react";

interface AciontEditorProps {
  product: string;
  onProductChange: (product: string) => void;
  action: string;
  onActionChange: (action: string) => void;
  pathName: string;
  onPathNameChange: (pathName: string) => void;
  method: string;
  onMethodChange: (method: string) => void;
}
export const ActionEditor = ({
  product, onProductChange,
  action, onActionChange,
  pathName, onPathNameChange,
  method, onMethodChange,
}: AciontEditorProps) => {
  return (<>
    <InlineFieldRow>
      <InlineField label="product" labelWidth={15}>
        <Input onChange={(e: any) => onProductChange(e.target.value)} placeholder="ecs" value={product || ''} />
      </InlineField>
      <InlineField label="action" labelWidth={15}>
        <Input onChange={(e: any) => onActionChange(e.target.value)} placeholder="DescribeInstances" value={action || ''} />
      </InlineField>
      <InlineField label="pathName" labelWidth={15}>
        <Input onChange={(e: any) => onPathNameChange(e.target.value)} placeholder="/" value={pathName || ''} />
      </InlineField>
      <InlineField label="method" labelWidth={15}>
        <Input onChange={(e: any) => onMethodChange(e.target.value)} placeholder="POST" value={method || ''} />
      </InlineField>
    </InlineFieldRow>
  </>)
}

import { SelectableValue } from '@grafana/data';
import { InlineField, InlineFieldRow, Select, Input } from '@grafana/ui';
import React, { ChangeEvent, memo, useState } from 'react';
import { ProductConfig } from 'constance/config';
import { ProductConfigItem, ProductConfigItemKey } from 'types';
import { message } from 'antd';

interface ProductConfigItemProps {
  product: ProductConfigItem;
  index: number;
  remove: () => void;
  addProduct: () => void;
  saveProductItem: (idx: number, product: ProductConfigItem) => void;
}

const ProductConfigItemEditor = ({
  product,
  index,
  remove,
  addProduct,
  saveProductItem
}: ProductConfigItemProps) => {
  const [productName, setProductName] = useState(product.product);
  const [endpoint, setEndpoint] = useState(product.endpoint);
  const [version, setVersion] = useState(product.version);
  const [style, setStyle] = useState(product.style);
  const [showAllConfig, setShowAllConfig] = useState(false);

  const onProductChange = (option: SelectableValue<string>) => {
    const product = option.value;
    if (product) {
      const otherInfo = ProductConfig[product];
      if (otherInfo) {
        const productConfig = {
          product: product,
          ...otherInfo
        };
        saveProductItem(index, productConfig);
      } else {
        setProductName(product);
        setEndpoint('');
        setVersion('');
        setStyle('');
        setShowAllConfig(true);
      }
    }
  }

  const onInputChange = (event: ChangeEvent<HTMLInputElement>, name: ProductConfigItemKey) => {
    switch(name){
      case 'version':
        setVersion(event.target.value);
        break;
      case 'endpoint':
        setEndpoint(event.target.value);
        break;
      case 'style':
        setStyle(event.target.value);
        break;
      default:
        break;
    }
  }

  const onKeyDown = (event: any) => {
    if (event.keyCode === 13) {
      // 按下回车
      validateProductConfig();
    }
  };

  const validateProductConfig = () => {
    if (!Boolean(productName) || !Boolean(endpoint) || !Boolean(version) 
    || !Boolean(style)) {
      message.warning('product 配置信息未填写完整');
      return null;
    }
    const productConfig = {
      product: productName,
      version: version,
      endpoint: endpoint,
      style: style,
      protocol: 'HTTPS',
    };
    saveProductItem(index, productConfig);
    return null;
  };

  const ProductsOptions = Array.from(Object.keys(ProductConfig)).map(item => ({
    label: item, value: item
  }));
  if (!ProductsOptions.find(item => item.value === productName) && productName) {
    ProductsOptions.push({
      label: productName, value: productName
    } as any);
  }

  return (
    <div>
      <InlineFieldRow>
        <div className='gf-form-label' style={{ width: '32px', padding: '0 8px 0 12px', cursor: 'pointer'}} onClick={addProduct}>+</div>
        <div className='gf-form-label' style={{ width: '32px', padding: '0 8px 0 12px', cursor: 'pointer'}} onClick={remove}>-</div>
        <InlineField label="Product" labelWidth={8}>
          <Select
            width={33}
            allowCustomValue={true}
            options={ProductsOptions}
            onChange={e => onProductChange(e)}
            value={productName}
            placeholder="please select or input product"
          />
        </InlineField>
        <InlineField label="Endpoint" labelWidth={8}>
          <Input
            width={33}
            placeholder='please enter endpoint'
            value={endpoint}
            onChange={(e: any) => onInputChange(e, 'endpoint')}
            onKeyDown={onKeyDown as any}
          />
        </InlineField>
        <InlineField label="show all config" labelWidth={15}>
          <input
            type="checkbox"
            checked={showAllConfig}
            style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)' }}
            onChange={(e) => setShowAllConfig(e.target.checked)}
          />
        </InlineField>
      </InlineFieldRow>
      {showAllConfig && <>
        <div className="gf-form" style={{marginLeft: '72px'}}>
          <InlineField labelWidth={8} label="Version">
            <Input
              width={33}
              placeholder='please enter version'
              value={version}
              onChange={(e: any) => onInputChange(e, 'version')}
              onBlur={validateProductConfig}
              onKeyDown={onKeyDown as any}
            />
          </InlineField>
          <InlineField labelWidth={8} label="Style">
            <Input
              width={33}
              placeholder='please enter style'
              value={style}
              onChange={(e: any) => onInputChange(e, 'style')}
              onBlur={validateProductConfig}
              onKeyDown={onKeyDown as any}
            />
          </InlineField>
        </div>
      </>}
    </div>
  )
}

export default memo(ProductConfigItemEditor);

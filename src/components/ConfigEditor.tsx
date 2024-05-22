import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { OpenAPIDataSourceOptions, OpenAPISecureJsonData, ProductConfigItem } from '../types';
import ProductConfigItemEditor from './ProductConfigItemEditor';

const { SecretFormField } = LegacyForms;

interface State {
  productConfigs: ProductConfigItem[];
}

interface Props extends DataSourcePluginOptionsEditorProps<OpenAPIDataSourceOptions> { }

export class OpenAPIConfigEditor extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props);
    const { jsonData } = props.options;
    this.state = {
      productConfigs: jsonData.productConfigs || [{
        product: '',
        protocol: 'HTTPS',
        endpoint: '',
        version: '',
        style: ''
      }],
    }
  }

  addProduct = () => {
    this.setState({
      productConfigs: [...this.state.productConfigs, {
        product: '',
        endpoint: '',
        version: '',
        style: ''
      }]
    })
  }

  removeProduct = (index: number) => {
    const { productConfigs } = this.state;
    const newProductConfigs = productConfigs.filter((item, idx) => idx !== index);
    this.setState({ productConfigs: newProductConfigs });
  }

  saveProductItem = (index: number, product: ProductConfigItem) => {
    const productConfigs = [...this.state.productConfigs];
    const newProductConfigs = productConfigs.map((item, idx) => {
      if (idx === index) {
        return product
      }
      return item;
    });
    this.setState({ productConfigs: newProductConfigs }, () => {
      const { onOptionsChange, options } = this.props;
      const jsonData = {
        ...options.jsonData,
        productConfigs: this.state.productConfigs
      }
      onOptionsChange({ ...options, jsonData });
    });
  }

  // Secure field (only sent to the backend)
  onAKIDChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    let accessKeySecret = '';
    if (options.secureJsonData !== undefined) {
      if (options.secureJsonData.hasOwnProperty('accessKeySecret')) {
        // @ts-ignore
        accessKeySecret = options.secureJsonData['accessKeySecret'];
      }
    }
    onOptionsChange({
      ...options,
      secureJsonData: {
        accessKeyId: event.target.value,
        accessKeySecret: accessKeySecret,
      },
    });
  };

  onAKSecretChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    let accessKeyId = '';
    if (options.secureJsonData !== undefined) {
      if (options.secureJsonData.hasOwnProperty('accessKeyId')) {
        // @ts-ignore
        accessKeyId = options.secureJsonData['accessKeyId'];
      }
    }
    onOptionsChange({
      ...options,
      secureJsonData: {
        accessKeyId: accessKeyId,
        accessKeySecret: event.target.value,
      },
    });
  };

  onReset = () => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonFields: {
        ...options.secureJsonFields,
        accessKeyId: false,
        accessKeySecret: false,
      },
      secureJsonData: {
        ...options.secureJsonData,
        accessKeyId: '',
        accessKeySecret: '',
      },
    });
  };

  render() {
    const { options } = this.props;
    const { secureJsonFields } = options;
    const { productConfigs } = this.state
    const secureJsonData = (options.secureJsonData || {}) as OpenAPISecureJsonData;

    return (
      <div className="gf-form-group">
        {/* aksk */}
        <div className="gf-form-inline">
          <div className="gf-form">
            <SecretFormField
              isConfigured={(secureJsonFields && secureJsonFields.accessKeyId) as boolean}
              value={secureJsonData.accessKeyId || ''}
              label="AccessKeyId"
              placeholder="AK secure json field (backend only)"
              labelWidth={8}
              inputWidth={25}
              onReset={this.onReset}
              onChange={this.onAKIDChange}
            />
          </div>
        </div>
        <div className="gf-form-inline">
          <div className="gf-form">
            <SecretFormField
              isConfigured={(secureJsonFields && secureJsonFields.accessKeySecret) as boolean}
              value={secureJsonData.accessKeySecret || ''}
              label="AccessKeySecret"
              placeholder="SK secure json field (backend only)"
              labelWidth={8}
              inputWidth={25}
              onReset={this.onReset}
              onChange={this.onAKSecretChange}
            />
          </div>
        </div>
        {
          productConfigs.map((product, index) => (
            <ProductConfigItemEditor
              product={product}
              key={JSON.stringify(product)}
              addProduct={() => this.addProduct()}
              remove={() => this.removeProduct(index)}
              index={index}
              saveProductItem={this.saveProductItem.bind(this)}
            />
          ))
        }
      </div>
    );
  }
}

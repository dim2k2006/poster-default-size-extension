import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import toNumber from 'lodash/toNumber';
import { SelectField, Option } from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-tokens/dist/css/index.css';
import './index.css';

const parseSize = (size) => size.split('x');

export class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    const sdkValue = props.sdk.field.getValue();
    const initialValue = { width: 50, height: 70 };
    const value = sdkValue ? sdkValue : initialValue;

    this.state = { value };
  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();
  }

  onSave = (value) => this.props.sdk.field.setValue(value);

  onExternalChange = (externalValue) => {
    this.setState((prevState) => ({
      value: externalValue ? externalValue : prevState.value,
    }));
  };

  onChange = (value) => {
    const size = parseSize(value);

    const width = toNumber(size[0]);
    const height = toNumber(size[1]);

    this.setState(() => {
      const newValue = { width, height };

      this.onSave(newValue);

      return { value: newValue };
    });
  };

  render() {
    const { width, height } = this.state.value;

    return (
      <div className="App">
        <div className="App__content">
          <div className="App__item">
            <div className="App__field">
              <SelectField
                id="defaultSize"
                name="defaultSize"
                labelText="Size"
                value={`${width}x${height}`}
                onChange={(event) => this.onChange(event.target.value)}
              >
                <Option value="50x70">50x70</Option>
                <Option value="40x50">40x50</Option>
                <Option value="30x40">30x40</Option>
                <Option value="21x30">21x30</Option>
                <Option value="70x50">70x50</Option>
                <Option value="50x40">50x40</Option>
                <Option value="40x30">40x30</Option>
                <Option value="30x21">30x21</Option>
                <Option value="30x30">30x30</Option>
              </SelectField>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }

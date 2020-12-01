import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import toNumber from 'lodash/toNumber';
import { RadioButtonField, FieldGroup } from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-tokens/dist/css/index.css';
import './index.css';

const sizes = [
  { orientation: 'portrait', width: 50, height: 70 },
  { orientation: 'portrait', width: 40, height: 50 },
  { orientation: 'portrait', width: 30, height: 40 },
  { orientation: 'portrait', width: 21, height: 30 },

  { orientation: 'landscape', width: 70, height: 50 },
  { orientation: 'landscape', width: 50, height: 40 },
  { orientation: 'landscape', width: 40, height: 30 },
  { orientation: 'landscape', width: 30, height: 21 },

  { orientation: 'square', width: 50, height: 50 },
  { orientation: 'square', width: 30, height: 30 },
];

const getInitialValue = () => ({ width: 0, height: 0 })

const parseSize = (size) => size.split('x');

const defaultOrientation = 'portrait';

export class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    const sdkValue = props.sdk.field.getValue();
    const initialValue = getInitialValue();
    const value = sdkValue ? sdkValue : initialValue;
    const orientation = defaultOrientation;

    this.state = { value, orientation };
  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();

    const orientationField = this.props.sdk.entry.fields.orientation;

    orientationField.onValueChanged((orientation = defaultOrientation) => {
      if (this.state.orientation === orientation) return; // prevent initial change

      this.setState((prevState) => {
        return { ...prevState, orientation, value: getInitialValue() };
      });
    });
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
    const { orientation } = this.state;
    const currentValue = `${width}x${height}`;

    return (
      <div className="App">
        <div className="App__content">
          <FieldGroup>
            {
              sizes
                .filter((size) => size.orientation === orientation)
                .map((size) => {
                  const value = `${size.width}x${size.height}`;

                  return (
                    <RadioButtonField
                      key={value}
                      labelText={value}
                      labelIsLight
                      name={value}
                      checked={value === currentValue}
                      value={value}
                      id={value}
                      onChange={(event) => this.onChange(event.target.value)}
                    />
                  );
                })
            }
          </FieldGroup>
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

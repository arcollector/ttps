import React from 'react';
import {Form, Input, InputOnChangeData} from 'semantic-ui-react';

type Props = {
  label: string,
  name: string,
  placeholder: string,
  type: string,
  onChange: (name: string, value: string) => any,
  value: string,
  disabled?: boolean,
};

export function FormInput(props: Props) {
  const onChange = React.useCallback((_, data: InputOnChangeData) => {
    props.onChange(props.name, data.value);
  }, [props.onChange, props.name]);

  return (
    <Form.Field>
      <div>{props.label}:</div> 
      <Input
        name={props.name}
        placeholder={props.placeholder}
        onChange={onChange}
        type={props.type}
        value={props.value}
        disabled={props.disabled}
      />
    </Form.Field>
  );
}

import React from 'react';
import * as Testing from '@testing-library/react'

import { Patient, emptyPatient } from '../../interfaces';
import { Form } from '../Form';

describe('<Form />', () => {

  function getInitialProps(
    onSubmit = jest.fn(),
    onSubmitError = jest.fn()
  ): React.ComponentProps<typeof Form> {
    return {
      values: emptyPatient,
      onSubmitError,
      onSubmit,
      isLoading: false,
      buttonText: 'Submit',
      disableDni: false,
    };
  }

  function getComponentForTesting(props = getInitialProps()) {
    return (
      <Form {...props} />
    );
  }

  function triggerChange(role: string, accebilityName: string, value: string) {
    Testing.fireEvent.change(
      Testing.screen.getByRole(role, { name: accebilityName }),
      { target: { value } }
    );
  }

  function fillFormFields(fields: Patient) {
    triggerChange('textbox', 'Nombre', fields.nombre);
    triggerChange('textbox', 'Apellido', fields.apellido);
    triggerChange('spinbutton', 'DNI', fields.dni);
    triggerChange('textbox', 'Fecha de nacimiento (DD/MM/YYYY)', fields.fecnac);
    triggerChange('spinbutton', 'Telefono', fields.telefono);
    triggerChange('textbox', 'Correo Electronico', fields.email);
    triggerChange('textbox', 'Nombre de la obra social', fields.nomsoc);
    triggerChange('textbox', 'Numero de la obra social', fields.numsoc);
  }

  test('should dont submit if all fields are empty', () => {
    const props = getInitialProps();
    const { getByTestId } = Testing.render(getComponentForTesting(props));
    const formElem = getByTestId('form');
    Testing.fireEvent.submit(formElem);
    expect(props.onSubmitError).toBeCalledTimes(1);
    expect(props.onSubmit).toBeCalledTimes(0);
  });

  test('should submit if all fields are valid', () => {
    const props = getInitialProps();
    const { getByTestId } = Testing.render(getComponentForTesting(props));
    const formElem = getByTestId('form');
    fillFormFields({
      id: 'whatever',
      nomsoc: 'IOMA',
      email: 'martin.ruiz@yahoo.com',
      numsoc: '1234456',
      telefono: '5452842655',
      nombre: 'Martin',
      apellido: 'Ruiz',
      dni: '33555999',
      fecnac: '10/10/2020',
    });
    Testing.fireEvent.submit(formElem);
    expect(props.onSubmitError).toBeCalledTimes(0);
    expect(props.onSubmit).toBeCalledTimes(1);
  });

  test('should validate fecnac value', () => {

  });

});

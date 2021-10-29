import React from 'react';
import * as Testing from '@testing-library/react'

import { Patient, emptyPatient } from '../../interfaces';
import { Form } from '../Form';

describe('<Form />', () => {

  const goodPatientData: Patient = {
    id: 'whatever',
    nomsoc: 'IOMA',
    email: 'martin.ruiz@yahoo.com',
    numsoc: '1234456',
    telefono: '5452842655',
    nombre: 'Martin',
    apellido: 'Ruiz',
    dni: '33555999',
    fecnac: '10/10/2020',
    historial: '20/20/2020 Dihariea',
  };

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

  function fillFormFields(fields: Partial<Patient>) {
    fields.nombre && triggerChange('textbox', 'Nombre', fields.nombre);
    fields.apellido && triggerChange('textbox', 'Apellido', fields.apellido);
    fields.dni && triggerChange('spinbutton', 'DNI', fields.dni);
    fields.fecnac && triggerChange('textbox', 'Fecha de nacimiento (DD/MM/YYYY)', fields.fecnac);
    fields.telefono && triggerChange('spinbutton', 'Telefono', fields.telefono);
    fields.email && triggerChange('textbox', 'Correo Electronico', fields.email);
    fields.nomsoc && triggerChange('textbox', 'Nombre de la obra social', fields.nomsoc);
    fields.numsoc && triggerChange('textbox', 'Numero de la obra social', fields.numsoc);
    fields.historial && triggerChange('textbox', 'Historia clinica', fields.historial);
  }

  describe('should mount initially using props.values as values for each form field', () => {
    function testFormFields(values: {role: string, name: string, value: string}[]) {
      Object.values(values).forEach(({role, name, value}) => {
        expect(
          (Testing.screen.getByRole(role, { name }) as HTMLInputElement).value
        ).toBe(value);
      });
    }

    test('when props.values is undefined all fields must be blank', () => {
      const props = getInitialProps();
      Testing.render(getComponentForTesting({ ...props, values: undefined }));
      testFormFields([
        { role: 'textbox', name: 'Nombre', value: '' },
        { role: 'textbox', name: 'Apellido', value: '' },
        { role: 'spinbutton', name: 'DNI', value: '' },
        { role: 'textbox', name: 'Fecha de nacimiento (DD/MM/YYYY)', value: '' },
        { role: 'spinbutton', name: 'Telefono', value: '' },
        { role: 'textbox', name: 'Correo Electronico', value: '' },
        { role: 'textbox', name: 'Nombre de la obra social', value: '' },
        { role: 'textbox', name: 'Numero de la obra social', value: '' },
        { role: 'textbox', name: 'Historia clinica', value: '' },
      ]);
    });

    test('when props.values is defined all fields must be fill up', () => {
      const props = getInitialProps();
      Testing.render(getComponentForTesting({ ...props, values: goodPatientData }));
      testFormFields([
        { role: 'textbox', name: 'Nombre', value: goodPatientData.nombre },
        { role: 'textbox', name: 'Apellido', value: goodPatientData.apellido },
        { role: 'spinbutton', name: 'DNI', value: goodPatientData.dni },
        { role: 'textbox', name: 'Fecha de nacimiento (DD/MM/YYYY)', value: goodPatientData.fecnac },
        { role: 'spinbutton', name: 'Telefono', value: goodPatientData.telefono },
        { role: 'textbox', name: 'Correo Electronico', value: goodPatientData.email },
        { role: 'textbox', name: 'Nombre de la obra social', value: goodPatientData.nomsoc },
        { role: 'textbox', name: 'Numero de la obra social', value: goodPatientData.numsoc },
        { role: 'textbox', name: 'Historia clinica', value: goodPatientData.historial },
      ]);
    });
  });

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
    fillFormFields(goodPatientData);
    Testing.fireEvent.submit(formElem);
    expect(props.onSubmitError).toBeCalledTimes(0);
    expect(props.onSubmit).toBeCalledTimes(1);
  });

  describe('single field validation', () => {
    function testFieldValidation(field: keyof Patient, badCases: string[], goodCases: string[]) {
      function doTest(cases: string[], toBe: boolean) {
        cases.forEach((value) => {
          fillFormFields({ [field]: value });
          expect(
            Testing.screen.getByTestId(field).classList.contains('error')
          ).toBe(toBe);
        });
      }
      doTest(badCases, true);
      doTest(goodCases, false);
    }

    beforeEach(() => {
      Testing.render(getComponentForTesting());
    });

    test('should validate nombre value', () => {
      testFieldValidation(
        'nombre',
        ['12344'],
        ['marcelo']
      );
    });

    test('should validate apellido value', () => {
      testFieldValidation(
        'nombre',
        ['12344'],
        ['rodriguez']
      );
    });

    test('should validate fecnac value', () => {
      testFieldValidation(
        'fecnac',
        ['not a valid date', '11/11', '11/11/1010', '10/Oct/2020'],
        ['10/10/2020']
      );
    });

    test('should validate dni value', () => {
      testFieldValidation(
        'dni',
        ['1', '111111111'],
        ['11222333']
      );
    });

    test('should validate telefono value', () => {
      testFieldValidation(
        'telefono',
        [],
        ['0118451113']
      );
    });

    test('should validate historial value', () => {
      testFieldValidation(
        'historial',
        [],
        ['20/20 Everything is fine']
      );
    });
  });

  test('should ignore successive submit events if props.isLoading is true', () => {
    const props = { ...getInitialProps(), isLoading: true };
    Testing.render(getComponentForTesting(props));
    Testing.fireEvent.submit(Testing.screen.getByTestId('form'));
    expect(props.onSubmit).toBeCalledTimes(0);
  });

  test('should dni field disable if props.disableDni is true', () => {
    const props = { ...getInitialProps(), disableDni: true };
    Testing.render(getComponentForTesting(props));
    expect(
      Testing.screen.getByRole('spinbutton', { name: 'DNI' })
    ).toBeDisabled();
  });

});

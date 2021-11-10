import React from 'react';
import * as Testing from '@testing-library/react'

import { Patient, emptyPatient } from '../../interfaces';
import { patient } from '../../__data__';
import { actions as insurersActions } from '../../../Insurers';
import { insurer } from '../../../Insurers/__data__'

import { Form } from '../Form';

describe('<Form />', () => {
  let spyOnGetAllInsurers: jest.SpyInstance<unknown, Parameters<typeof insurersActions.getAllInsurers>>;

  beforeEach(() => {
    spyOnGetAllInsurers = jest
      .spyOn(insurersActions, 'getAllInsurers')
      .mockImplementation(() => Promise.resolve([insurer]));
  });

  afterEach(() => {
    spyOnGetAllInsurers.mockRestore();
  });
  
  type Props = React.ComponentProps<typeof Form>;

  function getInitialProps(
    onSubmit = jest.fn(),
    onSubmitError = jest.fn()
  ): Props {
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

  async function renderAndWait(props: Props) {
    Testing.render(getComponentForTesting(props));
    await Testing.waitFor(() => Testing.screen.getAllByRole('option'));
  }

  function triggerChange(role: string, accebilityName: string, value: string) {
    const elem = Testing.screen.getByRole(role, { name: accebilityName });
    Testing.fireEvent.change(elem, { target: { value } });
  }

  function triggerChangeComboBox(testID: string, value: string) {
    const elem = Testing.screen.getByTestId(testID).firstChild as HTMLElement;
    Testing.fireEvent.change(elem, { target: { value } });
  }

  function fillFormFields(fields: Partial<Patient>) {
    fields.nombre && triggerChange('textbox', 'Nombre', fields.nombre);
    fields.apellido && triggerChange('textbox', 'Apellido', fields.apellido);
    fields.dni && triggerChange('spinbutton', 'DNI', fields.dni);
    fields.fecnac && triggerChange('textbox', 'Fecha de nacimiento (DD/MM/YYYY)', fields.fecnac);
    fields.telefono && triggerChange('spinbutton', 'Telefono', fields.telefono);
    fields.email && triggerChange('textbox', 'Correo Electronico', fields.email);
    fields.idInsurer && triggerChangeComboBox('idInsurer', fields.idInsurer);
    fields.numsoc && triggerChange('textbox', 'Numero de la obra social', fields.numsoc);
    fields.historial && triggerChange('textbox', 'Historia clinica', fields.historial);
  }

  describe('should mount initially using props.values as values for each form field', () => {
    type TestableFormField = {
      role: string,
      name?: string,
      value: string,
      testID?: string,
    };
    function testFormFields(values: TestableFormField[]) {
      Object.values(values).forEach(({role, name, value, testID}) => {
        if (role === 'combobox' && testID) {
          const elem = Testing.screen.getByTestId(testID).firstChild!.nextSibling as HTMLElement;
          if (!value) {
            expect(elem.classList.contains('default')).toBe(true);
          } else {
            expect(elem.classList.contains('default')).toBe(false);
            expect(elem.textContent).toBe(value);
          }
        } else {
          const elem = Testing.screen.getByRole(role, { name }) as HTMLInputElement;
          expect(elem.value).toBe(value);
        }
      });
    }

    test('when props.values is undefined all fields must be blank', async () => {
      await renderAndWait(getInitialProps());
      testFormFields([
        { role: 'textbox', name: 'Nombre', value: '' },
        { role: 'textbox', name: 'Apellido', value: '' },
        { role: 'spinbutton', name: 'DNI', value: '' },
        { role: 'textbox', name: 'Fecha de nacimiento (DD/MM/YYYY)', value: '' },
        { role: 'spinbutton', name: 'Telefono', value: '' },
        { role: 'textbox', name: 'Correo Electronico', value: '' },
        { role: 'combobox', testID: 'idInsurer', value: '' },
        { role: 'textbox', name: 'Numero de la obra social', value: '' },
        { role: 'textbox', name: 'Historia clinica', value: '' },
      ]);
    });

    test('when props.values is defined all fields must be fill up', async () => {
      await renderAndWait({ ...getInitialProps(), values: patient });
      testFormFields([
        { role: 'textbox', name: 'Nombre', value: patient.nombre },
        { role: 'textbox', name: 'Apellido', value: patient.apellido },
        { role: 'spinbutton', name: 'DNI', value: patient.dni },
        { role: 'textbox', name: 'Fecha de nacimiento (DD/MM/YYYY)', value: patient.fecnac },
        { role: 'spinbutton', name: 'Telefono', value: patient.telefono },
        { role: 'textbox', name: 'Correo Electronico', value: patient.email },
        { role: 'combobox', testID: 'idInsurer', value: insurer.nombre },
        { role: 'textbox', name: 'Numero de la obra social', value: patient.numsoc },
        { role: 'textbox', name: 'Historia clinica', value: patient.historial },
      ]);
    });
  });

  test('should dont submit if all fields are empty', async () => {
    const props = getInitialProps();
    await renderAndWait(props);
    const formElem = Testing.screen.getByTestId('form');
    Testing.fireEvent.submit(formElem);
    expect(props.onSubmitError).toBeCalledTimes(1);
    expect(props.onSubmit).toBeCalledTimes(0);
  });

  test('should submit if all fields are valid', async () => {
    const props = getInitialProps();
    await renderAndWait(props);
    const formElem = Testing.screen.getByTestId('form');
    fillFormFields(patient);
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

    beforeEach(async () => {
      await renderAndWait(getInitialProps());
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

  test('should ignore successive submit events if props.isLoading is true', async () => {
    const props = { ...getInitialProps(), isLoading: true };
    await renderAndWait(props);
    Testing.fireEvent.submit(Testing.screen.getByTestId('form'));
    expect(props.onSubmit).toBeCalledTimes(0);
  });

  test('should dni field disable if props.disableDni is true', async () => {
    const props = { ...getInitialProps(), disableDni: true };
    await renderAndWait(props);
    expect(
      Testing.screen.getByRole('spinbutton', { name: 'DNI' })
    ).toBeDisabled();
  });

});

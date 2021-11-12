import React from 'react';
import * as Testing from '@testing-library/react';

import { actions as insurersActions } from '../../../Insurers';
import { insurer } from '../../../Insurers/__data__';
import { patient } from '../../../Patients/__data__';
import * as appointmentsActions from '../../actions';
import { AppointmentNewForm } from '../AppointmentNewForm';

describe('', () => {
  let getAllInsurersResolved: boolean;
  let spyOnGetAllInsurers: jest.SpyInstance<unknown, Parameters<typeof insurersActions.getAllInsurers>>;
  let spyOnSearchByDniResolved: boolean;
  let spyOnSearchByDni: jest.SpyInstance<unknown, Parameters<typeof appointmentsActions.searchPatientByDni>>;

  beforeEach(() => {
    getAllInsurersResolved = false;
    spyOnGetAllInsurers = jest.spyOn(insurersActions, 'getAllInsurers')
      .mockImplementation(() => {
        getAllInsurersResolved = true;
        return Promise.resolve([insurer]);
      });
    spyOnSearchByDniResolved = false;
    spyOnSearchByDni = jest.spyOn(appointmentsActions, 'searchPatientByDni')
      .mockImplementation(() => {
        spyOnSearchByDniResolved = true;
        return Promise.resolve(patient);
      });
  });

  afterEach(() => {
    spyOnGetAllInsurers.mockRestore();
    spyOnSearchByDni.mockRestore();
  });

  function getComponentForTesting() {
    return (
      <AppointmentNewForm />
    );
  }

  async function renderAndWait() {
    Testing.render(getComponentForTesting());
    await Testing.waitFor(() => getAllInsurersResolved);
  }

  test('should derive patients insurer name correctly', async () => {
    await renderAndWait();
    Testing.fireEvent.click(
      Testing.screen.getByRole('button', { name: 'Buscar' })
    );
    await Testing.waitFor(() => spyOnSearchByDniResolved);
    expect(
      Testing.screen.getByText('Obra social: IOMA')
    ).toBeInTheDocument()
  });
});

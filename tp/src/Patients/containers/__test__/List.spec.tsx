import React from 'react';
import * as Testing from '@testing-library/react'
import * as RouterDom from 'react-router-dom';

import * as actions from '../../actions';
import { Patient } from '../interfaces/types';
import { List } from '../List';

describe('<List />', () => {
  let spyOnGetAllPatients: jest.SpyInstance<unknown, Parameters<typeof actions.getAllPatients>>;

  const patient: Patient = {
    id: '1234',
    nomsoc: 'IOMA',
    email: 'test@test.com',
    numsoc: '12345',
    telefono: '11554814',
    nombre: 'Jorge',
    apellido: 'Lopez',
    dni: '1222333',
    fecnac: '10/10/2010',
  };
  const patients: Patient[] = [ patient ];

  beforeEach(() => {
    spyOnGetAllPatients = jest.spyOn(actions, 'getAllPatients')
      .mockImplementation(() => Promise.resolve(patients));
  });

  afterEach(() => {
    spyOnGetAllPatients.mockRestore();
  });

  function getComponentForTesting() {
    return (
      <List />
    );
  }

  test('should display patient data correctly', async () => {
    Testing.render(getComponentForTesting());
    await Testing.waitFor(() => {
      expect(spyOnGetAllPatients).toBeCalled();
    });
    const row = Testing.screen.getAllByRole('row')[1];
    expect(
      Testing.within(row).getByText(`${patient.nombre} ${patient.apellido}`)
    ).toBeInTheDocument();
    expect(
      Testing.within(row).getByText(patient.dni)
    ).toBeInTheDocument();
    expect(
      Testing.within(row).getByText(patient.telefono)
    ).toBeInTheDocument();
    expect(
      Testing.within(row).getByText(patient.email)
    ).toBeInTheDocument();
    expect(
      Testing.within(row).getByText(`${patient.nomsoc} ${patient.numsoc}`)
    ).toBeInTheDocument();
  });

  test('should to attribute of details button correct', async () => {
    const dom = Testing.render(getComponentForTesting());
    await Testing.waitFor(() => {
      expect(spyOnGetAllPatients).toBeCalled();
    });
    const getByTo = Testing.queryByAttribute.bind(null, 'to');
    getByTo(dom.container, `/pacientes/${patient.id}`);
  });

});

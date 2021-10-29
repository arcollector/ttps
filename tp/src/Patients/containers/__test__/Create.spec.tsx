import * as Testing from '@testing-library/react'
import * as RouterDom from 'react-router-dom';

import { Patient } from '../../interfaces';
import * as actions from '../../actions';
import { Create } from '../Create';

describe('<Create />', () => {

  function getComponentForTesting() {
    return (
      <Create />
    );
  }

  describe('should invoke createPacient action when form is submitted', () => {
    let spyOnPatientCreate: jest.SpyInstance<unknown, Parameters<typeof actions.createPatient>>;
    let historyReplace: jest.Mock;
    let spyOnUseHistory: jest.SpyInstance<unknown, Parameters<typeof RouterDom.useHistory>>;

    const patient: Patient = {
      id: '',
      nomsoc: 'IOMA',
      email: 'test@test.com',
      numsoc: '12345',
      telefono: '11554814',
      nombre: 'Jorge',
      apellido: 'Lopez',
      dni: '1222333',
      fecnac: '10/10/2010',
      historial: '20/20 Everything is bad',
    };

    function fillForm(role: string, name: string, value: string) {
      Testing.fireEvent.change(
        Testing.screen.getByRole(role, { name }),
        { target: { value } }
      );
    }

    beforeEach(() => {
      spyOnPatientCreate = jest.spyOn(actions, 'createPatient')
        .mockImplementation(() => Promise.resolve(true));
      historyReplace = jest.fn();
      spyOnUseHistory = jest.spyOn(RouterDom, 'useHistory')
        .mockReturnValue({ replace: historyReplace });  
    });

    afterEach(() => {
      spyOnPatientCreate.mockRestore();
      spyOnUseHistory.mockRestore();
    });

    test('creation of patient was successful', async () => {
      Testing.render(getComponentForTesting());
      fillForm('textbox', 'Nombre', patient.nombre);
      fillForm('textbox', 'Apellido', patient.apellido);
      fillForm('spinbutton', 'DNI', patient.dni);
      fillForm('spinbutton', 'Telefono', patient.telefono);
      fillForm('textbox', 'Fecha de nacimiento (DD/MM/YYYY)', patient.fecnac);
      fillForm('textbox', 'Correo Electronico', patient.email);
      fillForm('textbox', 'Nombre de la obra social', patient.nomsoc);
      fillForm('textbox', 'Numero de la obra social', patient.numsoc);
      fillForm('textbox', 'Historia clinica', patient.historial);
      Testing.fireEvent.submit(Testing.screen.getByRole('button', { name: 'Crear paciente' }));
      await Testing.waitFor(() => {
        expect(spyOnPatientCreate).toBeCalledWith(patient);
      });
      expect(historyReplace).toBeCalledWith('/pacientes');
    });
  });

});

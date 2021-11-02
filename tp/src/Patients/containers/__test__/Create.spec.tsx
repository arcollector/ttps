import * as Testing from '@testing-library/react'
import * as RouterDom from 'react-router-dom';

import { patientRecentlyCreated } from '../../__data__';
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
      fillForm('textbox', 'Nombre', patientRecentlyCreated.nombre);
      fillForm('textbox', 'Apellido', patientRecentlyCreated.apellido);
      fillForm('spinbutton', 'DNI', patientRecentlyCreated.dni);
      fillForm('spinbutton', 'Telefono', patientRecentlyCreated.telefono);
      fillForm('textbox', 'Fecha de nacimiento (DD/MM/YYYY)', patientRecentlyCreated.fecnac);
      fillForm('textbox', 'Correo Electronico', patientRecentlyCreated.email);
      fillForm('textbox', 'Nombre de la obra social', patientRecentlyCreated.nomsoc);
      fillForm('textbox', 'Numero de la obra social', patientRecentlyCreated.numsoc);
      fillForm('textbox', 'Historia clinica', patientRecentlyCreated.historial);
      Testing.fireEvent.submit(Testing.screen.getByRole('button', { name: 'Crear paciente' }));
      await Testing.waitFor(() => {
        expect(spyOnPatientCreate).toBeCalledWith(patientRecentlyCreated);
      });
      expect(historyReplace).toBeCalledWith('/pacientes');
    });
  });

});

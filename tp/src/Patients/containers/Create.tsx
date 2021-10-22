import React from 'react';
import { Form } from '../components/Form';
import {toast} from 'react-toastify';
import { useHistory } from 'react-router-dom';

import { Patient } from '../interfaces';
import { PatientsService } from '../services';

export function Create() {
  const history = useHistory();

  const [ isLoading, setIsLoading ] = React.useState(false);

  const onPreSubmit = () => {
    setIsLoading(true);
  };

  const onSubmitError = (error?: string) => {
    toast.warning(error);
    setIsLoading(false);
  };

  const onSubmit = React.useCallback((formData: Patient) => {
    setIsLoading(true);
    PatientsService
      .create(formData)
      .then((success) => {
        if (success) {
          toast.success('El paciente fue cargado correctamente');
          history.replace('/pacientes');
        } else {
          toast.error('Ya existe un paciente con el mismo dni');
        }
      })
      .catch(() => {
        toast.error('Error al crear el paciente');
      })
      .finally(() => {
        setIsLoading(false); 
      });
  }, [history]);

  return (
    <div className="ui segment">
      <h1>
        Crear paciente
      </h1>

      <Form
        onPreSubmit={onPreSubmit}
        onSubmitError={onSubmitError}
        onSubmit={onSubmit}
        isLoading={isLoading}
        buttonText="Crear paciente"
      />
    </div>
  );
}

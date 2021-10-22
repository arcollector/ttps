import React from 'react';
import { Form } from '../components/Form';
import {toast} from 'react-toastify';
import { useHistory } from 'react-router-dom';

import { Patient } from '../interfaces';
import * as actions from '../actions'

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

  const onSubmit = React.useCallback(async (formData: Patient) => {
    setIsLoading(true);
    const success = await actions.createPatient(formData);
    if (success) {
      history.replace('/pacientes');
    }
    setIsLoading(false); 
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

import React from 'react';
import { Form } from '../components/Form';
import {toast} from 'react-toastify';

import { Patient } from '../interfaces/types';
import { db } from '../../shared/utils/Firebase';

function createPatient(formData: Patient) {
  return db
    .collection('patients')
    .add(formData);
}

export function Create() {
  const [ isLoading, setIsLoading ] = React.useState(false);

  const onPreSubmit = () => {
    setIsLoading(true);
  };

  const onSubmitError = (error?: string) => {
    toast.warning(error);
    setIsLoading(false);
  };

  const onSubmit = (formData: Patient) => {
    setIsLoading(true);
    createPatient(formData)
      .then(() => {
        toast.success('El paciente fue cargado correctamente');
      })
      .catch((error) => {
        console.log(error);
        toast.error('Error al guardar el paciente');
      })
      .finally(() => {
        setIsLoading(false); 
      });
  }

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

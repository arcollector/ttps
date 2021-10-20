import React from 'react';
import { Button } from 'semantic-ui-react';
import {toast} from 'react-toastify';
import { useParams } from "react-router-dom";

import { Form } from '../components/Form';
import { Patient, emptyPatient } from '../interfaces/types';
import { db } from '../../shared/utils/Firebase';

function getPatient(id: string): Promise<Patient> {
  return new Promise((resolve, reject) => {
    db
      .collection('patients')
      .doc(id)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          reject('Paciente no existe');
        } else {
          resolve(doc.data() as Patient);
        }
      });
  });
}

function updatePatient(formData: Patient) {
  return db
    .collection('patients')
    .doc(formData.id)
    .get();
}

export function Single() {
  const { id : patientId } = useParams<{ id: string }>();
  const [ patient, setPatient ] = React.useState<Patient>(emptyPatient);
  const [ isLoading, setIsLoading ] = React.useState(false);

  const onPreSubmit = () => {
    setIsLoading(true);
  };

  const onSubmitError = (error?: string) => {
    setIsLoading(false);
    toast.warning(error);
  };

  React.useEffect(() => {
    getPatient(patientId)
      .then((patient) => {
        setPatient(patient);
      })
      .catch((error) => {
        toast.error(error);
      });
  }, [patientId]);

  const onSubmit = (values: Patient) => {
    setIsLoading(true);
    updatePatient({ ...values, id: patientId })
      .then((doc) => {
        if (!doc.exists) {
          toast.error(`Paciente con id ${patientId} no existe`);
          setIsLoading(false);
        } else {
          doc
            .ref
            .set(values)
            .then(() => {
              toast.success('Los datos han sido actualizados correctamente');
            })
            .catch((error) => {
              console.log(error);
              toast.error('No se pudo editar los datos del paciente');
            })
            .finally(() => {
              setIsLoading(false);
            });
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(`No se puedo obtener la informacion del paciente ${patientId}`);
        setIsLoading(false);
      });
  };

  return (
    <div className="ui segment">
      <h1>Datos del paciente</h1>

      <Form
        values={patient}
        onPreSubmit={onPreSubmit}
        onSubmitError={onSubmitError}
        onSubmit={onSubmit}
        isLoading={isLoading}
        buttonText="Editar paciente"
      />

      <hr />
  
      <form className="ui">
        <Button
          className="negative"
          type="submit"
          loading={false}
        >
          Borrar paciente
        </Button>
      </form>
    </div>
  );
}

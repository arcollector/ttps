import React from 'react';
import { Button } from 'semantic-ui-react';
import {toast} from 'react-toastify';
import { useParams, useHistory } from 'react-router-dom';

import { Form } from '../components/Form';
import { Patient, emptyPatient } from '../interfaces/types';
import { PatientsService } from '../services';

export function Single() {
  const history = useHistory();

  const { id : patientId } = useParams<{ id: string }>();
  const [ patient, setPatient ] = React.useState<Patient>(emptyPatient);

  React.useEffect(() => {
    PatientsService.getAsItem(patientId)
      .then(setPatient)
      .catch(() => {
        toast.error(`no se pudo obtener los datos del paciente ${patientId}`);
      });
  }, [patientId]);

  const [ isLoadingForUpdate, setIsLoadingForUpdate ] = React.useState(false);
  const [ isLoadingForDelete, setIsLoadingForDelete ] = React.useState(false);

  const onPreUpdate = () => {
    setIsLoadingForUpdate(true);
  };

  const onUpdateError = (error?: string) => {
    setIsLoadingForUpdate(false);
    toast.warning(error);
  };

  const onUpdate = (values: Patient) => {
    setIsLoadingForUpdate(true);
    PatientsService
      .update(patientId, values)
      .then((success) => {
        if (success) {
          toast.success('Los datos han sido actualizados correctamente');
        }
      })
      .catch(() => {
        toast.error(`No se pudo actualizar el paciente ${patientId}`);
      })
      .finally(() => {
        setIsLoadingForUpdate(false);
      });
  };

  const [ isDeleteMode, setIsDeleteMode ] = React.useState(false);
  const onPreDelete = () => {
    setIsDeleteMode(true);
  };

  const onConfirmDelete = React.useCallback(() => {
    setIsLoadingForDelete(true);
    PatientsService
      .remove(patientId)
      .then((success) => {
        if (success) {
          toast.success('Paciente eliminado con exito');
          history.replace('/pacientes');
        } else {
          toast.error(`Fallo el borrado del paciente ${patientId}. Sera por que tiene examenes medicos asociados?`);
        }
      })
      .catch(() => {
        toast.error(`No se pudo obtener los datos del paciente ${patientId} para su borrado`);
      })
      .finally(() => {
        setIsLoadingForDelete(false);
      });
  }, [patientId]);

  const onCancelDelete = () => {
    setIsDeleteMode(false);
  };

  return (
    <div className="ui segment">
      <h1>Datos del paciente</h1>

      <Form
        values={patient}
        onPreSubmit={onPreUpdate}
        onSubmitError={onUpdateError}
        onSubmit={onUpdate}
        isLoading={isLoadingForUpdate}
        buttonText="Editar paciente"
        disableDni
      />

      <hr />
  
      {!isDeleteMode &&
      <Button
        className="negative"
        type="button"
        onClick={onPreDelete}
      >
        Borrar paciente
      </Button>
      }

      {isDeleteMode &&
      <>
        <h3>Esta seguro?</h3>
        <Button
          className="negative"
          type="button"
          loading={isLoadingForDelete}
          onClick={onConfirmDelete}
        >
          Si
        </Button>
        <Button
          className="grey"
          type="button"
          onClick={onCancelDelete}
        >
          No
        </Button>
      </>
      }
    </div>
  );
}

import React from 'react';
import { Button } from 'semantic-ui-react';
import { ErrorMessage } from '../../shared/components/ErrorMessage';
import { useParams, useHistory } from 'react-router-dom';

import { Form } from '../components/Form';
import { Patient, emptyPatient } from '../interfaces/types';
import * as actions from '../actions';

export function Single() {
  const history = useHistory();

  const { id : patientId } = useParams<{ id: string }>();
  const [ patient, setPatient ] = React.useState<Patient>(emptyPatient);

  React.useEffect(() => {
    (async () => {
      setPatient(await actions.getPatient(patientId));
    })();
  }, [patientId]);

  const [ isLoadingForUpdate, setIsLoadingForUpdate ] = React.useState(false);
  const [ isLoadingForDelete, setIsLoadingForDelete ] = React.useState(false);
  const [ errors, setErrros ] = React.useState<string[]>([]);

  const onUpdateError = (errors: string[]) => {
    setErrros(errors);
  };

  const onUpdate = async (values: Patient) => {
    setErrros([]);
    setIsLoadingForUpdate(true);
    await actions.updatePatient(patientId, values);
    setIsLoadingForUpdate(false);
  };

  const [ isDeleteMode, setIsDeleteMode ] = React.useState(false);
  const onPreDelete = () => {
    setIsDeleteMode(true);
  };

  const onConfirmDelete = React.useCallback(async () => {
    setIsLoadingForDelete(true);
    await actions.removePatient(patientId);
    history.replace('/pacientes');
    setIsLoadingForDelete(false);
  }, [patientId]);

  const onCancelDelete = () => {
    setIsDeleteMode(false);
  };

  return (
    <div className="ui segment">
      <h1>Datos del paciente</h1>

      <ErrorMessage
        heading="No se pudo editar los datos del paciente"
        errors={errors}
      />

      <Form
        values={patient}
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
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <h3 style={{ marginRight: 50 }}>Esta seguro?</h3>
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
      </div>
      }
    </div>
  );
}

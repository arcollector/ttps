import React from 'react';
import { Button } from 'semantic-ui-react';
import { ErrorMessage } from '../../shared/components/ErrorMessage';
import { useParams, useHistory } from 'react-router-dom';

import { Form } from '../components/Form';
import { Insurer, emptyInsurer } from '../interfaces/types';
import * as actions from '../actions';

export function Single() {
  const history = useHistory();

  const { id : insurerId } = useParams<{ id: string }>();
  const [ patient, setPatient ] = React.useState<Insurer>(emptyInsurer);

  React.useEffect(() => {
    (async () => {
      setPatient(await actions.getInsurer(insurerId));
    })();
  }, [insurerId]);

  const [ isLoadingForUpdate, setIsLoadingForUpdate ] = React.useState(false);
  const [ isLoadingForDelete, setIsLoadingForDelete ] = React.useState(false);
  const [ errors, setErrros ] = React.useState<string[]>([]);

  const onUpdateError = (errors: string[]) => {
    setErrros(errors);
  };

  const onUpdate = async (values: Insurer) => {
    setIsLoadingForUpdate(true);
    await actions.updateInsurer(insurerId, values);
    setIsLoadingForUpdate(false);
  };

  const [ isDeleteMode, setIsDeleteMode ] = React.useState(false);
  const onPreDelete = () => {
    setIsDeleteMode(true);
  };

  const onConfirmDelete = React.useCallback(async () => {
    setIsLoadingForDelete(true);
    await actions.removeInsurer(insurerId);
    history.replace('/obra-sociales');
    setIsLoadingForDelete(false);
  }, [insurerId]);

  const onCancelDelete = () => {
    setIsDeleteMode(false);
  };

  return (
    <div className="ui segment">
      <h1>Datos de la obra social</h1>

      <ErrorMessage
        heading="No se pudo editar los datos de la obra social"
        errors={errors}
      />

      <Form
        values={patient}
        onSubmitError={onUpdateError}
        onSubmit={onUpdate}
        isLoading={isLoadingForUpdate}
        buttonText="Editar obra social"
      />

      <hr />
  
      {!isDeleteMode &&
      <Button
        className="negative"
        type="button"
        onClick={onPreDelete}
      >
        Borrar obra social
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

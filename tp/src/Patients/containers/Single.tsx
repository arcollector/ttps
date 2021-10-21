import React from 'react';
import { Button } from 'semantic-ui-react';
import {toast} from 'react-toastify';
import { useParams, useHistory } from 'react-router-dom';

import firebase from 'firebase/compat/app';
import { Form } from '../components/Form';
import { Patient, emptyPatient } from '../interfaces/types';
import { db } from '../../shared/utils/Firebase';

function getPatient(id: Patient['id']):
  Promise<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>>
{
  return new Promise((resolve, reject) => {
    db
      .collection('patients')
      .doc(id)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          reject('Paciente no existe');
        } else {
          resolve(doc);
        }
      })
      .catch((error) => {
        console.error(error);
        reject(`Fallo la obtencion del paciente ${id}`);
      });
  });
}

function updatePatient(formData: Patient) {
  return db
    .collection('patients')
    .doc(formData.id)
    .get();
}

function removePatient(id: Patient['id']) {
  getPatient(id);
}

export function Single() {
  const history = useHistory();

  const { id : patientId } = useParams<{ id: string }>();
  const [ patient, setPatient ] = React.useState<Patient>(emptyPatient);

  React.useEffect(() => {
    getPatient(patientId)
      .then((doc) => {
        setPatient(doc.data() as Patient);
      })
      .catch((error) => {
        toast.error(error);
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
    getPatient(patientId)
      .then((doc) => {
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
            setIsLoadingForUpdate(false);
          });
      })
      .catch((error) => {
        toast.error(error);
        setIsLoadingForUpdate(false);
      });
  };

  const [ isDeleteMode, setIsDeleteMode ] = React.useState(false);
  const onPreDelete = () => {
    setIsDeleteMode(true);
  };

  const onConfirmDelete = () => {
    setIsLoadingForDelete(true);
    getPatient(patientId)
      .then((doc) => {
        // TODO no se puede borrar un paciente con estudio ya realizados
        doc
          .ref
          .delete()
          .then(() => {
            toast.success('Paciente eliminado con exito');
            history.replace('/pacientes');
          })
          .catch((error) => {
            console.error(error);
            toast.error(`Fallo el borrado del paciente ${patientId}`);
          })
          .finally(() => {
            setIsLoadingForDelete(false);
          });
      })
      .catch((error) => {
        toast.error(error);
        setIsLoadingForDelete(false);
      });
  };

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

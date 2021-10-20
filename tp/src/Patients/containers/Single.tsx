import React from 'react';
import {Form, Button } from 'semantic-ui-react';
import {toast} from 'react-toastify';

import { FormInput } from '../components/FormInput';
import { validateEmail } from '../../shared/utils/Validations';
import { db } from '../../shared/utils/Firebase';

function validateDni(dni: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db
      .collection('patients')
      .where('dni', '==', dni)
      .get()
      .then((doc) => {
        if (!doc.empty) {
          reject();
        } else {
          resolve();
        }
      });
  });
}

function createPatient(formData: Record<string, string>) {
  return db
    .collection('patients')
    .add(formData);
}

export function Single() {
  const [ formData, setFormData ] = React.useState<Record<string, string>>({});
  const onChange = (name: string, value: string) => {
    setFormData((v) => ({ ...v, [name]: value }));
  };

  const [ isLoading, setIsLoading ] = React.useState(false);
  const onSubmit = React.useCallback(() => {
    if (Object.keys(formData).length !== 8) {
      toast.warning('Debe completar todos los datos');
      return;
    }

    const {
      nombre,
      apellido,
      dni,
      fecnac,
      telefono,
      email,
      nomsoc,
      numsoc,
    } = formData;

    if (!validateEmail(email)) {
      toast.warning('Ingrese una direccion de correo valida');
      return;
    }

    // TODO validate all fields

    setIsLoading(true);
    const doneIsLoading = () => setIsLoading(false);

    validateDni(dni)
      .then(() => {
        createPatient(formData)
          .then(() => {
            toast.success('El paciente fue cargado correctamente');
          })
          .catch((error) => {
            console.log(error);
            toast.error('Error al guardar el paciente');
          })
          .finally(doneIsLoading);
      })
      .catch(() => {
        toast.warning('El paciente que intenta crear ya existe');
        doneIsLoading();
      });
  }, [formData]);

  return (
    <Form
      className="segment"
      onSubmit={onSubmit}
    >
      <h1>Datos del paciente</h1>

      <FormInput
        label="Nombre"
        name="nombre"
        placeholder="Nombre del paciente"
        type="text"
        onChange={onChange}
      />

      <FormInput
        label="Apellido"
        name="apellido"
        placeholder="Apellido del paciente"
        type="text"
        onChange={onChange}
      />

      <FormInput
        label="DNI"
        name="dni"
        placeholder="DNI del paciente"
        type="number"
        onChange={onChange}
      />

      <FormInput
        label="Fecha de nacimiento (DD/MM/YYYY)"
        name="fecnac"
        placeholder="Fecha de nacimiento del paciente en formato DD/MM/YYYY"
        type="text"
        onChange={onChange}
      />

      <FormInput
        label="Telefono"
        name="telefono"
        placeholder="Telefono del paciente"
        type="number"
        onChange={onChange}
      />

      <FormInput
        label="Correo Electronico"
        name="email"
        placeholder="Correo Electronico del paciente"
        type="email"
        onChange={onChange}
      />

      <FormInput
        label="Nombre de la obra social"
        name="nomsoc"
        placeholder="Nombre de la obra social del paciente"
        type="text"
        onChange={onChange}
      />

      <FormInput
        label="Numero de la obra social"
        name="numsoc"
        placeholder="Numero de la obra social del paciente"
        type="text"
        onChange={onChange}
      />

      <Button
        type="submit"
        loading={isLoading}
      >
        Cargar Datos del Paciente
      </Button>
    </Form>
  );
}

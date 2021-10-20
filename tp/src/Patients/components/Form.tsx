import React from 'react';
import * as SemanticUi from 'semantic-ui-react';

import { FormInput } from '../components/FormInput';
import { Patient, emptyPatient } from '../interfaces/types';
import { validateEmail } from '../../shared/utils/Validations';
import { db } from '../../shared/utils/Firebase';

function validateDni(dni: Patient['dni']): Promise<void> {
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

type Props = {
  values?: Patient,
  onPreSubmit: () => any,
  onSubmitError: (error?: string) => any,
  onSubmit: (values: Patient) => any,
  isLoading: boolean,
  buttonText: string,
};

export function Form(props: Props) {
  const [ formData, setFormData ] = React.useState<Patient>(props.values || emptyPatient);

  React.useEffect(() => {
    if (props.values) {
      setFormData(props.values);
    }
  }, [props.values]);

  const onChange = (name: string, value: string) => {
    setFormData((v) => ({ ...v, [name]: value }));
  };

  const onSubmit = React.useCallback(() => {
    props.onPreSubmit();

    if (Object.keys(formData).length !== 8) {
      props.onSubmitError('Debe completar todos los datos');
      return;
    }

    const {
      dni,
      email,
    } = formData;

    if (!validateEmail(email)) {
      props.onSubmitError('Ingrese una direccion de correo valida');
      return;
    }

    // TODO validate all fields

    validateDni(dni)
      .then(() => {
        props.onSubmit(formData);
      })
      .catch(() => {
        props.onSubmitError('Ya existe un paciente con el mismo dni');
      });
  }, [
    formData,
    props.onPreSubmit,
    props.onSubmitError,
    props.onSubmit
  ]);

  return (
    <SemanticUi.Form
      onSubmit={onSubmit}
    >
      <FormInput
        label="Nombre"
        name="nombre"
        placeholder="Nombre del paciente"
        type="text"
        onChange={onChange}
        value={formData.nombre}
      />

      <FormInput
        label="Apellido"
        name="apellido"
        placeholder="Apellido del paciente"
        type="text"
        onChange={onChange}
        value={formData.apellido}
      />

      <FormInput
        label="DNI"
        name="dni"
        placeholder="DNI del paciente"
        type="number"
        onChange={onChange}
        value={formData.dni}
      />

      <FormInput
        label="Fecha de nacimiento (DD/MM/YYYY)"
        name="fecnac"
        placeholder="Fecha de nacimiento del paciente en formato DD/MM/YYYY"
        type="text"
        onChange={onChange}
        value={formData.fecnac}
      />

      <FormInput
        label="Telefono"
        name="telefono"
        placeholder="Telefono del paciente"
        type="number"
        onChange={onChange}
        value={formData.telefono}
      />

      <FormInput
        label="Correo Electronico"
        name="email"
        placeholder="Correo Electronico del paciente"
        type="email"
        onChange={onChange}
        value={formData.email}
      />

      <FormInput
        label="Nombre de la obra social"
        name="nomsoc"
        placeholder="Nombre de la obra social del paciente"
        type="text"
        onChange={onChange}
        value={formData.nomsoc}
      />

      <FormInput
        label="Numero de la obra social"
        name="numsoc"
        placeholder="Numero de la obra social del paciente"
        type="text"
        onChange={onChange}
        value={formData.numsoc}
      />

      <SemanticUi.Button
        className="primary"
        type="submit"
        loading={props.isLoading}
      >
        {props.buttonText}
      </SemanticUi.Button>
    </SemanticUi.Form>
  );
}

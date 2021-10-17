import React from 'react';
import { db } from '../../shared/utils/Firebase';

type Patient = {
  nomsoc: string,
  code: string,
  email: string,
  numsoc: string,
  telefono: string,
  nombre: string,
  apellido: string,
  dni: string,
};

export function Patients() {
  const [ patients, setPatients ] = React.useState<Patient[]>([]);
  React.useEffect(() => {
    const items: Patient[] = [];
    db.collection('patients').get().then((doc) => {
      if (!doc.empty) {
        doc.docs.forEach((doc) => items.push(doc.data() as Patient));
        setPatients(items);
      }
    }).catch((e) => {
      console.error(e);
    });
  }, []);

  return (
    <div>
      <h1>Listado de pacientes</h1>
        <table className="ui celled table">
          <thead>
            <tr>
              <th>Nombre completo</th>
              <th>DNI</th>
              <th>Telefono</th>
              <th>Email</th>
              <th>Obra social</th>
            </tr>
          </thead>
        <tbody>
          {patients.map((patient, i) =>
            <tr key={i}>
              <td data-label="nombre completo">
                {patient.nombre} {patient.apellido}
              </td>
              <td data-label="email">
                {patient.email}
              </td>
              <td data-label="telefono">
                {patient.telefono}
              </td>
              <td data-label="email">
                {patient.email}
              </td>
              <td data-label="email">
                {patient.nomsoc} {patient.numsoc}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
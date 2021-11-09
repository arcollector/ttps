import { Patient } from '../interfaces'

export const patient: Patient = {
  id: '123456',
  idInsurer: '12345abc',
  nomsoc: 'IOMA',
  email: 'test@test.com',
  numsoc: '12345',
  telefono: '11554814',
  nombre: 'Jorge',
  apellido: 'Lopez',
  dni: '1222333',
  fecnac: '10/10/2010',
  historial: '10/10 Todo mal'
};

export const patientRecentlyCreated: Patient = {
  id: '',
  idInsurer: '12345abc',
  nomsoc: 'IOMA',
  email: 'test@test.com',
  numsoc: '12345',
  telefono: '11554814',
  nombre: 'Jorge',
  apellido: 'Lopez',
  dni: '1222333',
  fecnac: '10/10/2010',
  historial: '10/10 Todo mal'
};

export const patients = [ patient ];

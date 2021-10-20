export type Patient = {
  id: string,
  nomsoc: string,
  email: string,
  numsoc: string,
  telefono: string,
  nombre: string,
  apellido: string,
  dni: string,
  fecnac: string,
};

export const emptyPatient: Patient = {
  id: '',
  nomsoc: '',
  email: '',
  numsoc: '',
  telefono: '',
  nombre: '',
  apellido: '',
  dni: '',
  fecnac: '',
};

import { Crud } from '../../shared/firebase';
import { Patient } from '../interfaces';

type MedicExam = {};

export class PatientsService {

  public static existsDni(dni: string): Promise<boolean> {
    return new Promise((resolve) => {
      Crud
        .getAllBy<Patient>('patients', ['dni', dni])
        .then((items) => {
          resolve(items.length !== 0);
        });
    });
  }

  public static create(formData: Patient): Promise<boolean> {
    return new Promise((resolve) => {
      return PatientsService
        .existsDni(formData.dni)
        .then((existsDni) => {
          if (!existsDni) {
            Crud
              .create('patients', formData)
              .then(() => resolve(true))
          } else {
            resolve(false);
          }
        });
    });
  }

  public static update(patientId: string, formData: Patient): Promise<boolean> {
    return new Promise((resolve) => {
      Crud
      .getAsDoc('patients', patientId)
      .then((doc) => {
        Crud.update(doc, formData)
          .then(() => {
            resolve(true);
          });
      })
    });
  }

  public static getAsItem(patientId: string): Promise<Patient> {
    return new Promise((resolve) => {
      Crud.getAsItem<Patient>('patients', patientId)
        .then(resolve)
    });
  }

  public static remove(patientId: string): Promise<boolean> {
    return new Promise((resolve) => {
      Crud
        .getAllBy<MedicExam>('medicExams', ['idPatient', patientId])
        .then((items) => {
          if (items.length !== 0) {
            resolve(false);
          } else {
            Crud
            .getAsDoc('patients', patientId)
            .then((doc) => {
              Crud
                .delete(doc)
                .then(() => resolve(true))
            });
          }
        });
    });
  }

}

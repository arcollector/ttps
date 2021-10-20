import { Switch, Route } from 'react-router-dom';

import { AppointmentsSchedule }  from '../../../Appointments';
import { MedicalExams } from '../../../MedicalExams';
import { Patients } from '../../../Patients';

export function Routes() {
    return (
        <Switch>
            <Route path="/estudios" exact>
                <MedicalExams/>
            </Route>

            <Route path="/turnos" exact>
                <AppointmentsSchedule />
            </Route>

            <Route path="/pacientes" exact>
                <Patients.List />
            </Route>
            <Route path="/pacientes/crear" exact>
                <Patients.Create />
            </Route>
            <Route path="/pacientes/:id" exact>
                <Patients.Single />
            </Route>
        </Switch>
    );
}

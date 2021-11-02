import { Switch, Route } from 'react-router-dom';

import { AppointmentsSchedule }  from '../../../Appointments';
import { MedicalExams } from '../../../MedicalExams';
import { Patients } from '../../../Patients';
import { Lotes } from '../../../Lotes';

export function Routes(props) {
    const {user}=props
    return (
        <Switch>
            <Route path="/estudios" exact>
                <MedicalExams user={user}/>
            </Route>

            <Route path="/turnos" exact>
                <AppointmentsSchedule />
            </Route>

            <Route path="/lotes" exact>
                <Lotes />
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

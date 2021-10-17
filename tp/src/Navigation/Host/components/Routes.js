import React from 'react'
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
                <Patients />
            </Route>
        </Switch>
    );
}
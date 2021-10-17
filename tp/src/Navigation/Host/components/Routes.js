import React from 'react'
import { Switch, Route } from 'react-router-dom';

import { AppointmentsSchedule }  from '../../../Appointments';
import { MedicalExams } from '../../../MedicalExams';

export function Routes() {
    return (
        <Switch>
            <Route path="/estudios" exact>
                <MedicalExams/>
            </Route>

            <Route path="/turnos" exact>
                <AppointmentsSchedule/>
            </Route>
        </Switch>
    )
}

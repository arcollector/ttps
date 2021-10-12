import React from 'react'
import { Switch, Route } from 'react-router-dom';




//pages
import Home from '../pages/Home';
import AppointmentsSchedule from '../pages/AppointmentsSchedule';
import Estudios from '../pages/Estudios';



export default function Routes() {
    return (
        <Switch>
            <Route path="/" exact>
                <Home/>

            </Route>
            <Route path="/estudios" exact>
                <Estudios/>

            </Route>
            <Route path="/turnos" exact>
                
                    <AppointmentsSchedule/>
                
            </Route>
            
        </Switch>
    )
}

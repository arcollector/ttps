import React from 'react';
import '../Authenticated/styles/Authenticated.scss';

import {Grid} from 'semantic-ui-react';
import { Routes } from '../Authenticated/components/Routes';
import { BrowserRouter as Router} from 'react-router-dom';
import { SideBar } from '../Authenticated/components/SideBar';
import { TopBar } from '../Authenticated/components/TopBar';

export function Authenticated(props) {

    const {user}= props;


    return (
        <Router>

            <Grid className="logged-layout">
                <Grid.Row>
                    <Grid.Column width={3}>
                        <SideBar user={user}/>
                    </Grid.Column>
                    <Grid.Column className="content" width={13}>
                        <TopBar
                            user={user}
                        />
                        <Routes/>

                    </Grid.Column>
                </Grid.Row>

            </Grid>

        </Router>
    )
}

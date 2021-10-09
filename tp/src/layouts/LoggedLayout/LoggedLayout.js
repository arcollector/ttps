import React from 'react';
import './LoggedLayout.scss';

import {Grid} from 'semantic-ui-react';
import Routes from '../../routes/Routes';
import { BrowserRouter as Router} from 'react-router-dom';
import MenuLeft from '../../components/MenuLeft/MenuLeft';
import TopBar from '../../components/TopBar/TopBar';

export default function LoggedLayout(props) {

    const {user}= props;


    return (
        <Router>

            <Grid className="logged-layout">
                <Grid.Row>
                    <Grid.Column width={3}>
                        <MenuLeft user={user}/>
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

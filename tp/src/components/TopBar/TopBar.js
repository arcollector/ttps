import React from 'react';
import './TopBar.scss';

import {Icon, Image} from 'semantic-ui-react';
import {withRouter} from 'react-router-dom';

import firebase from '../../utils/Firebase';
import 'firebase/compat/auth';

import UserImage from '../../assets/png/user.png';

 function TopBar(props) {

    const {user, history} = props;
    

    const loguot=()=>{
        firebase.auth().signOut();
    }

    const goBack=()=>{
        history.goBack();
    }


    return (
        <div className="top-bar">
            <div className="top-bar__left">
                <Icon name="angle left" onClick={goBack}/>
                
            </div>
            <h3>Clinica Grupo 11</h3>
            <div className="top-bar__right">
                <Image src={UserImage}/>
                {user.displayName}
                <Icon name="power off" onClick={loguot}/>
            </div>
            
           
        </div>
    )
}


export default withRouter(TopBar);
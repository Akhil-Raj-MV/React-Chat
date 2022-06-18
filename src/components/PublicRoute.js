import React from 'react'
import { Route,Redirect } from 'react-router'
import { Loader,Container } from 'rsuite';
import { useProfile } from '../context/profile.context';

const PublicRoute = ({children,...routeProps}) => {
    const {isLoading,profile}=useProfile();
    
    if(isLoading && !profile){
        return(
            <Container>
                <Loader center vertical speed='slow' size='md' content='Loading'/>
            </Container>
        )
    }

    if(profile && !isLoading) {
        return <Redirect to="/"/>
    }
    return (
        <Route {...routeProps}>
            {children}
        </Route>
    )
}

export default PublicRoute
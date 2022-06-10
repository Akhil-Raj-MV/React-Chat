/* eslint-disable import/no-duplicates */
import React, { useContext, useEffect, useState } from 'react'
import { createContext } from 'react'
import firebase from 'firebase/app';
import { auth, database } from '../misc/firebase';

export const isOfflineForDatabase = {
    state: 'offline',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const isOnlineForDatabase = {
    state: 'online',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
};



const ProfileContext=createContext();

export const ProfileProvider=({children})=>{
    const [profile,setProfile]=useState(null);
    const [isLoading ,setIsLoading]=useState(true);

    useEffect(()=>{
        let userRef;
        let userStatusDatabaseRef;
        const authUnsub=auth.onAuthStateChanged((authObj)=>{

             if(authObj){

               userStatusDatabaseRef = database.ref(`/status/${authObj.uid}`);
               userRef= database.ref(`/profiles/${authObj.uid}`);
               
               userRef.on('value',(snap)=>{
                       const {name,createdAt,avatar}= snap.val();

                       const data={
                        name,
    
                        createdAt,
                        avatar,
                        uid:authObj.uid,
                        email:authObj.email
    
                    }
                    setProfile(data);
                    setIsLoading(false);
                       
                })
                           
                    
                database.ref('.info/connected').on('value', snapshot => {
                    if (!!snapshot.val() === false) {
                        return;
                    }
        
                    userStatusDatabaseRef
                    .onDisconnect()
                    .set(isOfflineForDatabase)
                    .then(() => {
                        userStatusDatabaseRef.set(isOnlineForDatabase);
                    });
                });


                
             } 
             else{
                 if(userRef){
                        userRef.off();
                 }
                if(userStatusDatabaseRef){
                    userStatusDatabaseRef.off();
                }

                database.ref('.info/connected').off();

                 setProfile(null);
                 setIsLoading(false);
             }  
        
        })

        return(
            ()=>{
                authUnsub();
                
                database.ref('.info/connected').off();
                if(userRef){
                    userRef.off();
                }
                if (userStatusDatabaseRef) {
                    userStatusDatabaseRef.off();
                  }
            }
        )
    },[])

    return(
       
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        <ProfileContext.Provider value={{isLoading,profile}}>
        {children}
        </ProfileContext.Provider>
    )
    }

export const useProfile=()=>{
    return (useContext(ProfileContext));
}
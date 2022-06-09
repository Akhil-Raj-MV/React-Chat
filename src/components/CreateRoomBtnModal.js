import React,{useCallback, useState,useRef} from 'react'
import {Alert, Button,ControlLabel,Form,FormControl,FormGroup,Icon, Modal, Schema} from 'rsuite'
import firebase from 'firebase/app'
import {database} from '../misc/firebase'
import {useModalState} from '../misc/custom.hook';


const INITIAL_FORM={
    name:" ",
    description:" "
}

const {StringType}=Schema.Types;

const modal=Schema.Model({
    name: StringType().isRequired('Chat name is required'),
    description: StringType().isRequired('description is required')

})

const CreateRoomBtnModal = () => {

const {isOpen,open,close}=useModalState();
const [formValue,setFormValue]=useState(INITIAL_FORM);
const [isLoading ,setIsLoading]=useState(false);
const formRef=useRef();


const onFormChange=useCallback((value)=>{
    setFormValue(value);
},[])

const onSubmit=async ()=>{
    if(!formRef.current.check()){
        return;
    }
    setIsLoading(true);
    const newRoomData={
        ...formValue,
        createdAt:firebase.database.ServerValue.TIMESTAMP
    }

    try {
        await database.ref('rooms').push(newRoomData);
        Alert.info(`${formValue.name} has been created`,4000);
        setIsLoading(false);
        setFormValue(INITIAL_FORM);
        close();
        
        
    } catch (error) {
        setIsLoading(false);
        Alert.error(error.message,4000);
    }
}

  return (
    <div className='mt-1'>
        
        <Button block color='green' onClick={open}>
            <Icon icon="creative"/> Create new Chat room
        </Button>
        <Modal show={isOpen} onHide={close} >
            <Modal.Header>
                <Modal.Title>
                    New Chat room
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form fluid onChange={onFormChange} formValue={formValue} model={modal} ref={formRef}>
                    <FormGroup className=''>
                        <ControlLabel>
                                Room name
                        </ControlLabel>
                        <FormControl name="name" placeholder="Enter the chat room name ..."/>
                    </FormGroup>

                    <FormGroup>
                    <ControlLabel>
                                Description
                    </ControlLabel>
                    <FormControl componentClass="textarea"  rows={5} name="description" placeholder="Type the description here..."/>
                    </FormGroup>


                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button block appearance='primary' onClick={onSubmit} disabled={isLoading}>create new chat room</Button>
            </Modal.Footer>
        </Modal>
    </div>
  )
}

export default CreateRoomBtnModal
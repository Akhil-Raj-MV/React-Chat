import React, { useState } from 'react'
import { useParams } from 'react-router';
import { Alert, Button, Icon ,InputGroup, Modal,Uploader} from 'rsuite'
import {useModalState} from '../../../misc/custom.hook'
import { storage } from '../../../misc/firebase';


const MAX_FILE_SIZE = 1000 * 1024 * 5;

const AttachmentBtnModal = ({afterUpload}) => {

    const {isOpen,open,close}=useModalState();
    const [isLoading,setIsLoading]=useState(false);
    const [fileList,setFileList]=useState([]);
    const {chatId}=useParams();

    const onChange=(fileArr)=>{
        const filtered=fileArr.filter((e)=>e.blobFile.size<=MAX_FILE_SIZE).slice(0,5);

        setFileList(filtered);
    };


    const onUpload= async ()=>{
        try {
            setIsLoading(true);
            const uploadPromises =fileList.map((f)=>{
                return storage
                .ref(`/chat/${chatId}`)
                .child(Date.now()+f.name)
                .put(f.blobFile,{
                    cacheControl:`public, max-age=${3600*24*3}`
                })
            })

            const uploadSnapShots=await Promise.all(uploadPromises);

            const shapePromises=uploadSnapShots.map(async snap=>{
                return(
                    {
                        contentType:snap.metadata.contentType,
                        name:snap.metadata.name,
                        url: await snap.ref.getDownloadURL()
                    }
                )

            })

            const files=await Promise.all(shapePromises);

            await afterUpload(files);

            setIsLoading(false);
            close();





            
        } catch (error) {
            setIsLoading(false);
            Alert.error(error.message,4000);
        }
    }

  return (
    <>
        <InputGroup.Button onClick={open}>
                <Icon icon='attachment'/>
        </InputGroup.Button>

        <Modal show={isOpen} onHide={close}>
            <Modal.Header>
                <Modal.Title>Upload your files here</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                    <Uploader
                    autoUpload={false}
                    action=""
                    fileList={fileList}
                    onChange={onChange}
                    multiple
                    listType="picture-text"
                    className="w-100"
                    disabled={isLoading}
                />
            </Modal.Body>

            <Modal.Footer>
                <Button block disabled={isLoading} onClick={onUpload}>Send</Button>
                <small className='text-right mt-2'>
                    * only files less than 5 MB are allowed
                </small>
            </Modal.Footer>
        </Modal>



    </>
  )
}

export default AttachmentBtnModal
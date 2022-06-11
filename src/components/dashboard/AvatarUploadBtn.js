import React, { useState,useRef } from 'react'
import {Alert, Button, Modal} from 'rsuite'
import AvatarEditor from 'react-avatar-editor'
import {useModalState} from '../../misc/custom.hook'
import { database, storage } from '../../misc/firebase';
import {useProfile} from '../../context/profile.context'
import ProfileAvatar from '../ProfileAvatar';
import { getUserUpdates } from '../../misc/helpers';


const fileInputTypes=".png, .jpeg, .jpg";

const acceptedFileTypes=['image/png','image/jpeg' ,'image/pjpeg']

const isValidFile=(file)=>{
    return acceptedFileTypes.includes(file.type)
}

const getBlob=(canvas)=>{
        return new Promise((resolve,reject)=>{
            canvas.toBlob((blob)=>{
                if(blob){
                    resolve(blob);
                }else{
                    reject(new Error("File process error, Try again"))
                }
            })
        })
}
const AvatarUploadBtn = () => {

    const {isOpen,open,close}=useModalState();
    const [img,setImg]=useState(null);
    const [isLoading,setIsLoading]=useState(false);
    const AvatarEditorRef=useRef();
    const {profile} =useProfile();

    const onFileInputChange=(ev)=>{
        const currentFiles=ev.target.files;

        if(currentFiles.length===1){
            const file=currentFiles[0];
            if(isValidFile(file)){
                    
                setImg(file);
                
                open();
            } else{
                Alert.warning(`wrong file type ${file.type}`,4000)
            }
        }

    }

    const onUploadClick=async()=>{
            const canvas=AvatarEditorRef.current.getImageScaledToCanvas();
            try {
                setIsLoading(true);
                const blob=await getBlob(canvas);
                const avatarFileRef=storage.ref(`/profiles/${profile.uid}`).child('avatar');
                const uploadAvatarResult=await avatarFileRef.put(blob,{
                    cacheControl:`public,max-age=${3600*24*3}`
                });
                const downloadUrl=await uploadAvatarResult.ref.getDownloadURL();

                const updates = await getUserUpdates(
                    profile.uid,
                    'avatar',
                    downloadUrl,
                    database
                  );
            
                  await database.ref().update(updates);
            
                Alert.info('Avatar has been uploaded',4000);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                Alert.error(error.message,4000);
            }
    }

  return (
    <div className='mt-3 text-center'>

        <ProfileAvatar src={profile.avatar} name={profile.name} className="width-200 height-200 img-fullsize font-huge" />

        <div>
            <label 
                htmlFor='avatar-upload' 
                className='d-block cursor-pointer paddded ' >
                Select new Avatar
                <input id='avatar-upload' type='file' className='d-none' accept={fileInputTypes}
                onChange={onFileInputChange} />
            </label>

            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                    <Modal.Title>
                        Upload the avatar
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                      <div  className='d-flex justify-content-center align-item-center h-100'>
                      {img && 
                       <AvatarEditor
                       ref={AvatarEditorRef}
                       image={img}
                       width={200}
                       height={200}
                       border={10}
                       borderRadius={100}
                       rotate={0}
                     />}
                      </div>
                </Modal.Body>

                <Modal.Footer>
                        <Button appearance='ghost' block onClick={onUploadClick} disabled={isLoading} > 
                            upload new avatar
                        </Button>
                </Modal.Footer>
            </Modal>
        </div>
    </div>
  )
}

export default AvatarUploadBtn
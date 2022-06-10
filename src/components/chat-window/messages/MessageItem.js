import React, { memo } from 'react';
import { Button } from 'rsuite';
import { useCurrentRoom } from '../../../context/current.room.context';
import { useHover, useMediaQuery } from '../../../misc/custom.hook';
import { auth } from '../../../misc/firebase';
import PresenceDot from '../../PresenceDot';
import ProfileAvatar from '../../ProfileAvatar';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';
import IconBtnControl from './IconBtnControl'


const MessageItem = ({ message,handleAdmin,handleLike,handleDelete }) => {
  const { author,text,likes,likeCount } = message;

  const [selfRef,isHovered]=useHover();
  const isMobile= useMediaQuery(('max-width:992px'));

  const canShowIcons=isMobile || isHovered


  const isAdmin=useCurrentRoom(v=>v.isAdmin);
  const admins=useCurrentRoom(v=>v.admins);

  const isMsgAuthorAdmin=admins.includes(author.uid);
  
  const isAuthor=auth.currentUser.uid===author.uid;

  const canGrantAdmin =isAdmin && !isAuthor;

  const isLiked= likes && Object.keys(likes).includes(auth.currentUser.uid);

  return (
    <li className={`padded mb-1 cursor-pointer ${isHovered?'bg-black-02':''}`} ref={selfRef}>
      <div className="d-flex align-items-center font-bolder mb-1">
        <PresenceDot uid={author.uid}/>
        
        <ProfileAvatar
          src={author.avatar}
          name={author.name}
          className="ml-1"
          size="xs"
        />
         <ProfileInfoBtnModal
          profile={author}
          appearance="link"
          className="p-0 ml-1 text-black"
          >
          {canGrantAdmin && 
              <Button block onClick={()=>
                    handleAdmin(author.uid)
              } color='blue' >
                  {isMsgAuthorAdmin?'Remove admin permission':'Give admin permission'}
              </Button>
          }
          </ProfileInfoBtnModal>

          <IconBtnControl
            // eslint-disable-next-line no-constant-condition
            {...(isLiked?{color:'red'}:{})}
            isVisible={canShowIcons}
            iconName="heart"
            tooltip="Like"
            onClick={()=>handleLike(message.id)}
            badgeContent={likeCount}

            />

            {isAuthor &&
              <IconBtnControl
              // eslint-disable-next-line no-constant-condition
              isVisible={canShowIcons}
              iconName="close"
              tooltip="Delete this message"
              onClick={()=>handleDelete(message.id)}
              />
            }

            

        <span className="ml-2">{author.name}</span>
      </div>

      <div>
        <span className="word-breal-all">{text}</span>
      </div>
    </li>
  );
};

export default memo(MessageItem);
import React from 'react'

const RoomItem = ({room}) => {

  const {name} =room;

  return (
    <div>
        <div className='d-flex justify-content-between align-items-center'>
            <h3 className='text-disappear'>{name}</h3>

        </div>
        <div className='d-flex align-items-center text-black-70'>
            <span>No messages yet</span>
        </div>
    </div>
  )
}

export default RoomItem
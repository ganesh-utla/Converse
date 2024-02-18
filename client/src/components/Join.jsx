import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { generateRoomID } from '../utils';

const Join = () => {

  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isCreateRoom, setIsCreateRoom] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isCreateRoom) {
      const room = generateRoomID();
      navigate(`/chat?name=${name}&roomId=${room}`)
    } else {
      navigate(`/chat?name=${name}&roomId=${roomId}`)
    }
  }

  return (
    <div className='w-full h-screen flex justify-center items-center p-2'>
      <form 
        className='w-full max-w-sm flex flex-col gap-3 items-center'
        onSubmit={handleSubmit}
      >
        <div className='flex flex-col mb-2'>
          <div className='flex justify-center items-center gap-5'>
            <img 
              src="/assets/logo.png"
              alt="logo"
              className='w-12 h-12 object-contain'
            />
            <h2 className='text-3xl font-bold'>
              Converse
            </h2>
          </div>
          <p className='text-center'>
            Improve conversations and share your moments. So let's converse better.
          </p>
        </div>
        <hr className='w-full h-0 border border-light-4' />
        <input
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='join-input'
          placeholder='Username'
        />
        {!isCreateRoom && (
          <input
            type='text'
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className='join-input'
            placeholder='RoomID'
          />
        )}
        <button
          type='submit'
          className='join-button'
          disabled={name==="" || (!isCreateRoom && roomId==="")}
        >
          {`${isCreateRoom? 'Create' : 'Join'} Room`}
        </button>
        <p>
          {isCreateRoom? 'Already created a room? ' : 'Wanna create a room? '}
          <span 
            className='text-primary-500 cursor-pointer underline'
            onClick={() => setIsCreateRoom(prev => !prev)}
          >
            {isCreateRoom? 'Join' : 'Create'}
          </span>
        </p>
      </form>
    </div>
  )
}

export default Join
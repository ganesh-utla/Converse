import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Join = () => {

  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/chat?name=${name}&roomId=${roomId}`)
  }

  return (
    <div className='w-full h-screen flex justify-center items-center p-2'>
      <form 
        className='w-full max-w-sm flex flex-col gap-3 items-center'
        onSubmit={handleSubmit}
      >
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
        <hr className='w-full h-0 border border-light-4' />
        <input
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='join-input'
          placeholder='Username'
        />
        <input
          type='text'
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className='join-input'
          placeholder='RoomID'
        />
        <button
          type='submit'
          className='join-button'
          disabled={name==="" || roomId===""}
        >
          Join
        </button>
      </form>
    </div>
  )
}

export default Join
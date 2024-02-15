import React from 'react'
import { useNavigate } from 'react-router-dom'
import ScrollToBottom from 'react-scroll-to-bottom';

const Messages = ({ activeMembers=1, username, messages }) => {

  const navigate = useNavigate();
  
  return (
    <div className='w-full bg-light-3 h-[75%] rounded-lg flex flex-col'>
      <div className='w-full bg-primary-500 flex justify-between items-center p-3 rounded-t-lg'>
        <div className='flex gap-2 items-center flex-wrap'>
          <img
            src='/assets/dot.svg'
            alt="active"
            className='object-contain w-5 h-5 cursor-pointer'
          />
          <p>
            {username}
          </p>
          <p className='text-sm'>
            {`(${activeMembers} active users)`}
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm("Leave the chat?")) {
              navigate('/');
            }
          }}
        >
          <img
            src='/assets/close.svg'
            alt="close"
            className='object-contain w-5 h-5 cursor-pointer'
          />
        </button>
      </div>

      {messages.length > 0? (
        <ScrollToBottom className='p-2 pr-1 overflow-auto flex-grow'>
        {messages.map((mes, index) => {
          if (mes.user==='admin') 
            return (
              <div key={index} className='w-full flex justify-center mt-1 pr-1'>
                <div className='bg-gray-1 rounded-full px-4 py-1'>
                  <p className='text-sm'>{mes.text}</p>
                </div>
              </div>
            )
          return (
            <div key={index} className={`flex mt-1 ${mes.user===username? 'justify-end pr-1' : 'justify-start'}`}>
              <div className={`sm:max-w-[60%] px-3 py-2 ${mes.user===username? 'bg-primary-500 rounded-l-lg rounded-br-lg' : 'bg-gray-2 rounded-r-lg rounded-bl-lg'} `}>
                {mes.user!==username && (
                  <p className='text-sm text-light-4 underline'>
                    {mes.user}
                  </p>
                )}
                {mes.text? (
                  <p className='break-all'>
                    {mes.text}
                  </p>
                ) : (
                  <img
                    src={mes.file}
                    alt={mes.user}
                    className='w-full max-h-[500px] max-w-[300px] object-contain aspect-auto rounded-lg'
                  />
                )}
              </div>
            </div>
          )
        })}
        </ScrollToBottom>
      ) : (
        <div className='flex h-full items-center justify-center'>
          <p className='text-gray-1'>
            No conversation found
          </p>
        </div>
      )}
    </div>
  )
}

export default Messages
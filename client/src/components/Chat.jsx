import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { io } from 'socket.io-client';
import Messages from './Messages';

let socket;

const Chat = () => {

  const location = useLocation();
  const { name, roomId } = queryString.parse(location.search);
  const username = name.toLowerCase().split(' ').join('_');
  const room = roomId.trim().toLowerCase();
  const serverURL = import.meta.env.VITE_SERVER_ORIGIN;

  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [activeUsers, setActiveUsers] = useState(1);
  const hiddenFileInput = useRef(null); 
  
  useEffect(() => {
    socket = io(serverURL);

    socket.emit('join', { name, roomId }, () => {

    });

    return () => {
      socket.disconnect();
      socket.off();
    }
  }, [location.search]);

  useEffect(() => {
    socket.on('message', message => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  useEffect(() => {
    socket.on('roomData', data => {
      setActiveUsers((data.users.length))
    });
  }, [activeUsers]);

  const handleCopy = () => {
    navigator.clipboard.writeText(room);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit('sendMessage', {message}, () => setMessage(''));
    }
  }

  const handleInputClick = async (e) => {
    if (e.key==='Enter')
      handleSendMessage(e);
    else if (e.ctrlKey && e.key==='v')
      await pasteImg();
  }

  const handleClick = (event) => {
    hiddenFileInput.current.click();   
  };

  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    if (!fileUploaded) return;
    getBase64(fileUploaded, (res) => {
      socket.emit('sendMessage', {file: res}, () => {});
    });
  };

  const getBase64 = (file, cb) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(reader.result)
    };
  }

  const pasteImg = async ()=> {
    try {
        const clipboardItems = await navigator.clipboard.read();
        const data = await clipboardItems[0].getType('image/png');
        getBase64(data, (res) => {
          socket.emit('sendMessage', {file: res}, () => {});
        })
    } catch(e) {
        console.log(e);
    }
  }

  return (
    <div className='w-full h-screen flex justify-center items-center p-2'>
      <div className='w-full h-full max-w-3xl p-2 flex flex-col justify-center items-center gap-2'>
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
        <div className='flex gap-1'>
          <p>
            {`(Room ID: ${room}`}
          </p>
          <img
            src={`/assets/${copied?'copy-check':'copy'}.svg`}
            alt="copy"
            className='object-contain w-5 h-5 cursor-pointer'
            onClick={handleCopy}
          />
          <p>
            {`)`}
          </p>
        </div>

        <Messages username={username} messages={messages} activeMembers={activeUsers} />

        <div className='w-full flex items-center gap-2'>
          <input
            type='text'
            className='chat-input'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Type something...'
            onKeyDown={handleInputClick}
          />

          <div>
            <button 
              className="chat-button"
              onClick={handleClick}
            >
              <img
                src="/assets/attach.svg"
                alt="attach"
                className='object-contain w-7 h-7'
              />
            </button>
            <input 
              type="file"
              onChange={handleChange}
              ref={hiddenFileInput}
              style={{display:'none'}}
              accept='image/*'
            />
          </div>
            
          <button 
            className='chat-button'
            onClick={(e) => handleSendMessage(e)}
            disabled={message===""}
          >
            <img
              src="/assets/send.svg"
              alt="send"
              className='object-contain w-7 h-7'
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat
/* ========== EXTERNAL MODULES ========== */
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { FaCommentAlt, FaChevronDown } from "react-icons/fa";

/* ========== INTERNAL MODULES ========== */
import Chat from '../components/Chat';
import logo from '../assets/images/logo.png';
import './ChatRoom.css';

/* ========== EXPORTS ========== */
export default function ChatRoom() {

  /* --- STATE HOOKS --- */
  const [ userName, setUserName ] = useState('');
  const [ room, setRoom ] = useState('123');
  const [ showChat, setShowChat ] = useState(false);
  const [ isLoggedIn, setIsLoggedIn] = useState(false);

  // console.log(location.search);
  const socket = io.connect('http://localhost:3001');

  /* --- LIFECYCLE METHODS --- */
  useEffect(() => {
    if(room !== '') {
      socket.emit('joinRoom', room)
    };
  },[socket, room])

  /* --- EVENT HANDLERS --- */
  const handleJoinRoom = event => {
    event.preventDefault();
    setIsLoggedIn(true);
    if (userName !== '' && room === '') {
      const createUniqueRoom = () => {
        return [...Array(12)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      }

      let newRoom = createUniqueRoom();
      setRoom(newRoom);
    }
  }

  const handleToggleChat = () => {

    setShowChat(prev => !showChat)
  };

  const handleUserName = ({ target: { value } }) => {
    setUserName(value);
  }


  const handleShareCode = () => {}; // creates and sends link of code to person in chat

  /* --- RENDER METHODS --- */

  const renderChatButton = () => {
    if (!showChat) {
      return (
        <button
          className='ChatRoom_button___open'
          onClick={handleToggleChat}
        >
          Having Trouble? <FaCommentAlt style={{transform: 'scale(1.5)'}} />
        </button>
      )
    } else {
      return (
        <button
          className='ChatRoom_button___close'
          onClick={handleToggleChat}
        >
          <FaChevronDown style={{transform: 'scale(1.5)'}} />
        </button>
      )
    }
  };

  const renderLogin = () => {
    if (!isLoggedIn) {
      return (
        <form className='ChatRoom_form'>
          <div className='ChatRoom_loginHeader'>
            <img src={logo} alt="Company Logo" className="ml-4 h-[6vh]" />
            <p>Enter a User Name to start chatting with us</p>
          </div>
          <div className='ChatRoom_inputContainer'>
            <label for='userName'>User Name:
            </label>
              <input
                type='text'
                id='userName'
                placeholder='User Name'
                onChange={handleUserName}
                required
              />
            <button className='ChatRoom_button___login' onClick={handleJoinRoom}>Login</button>
          </div>
          <div className='ChatRoom_loginFooter'>
            <p className='ChatRoom_loginNotice'>Using the chat feature will send a copy of your code to our team</p>
          </div>
        </form>
      )
    } else {
      return <></>
    }
  }

  /* --- RENDERER --- */
  return (
    <>
      <div className={`ChatRoom_container___${showChat ? 'open' : 'close'}`}>
        {renderLogin()}
        <Chat socket={ socket } userName={ userName } room={ room } isLoggedIn={isLoggedIn}/>
      </div>
      {renderChatButton()}
    </>
  )
}
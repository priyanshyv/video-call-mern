import React, { useCallback, useEffect } from 'react'
import { useState } from 'react'
import {useSocket} from '../context/SocketProvider'
import { useNavigate } from 'react-router-dom'

const LobbyScreen = () => {
  const [email,setEmail] = useState('');
  const [room,setRoom] = useState('');

  const socket = useSocket();
  const navigate = useNavigate();


  const handleSubmitForm = useCallback((e)=> {
    e.preventDefault();
    socket.emit('room:join',{email,room})
  },[email,room,socket])

const handleJoinRoom = useCallback((data)=>{
    const {email,room} = data;
    navigate(`/room/${room}`);
},[navigate])

//useEffect->allows you to set up the event listener and clean it up when the component unmounts or when the socket object changes.
useEffect(()=>{
  //listener
  //basically backend sey room join ka event aata hai
  socket.on('room:join',handleJoinRoom);
  //deregister a listner
  return () =>{
    socket.off('room:join')
  }
},[socket,handleJoinRoom])

  return (
    <div>
      <h1>Lobby</h1>
      <form onSubmit={handleSubmitForm}>
      <label htmlFor="email">Email Id</label>
      <input type="email" id="email" placeholder='enter your email' value={email} onChange={(e)=>setEmail(e.target.value)} />
      <br /><br />
      <label htmlFor="roomno">Room Number</label>
      <input type="text" id='roomno' placeholder='enter room number' value={room} onChange={(e)=>setRoom(e.target.value)} />
      <br />
      <button>Join</button>
      </form>
    </div>
  )
}

export default LobbyScreen

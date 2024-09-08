//yei provider mere poorey project ko socket ka access dega
import React, { useContext, useMemo } from 'react'
import {io} from 'socket.io-client'
import { createContext } from 'react'
const SocketContext = createContext(null);

// This is a custom React hook named useSocket.It uses the useContext hook to retrieve
// the socket object from the SocketContext and returns it. This allows 
//any component that uses this hook to access the socket object.
export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
  };
//ab jaha bhi hamey socket ka use karna hoga hamm directly
//waha use socket likhenge and we are good to go

export const SocketProvide = (props) => {
    const socket = useMemo(()=>io('https://video-call-mern.onrender.com/'),[])
    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}

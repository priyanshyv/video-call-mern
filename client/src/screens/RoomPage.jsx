import React, { useCallback, useEffect ,useState} from 'react'
import ReactPlayer from 'react-player'
import peer from '../service/peer'
import { useSocket } from '../context/SocketProvider'

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId,setRemoteSocketId] = useState(null);
  const [myStream,setMyStream] = useState();
  const [remoteStream,setRemoteStream] = useState();

  const handleUserJoined = useCallback(({email,id})=>{
      console.log(`Email ${email} joined the room`);
      //jab dusra user jopin karega tab mai bol dunga
      setRemoteSocketId(id);
  },[])


    const handleCallUser = useCallback(async()=>{

      
      //jab bhi ham kisi ko call karre hai toh hameny apni stream ko on kara 
      //1.apni stream ko on kara 
      //2.apni kudhi ek offer ko banaya
      //3.hamm uss offer ko dusrey user ke paas bhej denge


          const stream = await navigator.mediaDevices.getUserMedia({
            audio:true,
            video:true
          });

          const offer = await peer.getOffer();
          socket.emit("user:call",{to:remoteSocketId,offer});
          setMyStream(stream);
    },[remoteSocketId,socket])

    const handleIncommingCall = useCallback(async ({from,offer})=>{
      setRemoteSocketId(from);
      //incomming call waley ki bhi stream on kardi
      const stream = await navigator.mediaDevices.getUserMedia({
        audio:true,
        video:true
      });
      setMyStream(stream);
      console.log(`incoming call`,from,offer);
      const ans = await peer.getAnswer(offer);
      socket.emit('call:accepted',{to:from,ans});
    },[socket])

    const sendStreams = useCallback(() => {
      for (const track of myStream.getTracks()) {
        peer.peer.addTrack(track, myStream);
      }
    }, [myStream]);

    const handleCallAccepted = useCallback(({from,ans})=>{
          peer.setLocalDescription(ans);
          console.log('call accepted!!!!');
          sendStreams();
    },[sendStreams])

    const handleNegoNeeded = useCallback(async ()=>{
      const offer = await peer.getOffer();
      socket.emit("peer:nego:needed",{offer , to: remoteSocketId});
  },[remoteSocketId,socket])

    useEffect(()=>{
      peer.peer.addEventListener('negotiationneeded',handleNegoNeeded);
      return ()=>{
        peer.peer.removeEventListener('negotiationneeded',handleNegoNeeded);
      }
    },[handleNegoNeeded])

    const handleNegoNeedIncomming = useCallback(async ({from,offer})=>{
        const ans = await peer.getAnswer(offer);
        socket.emit('peer:nego:done',{to: from,ans});
    },[socket])

    const handleNegoNeedFinal = useCallback(async ({ans})=>{
      await peer.setLocalDescription(ans);
    },[])


    useEffect(()=>{
      peer.peer.addEventListener('track',async (ev) =>{
          const remoteStream = ev.streams;
          console.log("got tracks");
          setRemoteStream(remoteStream[0]);
      })
    },[])

  useEffect(()=>{
    //yei backend sey aaya hai
      socket.on("user:joined",handleUserJoined);
      socket.on("incomming:call",handleIncommingCall);
      socket.on("call:accepted",handleCallAccepted);
      socket.on('peer:nego:needed',handleNegoNeedIncomming);
      socket.on("peer:nego:final",handleNegoNeedFinal);
      //deregisted
      return ()=>{
          socket.off("user:joined",handleUserJoined);
          socket.off("incomming:call",handleIncommingCall);
          socket.off("call:accepted",handleCallAccepted);
          socket.off('peer:nego:needed',handleNegoNeedIncomming);
          socket.off("peer:nego:final",handleNegoNeedFinal);
      }
  },[socket,handleUserJoined,handleIncommingCall,handleCallAccepted,handleNegoNeedIncomming,handleNegoNeedFinal])


  return (
    <div>
      <h1>Room page</h1>
      <h4>{remoteSocketId ? "connected" : "No one in room"}</h4>
      {myStream && <button onClick={sendStreams}>Send Stream</button>}
      {
        // call button ko tabhi render karenge tab socket id hogi thats mean dusra insaan uss room mei hoga tabhi
        remoteSocketId && <button onClick={handleCallUser}>CALL</button>
      }
      {
        //agr myStream hai toh ham react-player ko render kar denge
        myStream &&(
          <>
        <h1>My Stream</h1>
        <ReactPlayer 
        playing 
        muted
        height={300}
        width={300} 
        url={myStream}></ReactPlayer>
        </>
        )
      }
      {
        remoteStream &&(
          <>
        <h1>Remote Stream</h1>
        <ReactPlayer 
        playing 
        muted
        height={300}
        width={300} 
        url={remoteStream}></ReactPlayer>
        </>
        )
      }
    </div>
  )
}

export default RoomPage

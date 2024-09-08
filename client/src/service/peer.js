class PeerService{
    constructor(){
        if(!this.peer){
            this.peer = new RTCPeerConnection({
                    iceServers:[{
                        urls:[
                            'stun:stun.l.google.com:19302',
                            'stun:global.stun.twilio.com:3478',
                        ],
                    }]
            })
        }
    }

    //It's used in WebRTC to respond to an incoming offer with an answer.
    //similar to sent offer
    async getAnswer(offer){
        if(this.peer){
            await this.peer.setRemoteDescription(offer);
            const ans = await this.peer.createAnswer();
            await this.peer.setLocalDescription(new RTCSessionDescription(ans));
            return ans;
        }
    }

    async setLocalDescription(ans) {
        if (this.peer) {
          await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
        }
      }

    async getOffer(){
        if(this.peer){
            const offer = await this.peer.createOffer();
            await this.peer.setLocalDescription(new RTCSessionDescription(offer));
            return offer;
        }
    }
}

export default new PeerService();

//ICE (Interactive Connectivity Establishment) servers: 
//When a user wants to initiate a video call, their browser doesn't know the IP address of the other user. To overcome this, the browser
//uses ICE servers (like the ones specified in the iceServers array in the code) to discover the IP addresses of both users.


//SDP (Session Description Protocol): 
//Once the IP addresses are discovered, the browsers create an SDP offer, which contains information about the user's media capabilities (e.g., video and audio codecs, resolution, etc.).



//Offer and Answer: 
//The SDP offer is sent to the other user, who then creates an SDP answer, which contains their own 
//media capabilities. The SDP answer is sent back to the original user.

//Connection establishment: 
//Once both users have exchanged SDP offers and answers, they can establish a 
//peer-to-peer connection using WebRTC. This connection allows them to communicate with each other directly, without the need for intermediaries.
//So, in the context of the PeerService class, the getOffer method creates an SDP offer, which is then sent to the other user to initiate the connection process.
// // CallHandler.js
// import { io } from 'socket.io-client';
// import Peer from 'react-native-peerjs';

// export class CallHandler {
//   constructor(userId) {
//     this.socket = io('http:localhost:3000/api/calls');
//     this.peer = new Peer();
//     this.userId = userId;
//     this.setupSocketListeners();
//   }

//   setupSocketListeners() {
//     this.socket.on('connect', () => {
//       this.socket.emit('register', this.userId);
//     });

//     this.socket.on('incoming-call', ({ from, signal, type }) => {
//       // Handle incoming call
//       if (this.onIncomingCall) {
//         this.onIncomingCall(from, signal, type);
//       }
//     });

//     this.socket.on('call-accepted', (signal) => {
//       // Handle call acceptance
//       if (this.onCallAccepted) {
//         this.onCallAccepted(signal);
//       }
//     });

//     this.socket.on('call-rejected', () => {
//       // Handle call rejection
//       if (this.onCallRejected) {
//         this.onCallRejected();
//       }
//     });

//     this.socket.on('call-ended', () => {
//       // Handle call end
//       if (this.onCallEnded) {
//         this.onCallEnded();
//       }
//     });
//   }

//   async initiateCall(userToCall, type) {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: type === 'video',
//         audio: true
//       });

//       const call = this.peer.call(userToCall, stream);
      
//       call.on('stream', (remoteStream) => {
//         // Handle remote stream
//         if (this.onStreamReceived) {
//           this.onStreamReceived(remoteStream);
//         }
//       });

//       this.socket.emit('call-user', {
//         userToCall,
//         from: this.userId,
//         type
//       });

//       return stream;
//     } catch (error) {
//       console.error('Error initiating call:', error);
//       throw error;
//     }
//   }

//   async answerCall(from, incomingSignal) {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true
//       });

//       this.socket.emit('answer-call', {
//         to: from,
//         signal: incomingSignal
//       });

//       return stream;
//     } catch (error) {
//       console.error('Error answering call:', error);
//       throw error;
//     }
//   }

//   rejectCall(from) {
//     this.socket.emit('reject-call', { to: from });
//   }

//   endCall(to) {
//     this.socket.emit('end-call', { to });
//   }

//   cleanup() {
//     if (this.socket) {
//       this.socket.disconnect();
//     }
//     if (this.peer) {
//       this.peer.destroy();
//     }
//   }
// }


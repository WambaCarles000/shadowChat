const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Join chatroom
const socket = io();

function showError(message) {

  const diverror = document.getElementsByClassName('error-message');

  
  console.log('Script main.js is running');

  console.log('message',diverror);

  if (diverror) {
    diverror.innerText = message;
    alert(message);
   
  } else {
    console.error("Element with ID 'error-message' not found.");
  }

 }
 document.addEventListener('DOMContentLoaded',function() {

//   const joinForm = document.getElementById('join-form');

//   joinForm.addEventListener('submit', function (e) {
//     e.preventDefault();});
  socket.emit('joinRoom', { username, room },(error)=>{
   console.log('Join Room callback received');
   if(error){
     console.log('Error:', error);
   showError(String(error));
   window.location.href = '/index.html';

   }else {
    // Émettre un message vers le serveur pour rediriger le client
    socket.emit('redirect', '/chat.html');
     console.log('User joined successfully');
      }
  
   
   
  });
   });


// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit

document.addEventListener('DOMContentLoaded',function() {

chatForm.addEventListener('submit', (e) => {

 // Empêche le comportement par défaut de la soumission du formulaire
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  //laisser le pointeur sur le champs(garder le focus)
  e.target.elements.msg.focus();
});
});

// Output message to DOM
function outputMessage(message) {
  //creation d'un div 

  const div = document.createElement('div');

  //on lui fourit le nom de classe message 
  div.classList.add('message');

  // creation du premier paragraphe qui contient le nom de l'expediteur et de l'heure courante
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  
// creation du deuxieme paragraphe qui va contenir le message
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});


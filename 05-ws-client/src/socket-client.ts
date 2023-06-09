// Instalamos un paquete que nos sirve para conectarnos a un servidor de websocket io, para emitir mensajes...
// yarn add socket.io-client
//
// IMPORTANTE: La versión de socket.io-client debe ser la misma que la versión de socket.io de la parte servidor.
// La versión del servidor aparece en: http://localhost:3001/socket.io/socket.io.js
import { Manager, Socket } from 'socket.io-client';

let socket: Socket;

export const connectToServer = (token: string) => {
  // Trabajamos con el mánager porque nos da más flexibilidad y poder. La otra opción es trabajar con io directamente.
  //
  // Al establecer la conexión podemos añadir información adicional
  // NOTA IMPORTANTE: Para el despligue en Producción, habrá que cambiar esta ruta por la que indique el servicio
  //    donde lo vayamos a subir. Ejemplo: https://teslo-nest.herokuapp.com/socket.io/socket.io.js
  const manager = new Manager('http://localhost:3001/socket.io/socket.io.js', {
    extraHeaders: {
      hola: 'mundo',
      authentication: token,
    },
  });

  // Se pueden eliminar todos los listeners sobre el socket. Esto es importante porque cada vez que intentamos
  // establecer la conexión se generan si o si los listeners.
  //
  // Si el server desconecta, sigo teniendo el problema de que los listeners actuales siguen en memoria.
  // Para solucionar esto, saco la declaración de la variable socket fuera de la función y pregunto si existe
  // el socket para borrar los listeners anteriores antes de crear los nuevos.
  socket?.removeAllListeners();

  // Para conectarnos indicamos el namespace (la casa), en este caso el root /
  // Adicionalmente se va a conectar a otro namespace que va a tener el id del cliente.
  // El socket generado es la comunicación activo - activo con el servidor.
  // Indicar que todos los clientes estarán conectados al servidor y el servidor a su vez está conectado a todos los clientes.
  socket = manager.socket('/');

  // Para ver más información del socket que está conectado.
  // La información más útil está en socket.io, que es la del Manager.
  // console.log({ socket });

  // Este socket que se envía a la función hay que quitarlo porque ya lo tenemos global.
  // Si lo dejamos vemos que no funciona la recepción del mensaje, es decir, escribo un mensaje y no aparece
  // escrito.
  // Esto es porque el socket que aparece en esta función no es el nuevo a nivel global, fuera de la función, existente,
  // sino uno anterior. Es un problema de scope.
  //
  //addListeners(socket);
  addListeners();
};

//const addListeners = (socket: Socket) => {
const addListeners = () => {
  const clientsUl = document.querySelector('#clients-ul')!;
  const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
  const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;
  const messagesUl = document.querySelector<HTMLUListElement>('#messages-ul')!;
  const serverStatusLabel = document.querySelector('#server-status')!;

  // Escuchar eventos que vienen del servidor: socket.on
  socket.on('connect', () => {
    serverStatusLabel.innerHTML = 'CONNECTED';
  });

  socket.on('disconnect', () => {
    serverStatusLabel.innerHTML = 'DISCONNECTED';
  });

  // Queremos saber el id de todos los usuarios que están conectados.
  socket.on('clients-updated', (clients: string[]) => {
    let clientsHtml = '';
    clients.forEach((clientId) => {
      clientsHtml += `
        <li>${clientId}</li>
      `;
    });

    clientsUl.innerHTML = clientsHtml;
  });

  // Hablar con el servidor: socket.emit
  // Como tercer argumento se puede ejecutar una función si el servidor hace el trabajo.
  messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (messageInput.value.trim().length <= 0) return;

    socket.emit('message-from-client', {
      id: 'YO!!',
      message: messageInput.value,
    });

    messageInput.value = '';
  });

  socket.on('message-from-server', (payload: { fullName: string; message: string }) => {
    const newMessage = `
      <li>
        <strong>${payload.fullName}</strong>
        <span>${payload.message}</span>
      </li>
    `;

    const li = document.createElement('li');
    li.innerHTML = newMessage;
    messagesUl.append(li);
  });
};

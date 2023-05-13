// Instalamos un paquete que nos sirve para conectarnos a un servidor de websocket io, para emitir mensajes...
// yarn add socket.io-client
//
// IMPORTANTE: La versión de socket.io-client debe ser la misma que la versión de socket.io de la parte servidor.
// La versión del servidor aparece en: http://localhost:3001/socket.io/socket.io.js
import { Manager, Socket } from 'socket.io-client';

export const connectToServer = () => {
  // Trabajamos con el mánager porque nos da más flexibilidad y poder. La otra opción es trabajar con io directamente.
  const manager = new Manager('http://localhost:3001/socket.io/socket.io.js');

  // Para conectarnos indicamos el namespace (la casa), en este caso el root /
  // Adicionalmente se va a conectar a otro namespace que va a tener el id del cliente.
  // El socket generado es la comunicación activo - activo con el servidor.
  // Indicar que todos los clientes estarán conectados al servidor y el servidor a su vez está conectado a todos los clientes.
  const socket = manager.socket('/');

  // Para ver más información del socket que está conectado.
  // La información más útil está en socket.io, que es la del Manager.
  // console.log({ socket });

  addListeners(socket);
};

const addListeners = (socket: Socket) => {
  const serverStatusLabel = document.querySelector('#server-status')!;
  const clientsUl = document.querySelector('#clients-ul')!;

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
};

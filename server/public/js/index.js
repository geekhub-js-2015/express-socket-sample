import 'babel-polyfill';
import io from 'socket.io-client';
import messageTpl from '../../views/partials/message.handlebars';

document.addEventListener('DOMContentLoaded', () => {
    let socket = io.connect('http://localhost:3000/messages');

    document.querySelector('#new-message').addEventListener('submit', (e) => {
        e.preventDefault();
        let message = document.querySelector('#message').value;
        if (message !== "") {
            socket.emit('/new', {
                message
            });
            showMessage(message, true);
            document.querySelector('#message').value = "";
        }
    });

    socket.on('/message', (data) => {
        showMessage(data.message);
    });

    function showMessage(message, me) {
        document.querySelector('#messages').innerHTML += messageTpl({message, me});
    }
});

const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const usuarios = new Usuarios();
const { crearMensaje } = new require('../utilidades/utilidades');

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            })
        }

        //Conectar a un usuario a una sala especifica
        client.join(data.sala);
        // console.log(usuarios.getPersonas());
        usuarios.agregarPersona(client.id, data.nombre, data.sala);
        // console.log(usuarios.getPersonasPorSala(data.sala));
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));
        callback(usuarios.getPersonasPorSala(data.sala));
        console.log(usuarios.getPersonasPorSala(data.sala));
    });

    client.on('crearMensaje', (data)=>{
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, persona.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    });

    client.on('disconnect', ()=>{
        let personaBorrada = usuarios.borrarPersonas(client.id);
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salio del chat`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala());
    });

    //Escucha de mensaje privado. El estara pendiente de quien emite y lo mandara el destinatario
    client.on('mensajePrivado', data=>{
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });

});
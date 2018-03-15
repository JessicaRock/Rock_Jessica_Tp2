let socketio = require('socket.io')

module.exports.listen = function(server){
    let io = socketio.listen(server)

    // ------------------------------ Traitement du socket
    let objUtilisateur = {}
    io.on('connection', function(socket){
    //console.log(socket.id)
////////////////////////////////////////////// TRAITEMENT DE LA CONNECTION DES USERS
    	socket.on('setUser', function(data){
    		objUtilisateur[socket.id] = data.user;
    		console.log(objUtilisateur[socket.id]);
    		console.log(data);
    		socket.emit('valide_user', data);
    		io.sockets.emit('diffuser_liste_user', objUtilisateur);
    	})

///////////////////////////////////////////// TRAITEMENT DES MESSAGES
    	socket.on('setMessage', function(data){
    		console.log(data);
    		data.user = objUtilisateur[socket.id];
    		socket.broadcast.emit('diffuserMessage', data);//emit à tous les utilisateurs (serveur)
    		socket.emit('valideMessage', data);//emit pour nous (client)
    	})

    	socket.on('disconnect', function(){
    		delete objUtilisateur[socket.id];
    		io.sockets.emit('diffuser_destruction_user', objUtilisateur);

    	})
   })
 return io
}
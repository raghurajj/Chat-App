const path=require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const filter = require('bad-words')
const { generateMessage,generateLocationMessage } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

io.on('connection',(socket)=>{  
    console.log('new websocket connection')

    socket.on('join',({username,room})=>{
        socket.join(room)

        socket.emit('message',generateMessage('Welcome!!'))
        socket.broadcast.emit('message',generateMessage('A new user has joined'))

    })


    socket.on('sendMessage',(message,callback)=>{

        const fltr = new filter()
        if(fltr.isProfane(message))
        {
            return callback('Profanity is not allowed')
        }
 
        io.emit('message',generateMessage(message)) 
        callback('Message delivered')
    })

    socket.on('sendLocation',(coords,callback)=>{

        io.emit('locationMessage',generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))

        callback('Location shared!!')
    })

    socket.on('disconnect',()=>{
        io.emit('message',generateMessage('A user has left'))
    })


})

server.listen(port,()=>{  
    console.log(`Server is up on port ${port}!!`)
})
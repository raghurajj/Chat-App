const socket = io()


socket.on('message',(msg)=>{
    console.log(msg)
})


// socket.on('countUpdated',(count)=>{
//    console.log('the count has been Updated ',count) 
// })

document.querySelector('#messageForm').addEventListener('submit',(e)=>{
   // console.log('Clicked')
   e.preventDefault()
   const message = e.target.elements.message.value
   socket.emit('sendMessage',message)
})
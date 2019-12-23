const socket = io()


socket.on('message',(msg)=>{
    console.log(msg)
})


document.querySelector('#messageForm').addEventListener('submit',(e)=>{
   // console.log('Clicked')
   e.preventDefault()
   const message = e.target.elements.message.value
   socket.emit('sendMessage',message,(retmsg)=>{
       console.log(retmsg)
   })
})

document.querySelector('#send-location').addEventListener('click',()=>{
    if(!navigator.geolocation)
    {
        return alert('Geolocation is not supported by your browser')   
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },(retmsg)=>{
            console.log(retmsg)
        })
        //console.log(position.coords.latitude)
    })
})
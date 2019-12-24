const socket = io()

const $messageform = document.querySelector('#messageForm')
const $messageFormInput = $messageform.querySelector('input')
const $messageFormButton = $messageform.querySelector('button')
 
socket.on('message',(msg)=>{
    console.log(msg)
})


$messageform.addEventListener('submit',(e)=>{
   // console.log('Clicked')
   e.preventDefault()

   $messageFormButton.setAttribute('disabled','disabled')

   const message = e.target.elements.message.value
   socket.emit('sendMessage',message,(retmsg)=>{
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value=''
    $messageFormInput.focus()
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
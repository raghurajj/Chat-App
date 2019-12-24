const socket = io()

const $messageform = document.querySelector('#messageForm')
const $messageFormInput = $messageform.querySelector('input')
const $messageFormButton = $messageform.querySelector('button')

const $locationButton = document.querySelector('#send-location')
 
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

$locationButton.addEventListener('click',()=>{

    

    if(!(navigator.geolocation))
    {
        $locationButton.removeAttribute('disabled')
        return alert('Geolocation is not supported by your browser')   
    }
    $locationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },(retmsg)=>{
            $locationButton.removeAttribute('disabled')
            console.log(retmsg)
        })
    })
})
const socket = io()
const $messageform = document.querySelector('#messageForm')
const $messageFormInput = $messageform.querySelector('input')
const $messageFormButton = $messageform.querySelector('button')

const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

const messageTemplate = document.querySelector('#message-template').innerHTML
const lmessageTemplate = document.querySelector('#lmessage-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const { username,room} = Qs.parse(location.search,{ignoreQueryPrefix : true})


socket.on('message',(msg)=>{
    const html = Mustache.render(messageTemplate,{
        message:msg.text,
        createdAt:moment(msg.createdAt).format('hh:mm a'),
        username:msg.username 
    })
    $messages.insertAdjacentHTML('beforeend',html)
})


socket.on('locationMessage',(locationLink)=>{
    const html = Mustache.render(lmessageTemplate,{
        locationLink:locationLink.link,
        createdAt:moment(locationLink.createdAt).format('hh:mm a'),
        username:locationLink.username
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

socket.on('roomData',({room,users})=>{
    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    })

    document.querySelector('#sidebar').innerHTML=html

})


$messageform.addEventListener('submit',(e)=>{
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

socket.emit('join',{username,room},(error)=>{

    if(error)
    {
        alert(error)
        location.href='/'
    }
})
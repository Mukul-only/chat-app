const socket = io();

socket.on('connect', () => {
    console.log('✅ Connected to server successfully!');
});

socket.on('connect_error', (err) => {
    console.error('❌ Socket connection error:', err);
});

const clientsTotal=document.getElementById('clients-total')



const messageContainer=document.getElementById('message-conntainer')
const nameInput=document.getElementById('name-input')

const messageForm=document.getElementById('message-form')

const messageInput=document.getElementById('message-input')

const messagetone=new Audio('/message-tone.mp3')




if (typeof moment === "undefined") {
    console.error("❌ Moment.js is NOT loaded. Check your script order.");
} else {
    console.log("✅ Moment.js is loaded!");
}

messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    sendMessage()
})

socket.on('client-total',(data)=>{
    clientsTotal.innerText=`Total Clients:${data}`
})

function sendMessage(){

    if(messageInput.value==='')return


    console.log(messageInput.value)
    const data={
        name:nameInput.value,
        message: messageInput.value,
        dateTime: new Date()
    }
    socket.emit('message',data)
    addMessagetoui(true,data)
    messageInput.value=''
}

socket.on('chat-message',(data)=>{
    console.log('📩 Received message:', data)
    messagetone.play().catch(e => console.warn('Audio play blocked or failed:', e))
    addMessagetoui(false,data)
})

function addMessagetoui(isOwnMessage,data){
    clearFeedback()
    const timeString = typeof moment !== "undefined" ? moment(data.dateTime).fromNow() : new Date(data.dateTime).toLocaleTimeString()
    const element =`
    <li class="${isOwnMessage ? "message-right" : "message-left"}">
                <p class="message">
                   ${data.message}
                    <span>${data.name} • ${timeString}</span>
                    
                </p>
            </li>`

                messageContainer.innerHTML+=element
                scrollToBottom()


}

function scrollToBottom(){
    messageContainer.scrollTo(0,messageContainer.scrollHeight)
}

messageInput.addEventListener('focus',(e)=>{
    socket.emit('feedback',{
        feedback:`${nameInput.value} is typing...`,
    })
})
messageInput.addEventListener('keypress',(e)=>{
    socket.emit('feedback',{
        feedback:`${nameInput.value} is typing...`,
    })
})



messageInput.addEventListener('blur',(e)=>{
    socket.emit('feedback',{
        feedback:'',
    })
})


socket.on('feedback',(data)=>{
    clearFeedback()
    if (!data.feedback) return
    const element=`  <li class="message-feedback">
        <p class="feedback" id="feedback">
            ${data.feedback}</p>
        </li>`

        messageContainer.innerHTML+=element
})


function clearFeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element=>{
        element.parentNode.removeChild(element)
    })
}


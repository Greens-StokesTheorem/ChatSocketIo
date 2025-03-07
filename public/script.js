let socket = io();
let button = document.getElementById("entermessage");
let textbox = document.getElementById("inputfield");
let messagearea = document.getElementById("messagearea")
let PlayerId;


let messages = {};

socket.on("connect", () => {

    PlayerId = socket.id;
    console.log(PlayerId);



})


socket.on("sentmessage", ({id: PlayerId, message: message}) => {

    addmessage({PlayerId, message});

})




button.addEventListener("click", () => {

    socket.emit("sentmessage", {id: PlayerId, message: textbox.value});
    // addmessage(textbox.value);
    addmessage({id: PlayerId, message: textbox.value});

})



function addmessage({id, message}) {

    const newmessage = document.createElement("p");
    newmessage.innerHTML = `${id}: ${message}`;
    messagearea.appendChild(newmessage);


}
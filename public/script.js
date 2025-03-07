let socket = io();
let button = document.getElementById("entermessage");
let textbox = document.getElementById("inputfield");
let messagearea = document.getElementById("messagearea")
let PlayerId;


let messages = {};

socket.on("connect", () => {

    PlayerId = socket.id;
    console.log(PlayerId);
    document.getElementById("playerid").innerHTML = PlayerId;


})


socket.on("sentmessage", ({id: player_id, message: message}) => {

    addmessage(player_id, message, false);

})




button.addEventListener("click", () => {

    socket.emit("sentmessage", {id: PlayerId, message: textbox.value});
    // addmessage(textbox.value);
    addmessage(PlayerId, textbox.value, true);

})



function addmessage(id, message,owner) {

    const newmessage = document.createElement("p");
    newmessage.innerHTML = `${id}: ${message}`;

    if (owner) { 
        newmessage.style.color = "red";
    }
    messagearea.appendChild(newmessage);




}



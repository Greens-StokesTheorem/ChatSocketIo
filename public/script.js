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

    let messagevalue = textbox.value;
    if (messagevalue.length > 0) {

        socket.emit("sentmessage", {id: PlayerId, message: messagevalue});
        // addmessage(textbox.value);
        addmessage(PlayerId, textbox.value, true);
        textbox.value = "";


    }

})


document.addEventListener("keydown", (e) => {


    if (e.code == "Enter") {

        
        let messagevalue = textbox.value;
        if (messagevalue.length > 0) {
    
            socket.emit("sentmessage", {id: PlayerId, message: messagevalue});
            // addmessage(textbox.value);
            addmessage(PlayerId, textbox.value, true);
            textbox.value = "";
    
        }

    }

})



function addmessage(id, message,owner) {

    const newmessage = document.createElement("p");
    newmessage.innerHTML = `${id}: ${message}`;

    if (owner) { 
        newmessage.style.color = "red";
    }
    messagearea.appendChild(newmessage);




}



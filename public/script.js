let socket = io();
let button = document.getElementById("entermessage");
let textbox = document.getElementById("inputfield");
let messagearea = document.getElementById("messagearea")
let PlayerId;


let messages = {};




socket.on("connect", () => {

    // PlayerId = socket.id;
    // document.getElementById("playerid").innerHTML = PlayerId;

    // getLoginfunc(socket.id);

})


socket.on("initmessages", (messagelog) => {

    PlayerId = socket.id;
    document.getElementById("playerid").innerHTML = PlayerId;

    // getLoginfunc(socket.id);


    // console.log({messageid: messageid, messageinfo: {id: PlayerId, message: message}})
    loopentry(messagelog, socket.id);

})



socket.on("sentmessage", ({id: player_id, message: message}) => {

    addmessage(player_id, message, false);

})




button.addEventListener("click", () => {

    let messagevalue = textbox.value;
    if (messagevalue.length > 0) {

        socket.emit("sentmessage", {id: PlayerId, message: messagevalue});
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



function addmessage(id, message, owner) {

    const newmessage = document.createElement("p");
    newmessage.innerHTML = `${id}: ${message}`;
    // console.log(id);
    // console.log(PlayerId);

    if (id == PlayerId) { 

        newmessage.style.color = "red";
    }
    messagearea.appendChild(newmessage);
    // container.insertBefore(newFreeformLabel, container.firstChild);
    newmessage.scrollIntoView({behavior: "smooth"});

}




    

async function loopentry(messages, socketId) {

    await getLoginfunc(socketId);

    for (const [numofmessages, {id, message}] of Object.entries(messages)) {

        // console.log(`${numofmessages}: ${id}, ${message}`);
        addmessage(id, message, false);
    }

}


const getLoginfunc = async (socketid) => {

    const getLogin = await fetch("/api/session", {

        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        // body: JSON.stringify(),

    });

    const result = await getLogin.json();

    // console.log(result.message);

    if (result.status == 1) {
        console.log("User is logged in");
        PlayerId = result.message.userId;


    } else if (result.status == 0) {

        // console.log("User is not logged in");
        PlayerId = socketid;

    }

    document.getElementById("playerid").innerHTML = PlayerId;    


};


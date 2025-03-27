let socket = io();
let button = document.getElementById("entermessage");
let textbox = document.getElementById("messagefield");
let messagearea = document.getElementById("messagearea")
let PlayerId;
const userArea = document.getElementById("onlineusers")
const mydiv = document.getElementById("onlineusers")
let pointerdown = false;
let offx, offy;
let loggedin = false;
let interval;


let messages = {};


socket.on("updatelist", (onlinelist) => {

    console.log("Disocnect");
    updateuserlist(onlinelist);

})


document.getElementById("loginbutton").addEventListener("click", () => {

    PlayerId = document.getElementById("username").value.trim();

    loggedin = true;

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

    if (!loggedin) {

        function checkregister() {

            document.getElementById("blur").style.display = "block";
            document.getElementById("logincontainer").style.display = "block";

            if (loggedin) {

                clearInterval(interval);
                document.getElementById("blur").style.display = "none";
                document.getElementById("logincontainer").style.display = "none";
                document.getElementById("onlineusers").style.display = "block"
        
                // socket.emit("reqInitmessage", socketId);
                document.getElementById("playerid").innerHTML = PlayerId;  
                socket.emit("reqUpdatelist");  

            }

        }

        interval = setInterval(checkregister, 500)

        // waits for user to log in before able to chat
    }


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
        body: JSON.stringify({socketid}),

    });

    const result = await getLogin.json();

    // console.log(result.message);

    if (result.status == 1) {

        console.log("User is logged in");
        PlayerId = result.message.userId;

        document.getElementById("playerid").innerHTML = PlayerId;  
        // mydiv.style.opacity = "1";
        socket.emit("reqUpdatelist")  
        loggedin = true;


    } else if (result.status == 0) {

        // console.log("User is not logged in");
        PlayerId = socketid;

    }




};



function updateuserlist(onlineusers) {

    userArea.textContent = "";

    for (const [id, {loggedin, username}] of Object.entries(onlineusers)) {

        console.log(`${id} status: ${loggedin}     Username: ${username}`);

        const newuser = document.createElement("p")
        newuser.innerText = (username) ? username : id;
        newuser.style.textAlign = "center";
        userArea.appendChild(newuser);

    }
    
}




mydiv.addEventListener("pointerdown", (e) => {

    offx = e.clientX - mydiv.offsetLeft;
    offy = e.clientY - mydiv.offsetTop;
    pointerdown = true;

})

document.addEventListener("pointermove", (e) => {

    if (pointerdown) {
        mydiv.style.left = `${e.clientX - offx}px`;
        mydiv.style.top = `${e.clientY - offy}px`;
    }
})

mydiv.addEventListener("pointerup", (e) => {

    pointerdown = false;

})


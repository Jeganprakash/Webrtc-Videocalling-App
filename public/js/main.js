//Global vars
let width = 500,
    heigth = 0,
    filter = 'none',
    streaming = false;

//DOM ELEMENTS
const video = document.createElement('video');
const canvas = document.getElementById('canvas');
const photos = document.getElementById('photos');
const photoButton = document.getElementById('photo-button');
const clearButton = document.getElementById('clear-button');
const photoFilter = document.getElementById('photo-filter');
const topcon = document.getElementById('top');
const child = document.createElement('video');




//Get media stream


//play when ready
// video.addEventListener('canplay', function (e) {
//     if (!streaming) {
//         //set video / canvas height
//         height = video.videoHeight / (video.videoHeight / width);
//         video.setAttribute('width', width);
//         video.setAttribute('width', height);
//         canvas.setAttribute('width', width);
//         canvas.setAttribute('width', height);

//         streaming = true;

//     }
// }, false)


photoButton.addEventListener('click', function (e) {
    takePicture();
    e.preventDefault();

}, false);

// //Filter event
photoFilter.addEventListener('change', function (e) {

    //Set filter to chosen option
    filter = e.target.value;

    //add video css filter
    total = videotag.length;
    for (i = 0; i < total; i++) {
        videotags[i].style.filter = filter;
    }
    e.preventDefault();
});

// //Clear event
clearButton.addEventListener('click', function (e) {
    //clear photos
    photos.innerHTML = '';
    //change filter back to none
    filter = 'none';
    //Set video Filter
    total = videotag.length;
    for (i = 0; i < total; i++) {
        videotags[i].style.filter = filter;
    }
    //Reset select List
    photoFilter.selectedIndex = 0;
})

// //Take picture from canvas
function takePicture() {
    const context = canvas.getContext('2d');
    if (width && height) {
        //set canvas props
        canvas.width = 300;
        canvas.height = 300;

        //Draw an image of the video ont the canvas
        context.drawImage(videotags[videotags.length - 1], 0, 0, width, height);

        //Create image from canvas
        const imgUrl = canvas.toDataURL('image/png');

        //create img Element
        const img = document.createElement('img');

        //Set img src
        img.setAttribute('src', imgUrl);

        //set image filter
        img.style.filter = filter;

        photos.appendChild(img);
    }
}


navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(function (stream) {
        //Link to video source
        addVideoStream(video, stream)
        myPeer.on('call', call => {
            call.answer(stream)
            const video2 = document.createElement('video')
            call.on('stream', userVideoStream => {
                addVideoStream(video2, userVideoStream)

            })
        })
        socket.on('user-connected', userId => {
            console.log("user connected", userId)
            connectToNewUser(userId, stream)
        })
    })
    .catch(function (err) {
        console.log(`Error: ${err}`);
    });

const peers = {}
//Webrtc client
const socket = io.connect('/')
console.log(socket)
const myPeer = new Peer(undefined, {
    host: '/',
    port: 443,
    path: "/peer"
})

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
    console.log(id)
})
socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()

})
const video2 = document.createElement('video')
function connectToNewUser(userId, stream) {

    const call = myPeer.call(userId, stream)
    call.on('stream', userVideoStream => {
        addVideoStream(video2, userVideoStream)
        console.log('hi')
    })
    call.on('close', () => {
        video2.remove()
    })
    peers[userId] = call
}

function addVideoStream(videox, stream) {
    videox.srcObject = stream;
    //play video
    videox.muted = true;
    videox.addEventListener('loadedmetadata', () => {
        videox.play()
    })
    topcon.appendChild(videox)
    //play when ready

}

// video2.addEventListener('canplay', function (e) {
//     if (!streaming) {
//         //set video / canvas height
//         height = video2.videoHeight / (video2.videoHeight / width);
//         video2.setAttribute('width', width);
//         video2.setAttribute('width', height);
//         canvas.setAttribute('width', width);
//         canvas.setAttribute('width', height);

//         streaming = true;

//     }
// }, false)


const videotags = document.getElementsByTagName("VIDEO");
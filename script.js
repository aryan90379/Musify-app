try {
    document.querySelector(".cardContainer").addEventListener('mouseenter', () => {
        document.querySelector(".playbtn").style.opacity = 1;
        document.querySelector(".playbtn").style.top = "150px";
    });
    document.querySelector(".cardContainer").addEventListener('mouseleave', () => {
        document.querySelector(".playbtn").style.opacity = 0;
        document.querySelector(".playbtn").style.top = "170px";
    });
} catch (error) {

}

let originalSongs = [];
let currentAudio = null;
let currFolder;
// Playlist = ["FilmyHits", "EnglishHits"];
Playlist = [];
// console.log(Playlist);


let globalsongIndex;





async function getSongs(currFolder) {
    let a = await fetch(`http://127.0.0.1:3000/songs/${currFolder}`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    originalSongs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${currFolder}/`)[1].split(".mp3")[0]) //split the elements before and after song and we are taking the first paart of it, it basically converts it into lis of two separate strings containing elemenets of before and after the element we split it with
            originalSongs.push(element.href)
        }
    }
    return songs;
    //    let audio = new Audio(songs[6])
    //    audio.play();
}
// console.log(originalSongs);
const playMusic = (track) => {
    if (currentAudio) {
        currentAudio.pause();//pause the current audio that is playing
        currentAudio.currentTime = 0; //reset playback time
        clearInterval(runtimeDisplayInterval)

    }

    currentAudio = new Audio(track);
    currentAudio.addEventListener("timeupdate", () => {
        document.querySelector(".passtime").style.width = (currentAudio.currentTime / currentAudio.duration) * 100 + "%"
    })

    currentAudio.play();
    displayRuntime()
    play.src = "pause.svg"// Correctly invoke the play method
    console.log(track);
    console.log(track.split(`/${currFolder}/`)[1].split(".mp3")[0].replaceAll("%20",""));
    document.querySelector(".displaySong").innerText = track.split(`/${currFolder}/`)[1].split(".mp3")[0].replaceAll("%20","")
}


// playMusic(originalSongs[0]);

function displayRuntime() {
    const runtimeElement = document.querySelector(".runtime");
    runtimeDisplayInterval = setInterval(() => {
        let minutes = Math.floor(currentAudio.currentTime / 60)
        let seconds = Math.floor(currentAudio.currentTime % 60)


        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        runtimeElement.textContent = `${minutes}:${seconds}/${Math.floor(currentAudio.duration / 60)}:${Math.floor(currentAudio.duration % 60)}`
    }, 10);
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let cardContainer = document.querySelector(".cards");
    // console.log(div);
    let anchors = div.getElementsByTagName("a");
    let array = Array.from(anchors);
    console.log(array);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        // console.log(e);

        if (e.href.includes("/songs")) {
            // console.log("album is ",);
            let folder = e.href.split("/")[4];
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
            let response = await a.json();
            Playlist.push(`${folder}`)
            // console.log(response);
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="cardContainer">
                <svg class="playbtn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="60"
                height="60">
                <circle cx="50" cy="50" r="48" fill="#1ed760" />
                <polygon points="40,30 70,50 40,70" fill="black" />
                </svg>
                
                <div class="card">
                <img src="/songs/${folder}/cover.jpg"
                alt="playlist cover">
                <h2>${response.title}</h2>
                <p>${response.description}</p>
                </div>
                </div>`
        }

        // console.log(Playlist);
    }
}
// Array.from(e.here)



async function main() {

    let songs = [];
    await displayAlbums();
    Array.from(document.getElementsByClassName("cardContainer")).forEach((e, index) => {
        e.addEventListener("click", async () => {
            // console.log(index);
            currFolder = `${Playlist[index]}`;
            songs = await getSongs(currFolder);
            populateSongsList(songs);
            // playMusic[songs[0]]
            let selectedSong = originalSongs[0];
            playMusic(selectedSong);
            
            // console.log(songs[0]);
        });
    });
    //Display all the albums


    // Ensure the song list is populated after fetching the songs
    function populateSongsList(songs) {
        let songUL = document.querySelector(".songsList").getElementsByTagName("ul")[0];
        songUL.innerHTML = ''; // Clear any existing songs

        for (const song of songs) {
            songUL.innerHTML += `<li>
                                        <div class="initial" style="display: flex; gap: 20px;">
                                            <img style="filter: invert(); width: 25px;" src="musicIcon.svg" alt="">
                                            <div class="info">
                                                <div class="songname" style="font-size: 19px;">${song.replaceAll("%20", " ").split("-")[0]}</div>
                                                <div class="artist" style="color: rgb(190, 187, 187); font-size: 16px;">${song.replaceAll("%20", " ").split("-")[1]}</div>
                                            </div>
                                        </div>
                                        <img style="filter: invert(); width: 25px;" src="playbtn.svg" alt="">
                                    </li>`;
        }

        // Add event listeners to the new list items
        Array.from(songUL.getElementsByTagName("li")).forEach((e, index) => {
            e.addEventListener("click", () => {
                let selectedSong = originalSongs[index];
                playMusic(selectedSong);
                // console.log(selectedSong); 
                globalsongIndex = index;
                // console.log(e);
                // document.querySelector(".displaySong").innerText = `${e.querySelector(".songname").innerText} - ${e.querySelector(".artist").innerText}`;
            });
        });
    }

   let play = document.getElementById("play");


    play.addEventListener("click", () => {
        if (currentAudio == null) {
            let selectedSong = originalSongs[0];
            // console.log(originalSongs[]);
            playMusic(selectedSong);
            // console.log(e,index);
            // console.log(document.querySelector(".songsList").getElementsByTagName("li")[0]);
            let e = document.querySelector(".songsList").getElementsByTagName("li")[0]
            document.querySelector(".displaySong").innerText = `${e.querySelector(".songname").innerText} - ${e.querySelector(".artist").innerText}`
            currentAudio.play();
            play.src = "pause.svg";

        }
        else if (currentAudio.paused) {
            currentAudio.play();
            play.src = "pause.svg";
        } else {
            currentAudio.pause();
            play.src = "playbtn.svg";

        }


    });

    document.addEventListener("keydown", (event) => {
        if (event.code === "Space") {
            // Prevent the default action if necessary
            event.preventDefault();

            // Trigger the same logic as the click event
            play.click();
        }
    });


    document.querySelector(".seekbar").addEventListener("click", e => {
        // console.log(document.querySelector(".circle"));
        // console.log(e.offsetX);
        // console.log(e.target,e.offsetX);
        // console.log(e.offsetX/e.target.getBoundingClientRect().width);
        let percent = (e.offsetX / e.target.getBoundingClientRect().width)
        document.querySelector(".passtime").style.width = percent * 100 + "%"
        currentAudio.currentTime = (percent * (currentAudio.duration))

        // console.log((percent*(currentAudio.duration))/100);
    })


    // Add event listener for the same
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left ").style.left = "0%";
    })


    document.querySelector(".cloz").addEventListener("click", () => {
        document.querySelector(".left ").style.left = "-200%";
    })

    // add an event listener to previous and next
    previous.addEventListener("click", () => {
        console.log("previous clicked");
        if (globalsongIndex > 0) {
            globalsongIndex -= 1;
        }
        let selectedSong = originalSongs[globalsongIndex];
        playMusic(selectedSong);
        document.querySelector(".displaySong").innerText = `${document.querySelector(".songsList").getElementsByTagName("li")[globalsongIndex].querySelector(".songname").innerText} - ${document.querySelector(".songsList").getElementsByTagName("li")[globalsongIndex].querySelector(".artist").innerText}`


    })

    next.addEventListener("click", () => {
        // console.log("next clicked");
        if (globalsongIndex < document.querySelector(".songsList").getElementsByTagName("li").length) {

            globalsongIndex += 1;
        }
        // console.log(document.querySelector(".songsList").getElementsByTagName("li").length);

        let selectedSong = originalSongs[globalsongIndex];
        playMusic(selectedSong);
        document.querySelector(".displaySong").innerText = `${document.querySelector(".songsList").getElementsByTagName("li")[globalsongIndex].querySelector(".songname").innerText} - ${document.querySelector(".songsList").getElementsByTagName("li")[globalsongIndex].querySelector(".artist").innerText}`

    })

    // add an event to volume
    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("click", (e) => {
        console.log(e, e.target.value);
        currentAudio.volume = parseInt(e.target.value) / 100
    })

    document.querySelector(".volume>img").addEventListener("click", e => {
        console.log("changing", e.target.src);
        if (e.target.src.includes("unmute.svg")) {
            e.target.src = e.target.src.replace("unmute.svg", "mute.svg");
            currentAudio.volume = 0;
            document.querySelector(".volume").getElementsByTagName("input")[0].value = 0;
            console.log(currentAudio.volume);
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "unmute.svg");
            currentAudio.volume = 0.1;
            document.querySelector(".volume").getElementsByTagName("input")[0].value = 10;
            console.log(currentAudio.volume);
        }

    })





}

main()



currFolder = "FilmyHits"

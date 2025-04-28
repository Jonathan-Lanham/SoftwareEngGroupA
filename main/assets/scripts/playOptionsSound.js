// grabbing the elements for all buttons
const allButtons = document.querySelectorAll('button');
const allAtag = document.querySelectorAll('a');
const btnSound = new Audio('../assets/sounds/sounds_button-click.mp3');

// when any button is clicked, it plays a sound effect
allButtons.forEach(button => {
    button.addEventListener('click', ()  =>{
       btnSound.play();
    });
});
// when any a-tag is clicked, it plays a sound effect
allAtag.forEach(aTag => {
    aTag.addEventListener('click', (event)  =>{
        event.preventDefault();
        btnSound.play();

        //Hardcoded 125ms timeout to let the button sound play. Can remove if preferred.
        setTimeout(() => {
            window.location.href = aTag.href
        }, 125);
        //Old issue: location change was attached to the end of a global sound object
        // btnSound.onended = () => {
        //     window.location.href = aTag.href;  // navigate after sound ends
        // };
    });
});





const soundIcon = document.querySelector('.music-icon');
const musicSlash = document.querySelector('.slash-music');
const music = new Audio('../assets/sounds/game-8-bit-on-278083.mp3')

soundIcon.addEventListener('click', () =>{
    if(musicSlash.style.display === 'block'){
        musicSlash.style.display = 'none';
        music.play(); // Play the music
    }
    else{
        musicSlash.style.display = 'block';
        music.pause(); 
    }
    
    
});
musicSlash.addEventListener('click', () =>{
    if(musicSlash.style.display === 'block'){
        musicSlash.style.display = 'none';
        music.play(); // Play the music
    }
    else{
        musicSlash.style.display = 'block';
        music.pause(); 
    }
    
    
});

// grabbing the sliders from the HTML
const volumeSlider = document.getElementById('volume-slider');
const musicSlider = document.getElementById('music-slider');

// loading the saved volume setting from localStorage (if it exists)
const savedVolume = localStorage.getItem('volume');
if (savedVolume !== null) { // if the saved volume is not equal to nothing...
    volumeSlider.value = savedVolume;  // setting slider to saved volume
    btnSound.volume = savedVolume / 100;  // setting the volume of the sound to saved value (0 to 1)
    gameVolume = savedVolume / 100;
};

// saving volume setting to the localStorage and update the volume
volumeSlider.addEventListener('input', () => {
    const volumeValue = volumeSlider.value / 100;  // getting volume as a decimal (0 to 1)
    btnSound.volume = volumeValue;  // updating the sound's volume
    gameVolume = volumeValue
    localStorage.setItem('volume', volumeSlider.value);  // saving the volume slider value to localStorage
});

// loading the saved music volume setting from localStorage (if it exists)
const savedMusicVolume = localStorage.getItem('musicVolume');
if (savedMusicVolume !== null) {
    musicSlider.value = savedMusicVolume;  // setting music slider to saved value
    music.volume = savedMusicVolume / 100;  // setting the volume of the music to saved value (0 to 1)
};

// saving music volume setting to the localStorage and updating the music player volume
musicSlider.addEventListener('input', () => {
    const musicVolumeValue = musicSlider.value / 100;  // getting volume as a decimal (0 to 1)
    music.volume = musicVolumeValue;  // updating the music player's volume
    localStorage.setItem('musicVolume', musicSlider.value);  // saving the music volume slider value to localStorage
});

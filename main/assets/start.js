

// grabbing the elements for the options menu buttons
const optionsBtn = document.querySelector('.options-btn');
const optionsHiddenMenu = document.getElementById('optionsMenu');
const optionsExitBtn = document.querySelector('.exit-btn');


// code for the options button to showcase the options menu
optionsBtn.addEventListener('click', () => {
    if(optionsHiddenMenu.style.display === 'none'){
        optionsHiddenMenu.style.display = 'block';
    }
    else{
        optionsHiddenMenu.style.display = 'none';
    }
});
// code for the options exit button to get rid of the options menu
optionsExitBtn.addEventListener('click', () => {
    if(optionsHiddenMenu.style.display === 'block' ){
        optionsHiddenMenu.style.display = 'none';
        languageHiddenMenu.style.display = 'none';
    }
    else{
        optionsHiddenMenu.style.display = 'block';
    }
});


// grabbing the elements for the credits popup menu
const creditsBtn = document.querySelector('.credits-btn');
const creditsHiddenMenu = document.getElementById('creditsPopup');
const creditsExitBtn = document.querySelector('.credits-exit-btn');

// code for the credits button to showcase the credits menu
creditsBtn.addEventListener('click', () => {
    if(creditsHiddenMenu.style.display === 'none'){
        creditsHiddenMenu.style.display = 'block';
    }
    else{
        creditsHiddenMenu.style.display = 'none';
    }
});
// code for the credits exit button to get rid of the credits menu
creditsExitBtn.addEventListener('click', () => {
    if(creditsHiddenMenu.style.display === 'block' ){
        creditsHiddenMenu.style.display = 'none';
    }
    else{
        creditsHiddenMenu.style.display = 'block';
    }
});

// grabbing the elements for the support menu buttons
const supportBtn = document.querySelector('.support-btn');
const supportHiddenMenu = document.getElementById('supportPopup');
const supportExitBtn = document.querySelector('.support-exit-btn');


// code for the support button to showcase the support popup
supportBtn.addEventListener('click', () => {
    if(supportHiddenMenu.style.display === 'none'){
        supportHiddenMenu.style.display = 'block';
    }
    else{
        supportHiddenMenu.style.display = 'none';
    }
});
// code for the support exit button to get rid of the support menu
supportExitBtn.addEventListener('click', () => {
    if(supportHiddenMenu.style.display === 'block' ){
        supportHiddenMenu.style.display = 'none';
    }
    else{
        supportHiddenMenu.style.display = 'block';
    }
});

// grabbing the elements for the Language menu buttons
const languageBtn = document.querySelector('.language-btn');
const languageHiddenMenu = document.querySelector('.language-content');
const languageExitBtn = document.querySelector('.support-exit-btn');


// code for the language button to showcase the language popup
languageBtn.addEventListener('click', () => {
    if(languageHiddenMenu.style.display === 'none'){
        languageHiddenMenu.style.display = 'block';
    }
    else{
        languageHiddenMenu.style.display = 'none';
    }
});

// Code to make the popup close whenever anything else on screen is clicked
document.addEventListener("click", (event) => {
    if (!event.target.closest(".language-content") && !event.target.closest(".language-btn")) {
        languageHiddenMenu.style.display = 'none';
    }
}); 



const languageIcons = document.querySelectorAll('.english-icon, .spanish-icon, .german-icon, .french-icon');

// first have english be preset for green outline
languageIcons[0].classList.add("language-outline");

languageIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        // when a icon is clicked remove the previous selection
        languageIcons.forEach(i => i.classList.remove("language-outline"));
        // adds it to clicked selection
        icon.classList.add("language-outline");
    });
});




// grabbing the elements for all buttons
const allBtns = document.querySelectorAll('button');
const allAtags = document.querySelectorAll('a');
const btnSound = new Audio('../assets/music/music_button-click.mp3');

// when any button is clicked, it plays a sound effect
allBtns.forEach(button => {
    button.addEventListener('click', ()  =>{
       btnSound.play();
    });
});
// when any a-tag is clicked, it plays a sound effect
allAtags.forEach(aTag => {
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




// grabbing the elements for the sound button
const soundBtn = document.querySelector('.sound-button');
const soundIcon = document.querySelector('.fa-volume-xmark');
const music = new Audio('../assets/music/game-8-bit-on-278083.mp3')

// when sound button is clicked, replace the icons and play music
soundBtn.addEventListener('click', () =>{
    if(soundIcon.classList.contains('fa-volume-xmark')){
        soundIcon.classList.replace('fa-volume-xmark', 'fa-volume-high');
        music.play();
    }
    else{
        soundIcon.classList.add('fa-volume-xmark');
        music.currentTime = 0;
        music.pause();
    }
});


// grabbing the sliders from the HTML
const volumeSlider = document.getElementById('volumeSlider');
const musicSlider = document.getElementById('musicSlider');

// loading the saved volume setting from localStorage (if it exists)
const savedVolume = localStorage.getItem('volume');
if (savedVolume !== null) { // if the saved volume is not equal to nothing...
    volumeSlider.value = savedVolume;  // setting slider to saved volume
    btnSound.volume = savedVolume / 100;  // setting the volume of the sound to saved value (0 to 1)
};

// saving volume setting to the localStorage and update the volume
volumeSlider.addEventListener('input', () => {
    const volumeValue = volumeSlider.value / 100;  // getting volume as a decimal (0 to 1)
    btnSound.volume = volumeValue;  // updating the sound's volume
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



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
    if(optionsHiddenMenu.style.display === 'block'){
        optionsHiddenMenu.style.display = 'none';
    }
    else{
        optionsHiddenMenu.style.display = 'block';
    }
});


// grabbing the elements for the sound button
const soundBtn = document.querySelector('.sound-button');
const soundIcon = document.querySelector('.fa-volume-xmark');
const music = new Audio('music/game-8-bit-on-278083.mp3')

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
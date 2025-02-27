// grabbing the elements for all buttons
const allBtns = document.querySelectorAll('button');
const allAtags = document.querySelectorAll('a');
const btnSound = new Audio('../static/music/music_button-click.mp3');

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

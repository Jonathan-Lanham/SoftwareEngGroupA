// grabbing the elements for all buttons
const allBtns2 = document.querySelectorAll('button');
const allAtags2 = document.querySelectorAll('a');
const btnSound2 = new Audio('../assets/sounds/sounds_button-click.mp3');

// when any button is clicked, it plays a sound effect
allBtns2.forEach(button => {
    button.addEventListener('click', ()  =>{
       btnSound2.play();
    });
});
// when any a-tag is clicked, it plays a sound effect
allAtags2.forEach(aTag => {
    aTag.addEventListener('click', (event)  =>{
        event.preventDefault();
        btnSound2.play();

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

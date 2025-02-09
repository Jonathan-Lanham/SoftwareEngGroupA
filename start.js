

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

    // javaScript to load page-specific content such as language.json
function changeLanguage(lang){


    fetch('../static/language.json')
    .then(response => response.json())
    .then(data => {


        // update content based on selected language and page
        document.querySelector('.gatekeeper-title').textContent = data[lang].startPage.title;
        document.querySelector('.start-btn').textContent = data[lang].startPage.startBtn;
        document.querySelector('.options-btn').textContent = data[lang].startPage.optionsBtn;
        document.querySelector('.start-btn').textContent = data[lang].startPage.levelSelectBtn;
        document.querySelector('.option-title').textContent = data[lang].startPage.optionsPopupTitle;
        document.querySelector('.support-btn').textContent = data[lang].startPage.optionsPopupSupport;
        document.querySelector('.credits-btn').textContent = data[lang].startPage.optionsPopupCredits;
        document.querySelector('.terms-btn').textContent = data[lang].startPage.optionsPopupTerms;
        document.querySelector('.support-title').textContent = data[lang].startPage.supportPopupTitle;


    })
    .catch(error => console.error('Error loading language data:', error));
}


    // javaScript to load page-specific content such as language.json

const DEFAULT_LANG = 'en';
const LANG_PATH = '../assets/data/language.json';


function changeLanguage(lang){
    // saving the language choice
    localStorage.setItem('language', lang);

    document.body.classList.remove('lang-en', 'lang-es', 'lang-de', 'lang-fr'); // remove the existing classes
    document.body.classList.add(`lang-${lang}`); // adding new language class


    fetch(LANG_PATH)
        .then(response => response.json())
        .then(data => {


            // update content based on selected language and page
            // for start page buttons and title
            document.querySelector('.gatekeeper-title').textContent = data[lang].startPage.title;
            document.querySelector('.start-btn').textContent = data[lang].startPage.startBtn;
            document.querySelector('.options-btn').textContent = data[lang].startPage.optionsBtn;
            document.querySelector('.level-select-btn').textContent = data[lang].startPage.levelSelectBtn;
            document.querySelector('.sandbox-btn').textContent = data[lang].startPage.sandboxBtn;
            // for buttons title and btns within options popup menu
            document.querySelector('.option-title').textContent = data[lang].startPage.optionsPopupTitle;
            document.querySelector('.support-btn').textContent = data[lang].startPage.optionsPopupSupport;
            document.querySelector('.credits-btn').textContent = data[lang].startPage.optionsPopupCredits;
            document.querySelector('.terms-btn').textContent = data[lang].startPage.optionsPopupTerms;
            // for support popup menu
            document.querySelector('.support-title-p').textContent = data[lang].startPage.supportPopupTitle;
            document.querySelector('.subject-label').textContent = data[lang].startPage.supportPopupSubject;
            document.querySelector('.subject-lang').placeholder= data[lang].startPage.supportPopupSubjectPlaceholder;
            document.querySelector('.username-label').textContent = data[lang].startPage.supportPopupEmail;
            document.querySelector('.email-lang').placeholder = data[lang].startPage.supportPopupEmailPlaceholder;
            document.querySelector('.question-label').textContent = data[lang].startPage.supportPopupQuestion;
            document.querySelector('.question-1').textContent = data[lang].startPage.supportPopupQuestion1;
            document.querySelector('.question-2').textContent = data[lang].startPage.supportPopupQuestion2;
            document.querySelector('.question-3').textContent = data[lang].startPage.supportPopupQuestion3;
            document.querySelector('.question-4').textContent = data[lang].startPage.supportPopupQuestion4;
            document.querySelector('.message-label').textContent = data[lang].startPage.supportPopupMessage;
            document.querySelector('.attachments-label').textContent = data[lang].startPage.supportPopupUpload;
            document.querySelector('.support-submit-btn').value = data[lang].startPage.supportPopupSubmit;
            // for about popup in the start page
            document.querySelector('.about-pTag').textContent = data[lang].startPage.aboutPopupTitle;
            document.querySelector('.game-info-pTag').textContent = data[lang].startPage.aboutPopupGameInfo;
            document.querySelector('.logic-gates-pTag').textContent = data[lang].startPage.aboutPopupLogicGates;
            document.querySelector('.about-game-pTag').textContent = data[lang].startPage.aboutPopupAboutTheGame;
            document.querySelector('.logic-overview-pTag').textContent = data[lang].startPage.aboutPopupLogicGatesOverview;
            document.querySelector('.about-desc-pTag').textContent = data[lang].startPage.aboutPopupGameInfoDesc;
            document.querySelector('.logic-desc-pTag').textContent = data[lang].startPage.aboutPopupLogicGatesDesc;




        })
        .catch(error => console.error('Error loading language data:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language') || DEFAULT_LANG;
    changeLanguage(savedLang);
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
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
            // for credits popup
            document.querySelector('.credits-title-pTag').textContent = data[lang].startPage.creditsPopupTitle;
            document.querySelector('.front-end-span1').textContent = data[lang].startPage.creditsPopupFrontEnd;
            document.querySelector('.front-end-span2').textContent = data[lang].startPage.creditsPopupFrontEnd;
            document.querySelector('.front-end-span3').textContent = data[lang].startPage.creditsPopupFrontEnd;
            document.querySelector('.front-end-span4').textContent = data[lang].startPage.creditsPopupFrontEnd;
            document.querySelector('.back-end-span1').textContent = data[lang].startPage.creditsPopupBackEnd;
            document.querySelector('.back-end-span2').textContent = data[lang].startPage.creditsPopupBackEnd;
            document.querySelector('.back-end-span3').textContent = data[lang].startPage.creditsPopupBackEnd;
            document.querySelector('.back-end-span4').textContent = data[lang].startPage.creditsPopupBackEnd;
            document.querySelector('.back-end-span5').textContent = data[lang].startPage.creditsPopupBackEnd;

            // for Terms page
            document.addEventListener("DOMContentLoaded", () => {
                document.querySelector('.gatekeeper-home').textContent = data[lang].startPage.termsTitle;
            
                document.querySelector('.terms-text').textContent = data[lang].startPage.termsSubheading;
                document.querySelector('.privacy-tab').textContent = data[lang].startPage.termsPrivacyTab;
                document.querySelector('.terms-tab').textContent = data[lang].startPage.termsServiceTab;
                document.querySelector('.terms-line1').textContent = data[lang].startPage.termsLine1;
                document.querySelector('.terms-line2').textContent = data[lang].startPage.termsLine2;
                document.querySelector('.terms-line3').textContent = data[lang].startPage.termsLine3;
                document.querySelector('.terms-line4').textContent = data[lang].startPage.termsLine4;
                document.querySelector('.terms-line5').textContent = data[lang].startPage.termsLine5;
                document.querySelector('.terms-line6').textContent = data[lang].startPage.termsLine6;
                document.querySelector('.terms-line7').textContent = data[lang].startPage.termsLine7;
                document.querySelector('.terms-line8').textContent = data[lang].startPage.termsLine8;
                document.querySelector('.terms-line9').textContent = data[lang].startPage.termsLine9;
                document.querySelector('.terms-line10').textContent = data[lang].startPage.termsLine10;
                document.querySelector('.terms-line11').textContent = data[lang].startPage.termsLine11;
                document.querySelector('.terms-line12').textContent = data[lang].startPage.termsLine12;
                document.querySelector('.terms-line13').textContent = data[lang].startPage.termsLine13;
                document.querySelector('.terms-line14').textContent = data[lang].startPage.termsLine14;
                document.querySelector('.terms-line15').textContent = data[lang].startPage.termsLine15;
                document.querySelector('.terms-line16').textContent = data[lang].startPage.termsLine16;
                document.querySelector('.terms-line17').textContent = data[lang].startPage.termsLine17;
            })



            // for Privacy page
            document.addEventListener("DOMContentLoaded", () => {
                document.querySelector('.').textContent = data[lang].startPage.policyTitle;
                document.querySelector('.').textContent = data[lang].startPage.policySubheading;
                document.querySelector('.').textContent = data[lang].startPage.policyPrivacyTab;
                document.querySelector('.').textContent = data[lang].startPage.policyServiceTab;
                document.querySelector('.').textContent = data[lang].startPage.policyLine1;
                document.querySelector('.').textContent = data[lang].startPage.policyLine2;
                document.querySelector('.').textContent = data[lang].startPage.policyLine3;
                document.querySelector('.').textContent = data[lang].startPage.policyLine4;
                document.querySelector('.').textContent = data[lang].startPage.policyLine5;
                document.querySelector('.').textContent = data[lang].startPage.policyLine6;
                document.querySelector('.').textContent = data[lang].startPage.policyLine7;
                document.querySelector('.').textContent = data[lang].startPage.policyLine8;
                document.querySelector('.').textContent = data[lang].startPage.policyLine9;
                document.querySelector('.').textContent = data[lang].startPage.policyLine10;
                document.querySelector('.').textContent = data[lang].startPage.policyLine11;
                document.querySelector('.').textContent = data[lang].startPage.policyLine12;
                document.querySelector('.').textContent = data[lang].startPage.policyLine13;
                document.querySelector('.').textContent = data[lang].startPage.policyLine14;
            })



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
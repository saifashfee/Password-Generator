const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]"); //jin input ka type checkbox hai unn sabko pakadliya
let symbols = '~!@#$%^&*()_+`-=["];:<>\,.?/|}{;';


//by default values
let password = "";
let passwordLength = 10; 
handleSlider(); //calling the function to set slider to 10 and display 10

let checkCount = 0; //no checkbox is checked
//ste strength circle color to grey
setIndicator("#ccc");



//set password length
function handleSlider(){ //UI par password length show karega
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    //slider thumb ke right side gray color left side se color aaega as we slide
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%";
}
//displaying slider number using EVENT LISTENER
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value; //e.target represents slider
    handleSlider();
})

function setIndicator(color){ //
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

//showing strength of password
function calculateStrength(){
    let hasUppercase = false;
    let hasLowercase = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(uppercaseCheck.checked){
        hasUppercase = true;
    }
    if(lowercaseCheck.checked){
        hasLowercase = true;
    }
    if(numbersCheck.checked){
        hasNumber = true;
    }
    if(symbolsCheck.checked){
        hasSymbol = true;
    }

    if((passwordLength >= 12) && hasUppercase && hasLowercase && hasNumber && hasSymbol){
        setIndicator('#0f0');
    }
    else if((passwordLength > 8 && passwordLength < 12) && ((hasUppercase || hasLowercase) && (hasNumber || hasSymbol))){
        setIndicator('#ff0');
    }
    else{
        setIndicator('#f00');
    }
}


function getRandomInteger(min, max){
    return Math.floor(Math.random()*(max-min+1)) + min;
    //this formula gives a random number in range [min, max]
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97, 122));
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65, 90));
}
function generateSymbol(){
    const randomNum = getRandomInteger(0, symbols.length); //generating random number between 0 and string ki length
    return symbols.charAt(randomNum); //jo random number generate hua uske corresponding symbol in string leliya
}

//Event listener on every check box
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
        //SPECIAL CASE- agar passwordlength 2 hai and 3 checkbox checked hain toh automatically 3 length ka password aaega so, slider update karengey
        if(passwordLength < checkCount){
            passwordLength = checkCount;
            handleSlider();
        }
    })
}
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});



async function copyContent(){
    try{ //resolve hoga toh ye chalega
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied"; //copy hone pr copied likha aa jaega
    }
    catch(e){ //reject hoga toh ye chalega
        copyMsg.innerText = "failed"; //if copy nahi hua then failed likha aaega
    }

    //copy hone pr msg dikhe
    copyMsg.classList.add("active");
    //2 second baad msg gayab ho jae
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000)
}
copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value){
        copyContent();
    }
});


function shufflePassword(array){
    //Fisher Yates Method
    for(let i = array.length-1; i>0; i--){
        const j = Math.floor(Math.random()*(i+1));
        //swap
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
} 

//GENERATING PASSWORD
generateBtn.addEventListener('click', () => {
    //0 checkbox selected
    if(checkCount == 0){
        return;
    }
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //Making password
    //removing previous password
    password = "";

    let funcArr = [];
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }
    //atleast 1 checked item aa jae iske liye loop
    for(let i = 0; i < funcArr.length; i++){
        password += funcArr[i]();
    }
    //remaining random addition
    for(let i = 0; i<passwordLength-funcArr.length; i++){
        let randomIndex = getRandomInteger(0, (funcArr.length-1));
        password += funcArr[randomIndex]();
    }

    //now we have to shuffle the password kyunki pehle uppercase aaya then lower then etc etc toh isko shuffle karna padega nahi toh pata hee lag gaya na ki password kya hai.
    password = shufflePassword(Array.from(password));

    //showing in UI
    passwordDisplay.value = password;

    //showing strength of password
    calculateStrength();
});
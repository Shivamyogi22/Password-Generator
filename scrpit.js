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
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//Set strength circle to grey
setIndicator("#ccc");

//set passwordLength
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  //kch aur add krna chaiye//-HW
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =((passwordLength-min)*100/(max-min)) +"% 100%"

}

function setIndicator(color) {
  
  indicator.style.backgroundColor = color;
  //shadow
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRndInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123)); //use to convert askII value to alphabate
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91)); //use to convert askII value to alphabate
}

function generateSymbol() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum); // charAt is used to get the index for a variable
}

function calcStrength() {
  // console.log("Indicator color set"); 
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 14  ) {
    setIndicator("#0f0");
  } 
  else if (
    (hasUpper || hasLower) &&
    (hasNum || hasSym) &&
    passwordLength >= 8
  ) {
    setIndicator("#ff0");
  } 
  else {
    setIndicator("#f00");
  }
  // console.log("Indicator color set"); 
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Failed"
    }
    copyMsg.classList.add("active"); // To make copy wla span visible   
    setTimeout(()=>{
        copyMsg.classList.remove("active")
    },2000)
}

/////Password SHUFFLE K LIYE 
function shufflePassword(array){
  //FISHER YATES METHOD
  for(let i=array.length-1; i>0; i--){
    //random j , find out using random function
    const j = Math.floor(Math.random()*(i+1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  
  let str = "";
  array.forEach((el)=>(str+=el));
  
  return str;

}


// Iske through hum dkh rhe h ki boxes ko jab hum check kre tb humera count change ho
function handleCheckboxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
        checkCount++;
    })
    
    //special case
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

// this is used to add a event listner for a checkbox when we check any box, by calling a function 
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckboxChange);
})

// ye event listner jab kam krega jb hum silder ko aage piche krte h to change krte h input value m to slider m bhi change hoga na to .taget.value usko update krega
inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

//jab bhi koi value hogi tabhi copy hogi other wise copy wla button kam nhi krega to hum copyCintent wla ko call krenge  
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
    copyContent();
})

generateBtn.addEventListener('click', () => {
    //none of the check box are selected
    if(checkCount==0)
     return;

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    //let start the journey to find new password
    console.log("starting the journey");
    //purne password ko hta do
    password = "";

    // let's put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked){
    //     password +=generateUpperCase(); 
    // }
    
    // if(lowercaseCheck.checked){
    //     password +=generateLowerCase(); 
    // }

    // if(numbersCheck.checked){
    //     password +=generateRandomNumber(); 
    // }

    // if(symbolsCheck.checked){
    //     password +=generateSymbol (); 
    // }

    let funArr = [];

    if(uppercaseCheck.checked)
      funArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
      funArr.push(generateLowerCase);

    if(numbersCheck.checked)
      funArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
      funArr.push(generateSymbol);

    //compulsary addition
    for(let i=0; i<funArr.length; i++){
      password += funArr[i]();
    }
    console.log("Compulasary addiion done");
    //remaining additon
    for(let i=0; i<passwordLength-funArr.length; i++){
      let randIndex = getRndInteger(0, funArr.length);
      console.log("randIndex" + randIndex);  
      password += funArr[randIndex]();
    }
    console.log("Remaining addtion done");

    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("Display on UI done ");
    //calculate strength
    calcStrength();
     
});
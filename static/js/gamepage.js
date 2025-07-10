// Welp. here we go. This file will contain all the JS needed for my game.

//**************************PROMPT HANDLING JS********************************/
// Define the yes and no buttons.
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const hiddenSound = document.getElementById("hiddenSound");
const hiddenSound2 = document.getElementById("hiddenSound2"); // This is the yes sound button

// Now have event listener for both buttons (on click!).
yesBtn.addEventListener('click', (event) => { // On click, this event function we are making right now should be done
    let clearableDiv = document.getElementById("clearableDiv"); // Define the div
    let gameDiv = document.getElementById('gameDiv'); // Get the game div
    hiddenSound2.currentTime = 0; // Start sound from beginning
    hiddenSound2.setVolume = 0.7; // 70% volume
    hiddenSound2.play(); // Play sound

    clearableDiv.classList.add("d-none"); // Add the 'display none' class from BOOTSTRAP here to hide it
    getFlags(); // Get the flags necessary, also does the BUTTONS function for game logic (do before revealing)
    gameDiv.classList.remove('d-none'); // Remove the display none from game div so we can see it
});

noBtn.addEventListener('click', (event) => {
    let waitStuff = document.getElementsByClassName('waitStuff');
    let waitStuffArray = Array.from(waitStuff); // Turn it into an array to work with
    // Do sound logic for waiting sound
    hiddenSound.currentTime = 0; // Start sound from beginning
    hiddenSound.setVolume = 0.8; // Lower volume to 80%
    hiddenSound.play(); // Play sound

    // Reveal all the hidden WAIT elements!
    waitStuffArray.forEach(element => {
        element.classList.remove("d-none"); // Remove the bootstrap class that is hiding it

        // This will bring the elements back after a few seconds
        setTimeout(() => {
            element.classList.add('d-none'); // RE-hide it with bootstrap class
        }, 5000); // 5 seconds
    });

    // ANOTHER timeout OUTSIDE of for loop so sound plays once, and stops once.
    setTimeout(() => {
        hiddenSound.pause(); // Stop sound
    }, 5000); // After 5 seconds
});
//********************************FLAG HANDLING JS*****************************/
function getFlags() {
    const api_url = "https://restcountries.com/v3.1/all?fields=name,flags" // This URL gets EVERY country, with the name and its flag
    fetch(api_url) // Fetch
      .then(response => {
        if (!response.ok) { // If the response returns an error
          throw new Error(`HTTP Error!: Status: ${response.status}`)
        }
        return response.json(); // Return the json so we can use it in the next 'then' part of the chain (outside of if statement)
      })
      .then(countryJson => {
            let dictList = []; // This list will hold country dicts, will use for name later
            let namesList = []; // This list will be passed into choice btns function for game logic
            let random0to249 = Math.floor(Math.random() * 250); // Get random int between 0 and 249 (length of json list)
            let randomCountryDict = countryJson[random0to249]; // Get a random country dictionary
            dictList.push(randomCountryDict); // PUSH dictionary to list
            namesList.push(randomCountryDict['name']['common']); // PUSH the name of that country to the list
            let countryFlagOne = randomCountryDict['flags']['png']; // Search it to get flag
            // Do above again for second flag
            random0to249 = Math.floor(Math.random() * 250);
            randomCountryDict = countryJson[random0to249];
            dictList.push(randomCountryDict); // Push dictionary to list again
            namesList.push(randomCountryDict['name']['common']); // Push other name to list again
            let countryFlagTwo = randomCountryDict['flags']['png'];
            // Use RANDOMIZING to find out which name we should guess
            let randomIndex = Math.floor(Math.random() * dictList.length);
            let countryName = dictList[randomIndex]['name']['common']; // Get the random country dict in the list and get its name under common key, under name key
            // Now get the img tags and fill em up, and also adjust the text in the "Which country is?"
            let whichCountryText = document.getElementById("whichCountry");
            let flagOne = document.getElementById('flagOne');
            let flagTwo = document.getElementById('flagTwo');
            whichCountryText.textContent = `${countryName}?`; // Set text equal to the country name (first random country)
            flagOne.src = countryFlagOne; // change the first image's src attribute to the image we got from API
            flagTwo.src = countryFlagTwo; // change the second image's src attribute to the image we got from API
            getChoiceBtns(namesList, whichCountryText); // Do CHOICE BUTTONS FUNCTION WITH OUR NAMES LIST and CORRECT nation name as input!
      })
      .catch(error => { // This will catch any errors and show them back to me
        console.error("Error fetching flag data", error);
      }) 
};

function getChoiceBtns(nameList, correctCountry) {
    let flagOneDiv = document.getElementById("flagOneDiv"); // Get both of the little blue boxes holding the flags
    let flagTwoDiv = document.getElementById("flagTwoDiv"); // Get both of the little blue boxes holding the flags
    var buttonOne = document.createElement("button"); // create button one (left)
    var buttonTwo = document.createElement("button"); // create button two (right)
    // Configure button one
    buttonOne.innerHTML = "Flag A🤔"; // Button text
    buttonOne.id = nameList[0]; // Its ID will match its flag. This is CRUCIAL for checking later
    buttonOne.classList.add('btn', 'btn-lg', 'btn-success'); // add bootstrap styling with classes
    flagOneDiv.appendChild(buttonOne); // Add button one to left div
    // Config button two
    buttonTwo.innerHTML = "Flag B😳";
    buttonTwo.id = nameList[1];
    buttonTwo.classList.add('btn', 'btn-lg', 'btn-danger');
    flagTwoDiv.appendChild(buttonTwo);
}
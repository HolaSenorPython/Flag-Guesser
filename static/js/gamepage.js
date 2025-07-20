// Welp. here we go. This file will contain all the JS needed for my game.

//**************************PROMPT HANDLING JS********************************/
// Define the yes and no buttons.
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const hiddenSound = document.getElementById("hiddenSound");
const hiddenSound2 = document.getElementById("hiddenSound2"); // This is the yes sound button
const correctSound = document.getElementById('correctSound'); // This sound plays on a correct country click!
const wrongSound = document.getElementById('wrongSound'); // This sound plays on an INCORRECT country click!
const ratherSleep = document.getElementById('gameBgAudio'); // This is the BG audio for the game page
const scoreText = document.getElementById('scoreText'); // This is the score text that will dynamically update based on how well the user does
let userScore = 0; // variable for SCORE that we will check against later

// Now have event listener for both buttons (on click!).
yesBtn.addEventListener('click', (event) => { // On click, this event function we are making right now should be done
    let clearableDiv = document.getElementById("clearableDiv"); // Define the div
    let gameDiv = document.getElementById('gameDiv'); // Get the game div
    clearableDiv.classList.add("d-none"); // Add the 'display none' class from BOOTSTRAP here to hide it
    getFlags(); // Get the flags necessary, also does the BUTTONS function for game logic (do before revealing)
    gameDiv.classList.remove('d-none'); // Remove the display none from game div so we can see it
});

noBtn.addEventListener('click', (event) => {
    let waitStuff = document.getElementsByClassName('waitStuff');
    let waitStuffArray = Array.from(waitStuff); // Turn it into an array to work with
    // Do sound logic for waiting sound
    hiddenSound.currentTime = 0; // Start sound from beginning
    hiddenSound.volume = 0.9; // Lower volume to 80%
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
            hiddenSound2.currentTime = 0; // Start sound from beginning
            hiddenSound2.volume = 0.7; // 70% volume
            hiddenSound2.play(); // Play sound
            // Handle the looping bg song
            ratherSleep.volume = 0.4;
            ratherSleep.loop = true; // LOOP song
            ratherSleep.play();
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
            let cleanCountryName = whichCountryText.textContent.replace("?", ""); // Use this clean country name for checking against later!
            flagOne.src = countryFlagOne; // change the first image's src attribute to the image we got from API
            flagTwo.src = countryFlagTwo; // change the second image's src attribute to the image we got from API
            getChoiceBtns(namesList, cleanCountryName); // Do CHOICE BUTTONS FUNCTION WITH OUR NAMES LIST and CORRECT nation TEXT as input!
      })
      .catch(error => { // This will catch any errors and show them back to me
        console.error("Error fetching flag data", error);
      }) 
};

//*******************SUMMONING THE BUTTONS JS*******************************/
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
    console.log(`Current names list: ${nameList}`);
    buttonTwo.classList.add('btn', 'btn-lg', 'btn-danger');
    flagTwoDiv.appendChild(buttonTwo);
    // Now add EVENT listeners to these buttons. They should both do my correctness check function on click!
    buttonOne.addEventListener('click', () => answerCheck(correctCountry, buttonOne, buttonTwo));
    buttonTwo.addEventListener('click', () => answerCheck(correctCountry, buttonTwo, buttonOne));
}

//***************ACTUAL CORRECTNESS CHECKING LOGIC, AND KEEPING THE GAME GOING!******************/
function answerCheck(correctNation, buttonToCheck, otherButton) { // Pass in the button we AREN'T checking against (the one not clicked) for deletion purposes and game loop logic
    // Grab the div inbetween the two text boxes to add our result/feedback later
    let textAreaDiv = document.getElementById("textArea");
    // have a variable we will adjust depending on their answer
    let feedbackText = null // Start as none
    if (buttonToCheck.id === correctNation) {
        // Disable buttons so NO SPAM CLICKS OCCUR
        buttonToCheck.disabled = true;
        otherButton.disabled = true;
        // Handle SCORE!
        userScore += 1;
        scoreText.textContent = `Score: ${userScore}`
        // Handle feedback in the text div area
        feedbackText = document.createElement("p"); // create a paragraph tag that we will use later
        feedbackText.classList.add('fs-3', 'fw-bold', 'text-decoration-underline'); // add bootstrap styling with the classes
        feedbackText.style.color = "lime"; // Change its color to green!
        feedbackText.textContent = "Correct!"; // Set its text to this
        textAreaDiv.appendChild(feedbackText) // Add it to the text area div for user to see in center!
        // Handle sound playing
        correctSound.currentTime = 0.3; // Start it from a little after beginning, thats when trump talks lol
        correctSound.volume = 0.8; // i adjusted the loudness myself so lets quiet it a little
        correctSound.play() // Play sound
        // Remove the text after a few seconds, and LOOP THE GAME!!!!!!!!!!!!!!!
        setTimeout(() => {
          feedbackText.remove(); // Kill the feedback text
          // Clear BOTH buttons from screen BEFORE getting the new stuff!!! (they are correct! so they should move)
          buttonToCheck.remove();
          otherButton.remove();
          getFlags(); // Get the flags, which gets the buttons, and yeah
        }, 1500) // After 1.5 seconds
    }
    else {
      // Disable ONLY clicked button so no spamming occurs, user gets chance to pick right answer
      buttonToCheck.disabled = true;
      // Handle SCORE
      if (userScore >= 2) { // ONLY take away if the score is not gonna be negative
        userScore -= 2;
        // Subtract 2 from score since user is allowed to pick right one and gain one back
        scoreText.textContent = `Score: ${userScore}`;
      }
      else { // Else...
        userScore = 0; // Keep the score 0
        scoreText.textContent = `Score: ${userScore}\n(Your score was too\nlow to subtract! 🤣)`; // Keep text zero
      }
      // Handle feedback text stuff
      feedbackText = document.createElement('p');
      feedbackText.classList.add('fs-3', 'fw-bold', 'text-decoration-underline'); // add bootstrap styling with the classes
      feedbackText.style.color = "red"; // Change its color to red!
      feedbackText.textContent = "Incorrect!"; // Set its text to this
      textAreaDiv.appendChild(feedbackText) // Add it to the text area div for user to see in center!
      // Handle sound stuff
      wrongSound.currentTime = 0; // Start from beginning
      wrongSound.volume = 0.8; // i adjusted vol myself here too, so lets quiet it a bit
      wrongSound.play(); // Play
      setTimeout(() => {
          feedbackText.remove(); // Kill it ( NO LOOP THIS TIME, ONLY ON CORRECT ANSWER)
        }, 1500) // After 1.5 seconds
    }
}
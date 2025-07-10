// This file will contain the JS for the homepage!

const contactMe = document.getElementById("contactMe"); // get the contact me button
const letsPlay = document.getElementById('letsPlay'); // get the let's play button
const pluhSound = document.getElementById('pluhSound'); // Get pluh sound
const dababySound = document.getElementById('dababySound'); // Get dababy sound
const homePageGif = document.getElementById('homePageGif'); // Get the spinning earth gif, we will adjust it later on play click

// Add event listener for lets play
letsPlay.addEventListener('click', (event) => {
    event.preventDefault(); // Don't let the anchor tag redirect immediately
    dababySound.currentTime = 0;
    dababySound.setVolume = 0.6;
    dababySound.play(); // Play the sound
    homePageGif.src = "static/assets/img/dababy.png"; // Change spinning globe to dababy
    homePageGif.style.transform = 'scaleX(-1)'; // Flip dababy horizontally
    homePageGif.style.transform = 'scaleX(-1)'; // flip again lol

    // Visually, reset button to unclicked
    letsPlay.blur();

    setTimeout(() => {
        window.location.href = letsPlay.href; // Go to the anchor tag's href attribute after the timeout
    }, 3000); // Should play for about 3 seconds
});

// Now for contact me
contactMe.addEventListener('click', (event) => { // All the same code lol
    event.preventDefault();
    pluhSound.currentTime = 0;
    pluhSound.setVolume = 0.9;
    pluhSound.play();

    // Visually, reset button to unclicked
    contactMe.blur();

    setTimeout(() => {
        window.location.href = contactMe.href;
    }, 1200) // About 1.2 seconds
})
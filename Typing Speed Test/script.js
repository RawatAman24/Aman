const textDisplay = document.getElementById("textDisplay");
const typingInput = document.getElementById("typingInput");

const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const errorsElement = document.getElementById("errors");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const result = document.getElementById("result");

const paragraphs = [
    "The quick brown fox jumps over the lazy dog. Learning to type faster can save a lot of time and improve your productivity.",

    "Web development is an exciting field where developers create websites and applications using HTML CSS JavaScript and modern technologies.",

    "Practice makes perfect. The more you practice typing every day the faster and more accurate you will become.",

    "Technology has changed the way people communicate work and learn. Good typing skills are useful for students and professionals.",

    "JavaScript is one of the most popular programming languages used to create interactive and dynamic websites."
];

let selectedText = "";
let timeLeft = 60;
let timer = null;
let testStarted = false;

function loadText() {

    const randomIndex = Math.floor(Math.random() * paragraphs.length);

    selectedText = paragraphs[randomIndex];

    textDisplay.innerHTML = "";

    selectedText.split("").forEach((character, index) => {

        const span = document.createElement("span");

        span.textContent = character;

        if (index === 0) {
            span.classList.add("current");
        }

        textDisplay.appendChild(span);
    });
}

function startTest() {

    if (testStarted) {
        return;
    }

    testStarted = true;

    typingInput.disabled = false;

    typingInput.focus();

    timeLeft = 60;

    timerElement.textContent = timeLeft;

    result.textContent = "";

    timer = setInterval(() => {

        timeLeft--;

        timerElement.textContent = timeLeft;

        calculateStats();

        if (timeLeft <= 0) {

            endTest();

        }

    }, 1000);
}

function calculateStats() {

    const typedText = typingInput.value;

    const characters = textDisplay.querySelectorAll("span");

    let correctCharacters = 0;
    let errors = 0;

    characters.forEach((span, index) => {

        if (index < typedText.length) {

            if (typedText[index] === selectedText[index]) {

                correctCharacters++;

                span.classList.add("correct");
                span.classList.remove("incorrect");

            } else {

                errors++;

                span.classList.add("incorrect");
                span.classList.remove("correct");

            }

        } else {

            span.classList.remove("correct");
            span.classList.remove("incorrect");

        }

        span.classList.remove("current");
    });

    if (typedText.length < characters.length) {

        characters[typedText.length].classList.add("current");

    }

    const wordsTyped = typedText.trim().length / 5;

    const elapsedTime = 60 - timeLeft;

    let wpm = 0;

    if (elapsedTime > 0) {

        wpm = Math.round(
            (wordsTyped / elapsedTime) * 60
        );

    }

    let accuracy = 100;

    if (typedText.length > 0) {

        accuracy = Math.round(
            (correctCharacters / typedText.length) * 100
        );

    }

    wpmElement.textContent = wpm;
    accuracyElement.textContent = accuracy + "%";
    errorsElement.textContent = errors;
}

function endTest() {

    clearInterval(timer);

    testStarted = false;

    typingInput.disabled = true;

    calculateStats();

    const finalWPM = wpmElement.textContent;
    const finalAccuracy = accuracyElement.textContent;

    result.innerHTML =
        `🎉 Test Complete!<br>
        Your Speed: <strong>${finalWPM} WPM</strong><br>
        Accuracy: <strong>${finalAccuracy}</strong>`;
}

function restartTest() {

    clearInterval(timer);

    testStarted = false;

    timeLeft = 60;

    timerElement.textContent = "60";

    wpmElement.textContent = "0";

    accuracyElement.textContent = "100%";

    errorsElement.textContent = "0";

    typingInput.value = "";

    typingInput.disabled = true;

    result.textContent = "";

    loadText();
}

typingInput.addEventListener("input", () => {

    if (!testStarted) {
        return;
    }

    calculateStats();

    if (typingInput.value.length >= selectedText.length) {

        endTest();

    }

});

startBtn.addEventListener("click", startTest);

restartBtn.addEventListener("click", restartTest);

loadText();
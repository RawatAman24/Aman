const form = document.querySelector(".my-form");
const inputValue = document.getElementById("input-value");
const generatedImage = document.getElementById("generated-image");
const imageText = document.getElementById("imageContainerText");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const prompt = inputValue.value.trim();
    if (!prompt) {
        alert("Please enter some text");
        return;
    }
    imageText.innerText = "Generating image...";
    generatedImage.src = "";
    try {
        // Example using Pollinations AI (Free)
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
        generatedImage.src = imageUrl;
        imageText.innerText = "Generated Image:";
    } catch (error) {
        imageText.innerText = "Error generating image.";
        console.error(error);
    }
});

/*Quize App*/
const quizData = [
{
    question: "What does HTML stand for?",
    a: "Hyper Text Markup Language",
    b: "High Text Machine Language",
    c: "Hyper Transfer Markup Language",
    d: "Home Tool Markup Language",
    correct: "a"
},
{
    question: "Which language is used for styling web pages?",
    a: "HTML",
    b: "CSS",
    c: "Python",
    d: "Java",
    correct: "b"
},
{
    question: "Which language is used for web development?",
    a: "JavaScript",
    b: "C",
    c: "C++",
    d: "Assembly",
    correct: "a"
},
{
    question: "Which tag is used for links in HTML?",
    a: "<p>",
    b: "<img>",
    c: "<a>",
    d: "<div>",
    correct: "c"
}
];
const question =
document.getElementById("question");
const a_text =
document.getElementById("a_text");
const b_text =
document.getElementById("b_text");
const c_text =
document.getElementById("c_text");
const d_text =
document.getElementById("d_text");
const submitBtn =
document.getElementById("submit");
let currentQuiz = 0;
let score = 0;
loadQuiz();
function loadQuiz()
{
    deselectAnswers();
    const currentData =
    quizData[currentQuiz];
    question.innerText =
    currentData.question;
    a_text.innerText =
    currentData.a;
    b_text.innerText =
    currentData.b;
    c_text.innerText =
    currentData.c;
    d_text.innerText =
    currentData.d;
}
function deselectAnswers()
{
    const answers =
    document.querySelectorAll(
        'input[name="answer"]'
    );
    answers.forEach(answer =>
    {
        answer.checked = false;
    });
}
function getSelected()
{
    const answers =
    document.querySelectorAll(
        'input[name="answer"]'
    );
    let answer =
    undefined;
    answers.forEach(option =>
    {
        if(option.checked)
        {
            answer = option.value;
        }
    });
    return answer;
}
submitBtn.addEventListener(
"click",
() =>
{
    const answer =
    getSelected();
    if(answer)
    {
        if(
            answer ===
            quizData[currentQuiz].correct
        )
        {
            score++;
        }
        currentQuiz++;
        if(
            currentQuiz <
            quizData.length
        )
        {
            loadQuiz();
        }
        else
        {
            document.getElementById(
                "quiz"
            ).innerHTML =`
            <h2>
            You scored
            ${score}
            out of
            ${quizData.length}
            </h2>
            <button
            onclick="location.reload()">
            Restart Quiz
            </button>
            `;
        }
    }
});
/*Weather*/
async function getWeather() {
    const city = document.getElementById("cityInput").value;
    const result = document.getElementById("weatherResult");
    if (city === "") {
        result.innerHTML = "<p>Please enter a city name.</p>";
        return;
    }
    const apiKey = "1a2b3c4d5e6f7g8h9i0j123456789abc";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod !== 200) {
            result.innerHTML = `<p>${data.message}</p>`;
            return;
        }
        result.innerHTML = `
            <div class="weather-card">
                <h2>${data.name}, ${data.sys.country}</h2>
                <p>🌤 Weather: ${data.weather[0].main}</p>
                <p>🌡 Temperature: ${data.main.temp} °C</p>
                <p>💧 Humidity: ${data.main.humidity}%</p>
                <p>🌬 Wind Speed: ${data.wind.speed} m/s</p>
            </div>
        `;
    } catch (error) {
        result.innerHTML = "<p>Error fetching weather data.</p>";
        console.log(error);
    }
}
/* Add to cart*/
function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(name + " added to cart!");
}
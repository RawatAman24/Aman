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
/* Weather app*/
async function getWeather()
{
    // Get city name
    const city =
        document.getElementById("cityInput").value;
    // API Key
    const apiKey = "YOUR_API_KEY";
    // API URL
    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try
    {
        // Fetch data
        const response =
            await fetch(url);
        // Convert JSON
        const data =
            await response.json();
        // Check city exists
        if(data.cod === "404")
        {
            document.getElementById(
                "weatherResult"
            ).innerHTML =
            "<h3>City not found</h3>";
            return;
        }
        // Display data
        document.getElementById(
            "weatherResult"
        ).innerHTML =
        `
        <h2>${data.name}</h2>
        <p>
            Temperature:
            ${data.main.temp} °C
        </p>
        <p>
            Humidity:
            ${data.main.humidity}%
        </p>
        <p>
            Wind Speed:
            ${data.wind.speed} m/s
        </p>
        <p>
            Weather:
            ${data.weather[0].description}
        </p>
        `;
    }
    catch(error)
    {
        document.getElementById(
            "weatherResult"
        ).innerHTML =
        "<h3>Error fetching data</h3>";

        console.log(error);
    }
}

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
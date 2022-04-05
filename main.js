const categories = ["General Knowledge", "Entertainment: Books", "Entertainment: Film", "Entertainment: Music", 
"Entertainment: Musicals & Theatres", "Entertainment: Television", "Entertainment: Video Games", 
"Entertainment: Board Games", "Science & Nature", "Science: Computers", "Science: Mathematics", 
"Mythology", "Sports", "Geopraphy", "History", "Politics", "Art", "Celebrities", "Animals", 
"Vehicles", "Entertainment: Comics", "Science: Gadgets", "Entertainment: Japanese Anime & Manga", 
"Entertainment: Cartoon & Animation"];

let resultArray = [];
let isDarkMode = false;

categories.forEach(category => {
    let option = $("<option></option/>").text(category).val(categories.indexOf(category) + 9);
    $("#categorySelector").append(option);
});

let getData = async(url) => {
    let queries = "?"
    let numberOfQuestions = $("#numberOfQuestions").val();
    queries +=`amount=${numberOfQuestions}`

    let chosenCategory = $("#categorySelector").val();
    if(chosenCategory !== "any") {
        queries +=`&category=${chosenCategory}`
    }

    let chosenDifficulty = $("#difficultySelector").val();
    if(chosenDifficulty !== "any") {
        queries +=`&difficulty=${chosenDifficulty}`
    }

    let chosenType = $("[name='type']:checked").val();
    queries +=`&type=${chosenType}`

    let response = await fetch(url + queries);
    return await response.json();
}

let renderQuiz = async () => {
    let data = await getData("https://opentdb.com/api.php");
    console.log(data);
    let questionList = [];
    for(let i = 0; i < data.results.length; i++) {
        questionList.push(data.results[i]);
    }
    console.log(questionList);

    questionList.forEach((questionObj) => {
        let {correct_answer, incorrect_answers, question, type} = questionObj
        let questionNumberString = $("<p></p>").text(`Question: ${questionList.indexOf(questionObj)}`)
        let questionString = $("<p></p>").text(question);
        let answers = [];
        answers.push($("<button></button>").text(correct_answer).attr("class", "correctBtn"));
        for(let i = 0; i < incorrect_answers.length; i++) {
            answers.push($("<button></button>").text(incorrect_answers[i]).attr("class", "falseBtn"));
        }
        shuffle(answers);

        let questionDiv = $("<div></div>");
        $(questionDiv).append(questionString, answers, questionNumberString)
        $(".gameDiv").append(questionDiv);

        $(".correctBtn").click((event) => {
            $(event.target).parent().css("background-color", "green");
            scoreKeeping(resultArray, "correct");
        });

        $(".falseBtn").click((event) => {
            $(event.target).parent().css("background-color", "red");
            scoreKeeping(resultArray, "wrong");
        })
    });

    let getResultsBtn = $("<button></button>").text("Get results");
    $(getResultsBtn).click(() => {
        renderResult();
    })
    $(".gameDiv").append(getResultsBtn);
}

let renderResult = () => {
    $(".gameDiv").hide();
    let resultObj = calculateScore(resultArray);
    let proportionCorrect = resultObj.numberOfCorrect;
    let resultString = $("<p></p>").text(`Your result is: ${resultObj.numberOfCorrect} correct out of ${resultArray.length}.`);
    let passedOrNotString = $("<p></p>")

    if(proportionCorrect < 0.5) {
        $(".resultDiv").css("background-color", "red");
        $(passedOrNotString).text("Failed")
    } else if(proportionCorrect < 0.85) {
        $(".resultDiv").css("background-color", "yellow");
        $(passedOrNotString).text("Passed");
    } else {
        $(".resultDiv").css("background-color", "green");
        $(passedOrNotString).text("Very much passed");
    }
    let playAgainBtn = $("<button></button>").text("Play again?");
    $(playAgainBtn).click(() => {
        $(".optionsDiv").show();
    })
    $(".resultDiv").append(resultString, passedOrNotString, playAgainBtn);
}

$("#confirmBtn").click(() => {
    $(".optionsDiv").hide();
    renderQuiz();
});

$("#darkModeBtn").click(() => {
    if(isDarkMode === false) {
        $("body").css("background-color", "black");
        isDarkMode = true;
    } else {
        $("body").css("background-color", "white");
        isDarkMode = false;
    }
})

function scoreKeeping(resultArray, result) {
    if(result === "correct") {
        resultArray.push(true);
    } else if (result === "wrong") {
        resultArray.push(false);
    } else if (result === "clear") {
        resultArray.length = 0;
    }
}

function calculateScore(resultArray) {
    let resultObj = {numberOfCorrect, proportionCorrect};
    for(let i = 0; i < resultArray.length; i++) {
        if(resultArray[i] === true) {
            resultObj.numberOfCorrect++;
        }
        resultObj.proportionCorrect = resultObj.numberOfCorrect / resultArray.length;
    }
    return resultObj;
}

//Durstenfeld shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
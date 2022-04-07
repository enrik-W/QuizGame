const categories = ["General Knowledge", "Entertainment: Books", "Entertainment: Film", "Entertainment: Music", 
"Entertainment: Musicals & Theatres", "Entertainment: Television", "Entertainment: Video Games", 
"Entertainment: Board Games", "Science & Nature", "Science: Computers", "Science: Mathematics", 
"Mythology", "Sports", "Geopraphy", "History", "Politics", "Art", "Celebrities", "Animals", 
"Vehicles", "Entertainment: Comics", "Science: Gadgets", "Entertainment: Japanese Anime & Manga", 
"Entertainment: Cartoon & Animation"];

let resultArray = [];

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
    let questionList = [];
    for(let i = 0; i < data.results.length; i++) {
        questionList.push(data.results[i]);
    }

    questionList.forEach((questionObj) => {
        let {correct_answer, incorrect_answers, question, type} = questionObj

        let createArea = $("<textarea></textarea>").html(question).text();
        let createAreaCAns = $("<textarea></textarea>").html(correct_answer).text();
        let createAreaAns = []
        
        for(let i = 0; i < incorrect_answers.length; i++) {
            createAreaAns.push($("<textarea></textarea>").html(incorrect_answers[i]).text());
        }

        console.log(createAreaAns);
        question = createArea;
        correct_answer = createAreaCAns;
        incorrect_answers = createAreaAns;
        
        let questionNumberString = $("<p></p>").text(`Question: ${questionList.indexOf(questionObj) + 1}`);
        let questionString = $("<p></p>").text(question);
        let answers = [];
        answers.push($("<button></button>").text(correct_answer).attr("class", "correctBtn"));
        for(let i = 0; i < incorrect_answers.length; i++) {
            answers.push($("<button></button>").text(incorrect_answers[i]).attr("class", "falseBtn"));
        }
        shuffle(answers);

        let questionDiv = $("<div></div>");
        $(questionDiv).append(questionNumberString, questionString, answers);
        $(".gameDiv").append(questionDiv);
    });

    let getResultsBtn = $("<button></button>").text("Get results");
    $(getResultsBtn).click(() => {
        renderResult();
    })
    
    $(".gameDiv").append(getResultsBtn);

    $(".correctBtn").click((event) => {
        let correct = $("<p></p>").text("Correct!");
        $(event.target).parent().css("background-color", "green").append(correct);
        scoreKeeping(resultArray, true);
    });
    
    $(".falseBtn").click((event) => {
        let wrong = $("<p></p>").text("Wrong!");
        $(event.target).parent().css("background-color", "red").append(wrong);
        scoreKeeping(resultArray, false);
    })
}

let renderResult = () => {
    $(".gameDiv").hide();
    $(".resultDiv").show();
    let resultObj = calculateScore(resultArray);
    let proportionCorrect = resultObj.proportionCorrect;
    let resultString = $("<p></p>").text(`Your result is: ${resultObj.numberOfCorrect} correct out of ${resultArray.length}.`);
    let passedOrNotString = $("<p></p>")

    if(proportionCorrect < 0.5) {
        $(".resultDiv").css("background-color", "red");
        $(passedOrNotString).text("Failed")
    } else if(proportionCorrect < 0.75) {
        $(".resultDiv").css("background-color", "yellow");
        $(passedOrNotString).text("Passed");
    } else {
        $(".resultDiv").css("background-color", "green");
        $(passedOrNotString).text("Very much passed");
    }
    let playAgainBtn = $("<button></button>").text("Play again?");
    $(playAgainBtn).click(() => {
        $(".optionsDiv").show();
        $(".gameDiv").children().remove();
        $(".resultDiv").children().remove();
        
        clearArray(resultArray);
    })
    $(".resultDiv").append(resultString, passedOrNotString, playAgainBtn);
}

function scoreKeeping(resultArray, result) {
    resultArray.push(result);
}

function clearArray(resultArray) {
    resultArray.length = 0;
}

function calculateScore(resultArray) {
    let resultObj = {numberOfCorrect: 0, proportionCorrect: 0.0};
    for(let i = 0; i < resultArray.length; i++) {
        if(resultArray[i] === true) {
            resultObj.numberOfCorrect++;
        }
        resultObj.proportionCorrect = (resultObj.numberOfCorrect / resultArray.length);
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

$("#confirmBtn").click(() => {
    $(".optionsDiv").hide();
    $(".gameDiv").show();
    renderQuiz();
});

$("#darkModeBtn").click(() => {
    if($("body").hasClass("dark")) {
        $("body").removeClass("dark");
        $("#darkModeBtn").text("Dark mode OFF");
    } else {
        $("body").addClass("dark");
        $("#darkModeBtn").text("Dark mode ON");
    }
});
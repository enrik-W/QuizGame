let resultArray = [];
let questionList = [];
let chosenCategory = 0;
let chosenDifficulty = "";

let renderCategories = () => {
    const categories = ["General Knowledge", "Entertainment: Books", "Entertainment: Film", "Entertainment: Music", 
    "Entertainment: Musicals & Theatres", "Entertainment: Television", "Entertainment: Video Games", 
    "Entertainment: Board Games", "Science & Nature", "Science: Computers", "Science: Mathematics", 
    "Mythology", "Sports", "Geopraphy", "History", "Politics", "Art", "Celebrities", "Animals", 
    "Vehicles", "Entertainment: Comics", "Science: Gadgets", "Entertainment: Japanese Anime & Manga", 
    "Entertainment: Cartoon & Animation"];

    categories.forEach(category => {
        let option = $("<option></option/>").text(category).val(categories.indexOf(category) + 9);
        $("#categorySelector").append(option);
    });
}

let getData = async(url) => {
    let queries = "?"
    let numberOfQuestions = $("#numberOfQuestions").val();
    queries +=`amount=${numberOfQuestions}`

    chosenCategory = $("#categorySelector").val();
    if(chosenCategory !== "any") {
        queries +=`&category=${chosenCategory}`
    }

    chosenDifficulty = $("#difficultySelector").val();
    if(chosenDifficulty !== "any") {
        queries +=`&difficulty=${chosenDifficulty}`
    }

    let chosenType = $("[name='type']:checked").val();
    queries +=`&type=${chosenType}`

    let response = await fetch(url + queries);
    return await response.json();
}

let properText = (question, correct_answer, incorrect_answers = []) => {
    let properTextObj = {questionText: "", correctAnswerText: "", incorrectAnswersText: []}

    properTextObj.questionText = $("<textarea></textarea>").html(question).text();
    properTextObj.correctAnswerText = $("<textarea></textarea>").html(correct_answer).text();
    properTextObj.incorrectAnswersText = [];
        
        for(let i = 0; i < incorrect_answers.length; i++) {
            properTextObj.incorrectAnswersText.push($("<textarea></textarea>").html(incorrect_answers[i]).text());
        }

    return properTextObj;
}

let setQuizTitle = () => {
    let infoString = $("<h3></h3>");

    if(chosenCategory !== "any") {
        try {
            infoString.text(`Quiz about: ${questionList[0].category},`);
        } catch {
            alert("Not enough questions meeting your criterias were found!");
            renderResult();
        }
       
    } else {
        infoString.text("Quiz about: Anything!");
    }

    if(chosenDifficulty !== "any") {
        try {
            infoString.append(` Difficulty ${questionList[0].difficulty}`);
        } catch {
            alert("Not enough questions meeting your criterias were found!");
            renderResult();
        }
        
    } else {
        infoString.append(" Any Difficulty!")
    }

    $(".gameDiv").before(infoString);
}

let renderQuiz = async () => {
    let data = await getData("https://opentdb.com/api.php");

    for(let i = 0; i < data.results.length; i++) {
        questionList.push(data.results[i]);
    }

    questionList.forEach((questionObj) => {
        let {correct_answer, incorrect_answers, question} = questionObj;

        let properTextObj = properText(question, correct_answer, incorrect_answers);

        question = properTextObj.questionText;
        correct_answer = properTextObj.correctAnswerText;
        incorrect_answers = properTextObj.incorrectAnswersText;
        
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

    setQuizTitle();
    defineCorrectButton();
    defineWrongButton();
    defineGetResultButton();
}

let defineGetResultButton = () => {
    let getResultsBtn = $("<button></button>").text("Get results");

    $(getResultsBtn).click(() => {
        renderResult();
    });

    $(".gameDiv").append(getResultsBtn);
}
    
let defineCorrectButton = () => {
    $(".correctBtn").click((event) => {
        let correct = $("<p></p>").text("Correct!");
        $(event.target).parent().css("background-color", "green").append(correct);
        scoreKeeping(resultArray, true);
    });
}

let defineWrongButton = () => {
    $(".falseBtn").click((event) => {
        let wrong = $("<p></p>").text("Wrong!");
        $(event.target).parent().css("background-color", "red").append(wrong);
        scoreKeeping(resultArray, false);
    });
}

let renderResult = () => {
    $(".gameDiv").hide();
    let resultDiv = $("<div></div>").attr("class", "resultDiv");
    $("body").append(resultDiv);

    let resultObj = calculateScore(resultArray);
    let proportionCorrect = resultObj.proportionCorrect;
    let numberOfCorrect = resultObj.numberOfCorrect;
    let resultString = $("<p></p>").text(`Your result is: ${numberOfCorrect} correct out of ${questionList.length}.`);
    let passedOrNotString = $("<p></p>");

    if(proportionCorrect < 0.5) {
        $(resultDiv).css("background-color", "red");
        $(passedOrNotString).text("Failed");
    } else if(proportionCorrect < 0.75) {
        $(resultDiv).css("background-color", "yellow");
        $(resultDiv).css("color", "black");
        $(passedOrNotString).text("Passed");
    } else {
        $(resultDiv).css("background-color", "green");
        $(passedOrNotString).text("Very much passed");
    }

    $(resultDiv).append(resultString, passedOrNotString);
    definePlayAgainButton(resultDiv);
}

let definePlayAgainButton = (resultDiv) => {
    let playAgainBtn = $("<button></button>").text("Play again?");

    $(playAgainBtn).click(() => {
        $(".optionsDiv").show();
        $(".gameDiv").children().remove();
        $(resultDiv).remove();
        
        clearArray(resultArray);
        clearArray(questionList);
    });

    $(resultDiv).append(playAgainBtn);
}

let scoreKeeping = (resultArray, result) => {
    resultArray.push(result);
}

let clearArray = (array) => {
    array.length = 0;
}

let calculateScore = (resultArray) => {
    let resultObj = {numberOfCorrect: 0, proportionCorrect: 0.0};
    for(let i = 0; i < resultArray.length; i++) {
        if(resultArray[i] === true) {
            resultObj.numberOfCorrect++;
        }

        resultObj.proportionCorrect = (resultObj.numberOfCorrect / questionList.length);
        console.log(resultObj.proportionCorrect);
    }

    return resultObj;
}

//Durstenfeld shuffle
let shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

let defineConfirmButton = () => {
    $("#confirmBtn").click(() => {
        if($("#numberOfQuestions").val() > 50 || $("#numberOfQuestions").val() < 1) {
            alert("You can only have between 1 and 50 questions");
        } else {
            $(".optionsDiv").hide();
            $(".gameDiv").show();
            renderQuiz();
        }
    });
}

let defineDarkModeButton = () => {
    $("#darkModeBtn").click(() => {
        if($("body").hasClass("dark")) {
            $("body").removeClass("dark");
            $("#darkModeBtn").text("Dark mode OFF");
        } else {
            $("body").addClass("dark");
            $("#darkModeBtn").text("Dark mode ON");
        }
    });
}

renderCategories();
defineConfirmButton();
defineDarkModeButton();
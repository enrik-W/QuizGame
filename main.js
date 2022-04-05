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
    console.log(data);
    let questionList = [];
    for(let i = 0; i < data.results.length; i++) {
        questionList.push(data.results[i]);
    }
    console.log(questionList);

    questionList.forEach((questionObj) => {
        let {correct_answer, incorrect_answers, question, type} = questionObj
        let questionString = $("<p></p>").text(question);
        let answers = [];
        answers.push($("<button></button>").text(correct_answer).attr("class", "correctBtn"));
        for(let i = 0; i < incorrect_answers.length; i++) {
            answers.push($("<button></button>").text(incorrect_answers[i]).attr("class", "falseBtn"));
        }
        shuffle(answers);

        let questionDiv = $("<div></div>");
        $(questionDiv).append(questionString, answers)
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
}

let renderResult = () => {
    let resultString = $("<p></P>").text(`Your result is: ${calculateScore(resultArray)} correct out of ${resultArray.length}.`)
}

$("#confirmBtn").click(() => {
    renderQuiz();
});

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
    let numberOfCorrect = 0;
    for(let i = 0; i < resultArray.length; i++) {
        if(resultArray[i] === true) {
            numberOfCorrect++;
        }
    }
    return numberOfCorrect;
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
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

let getData = async(url) => {
    let queries = "?"
    let numberOfQuestions = document.querySelector("#numberOfQuestions");
    queries +=`amount=${numberOfQuestions.value}`

    let chosenCategory = document.querySelector("#categorySelector");
    if(chosenCategory.value !== "any") {
        queries +=`&category=${chosenCategory.value}`
    }

    let chosenDifficulty = document.querySelector("#difficultySelector");
    if(chosenDifficulty.value !== "any") {
        queries +=`&difficulty=${chosenDifficulty.value}`
    }

    let chosenType = document.querySelector("[name='type']:checked");
    queries +=`&type=${chosenType.value}`

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
        answers.push($("<button></button>").text(correct_answer));
        for(let i = 0; i < incorrect_answers.length; i++) {
            answers.push($("<button></button>").text(incorrect_answers[i]));
        }
        shuffle(answers);
        
        let questionDiv = $("<div></div>")
        $(questionDiv).append(questionString, answers)
        $(".gameDiv").append(questionDiv);
    });
}

document.querySelector("#confirmBtn").addEventListener("click",() => {
    renderQuiz();
})

//Durstenfeld shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
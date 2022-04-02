let categories = ["General Knowledge", "Entertainment: Books", "Entertainment: Film", "Entertainment: Music", "Entertainment: Musicals & Theatres", "Entertainment: Television", "Entertainment: Video Games", "Entertainment: Board Games", "Science & Nature", "Science: Computers", "Science: Mathematics", "Mythology", "Sports", "Geopraphy", "History", "Politics", "Art", "Celebrities", "Animals", "Vehicles", "Entertainment: Comics", "Science: Gadgets", "Entertainment: Japanese Anime & Manga", "Entertainment: Cartoon & Animation"];

categories.forEach(category => {
    let option = document.createElement("option")
    option.value = categories.indexOf(category) + 9;
    option.innerHTML = category;
    document.querySelector("#categorySelector").append(option);
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
    let data = getData("https://opentdb.com/api.php");
    console.log(data);
}

document.querySelector("#confirmBtn").addEventListener("click",() => {
    renderQuiz();
})
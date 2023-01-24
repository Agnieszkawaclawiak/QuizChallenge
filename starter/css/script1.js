//gettiong all element//
const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = document.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const option_list = document.querySelector(".option_list");
const timeCount = quiz_box.querySelector(".timer .timer_sec");
const timeLine = quiz_box.querySelector(".header .timer_line")
//if start quiz button clicked//
start_btn.onclick = () =>{
    info_box.classList.add("activeInfo"); // show the rules box 
} 
//if exit button clicked//
exit_btn.onclick = () =>{
    info_box.classList.remove("activeInfo"); // hide the rules box 
} 

//if continue button clicked//
continue_btn.onclick = () =>{
    info_box.classList.remove("activeInfo"); // hide the rules box 
    quiz_box.classList.add("activeQuiz"); //show the quiz
 showQuestions(0);
 queCounter(1);
 startTimer(15);
} 
let que_count = 0;
let que_numb =1;
let counter;
let timeValue = 15;
let widthValue = 0;

const next_btn = quiz_box.querySelector(".next_btn");
//If next button clicked 
next_btn.onclick = () =>{
if (que_count < questions.length - 1){
    que_count++;
    que_numb++;
    showQuestions(que_count);
    queCounter(que_numb);
        clearInterval(counter);
        startTimer(timeValue);
        clearInterval(counterLine);
        startTimerLine(widthValue);
     

}else{
    console.log("Questions completed")
}


}

//getting questions and optiond form array 
function showQuestions(index) {
    const que_text = document.querySelector(".que_text");

    let que_tag = '<span>' +questions[index].numb + questions[index].question + '</span>';
    let option_tag = '<div class = "option">' + questions[index].options[0] + '<span></span></div>'
                   +  '<div class = "option">' + questions[index].options[1] + '<span></span></div>'
                   +  '<div class = "option">' + questions[index].options[2] + '<span></span></div>'
                   +  '<div class = "option">' + questions[index].options[3] + '<span></span></div>'
                   

    que_text.innerHTML = que_tag;
    option_list.innerHTML = option_tag;
    const option = option_list.querySelectorAll(".option");
    for (let i = 0; i < option.length; i++){
  option[i].setAttribute("onclick", "optionSelected(this)");
    }
}   

let tickIcon =   '<div class="icon tick"><i class = "fas fa-check"></i></div>';
let iconCross =  '<div class="icon cross"><i class="fas fa-times"></i></div>';

function optionSelected(answer) {
    clearInterval(counter);
   
    let userAns = answer.textContent;
    let correctAns = questions[que_count].answer;
    let allOptions = option_list.children.length;
   
    if(userAns == correctAns) {
         console.log("answer is correct");
          answer.classList.add("correct")
      answer.insertAdjacentHTML("beforeend", tickIcon);
    } else {
        answer.classList.add("incorrect")
        console.log("answer is wrong");
        answer.insertAdjacentHTML("beforeend", iconCross);
        //if answers correct then automatically select correct answer
        for (let i = 0; i <allOptions; i++){
         option_list.children[i].setAttribute("class", "option correct");
         option_list.children[i].insertAdjacentHTML("beforeend", tickIcon);    }
    }

    //once user selected disabled all options
    for (let i = 0; i< allOptions; i++){
        if(option_list.children[i].textContent == correctAns){
        option_list.children[i].classList.add("disabled");
}


}}
function startTimer (time) {
    counter = setInterval(timer, 1000);
    function timer(){
        timeCount.textContent = time;
        time--;
        if(time < 9) {
            let addZero = timeCount.textContent;
         
            timeCount.textContent = "0" + addZero;
        }
        if(time < 0 ){
            clearInterval(counter);
            timeCount.textContent ="00";
        }
    }
}
function startTimerLine(time) {
    counterLine = setInterval(timer, 29);
    function timer(){
       time += 1;
       timeLine.style.width = time + "px";
        }
        if(time > 549 ){
            clearInterval(counterLine);
   
        }
    }

function queCounter(index){
    const bottom_gues_counter = quiz_box.querySelector(".total_que");
let totalQuestCountTag =  '<span><p>' + index + '</p>of<p>' +questions.length + '</p>Questions</span>';
bottom_gues_counter.innerHTML = totalQuestCountTag}


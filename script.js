const lettersDiv = document.querySelector('.letters');
const gameCommentary = document.querySelector('.game-commentary');
const lives = document.querySelector('.lives');
const buttons = document.querySelector('.btn-container').children;

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split("");

let livesLeft = 10; 
let index;
let letters = [];
let chosenPlayer; 
let playing; 

let wordsArray = ['Wayne Rooney', 'Ruud Van Nistelrooy', 'Bobby Charlton', 'Ryan Giggs', 'Roy Keane', 'John O\'Shea', 'Nemanja Vidic', 'Alan Smith', 'Jaap Staam', 'Steve Bruce', 'Philip Neville', 'Roy Carroll', 'Cristiano Ronaldo', 'Bruno Fernandes', 'Mason Greenwood', 'Shola Shoretire', 'Luis Nani', 'Phil Jones', 'Edwin Van Der Sar', 'Robin Van Persie', 'Wilfried Zaha', 'Angel Di Maria']; 

let hints = ['Scored a hattrick on his debut for Manchester United against Fenerbache', 'Played for the Reds over 5 seasons, scoring 95 goals in 150 appearances', 'A survivor of the infamous 1958 Munich air disaster', '13 time Premier League champion with the Red Devils', 'Involved in the imfamous leg break of Alf-Inge Haaland', 'A fan fvourite during his time at United, famously nutmegging a well-known Portuguese playmaker in a Champions League tie at OT in 2003', 'A legend of the club, he arrived at the club at the same time as Patrice Evra, in the 2006 January transfer window', 'Famously known by his nickname \'Smudge\'', 'One of the toughest to wear the United shirt, this player was transfered to Lazio in what Sir Alex Ferguson later admitted was one of his biggest mistakes as United manager', 'A Geordie bruiser who has gone on to manage several clubs in the Premier League including Wigan, Hull and Newcastle', 'The left-sided player of a brother-brother full back pair', 'This player was famously involved in a \'ghost goal\' situation against Tottenham in 2005', 'Arguably the greatest player to play in the United shirt, this player won the Balon D\'or whilst playing for the club in 2008', 'Portuguese playmaker signed from Sporting Lisbon', 'The youngest English player to make 100 appearances for United', 'Youngest player in United\'s history to make an appearance in Europe', 'A fan favourite, this player used to mark his celebrations with his famous backflips', 'Sir Alex Ferguson praised this player in 2013, saying \'arguably the way he is looking, could be our best ever player\'', 'Holds the Premier League record for the most consecutive clean sheets', 'Scored a hattrick in a game against Aston Villa that won United the league title in his debut season with the reds', 'Rumoured to have dated the then United manager\'s daughter', 'Staying with the reds for only a single season, this player set up Juan Mata\'s famous acrobatic goal against Liverpool at Anfield in 2015']; 

// create array of the child elements within the 'letters-container' div (the letter buttons)
const lettersContainer = Array.from(document.querySelector('.letters-container').children);

// create array containing the letters buttons only (get rid of the hardcoded <br>)
lettersContainer.forEach(item => {
  alphabet.forEach(letter => {
    if(letter === item.innerHTML){
      letters.push(item); 
    }
  });
});

// set lives
lives.innerHTML = livesLeft; 
buttons[2].addEventListener('click', startGame); 

function startGame(){
  playing = true; 
  hideButtons();
  choosePlayer(); 
  lettersWorking();
}

function hideButtons(){
  buttons[0].classList.toggle('hide-btn');
  buttons[1].classList.toggle('hide-btn');
  buttons[2].classList.toggle('hide-btn');
}

// choose random player and append name in underscores, spaces and apostrophies where appropriate
function choosePlayer(){
  let randomIndex = Math.floor(Math.random() * wordsArray.length);
  chosenPlayer = wordsArray[randomIndex]; // player name
  let playerLetters = chosenPlayer.split(""); 

  playerLetters.forEach(item => { // forEach letter in name
    if(item === " " || item === "'"){  // if space or apost
      const newElement = document.createElement('p');//create p element
      newElement.append(item); //append space or ' into p
      lettersDiv.appendChild(newElement); //append p tag
    } else {   // else if it's a letter
      const newElement = document.createElement('p');
      newElement.append('_');  // append underscore
      lettersDiv.appendChild(newElement);
    }
  });

  // this could be included as the else to ensure all other characters are definitely letters 

  //   } else {
  //     alphabet.forEach(letter => {
  //       if(item.toLowerCase() === letter.toLowerCase()){
  //         const newElement = document.createElement('p');
  //         newElement.append('_');
  //         lettersDiv.appendChild(newElement);
  //       } 
  //     });
  //   }    
  // });
}

// functionality for letters
function lettersWorking(){
  letters.forEach(letter => {
    letter.addEventListener('click', () => {
      if(playing){   // if game is ongoing
        let underScores = Array.from(lettersDiv.children); // array of <p> elements (the hangman letters)


        // regex to get the index's of all the occurences of the letter in the name 

        //make a regular expression out of your needle
        let needle = letter.innerHTML; // letter to check
        let re = new RegExp(needle,'gi');
        let haystack = chosenPlayer;  // string to check
        let results = new Array();    // array of index's 
        while (re.exec(haystack)){
          results.push(re.lastIndex);
        }
        // index's are +1 as they dont recognise 0 based index, so item - 1 acesses the previous index to take into account 0 index
        results.forEach(item => {  // for each index
          if(chosenPlayer[item - 1].toLowerCase() === letter.innerHTML){   // if letter[=== to index] in player name string === letter clicked
            underScores[item - 1].innerHTML = letter.innerHTML;   // <p>.innerHMTL = letter clicked
            letter.classList.add('transparent'); // letter clicked appears as clicked
          }
        });

        
        if(!letter.classList.contains('transparent')){
          // if letter clicked hasn't already been clicked
          livesLeft--;     // lose a life
          lives.innerHTML = livesLeft;//update life for user
          letter.classList.add('transparent'); // letter now been clicked
        }

        if(livesLeft === 0){   // if no lives left
          gameCommentary.innerHTML = 'GAME OVER.';
          playing = false;
          gameCommentary.classList.add('rotate');
          gameCommentary.style.fontSize = "2rem";
        }

        // if theres a winner
        isWinner(); 
      }
    });
  });
}

function isWinner(){
  let array = Array.from(lettersDiv.children); // hangman letters <p> tags
  let innerHTMLArray = [];
  let spaceCount = 0;

  array.forEach(item => {    // for each hangman letter
    innerHTMLArray.push(item.innerHTML);  //push into array
  })

  // create array of only underscores and spaces
  let filteredHaystack = innerHTMLArray.filter(item => {
    if(item === " " || item === "_"){
      return item; 
    }
  });
  
  filteredHaystack.forEach(item => {    
    if(item === " "){   // if theres a space 
      spaceCount++;    // count amount of spaces 
    }

    // as letters are clicked, there are less items in the filteredHaystack array, so if all the letters have been clicked, then this array will only have " " spaces left. if spaceCount are only things left in array, then user has guessed all letters and therefore won 
    if(spaceCount === filteredHaystack.length){ 
      playing = false;
      gameCommentary.innerHTML = "WINNER!!";
      gameCommentary.classList.add('rotate');
      gameCommentary.style.fontSize = "2rem";
    }
  })
}

// hint button functionality
buttons[0].addEventListener('click', () => {
  if(playing){
    let index = wordsArray.indexOf(chosenPlayer);
    let correctHint = hints[index]; 
    gameCommentary.innerHTML = correctHint;
  }
});

// play again button functionality
buttons[1].addEventListener('click', () => {
  reset();      // reset all resettables 
  choosePlayer();   // choose new player
  // isWinner();   
});

// reset all resetable features
function reset(){
  playing = true;
  livesLeft = 10; 
  lives.innerHTML = livesLeft; 
  removeAllChildNodes(lettersDiv);
  letters.forEach(item => {
    item.classList.remove('transparent');
  });

  gameCommentary.innerHTML = "";
  gameCommentary.style.fontSize = "1rem";
  gameCommentary.classList.remove('rotate'); 
}

function removeAllChildNodes(parent) {
  while(parent.firstChild) {  // while theres a child el
    parent.removeChild(parent.firstChild); //remove firstChild
  }
}
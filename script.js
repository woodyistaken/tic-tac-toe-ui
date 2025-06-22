function createBoard(){
  let board=[["","",""],["","",""],["","",""]]
  const changeSquare=function(row,column,symbol){
    if(getSquare(row,column)!=""){
      return false;
    }
    board[row][column]=symbol;
    return true;
  }
  const getSquare=function(row,column){
    return board[row][column]
  }
  const checkWin=function(){
    return checkRows() || checkCols() || checkDiags()
  }
  function checkRows(){
    for(let i=0; i<3;i++){
      if(board[i][0]!="" && board[i][0]==board[i][1]&&board[i][1]==board[i][2]){
        return true
      }
    }
    return false;
  }
  function checkCols(){
    for(let i=0; i<3;i++){
      if(board[0][i]!="" && board[0][i]==board[1][i]&&board[1][i]==board[2][i]){
        return true
      }
    }
    return false;
  }
  function checkDiags(){
    if(board[1][1]!="" && (board[0][0]==board[1][1] && board[1][1]==board[2][2] || board[0][2]==board[1][1] && board[1][1]==board[2][0])){
      return true
    }
    return false;
  }
  function checkDraw(){
    for(let i=0; i<3;i++){
      for(let j=0; j<3;j++){
        if(board[i][j]==""){
          return false;
        }
      }
    }
    return true;
  }
  return {board,changeSquare,getSquare,checkWin,checkDraw}
}
function createUser(symbol){
  let score=0;
  const addScore=function(){
    this.score+=1
  }
  return {symbol,score,addScore}
}
function createGame(player1, player2){
  const board=createBoard()
  const display=createDisplay()
  display.printBoard(board.board)
  const buttons=display.buttons
  let currentPlayer=player1;

  const startGame=function(e){
    let position=e.target.getAttribute("data-position")
    if(board.changeSquare(Math.floor(position/10),position%10,currentPlayer.symbol))
    {
      display.printBoard(board.board)
     
      if(board.checkWin()){
        currentPlayer.addScore()
        cleanup()
        if(currentPlayer==player1){
          gameManager.displayMessage( `${document.querySelector("#player1Name").value} wins`)
        }
        else{
          gameManager.displayMessage( `${document.querySelector("#player2Name").value} wins`)
        }
      }
      if(board.checkDraw()){
        cleanup()
        gameManager.displayMessage( `Draw`)
      }
      switchPlayer()
    }
    else{
      alert("invalid square")
    }
  }
  buttons.forEach((button)=>{button.addEventListener("click",startGame)})

  const switchPlayer=function(){
    currentPlayer=currentPlayer==player1?player2:player1;
  }
  function cleanup(){
    buttons.forEach((button)=>{button.removeEventListener("click",startGame)})
  }
  return {startGame,cleanup}
}


function createDisplay(){
  const buttons=Array.from(document.querySelectorAll(".squareButton"))
  const printBoard=function(board){
    for(let i=0; i<3;i++){
      for(let j=0; j<3;j++){
        buttons[i*3+j].textContent=board[i][j]
      }
    }
  }
  return {buttons,printBoard}
}

function createGameManager(){
  const modal=document.querySelector("dialog")
  const startButton=document.querySelector(".startButton")
  const restartButton=document.querySelector(".restartButton")
  const display=document.querySelector(".display")
  const player1=createUser("X")
  const player2=createUser("O")
  let game;
  startButton.addEventListener("click",()=>{
    modal.close()
    game=createGame(player1, player2)
  })
  restartButton.addEventListener("click",()=>{
    game.cleanup()
    game=createGame(player1, player2)
  })
  function displayMessage(message){
    display.textContent=`${message}\nX:${player1.score}     ,O:${player2.score}`
    modal.showModal()
  }
  return {displayMessage}
}
gameManager=createGameManager()
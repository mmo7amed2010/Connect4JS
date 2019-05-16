"use strict"; 
var Connect4=function (gridView,whoStart,depth) {
    this.rows = 6;
    this.columns = 7;
    console.log(depth)
    this.depth = depth;
    this.whoStart=whoStart
    this.playersTurn = this.whoStart;
    this.gridView = $(gridView);
    this.playingArr=this.zeros([this.rows,this.columns])
    this.gridInit();
    if(whoStart=="red"){
        let Rand= Math.floor(Math.random() * Math.floor(5));

      var random_col=$(`.col[data-col='`+Rand+`'] `).first()
    
        random_col.trigger('click');

         $('.col').removeClass(`place-red`)
         $('.col').removeClass(`place-yellow`)

    }
  }
  const proto=Connect4.prototype
  proto.zeros=function(dimensions) {
    var array = [];
    for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : this.zeros(dimensions.slice(1)));
    }

    return array;
  }

  proto.gridInit=function() {
    const Board = this.gridView;
    Board.empty();
    this.gameDone = false;
    this.playingArr=this.zeros([this.rows,this.columns])
    ///grid creation 
    var grid =""
    for (let row = 0; row < this.rows; row++) {
      grid += "<div class='row'>";
      for (let col = 0; col < this.columns; col++) {
        grid+=`<div class='col blank' data-col='${col}' data-row='${row}'></div>`
      }
     grid +="</div>"
    }
    Board.append(grid);
    this.Actions()

   
  }
  proto.countConnected=function(y,x,row,col){
    const that=this
    if((y>0 && row==this.rows-1) || (y<0 && row==0) ||(x>0 && col==this.columns-1) ||(x<0 && col==0))
      return 0

    row = (row+y)%this.rows
    col = (col+x)%this.columns
    if(this.playingArr[row][col]==that.playersTurn){
      return 1 + that.countConnected(y,x,row,col)
    }
    return 0
  }
  proto.isWinner=function(row, col) {
    const that = this
 
    function vertical(){
     return (1+that.countConnected(1,0,row,col)>=4)
    }
    function horizontal(){
     return (1+that.countConnected(0,1,row,col)+that.countConnected(0,-1,row,col)>=4)
    }
    function leftToRightDiagonal(){
     return (1+that.countConnected(-1,1,row,col)+that.countConnected(1,-1,row,col)>=4)
    }
    function rightToLeftDiagonal(){
     return (1+that.countConnected(-1,-1,row,col)+that.countConnected(1,1,row,col)>=4)
    }

    return   vertical() || horizontal() ||leftToRightDiagonal() || rightToLeftDiagonal()      
  }
  proto.inputPlace=function(col) {
    var place = null;
    $(`.col[data-col='`+col+`']`).each( function() {
        if ($(this).hasClass('blank')) {
            place = $(this);
          }
     });
    return place;
  }

  proto.Actions=function() {

    const that = this;
    const Board =this.gridView
    if (that.gameDone) {return}

    Board.on('click', '.col.blank', function() {
      const inputPlace = that.inputPlace($(this).data('col'));
      inputPlace.attr('class', `col ${that.playersTurn}`);

      that.playingArr[inputPlace.data('row')][inputPlace.data('col')]=that.playersTurn;
      const win = that.isWinner(inputPlace.data('row'),inputPlace.data('col'))
      if (win) {
        that.gameDone = true;
        swal(`yaay ! the ${that.playersTurn} has Won`)
        $('.col.blank').attr('class', `col`);
        return;
      }else{
        var tie
        for(let i = 0;i<that.columns;i++){
          if(that.playingArr[0][i]==0){
            tie=0
            break
          }else{
            tie=1
          }

        }
                  if(tie){
            swal("draw :(")
          }
      }
      that.playersTurn = (that.playersTurn == 'red') ? 'yellow' : 'red';

      $(this).trigger('mouseenter');
      // console.log(that.playersTurn)
      if(that.playersTurn=='red'){


        var number=that.minimax("test","test",that.depth,-100000000,100000000,"red",that.playingArr.map(function(arr) {
        return arr.slice();
      }))
      // console.log(number)

       var random_col=$(`.col[data-col='`+number[0]+`'] `).first()
    
        random_col.trigger('click');

         $('.col').removeClass(`place-red`)
         $('.col').removeClass(`place-yellow`)


            
       
        
      }
    });
    Board.on('mouseenter', '.col.blank', function() {
      const inputPlace = that.inputPlace($(this).data('col'));
      inputPlace.addClass(`place-${that.playersTurn}`);
    });

    Board.on('mouseleave', '.col.blank', function() {
      $('.col').removeClass(`place-${that.playersTurn}`);
    });

}

////ai part 
  proto.availableColumns=function(copy){
    var array = []

    for(let i=0;i<this.columns;i++){
    if(copy[0][i]==0){
       array.push(i);
    }
    }
    return array;
}

  proto.score=function(row, col,type,copy) {
    const that = this
    that.oldturn=type;
    function vertical(copy){
     return 1+that.countConnected2(1,0,row,col,copy)
    }
    function horizontal(copy){
     return 1+that.countConnected2(0,1,row,col,copy)+that.countConnected2(0,-1,row,col,copy)
    }
    function leftToRightDiagonal(copy){
     return 1+that.countConnected2(-1,1,row,col,copy)+that.countConnected2(1,-1,row,col,copy)
    }
    function rightToLeftDiagonal(copy){
     return 1+that.countConnected2(-1,-1,row,col,copy)+that.countConnected2(1,1,row,col,copy)
    }
    function points(connected){
      if(connected>=4){
        return 100000
      }else if(connected==3){
        return 130
      }else if(connected==2){
        return 40
      }else{
        return 0
      }
    }
    var pointsVal=points(vertical(copy))+  points(horizontal(copy))+ points(leftToRightDiagonal(copy))+ points(rightToLeftDiagonal(copy)) ;
    // console.log(pointsVal)
    if(type=="yellow")
    return -pointsVal
    else
    return pointsVal   }
  proto.countConnected2=function(y,x,row,col,copy){
    const that=this

    if((y>0 && row==this.rows-1) || (y<0 && row==0) ||(x>0 && col==this.columns-1) ||(x<0 && col==0))
      return 0

    row = (row+y)%this.rows
    col = (col+x)%this.columns
    if(copy[row][col]==that.oldturn){
      return 1 + that.countConnected2(y,x,row,col,copy)
    }
    return 0
  }
  proto.minimax=function(y, x,depth,alpha,beta,type,copy) {
    const that=this
    if(y!="test"){
      var xtype;
      if(type=="red"){
        xtype="yellow"

      }else{
        xtype="red"
      }
      var score= that.score(y,x,xtype,copy.map(function(arr) {
        return arr.slice();
      }))        
      if(depth==0||score>=100000 || score<=-100000){

            // console.log([score,copy])
            return [null,score]
    }}
      var coulmns=this.availableColumns(copy.map(function(arr) {
        return arr.slice();
      }))

      // if(depth==this.depth)
        var maxEval=(type == 'red') ? [null,-100000] : [null,100000]


        for(let value=0;value<coulmns.length;value++){

         var inputPlace=that.inputplace2(coulmns[value],copy)
        
        copy[inputPlace][coulmns[value]]=type;

       var maxvalues = that.minimax(inputPlace,coulmns[value],depth-1,alpha,beta,((type == 'red') ? 'yellow' : 'red'),copy.map(function(arr) {
        return arr.slice();
      }))

        copy[inputPlace][coulmns[value]]=0;
        if(type=="red"){
            // Evaluate new move
            if (maxvalues[1] > maxEval[1] || maxEval[0] == null ) {
                maxEval[0] = coulmns[value];
                maxEval[1] = maxvalues[1];
                alpha = maxvalues[1];
            }
        }else{
        // console.log(maxvalues,maxEval)
            if ( maxvalues[1] < maxEval[1] || maxEval[0] == null ) {
                maxEval[0] = coulmns[value];
                maxEval[1] = maxvalues[1];
                beta = maxvalues[1];

            }

        // console.log(maxEval)

        }
            if (alpha >= beta){
              // console.log("hi")
              // console.log(maxEval)
            return maxEval;

            } 

      }
        return maxEval

  }
  proto.inputplace2=function(value,copy){
    var inputPlace;
    for(let value2=0;value2<this.rows;value2++) {
        if(copy[value2][value]!=0){
          return inputPlace=value2-1;
          break;
        }else{
          inputPlace=value2; 
        }
    }
    return inputPlace
  }
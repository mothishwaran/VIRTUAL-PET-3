var dog,Dog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var changegameState;
var readgameState;
var bedroom;
var garden;
var sadDog;
var washroom;
var gameState=0;
var currentTime;




function preload(){
Dog=loadImage("Dog.png");
happyDog=loadImage("happydog.png");
bedroom=loadImage("virtual pet images/Bed Room.png");
washroom=loadImage("virtual pet images/Wash Room.png");
garden=loadImage("virtual pet images/Garden.png");
sadDog=loadImage("virtual pet images/Lazy.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1200,800);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  readgameState=database.ref('gameState');
  readgameState.on("value",function(data){
    gameState=data.val();
  });
  
  dog=createSprite(800,200,150,150);
  dog.addImage(Dog);
  
  
  feed=createButton("Feed TOM");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 PM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
   if(foodS<=0){
    dog.addImage(Dog);
  }

if(gameState!="hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
}else{
  feed.show();
  addFood.show();
  dog.addImage(sadDog);
}

currentTime=hour();
if(currentTime===(lastFed+1)){
  dog.addImage(garden);
  update('playing');
  foodObj.Garden();
}else if(currentTime===(lastFed+2)){
dog.addImage(bedroom);
update('sleeping');
foodObj.bedroom();
}else if(currentTime===(lastFed+3)){
  dog.addImage(washroom);
  update('bathroom');
  foodObj.WashRoom();
}else{
  update('hungry');
  foodObj.display();
}
  drawSprites();
}





//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
database.ref('/').update({
  gameState:state
})
}
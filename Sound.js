class Sound {
   constructor(sounds){
      this.sounds = sounds; 
   }
  
  menuMoveSound(){
     this.sounds[0].play(); 
  }
  
  endGameSound(){
     this.sounds[1].play(); 
  }
  
  asteroidHitSound(){
     this.sounds[2].play();
  }
  
  laserSound(){
     this.sounds[3].play(); 
  }
  
  pauseInSound(){
     this.sounds[4].play(); 
  }
  
  menuSelectSound(){
     this.sounds[5].play();  
  }
  
  pauseOutSound(){
       this.sounds[6].play();
  }
  
  playerAsteroidCollisionSound(){
     this.sounds[7].play(); 
  }
}
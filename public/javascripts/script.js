var searchresults;

$( document ).ready(function() {

  $('.view-all').on('click', function(event){
    toggleViewAll();
    console.log(event);
    $('.view-all-title').text(event.target.name);
    if(event.target.name === "albums"){
      $('.album-container').toggle();
    }else if(event.target.name === "artists"){
      $('.artist-container').toggle();  
    }else if(event.target.name === "songs"){
      $('.song-container').toggle();
    }
  });
  
  $('.search-return').on('click', function(){
    toggleViewAll();
    hideAll();
  });
});

function hideAll(){
  $('.album-container').hide();
  $('.artist-container').hide();
  $('.song-container').hide();
}

function toggleViewAll(){
  $('.search-results').toggle();
  $('.search-all').toggle();
}

function Jukebox(){
  this.play = function(){
    song.play();
  };
  this.pause = function(){
    song.pause();
  };
};

var mySong = new Jukebox();
var song = $('#song')[0];

$('#play').on("click",function(){
    song.play();
});
$('#pause').on("click",function(){
    song.pause();
});

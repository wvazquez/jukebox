$(".search").on('click', function(){
  if($(".searchbox").val().trim().length === 0){ return; }
  searchTrack($(".searchbox").val());
});
$("#list").on('click', 'a', function(){
  var song = $(this).text().split(' ').pop();
  var song_id = song.substring(1,song.length-1);
  setTrack(song_id, $(this));
});

function searchTrack(name){
  $.ajax({
    type: "GET",
    url: "https://freemusicarchive.org/api/trackSearch",
    data: {
        q: name,
        limit: 10
    },
    dataType: 'json',
    success: function(response) {
        console.log(response);
        var result = response.aRows;
        $('#list li').replaceWith('');
        for(var i=0; i< result.length; i++){
          $('#list').append("<li><a class ='the_song' href='#'>" + result[i]+ "</a></li>");
        }
    },
    error: function(err) {
        console.error( err );
    }
  });
}
function setTrack(song_id, listItem){
  $.ajax({
      type: "GET",
      url: "https://freemusicarchive.org/api/get/tracks.json",
      data: {
          api_key: 'OP9SUQBTB82K9U7W',
          track_id: song_id
      },
      dataType: "json",
      success: function(response) {
        var track = response.dataset[0];
        $('#song source').attr('src', "https://files.freemusicarchive.org/" + track.track_file);
        $('#song').load();
        $('.current-song img').replaceWith('');
        $('.current-song').prepend('<img src="'+ track.track_image_file + '" class = "cover-image" alt="Track Cover Image">');

        $('.current-song h4').replaceWith('');
        $('.current-song').prepend('<h4 class="track_title">'+ track.track_title.toUpperCase() + '</h4>');

      },
      error: function(err) {
          console.error(err);
      }
  });
}

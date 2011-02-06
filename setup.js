$(document).ready(randomize);

function randomize(){
  $("a, input").each(function(index, element){
      var offset = {left: Math.random() * $(window).width(), top: Math.random() * $(window).height()};
      $(element).css('position', 'absolute');
      $(element).offset(offset);
  });
}

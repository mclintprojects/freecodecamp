$(document).ready(function(){
  $('.lab-item').on('click', function(){
    var link = $(this).attr('data-link');
    window.open(link, '_blank');
  });
});
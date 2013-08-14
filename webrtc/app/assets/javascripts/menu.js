jQuery(document).ready(function() {

  var linkId;
   $('#one').addClass('selected');
   $('#two').addClass('unselected');
   $('#three').addClass('unselected');
   $('#chatOne').show();
   $('#videoTwo').hide();
   $('#sketchThree').hide();

  function showStuff(showThisId, hideThisId, showThisP, hideThisP) {
    $(showThisId).removeClass('unselected');
    $(showThisId).addClass('selected');
    $(hideThisId).removeClass('selected');
    $(hideThisId).addClass('unselected');
    $(showThisP).show();
    $(hideThisP).hide();
  }

  $('#one').bind('click', function() {
    if ($(this).hasClass('unselected')) {
      if ($('#two').hasClass('selected')) {
        showStuff('#one','#two','#chatOne','#videoTwo');
      } else {
        showStuff('#one','#three','#chatOne','#sketchThree');
      }
    }
  });

  $('#two').bind('click', function() {
    if ($(this).hasClass('unselected')) {
      if ($('#three').hasClass('selected')) {
        showStuff('#two','#three','#videoTwo','#sketchThree');
      } else {
        showStuff('#two','#one','#videoTwo','#chatOne');
      }
    }
  });
  $('#three').bind('click', function() {
    if ($(this).hasClass('unselected')) {
      if ($('#one').hasClass('selected')) {
        showStuff('#three','#one','#sketchThree','#chatOne');
      } else {
        showStuff('#three','#two','#sketchThree','#videoTwo');
      }
    }
  });


});

var navigableEnabled = false;
var lastRectangle = {x: 0, y: 0, width: 0, height: 0};
var keyCodes = {left: 37, right: 39, up: 38, down: 40};

$(document).ready(function(){
    $(document).keyup(function(e){
      if (e.keyCode == 78){
        toggleNavigable();
      }

      if (navigableEnabled){
        handleKeyPresses(e);
      }
    });
});

function toggleNavigable(){
  if (navigableEnabled){
    hideNavigable();
  }
  else{
    showNavigable();
  }
}

function showNavigable(){
  navigableEnabled = true;
  lastRectangle = {x: 0, y: 0, width: $(window).width(), height: $(window).height()};
  drawRectangle(lastRectangle);
}

function hideNavigable(){
  navigableEnabled = false;
  hideAllBorders();
}

function createRectangle(from, type){
  var rectangle = {x: from.x, y: from.y, width: from.width, height: from.height};

  if (type == 'up' || type == 'down'){
    rectangle.width = from.width;
    rectangle.height = (from.height / 2);
    if (type == 'down') {
      rectangle.y = from.y + (from.height / 2);
    }
  }
  if (type == 'left' || type == 'right'){
    rectangle.width = from.width / 2;
    rectangle.height = from.height;
    if (type == 'right'){
      rectangle.x = from.x + (from.width / 2);
    }
  }
  return rectangle;
}

function handleKeyPresses(event){
  if (event.keyCode != keyCodes.up && event.keyCode != keyCodes.down && event.keyCode != keyCodes.left && event.keyCode != keyCodes.right){
    return;
  }
  var rectangleType = '';
  if (event.keyCode == keyCodes.up) rectangleType = 'up';
  if (event.keyCode == keyCodes.down) rectangleType = 'down';
  if (event.keyCode == keyCodes.left) rectangleType = 'left';
  if (event.keyCode == keyCodes.right) rectangleType = 'right';
  var rectangle = createRectangle(lastRectangle, rectangleType);

  var elementsInsideRectangle = findElementsInsideRectangle(rectangle);
  if (elementsInsideRectangle.length == 0){
    hideNavigable();
  }
  else if (elementsInsideRectangle.length == 1){
    elementsInsideRectangle[0].focus();
    hideNavigable();
  }
  else{
    var firstElement = elementsInsideRectangle[0];
    var firstElementOffset = firstElement.offset();
    var elementExtremities = {
      top: firstElementOffset.top,
      left: firstElementOffset.left,
      right: firstElementOffset.left + firstElement.width(),
      bottom: firstElementOffset.top + firstElement.height()
    };
    $.each(elementsInsideRectangle, function(index, element){
        var elementOffset = element.offset();
        if (elementOffset.left < elementExtremities.left) elementExtremities.left = elementOffset.left;
        if (elementOffset.top < elementExtremities.top) elementExtremities.top = elementOffset.top;
        if (elementOffset.left + element.width() > elementExtremities.right) elementExtremities.right = elementOffset.left + element.width();
        if (elementOffset.top + element.height() > elementExtremities.bottom) elementExtremities.bottom = elementOffset.top + element.height();
    });
    rectangle = {x: elementExtremities.left, y: elementExtremities.top, width: elementExtremities.right - elementExtremities.left, height: elementExtremities.bottom - elementExtremities.top};
    drawRectangle(rectangle);
    lastRectangle = rectangle;
  }
}

function findElementsInsideRectangle(rectangle){
  var foundElements = [];
  $('a, input').each(function(){
      var element = $(this);
      var offset = element.offset();
      if (offset.top >= rectangle.y){
        if (offset.left >= rectangle.x){
          if (offset.left + element.width() <= rectangle.x + rectangle.width){
            if (offset.top + element.height() <= rectangle.y + rectangle.height){
              foundElements.push(element);
            }
          }
        }
      }
  });
  return foundElements;
}

function drawRectangle(rectangle){
  hideAllBorders();
  createDivForRectangle(createRectangle(rectangle, 'up'));
  createDivForRectangle(createRectangle(rectangle, 'down'));
  createDivForRectangle(createRectangle(rectangle, 'left'));
  createDivForRectangle(createRectangle(rectangle, 'right'));
}

function hideAllBorders(){
  $('.navigableBorderDiv').fadeOut('fast');
}

function createDivForRectangle(rectangle){
  var div = $('<div></div>');
  div.attr('class', 'navigableBorderDiv');
  div.css('position', 'absolute');
  div.css('opacity', 0.5);
  div.css('overflow', 'hidden');
  div.css('border', '1px solid black');
  div.offset({ top: rectangle.y, left: rectangle.x});
  div.width(rectangle.width);
  div.height(rectangle.height);
  $('body').append(div);
}

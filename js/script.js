(function() {
  var create_div_for_rectangle, create_rectangle, draw_rectangle, find_elements_inside_rectangle, handle_key_press, hide_all_borders, hide_navigable, key_codes, last_rectangle, navigable_enabled, show_navigable, toggle_navigable;
  navigable_enabled = false;
  last_rectangle = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };
  key_codes = {
    up: 38,
    down: 40,
    left: 37,
    right: 39
  };
  $(document).ready(function() {
    return $(document).keyup(function(event) {
      if (event.keyCode === 78) {
        toggle_navigable();
      }
      if (navigable_enabled) {
        return handle_key_press(event);
      }
    });
  });
  toggle_navigable = function() {
    if (navigable_enabled) {
      return hide_navigable();
    } else {
      return show_navigable();
    }
  };
  show_navigable = function() {
    navigable_enabled = true;
    last_rectangle = {
      x: 0,
      y: 0,
      width: $(window).width(),
      height: $(window).height()
    };
    return draw_rectangle(last_rectangle);
  };
  hide_navigable = function() {
    navigable_enabled = false;
    return hide_all_borders();
  };
  create_rectangle = function(from, type) {
    var rectangle;
    rectangle = {
      x: from.x,
      y: from.y,
      width: from.width,
      height: from.height
    };
    if (type === 'up' || type === 'down') {
      rectangle.width = from.width;
      rectangle.height = from.height / 2;
      if (type === 'down') {
        rectangle.y = from.y + (from.height / 2);
      }
    }
    if (type === 'left' || type === 'right') {
      rectangle.width = from.width / 2;
      rectangle.height = from.height;
      if (type === 'right') {
        rectangle.x = from.x + (from.width / 2);
      }
    }
    return rectangle;
  };
  handle_key_press = function(event) {
    var all_key_codes, element, element_extremities, elements_inside_rectangle, padding, rectangle, rectangle_type, _fn, _i, _len;
    all_key_codes = [key_codes.up, key_codes.down, key_codes.left, key_codes.right];
    if ($.inArray(event.keyCode, all_key_codes) === -1) {
      return;
    }
    if (event.keyCode === key_codes.up) {
      rectangle_type = 'up';
    }
    if (event.keyCode === key_codes.down) {
      rectangle_type = 'down';
    }
    if (event.keyCode === key_codes.left) {
      rectangle_type = 'left';
    }
    if (event.keyCode === key_codes.right) {
      rectangle_type = 'right';
    }
    rectangle = create_rectangle(last_rectangle, rectangle_type);
    elements_inside_rectangle = find_elements_inside_rectangle(rectangle);
    if (elements_inside_rectangle.length === 0) {
      return hide_navigable();
    } else if (elements_inside_rectangle.length === 1) {
      elements_inside_rectangle[0].focus();
      return hide_navigable();
    } else {
      element_extremities = {
        top: elements_inside_rectangle[0].offset().top,
        left: elements_inside_rectangle[0].offset().left,
        right: elements_inside_rectangle[0].offset().left + elements_inside_rectangle[0].width(),
        bottom: elements_inside_rectangle[0].offset().top + elements_inside_rectangle[0].height()
      };
      _fn = function(element) {
        if (element.offset().left < element_extremities.left) {
          element_extremities.left = element.offset().left;
        }
        if (element.offset().top < element_extremities.top) {
          element_extremities.top = element.offset().top;
        }
        if (element.offset().left + element.width() > element_extremities.right) {
          element_extremities.right = element.offset().left + element.width();
        }
        if (element.offset().top + element.height() > element_extremities.bottom) {
          return element_extremities.bottom = element.offset().top + element.height();
        }
      };
      for (_i = 0, _len = elements_inside_rectangle.length; _i < _len; _i++) {
        element = elements_inside_rectangle[_i];
        _fn(element);
      }
      padding = 3;
      element_extremities.top = element_extremities.top - padding;
      element_extremities.left = element_extremities.left - padding;
      element_extremities.bottom = element_extremities.bottom + padding;
      element_extremities.right = element_extremities.right + padding;
      rectangle = {
        x: element_extremities.left,
        y: element_extremities.top,
        width: element_extremities.right - element_extremities.left,
        height: element_extremities.bottom - element_extremities.top
      };
      draw_rectangle(rectangle);
      return last_rectangle = rectangle;
    }
  };
  find_elements_inside_rectangle = function(rectangle) {
    var found_elements;
    found_elements = [];
    $('a, input').each(function(index, element) {
      element = $(element);
      if (element.offset().top >= rectangle.y) {
        if (element.offset().left >= rectangle.x) {
          if (element.offset().left + element.width() <= rectangle.x + rectangle.width) {
            if (element.offset().top + element.height() <= rectangle.y + rectangle.height) {
              return found_elements.push(element);
            }
          }
        }
      }
    });
    return found_elements;
  };
  draw_rectangle = function(rectangle) {
    var rectangle_type, rectangle_types, _i, _len, _results;
    hide_all_borders();
    rectangle_types = ['up', 'down', 'left', 'right'];
    _results = [];
    for (_i = 0, _len = rectangle_types.length; _i < _len; _i++) {
      rectangle_type = rectangle_types[_i];
      _results.push((function(rectangle_type) {
        return create_div_for_rectangle(create_rectangle(rectangle, rectangle_type));
      })(rectangle_type));
    }
    return _results;
  };
  hide_all_borders = function() {
    return $('.navigableBorderDiv').fadeOut('fast');
  };
  create_div_for_rectangle = function(rectangle) {
    var div;
    div = $('<div></div>');
    div.attr('class', 'navigableBorderDiv');
    div.css('position', 'absolute');
    div.css('opacity', 0.5);
    div.css('overflow', 'hidden');
    div.css('border', '1px solid black');
    div.offset({
      top: rectangle.y,
      left: rectangle.x
    });
    div.width(rectangle.width);
    div.height(rectangle.height);
    return $('body').append(div);
  };
}).call(this);

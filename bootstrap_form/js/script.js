var locked = false;
var loggedin = false;
var login_form_open = false;
var stars_filled = [false, false, false, false, false];
var avg_rating = 0;
var recent_ratings = [];
var todays_meal = "pizza";
var ip = "";

$(document).ready(function() {

  $.getJSON('//freegeoip.net/json/?callback=?', function(data) {
    let json = JSON.stringify(data, null, 2);
    let obj = JSON.parse(json);
    ip = obj.ip.replace(/\./g, '');
});

  let domain= "http://ratelunch.today"

  let today = new Date();
  let date = today.getDate();
  let month = today.getMonth()+1;
  let year = today.getFullYear();

  //getImage("pizza");
  //$('#item_name').text("pizza");

  lunchQueryAjax(domain, year, month, date);

  $('#star_parent').mouseleave(
    function(){
      if (locked)
        return;
      for(let i = 4; i >=0; i--){
        $('#star_' + i + '_img').attr("src", "resources/star_empty.png");
      }
    }
  );

  $('.z_top').mousedown(
    function()
    {
      if (login_form_open)
      {
        hideLoginForm();
        event.stopPropagation()
      }
    }
  );

  $('.login_button').mousedown(
    function(event) {
      if (!login_form_open)
      {
        showLoginForm();
        event.stopPropagation()
      }
    }
  );

  $('.button_close').click(function(e) {
    hideLoginForm();
  });

  $('.lunch_title').mouseenter(function() {
    $('.lunch_title').text("Follow our Twitters pls");
  });

  $('.lunch_title').mouseleave(function() {
    $('.lunch_title').text("How was Lunch Today?");
  });

  // $('.lunch_display_title').mouseenter(function() {
  //   $('.lunch_display_title').text("Why haven't you followed us yet? :(");
  // });
  //
  // $('.lunch_display_title').mouseleave(function() {
  //   $('.lunch_display_title').text("Today's lunch was " + todays_meal);
  // });

  $('.avi').mouseenter(function() {
    console.log("dddd");
    $('.zach_avi img').attr("src", "resources/zach.png");
    $('.fred_avi img').attr("src", "resources/fred.png");
    $('.lunch_title_div').css("margin", "");
  });

  $('.avi').mouseleave(function() {
    $('.fred_avi img').attr("src", "resources/empty.png");
    $('.zach_avi img').attr("src", "resources/empty.png");
    $('.lunch_title_div').css("margin", "0 auto");
  });

  $('.star_image').each(function(index){
    $(this).mouseenter(index, function(e){
      if (locked)
        return;

      for(let i = 4; i >=0; i--){
        $('#star_' + i + '_img').attr("src", "resources/star_empty.png");
        stars_filled[i] = false;
      }
      for(let i = 0; i <=index; i++){
        $('#star_' + i + '_img').attr("src", "resources/star_filled.png");
        stars_filled[i] = true;
      }
    });

    $(this).mousedown(index, function(){
      if (login_form_open)
      {
        return;
      }
      if (locked)
      {
        locked = !locked;
        return;
      }

      submitRating();
      // to do make it equal to real data
      let meal_id = 1;
      let item_id = 1;
      let user_id = 1;
      // to do make it equal to real data
      let rating_value = index + 1;
      //console.log(rating_value);
      lunchRateAjax(domain, meal_id, item_id, user_id, rating_value);
    });
  });
  startTick();
});

function lunchRateAjax(domain, meal_id, item_id, user_id, rating_value)
{
  let _data = {
    "meal_id": meal_id,
    "item_id": item_id,
    "user_id": user_id,
    "rating_value": rating_value
  }

  let data = JSON.stringify(_data);

  let url = domain + "/api/v1/ratings";

  $.ajax({
    async: true,
    crossDomain: true,
    url: url,
    method: "POST",
    headers: {
      "Authorization": "Bearer jakdsflkjfldsjflajfweihbjkbfw,bkb2j1khlkfwelkfjlkwe",
      "Content-Type": "application/json",
    },
    data: data,
    success: function(data) {
      console.log(data);
      updatePage(data);
    },
    error: function(xhr, text, e) {
      console.log(xhr.responseText+ ' \\ ' + e);
    }
  });
}

function lunchQueryAjax(domain, year, month, date)
{
  let url = domain + '/api/v1/meals/' + year + '/' + month + '/' + date;

  $.ajax(
    {
      async: true,
      crossDomain: true,
      url: url,
      method: "GET",
      dataType: "json",
      success: function(data) {
        console.log(data);
        updatePage(data);
      },
      error: function(xhr, text, e) {
        console.log(xhr.responseText+ ' \\ ' + e);
      }
    }
  );
}

function updatePage(data)
{

}




function submitRating()
{

  if (locked)
  {
    locked = !locked;
    return;
  }
  var i = 0;
  while (stars_filled[i] == true)
  {
    i++;
  }
  //log rating
  //console.log(i);


  locked = true;
  recent_ratings.push(i);

  $('#ratings_list_loading').remove();

  $('#' + ip).remove();
  $('#ratings_list').append('<li id="' + ip + '">' + i + '</li>');
  //push to DB
}

function showLoginForm()
{
  $('.login_frame').css('display', 'block');
  $('.button_close').css('display', 'block');
  login_form_open = true;
}

function hideLoginForm()
{
  //console.log("call");
  $('.login_frame').css('display', 'none');
  $('.button_close').css('display', 'none');
  login_form_open = false;
}

function startTick()
{
  setTimeout(function () {
    //  i++;
    //  if (i < 10) {
    console.log("cccc");
    let c = getRandomColor(rgb2hex($('.zach').css('color')), 5);
    //let f = getRandomColor(rgb2hex($('.fred').css('color')), 10);

    $('.zach').css('color', c);
    $('.fred').css('color', c);
    startTick();
    //  }
   }, 100);
}

var flip = 1, i = 0, pause = 0;
function getRandomColor(color, step){
  if (pause > 0)
  { pause --; return color; }

    var colorToInt = parseInt(color.substr(1), 16),                     // Convert HEX color to integer
        nstep = parseInt(step) * flip;
                                  // Convert step to integer
    if(!isNaN(colorToInt) && !isNaN(nstep)){                            // Make sure that color has been converted to integer
        colorToInt += nstep;                                            // Increment integer with step
        var ncolor = colorToInt.toString(16);                           // Convert back integer to HEX
        ncolor = '#' + (new Array(7-ncolor.length).join(0)) + ncolor;   // Left pad "0" to make HEX look like a color
        if(/^#[0-9a-f]{6}$/i.test(ncolor)){
          i++;
          if (i >= 25)
            { flip *= -1; i = 0; pause = 10;}

          return ncolor;
        }
    }
    return color;
};

var hexDigits = new Array
        ("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");

//Function to convert rgb color to hex format
function rgb2hex(rgb) {
 rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
 return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function hex(x) {
  return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
 }

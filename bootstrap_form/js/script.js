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

  getImage("pizza");
  $('#item_name').text("pizza");

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
      console.log(rating_value);
      lunchRateAjax(domain, meal_id, item_id, user_id, rating_value);
    });
  });
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


function getImage(word)
{
    var keyword = word + " food";
        $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
        {
            tags: keyword,
            tagmode: "any",
            format: "json"
        },
        function(data) {
              var rnd = Math.floor(Math.random() * 5);

            var image_src = data.items[rnd]['media']['m'].replace("_m", "_b");

            //$('body').css('background-image', "url('" + image_src + "')");
            $('#lunch_display_img').attr("src", image_src);

        });
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
  console.log("call");
  $('.login_frame').css('display', 'none');
  $('.button_close').css('display', 'none');
  login_form_open = false;
}

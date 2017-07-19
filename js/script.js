var locked = false;
var stars_filled = [false, false, false, false, false];
var avg_rating = 0;
var recent_ratings = [];
var todays_meal = "pizza";
var ip = "";

$(document).ready(function() {

    $(".lunch_display .meal_name").html(todays_meal);
    getImage(todays_meal);
    avg_rating = fetchAvgRating();

    $.get("http://ipinfo.io", function(response) {
      ip = response.ip.replace(/\./g, '');;
    }, "jsonp");

    $('#star_0').mouseenter(
      function() {
        enterStar('#star_0_img', 0);
       },
    );

    $('#star_1').mouseenter(
      function() {
        enterStar('#star_1_img', 1);
       },
    );

    $('#star_2').mouseenter(
      function() {
        enterStar('#star_2_img', 2);
       },
    );

    $('#star_3').mouseenter(
      function() {
        enterStar('#star_3_img', 3);
    },
    );

    $('#star_4').mouseenter(
      function() {
        enterStar('#star_4_img', 4);
       },
    );

    $('#star_parent').mouseleave(
      function() {
        reset();
      },
    );

    $('#star_parent').mousedown(
      function() {
        submitRating();
      },
    );
});

function enterStar(id, index)
{
  if (locked)
    return;
  //if star is not filled, toggle it on
  if (stars_filled[index] == false)
    toggleStar(id, index);
  //if next star is filled, toggle it off
  if (stars_filled[index + 1] == true && index < 4)
  {
    var s = id.substring(id.indexOf('_') + 1, id.lastIndexOf('_'));
    var d = parseInt(s) + 1;
    var i = "#star_" + d + "_img";

    toggleStar(i, index + 1);
  }

  //fill all previous stars
  var s = "";
  for (var i=index; i > -1; i--)
  {
    s = "#star_" + i + "_img";
    toggleStar(s, i, true);
  }
}

//force true = fill it, false = empty it, null = toggle
function toggleStar(id, index, force)
{

  if (force == false)
  {
    $(id).attr("src","resources/star_empty.png");
    stars_filled[index] = false;
    return;
  } else if (force == true)
  {
    $(id).attr("src","resources/star_filled.png");
    stars_filled[index] = true;
    return;
  }

  var b = stars_filled[index];

  if (b)
  {
    $(id).attr("src","resources/star_empty.png");
  } else
  {
    $(id).attr("src","resources/star_filled.png");
  }
  stars_filled[index] = !b;
  //console.log(id + " star is " + stars_filled[index]);
}

function reset()
{
  if (locked)
    return;
  toggleStar("#star_0_img", 0, false);
  toggleStar("#star_1_img", 1, false);
  toggleStar("#star_2_img", 2, false);
  toggleStar("#star_3_img", 3, false);
  toggleStar("#star_4_img", 4, false);
}

function getImage(word)
{
    var keyword = word;
        $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
        {
            tags: keyword,
            tagmode: "any",
            format: "json"
        },
        function(data) {
              var rnd = Math.floor(Math.random() * 10);

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
  console.log(i);


  locked = true;
  recent_ratings.push(i);

  $('#ratings_list_loading').remove();

  $('#' + ip).remove();
  $('#ratings_list').append('<li id="' + ip + '">' + i + '</li>');
  //push to DB

}

function fetchAvgRating()
{
  //pull from DB
}

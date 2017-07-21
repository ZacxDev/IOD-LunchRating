$(document).ready(function() {

  window.domain = "http://ratelunch.today";

  // login form
  $('#login-form-link').click(function(e) {
    $("#login-form").delay(100).fadeIn(100);
    $("#register-form").fadeOut(100);
    $('#register-form-link').removeClass('active');
    $(this).addClass('active');
    e.preventDefault();
  });

  // register form
  $('#register-form-link').click(function(e) {
    $("#register-form").delay(100).fadeIn(100);
    $("#login-form").fadeOut(100);
    $('#login-form-link').removeClass('active');
    $(this).addClass('active');
    e.preventDefault();
  });

  let apikey = Cookies.get("apikey");

  authenticateAjaxWith(domain, apikey);

  registerEvents();

});

function registerEvents()
{


  // star parent
  $('#star_parent').mouseleave(
    function(){
      for(let i = 4; i >=0; i--){
        $('#star_' + i + '_img').attr("src", "resources/star_empty.png");
      }
    }
  );

  // single star
  $('.star_image').each(function(index){
    $(this).mouseenter(index, function(e){
      for(let i = 4; i >=0; i--){
        $('#star_' + i + '_img').attr("src", "resources/star_empty.png");
      }
      for(let i = 0; i <=index; i++){
        $('#star_' + i + '_img').attr("src", "resources/star_filled.png");
      }
    });

    $(this).mousedown(index, function(){

      console.log("mousedown event:");

      let meal_id = Cookies.get("meal_id");
      let item_id = Cookies.get("item_id");
      let user_id = Cookies.get("user_id");

      let rating_value = index + 1;
      lunchRateAjax(domain, meal_id, item_id, user_id, rating_value);
    });
  });

  // Click Login Button
  $('#login-submit').click(function(e){
    e.preventDefault();
    let username = $('#login-form input[name=username]').val();
    let password = $('#login-form input[name=password]').val();
    console.log(username);
    loginAjax(username, password, domain);
  });

  // Click Register Button
  $('#register-form').click(function(e){
    e.preventDefault();
    let username = $('#register-form input[name=username]').val();
    let email = $('#register-form input[name=email]').val();
    let password = $('#register-form input[name=password]').val();
    let confirm_password = $('#register-form input[name=confirm-password]').val();
    registerAjax(username, email, password, confirm_password);
  });

  // Initialize Particle
  initializeParticle();

}

function lunchRateAjax(domain, meal_id, item_id, user_id, rating_value)
{
  let _data = {
    "meal_id": meal_id,
    "item_id": item_id,
    "user_id": user_id,
    "rating_value": rating_value
  }

  let data = JSON.stringify(_data);

  console.log(data);

  let url = domain + "/api/v1/ratings";

  let apikey = Cookies.get("apikey");

  $.ajax({
    async: true,
    crossDomain: true,
    url: url,
    method: "POST",
    headers: {
      "Authorization": "Bearer " + apikey,
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
      success: function(meal) {
        storeMealDataInCookie(meal);
        insertQueriedMealDataToPage(meal);
      },
      error: function(xhr, text, e) {
        console.log(xhr.responseText+ ' \\ ' + e);
      }
    }
  );
}

function insertQueriedMealDataToPage(meal)
{
  // <!-- avg_rating, item_name, username, avg_rating, rating_value, item_img -->
  let avg_rating = meal["items"][0]["average_rating"];
  let item_name = meal["items"][0]["name"];
  let ratings = meal["items"][0]["ratings"];
  $("#item_name").text(item_name);
  $("#avg_rating").text(avg_rating);

  for (rating of ratings) {
    $("#ratings_list").append('<li class="single_rating">' + rating["user"]["username"] + ': ' + rating["rating_value"] + '</li>');
  }

  if(meal["items"][0]["image"]){
    $("#lunch_display_img").attr("src", "data:image/png;base64," + meal["items"][0]["image"]);
  }
}

function updatePage(meal)
{
  let avg_rating = meal["items"][0]["average_rating"];
  let ratings = meal["items"][0]["ratings"];
  $("#avg_rating").text(avg_rating);
  $("#ratings_list").empty();
  for (rating of ratings) {
    $("#ratings_list").append('<li class="single_rating">' + rating["user"]["username"] + ': ' + rating["rating_value"] + '</li>');
  }
}

function storeMealDataInCookie(meal)
{
  let meal_id = meal["id"];
  let item_id = meal["items"][0]["id"];

  Cookies.set('meal_id', meal_id);
  Cookies.set('item_id', item_id);
}

function authenticateAjaxWith(domain, apikey)
{
  let url = domain + '/api/v1/auth/apikey';

  $.ajax(
    {
      async: true,
      crossDomain: true,
      url: url,
      method: "GET",
      data: {apikey: apikey},
      dataType: "json",
      success: function(user) {

        Cookies.set("user_id", user.id);

        console.log("user from authenticateAjaxWith Success: " + user);

        let today = new Date();
        let date = today.getDate();
        let month = today.getMonth()+1;
        let year = today.getFullYear();

        showMainContent();

        lunchQueryAjax(domain, year, month, date);

      },
      error: function(xhr, text, e) {
        console.log("error form authenticateAjax: " + xhr.responseText+ ' \\ ' + e);
        showFormContent();
      }
    }
  );
}

function showFormContent()
{
  $('#main_content').hide();
  $('#register-login-form-wrapper').show();
}

function showMainContent()
{
  $('#register-login-form-wrapper').hide();
  $('#main_content').show();
}

function loginAjax(username, password, domain)
{
  let data = {
    "username": username,
    "password": password,
  }

  // let data = JSON.stringify(_data);

  console.log(data);

  let url = domain + "/api/v1/auth/login";

  $.ajax({
    async: true,
    crossDomain: true,
    url: url,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
    success: function(apikey) {
      console.log("user from loginAjax success: " + apikey);
      Cookies.set("apikey", apikey);
      showMainContent();
    },
    error: function(xhr, text, e) {
      console.log("error form loginAjax" + xhr.responseText+ ' \\ ' + e);
    }
  });

}

function registerAjax(username, email, password,confirm_password)
{
  let _data = {
    "username": username,
    "email": email,
    "password": password,
    "confirm_password": confirm_password
  }

  let data = JSON.stringify(_data);

  console.log(data);

  let url = domain + "/api/v1/auth/register";

  $.ajax({
    async: true,
    crossDomain: true,
    url: url,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
    success: function(user) {
      console.log("user from registerAjax success: " + user);
      Cookies.set("apikey", user["apikey"]);
      showMainContent();
    },
    error: function(xhr, text, e) {
      console.log("error form registerAjax" + xhr.responseText+ ' \\ ' + e);
    }
  });

}

function initializeParticle()
{
  var canvasDiv = document.getElementById('particle-canvas');
  var options = {
    particleColor: '#11ce00',
    //background: 'https://raw.githubusercontent.com/JulianLaval/canvas-particle-network/master/img/demo-bg.jpg',
    interactive: false,
    speed: 'medium',
    density: 'high'
  };
  var particleCanvas = new ParticleNetwork(canvasDiv, options);
}

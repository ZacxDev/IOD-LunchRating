
var stars_filled = [false, false, false, false, false];

$(document).ready(function() {
    $('#star_0').hover(
      function() { $("#star_0_img").attr("src","resources/star_filled.png"); stars_filled[0] = true },
    );

    $('#star_1').hover(
      function() { $("#star_1_img").attr("src","resources/star_filled.png"); stars_filled[1] = true },
    );

    $('#star_2').hover(
      function() { $("#star_2_img").attr("src","resources/star_filled.png"); stars_filled[2] = true },
    );

    $('#star_3').hover(
      function() { $("#star_3_img").attr("src","resources/star_filled.png"); stars_filled[3] = true },
    );

    $('#star_4').hover(
      function() { toggleStar("#star_4_img", 4) },
    );

    $('#star_parent').mouseleave(
      function() {
      $("#star_0_img").attr("src","resources/star_empty.png");
      $("#star_1_img").attr("src","resources/star_empty.png");
      $("#star_2_img").attr("src","resources/star_empty.png");
      $("#star_3_img").attr("src","resources/star_empty.png");
      $("#star_4_img").attr("src","resources/star_empty.png");
      },
    );
});

function toggleStar(id, index)
{
  $(id).attr("src","resources/star_filled.png");
  stars_filled[index] = !stars_filled[index];
}

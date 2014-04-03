//= require jquery-1.10.2.js
//= require jquery.nicescroll.js
//= require jquery.qtip.js

$(function() {
  var brandsStore = [];

  $('.expandable').on('click', function() {
    if ($(this).hasClass('expanded')) {
      $('.sub-menu', this).stop().slideUp(500, function() {
        $(this).parents('.expandable').removeClass('expanded');
      });
    } else {
      $('.expanded').click();
      $(this).addClass('expanded');
      $('.sub-menu', this).stop().slideDown(500);
    }
  });

  $('.shop-brand').mouseover(function() {
    var img = $('img', this);

    if (img.length > 0 && !img.attr('src')) {
      img.on('load', function() {
        $(this).parent().attr('loaded', 'loaded');
      });
      img.attr('src', img.attr('data-image-src'));
    }
  });

  if ($('#howToGet-page, #about-page').length > 0) {
    $('.menu-1').addClass('expanded');
    $('.menu-1 .sub-menu').slideDown(500);
  }

  if ($('#firstLevel-page, #secondLevel-page, #thirdLevel-page').length > 0) {
    $('.menu-2').addClass('expanded');
    $('.menu-2 .sub-menu').slideDown(500);
  }

  if ($('#shop-page').length > 0) {
    $('.menu-4').addClass('expanded');
    $('.menu-4 .sub-menu').slideDown(500);
  }

  if ($('#entertain-page').length > 0) {
    $('.menu-5').addClass('expanded');
    $('.menu-5 .sub-menu').slideDown(500);
  }

  if ($('#dine-page').length > 0) {
    $('.menu-6').addClass('expanded');
    $('.menu-6 .sub-menu').slideDown(500);
  }

  $('#shop .sub-menu li a, #entertain .sub-menu li a, #dine .sub-menu li a').on('click', function() {

    if ($(this).hasClass('enabled')) {
      if ($(this).is($("#dine .sub-menu li a"))) {
          $(this).removeClass('enabled');
          $(this).addClass('un-enabled-2');
        } else {
        $(this).removeClass('enabled');
        $(this).addClass('un-enabled');
      }
    } else {
      $(this).removeClass('un-enabled');
      $(this).removeClass('un-enabled-2');
      $(this).addClass('enabled');
    }

    $('.shop-brand').detach().each(function() {
      if (brandsStore.indexOf(this) == -1) {
        brandsStore.push(this);
      }
    });

    $('.shop-brand-placeholder').remove();

    $(brandsStore).each(function() {
      var cat = $(this).attr('data-brand-category');
      if ($('#shop .sub-menu a.enabled, #entertain .sub-menu a.enabled, #dine .sub-menu a.enabled').length == 0 || $('[data-brand-toggle="' + cat + '"]').hasClass('enabled')) {
        $(this).removeClass('hidden');
      } else {
        $(this).addClass('hidden');
      }
    });

    var filtered = $.grep(brandsStore, function(item) {
      return !$(item).hasClass('hidden');
    });

    var needBoxes = Math.ceil(filtered.length / 9);

    $('.shop-box').hide().slice(0, needBoxes).show();
    var currentBox = $('.shop-box:first-child');

    var colors = ['#8E5793', '#FAC075', '#C7017F', '#EC6090', '#960E6D', '#E6007E', '#EA5153', '#C45580', '#E4609F', '#CF1152', '#F08159', '#A877B2'];
    var greys = ['#E3E5F1', '#ECEBF1', '#E8E9F0', '#E8EBF6', '#EDEFF8', '#E6E7EE', '#EDEDF1', '#E3E6F4', '#EAEBF0', '#F0F0F1', '#E6E8F5', '#F1F1F7', '#E3E6F4', '#E8EAF6', '#E7E8ED', '#E8E9EC', '#EDEFF7', '#E1E4F1'];

    while(filtered.length > 0) {
      var cc = colors.slice(0, colors.length - 1);
      var gc = greys.slice(0, greys.length - 1);
      var slice = filtered.splice(0, 9);
      $(slice).each(function() {
        var rc = Math.floor(Math.random()*cc.length);
        $(this).css('background-color', cc.splice(rc, 1));
        currentBox.append(this);
      });
      for (var i = 0; i < 9 - slice.length; ++i) {
        var rgc = Math.floor(Math.random()*gc.length);
        currentBox.append($('<div class="shop-brand-placeholder"></div>').css('background-color', gc.splice(rgc, 1)));
      }
      currentBox = currentBox.next();
    }

    return false;
  });

  $(".brand-text, .section-text-box, .event-text").niceScroll({
    cursorcolor: '#FCBB75',
    cursoropacitymin: 1,
    cursorwidth: 7,
    cursorborder: 'none',
    cursorborderradius: 0,
    background: '#C2BFBB',
    cursorminheight: 7,
    cursorfixedheight: 7
  });

  setTimeout(function() {
    $('#brand-description').css('overflow', 'visible');
  }, 1500);


  $('.brand-share').on('click', function() {
    $('.share-box').toggle();
  });

  var w = window.innerWidth;
  var lw = 192;
  var sq = 36;
  var lp = 16;
  var x = (w - lw - lp) / sq;
  var y = parseInt(x);
  var lm = lp + (y*sq);
  document.getElementById("lang").style.left=lm + "px";

  window.onresize = function() {
    var w = window.innerWidth;
    var lw = 192;
    var sq = 36;
    var lp = 16;
    var lm = lp;
    while (w > (lm + lw + sq)) {
        lm = lm + sq;
    }
    document.getElementById("lang").style.left=lm + "px";
  };

  $('.shop-brand-span').each(function(){
    var a = $(this).html().trim().replace(/( |\n|\r)/g, '<br>');
    $(this).html(a);
    var font_size = parseInt($(this).css("font-size"));
    while ( $(this).width() > 100 )
    {
      font_size = parseInt(font_size );
      font_size = font_size - 1 +"px";
      $(this).css({ 'font-size':  font_size  });
    }
  });

  $('.levels-box [id!=""]').each(function() {
    if (!$(this).attr('id')) return;
    $(this).qtip({
      position: {
        target: 'mouse',
        adjust: { x: -1, y: -30 }
      },
      content: {
        text: $(this).attr('id').replace(/\-/g, ' ').replace(' and ', ' & ')
      }
    });
  });

  if ($('#brand-page').length > 0) {
    var section = $('#brand-page').attr('data-section');
    $('#' + section).addClass("expanded");
  }
});

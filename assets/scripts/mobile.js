//= require jquery-1.10.2.js
//= require fastclick.js

$(function() {
  var brandsStore = [];
  FastClick.attach(document.body);

  $('.language-bar-container > span').on('click', function() {
    $(this).parent().toggleClass('active');
  });

  sizeBoxes();
  $(window).on("orientationchange",function(){
    sizeBoxes();
  });

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

  if ($('#howToGet-page, #about-page').length > 0) {
    $('.menu-1').addClass('expanded');
    $('.menu-1 .sub-menu').slideDown(500);
  }

  if ($('#firstLevel-page, #secondLevel-page').length > 0) {
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

  $('.menu-button').on('click', function() {
    $('.menu-layer').toggle();
  });

  $('#shop .sub-menu li a, #entertain .sub-menu li a, #dine .sub-menu li a').on('click', function() {
    $(this).toggleClass('enabled');

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

  $('.brand-share').on('click', function() {
    $('.share-box').toggle();
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
});

function sizeBoxes() {
  $('.index-box.szg').each(function() {
    var w = $('body').width();
    var lblHeight = w * 90 / 480;
    $(this).width(w);
    $(this).height(w);
    $('.box-label', this).width(w);
    $('.box-label', this).height(lblHeight);
  });

  $('.shop-box.szg').each(function() {
    var w = $('body').width();
    $(this).height(w);
    $('.shop-brand', this).css({width: w / 3, height: w / 3, lineHeight: (w / 3) + "px"});
    $('.shop-brand-placeholder', this).css({width: w / 3, height: w / 3});
  });

  $('.how-box.szg').each(function() {
    var w = $('body').width();
    $(this).width(w);
    $(this).height(w);
  });

  $('.levels-box.szg').each(function() {
    var w = $('body').width();
    $(this).width(w);
    $(this).height(w);
    $('svg', this).width(w);
    $('svg', this).height(w);
  });

  $('.brand-box.szg, .event-box.szg').each(function() {
    var w = $('body').width();
    $(this).height(w);
  });

  $('.section-image.szg').each(function() {
    var w = $('body').width();
    $(this).height(w);
  });

  $('.shop-brand span').each(function(){
    var a = $(this).html().trim().replace(/( |\n|\r)/g, '<br>');
    $(this).html(a);
    var sapn_width = $(this).width();
    var font_size = parseInt($(this).css("font-size"));
    while ( $(this).width() > 100 )
    {
      font_size = parseInt(font_size );
      font_size = font_size - 1 +"px";
      $(this).css({ 'font-size':  font_size  });
    }
  });

  $('.menu-bg').each(function() {
    if(window.innerHeight > window.innerWidth){
      var w = $('body').width();
      if (w > 320) {
        w = 320;
      }
    } else {
      var w = 320;
    };
    var bgh = w * 90 / 480;
    $(this).width(w);
    $(this).css({'min-height': bgh, 'background-size': w + 'px ' + ' ' + bgh + 'px'});
    $('a', this).css({'line-height': bgh + 'px', 'font-size': (bgh / 3) + 'px', 'padding-left': (w*15.5/100) + 'px'});
    $('.sub-menu a', this).css({'height': (bgh / 1.7) + 'px', 'line-height': (bgh / 1.7) + 'px', 'padding-left': (w*10/100) + 'px'});
  });

  $( window ).on( "orientationchange", function(event) {
    $('.menu-bg').each(function() {
      if(window.innerHeight > window.innerWidth){
        var w = $('body').width();
        if (w > 320) {
          w = 320;
        }
      } else {
        var w = 320;
      };
      var bgh = w * 90 / 480;
      $(this).width(w);
      $(this).css({'min-height': bgh, 'background-size': w + 'px ' + ' ' + bgh + 'px'});
      $('a', this).css({'line-height': bgh + 'px', 'font-size': (bgh / 3) + 'px', 'padding-left': (w*15.5/100) + 'px'});
      $('.sub-menu a', this).css({'height': (bgh / 1.7) + 'px', 'line-height': (bgh / 1.7) + 'px', 'padding-left': (w*10/100) + 'px'});
    });
  });

  $('.box-title, .box-subtitle, .box-date, .box-title-without-date, html[lang=hy] .box-title-without-date, .box-date-without-subtitle, html[lang=hy] .box-date-without-subtitle, .box-subtitle-alone, html[lang=hy] .box-subtitle-alone, .box-date-alone, html[lang=hy] .box-date-alone, .box-title-without-date-2, html[lang=hy] .box-title-without-date-2').each(function() {
    if(window.innerWidth > 320){
      var w = $('body').width();
      var persentage = 1;
      if (w > 320) {
        persentage = w / 320;
        $('.box-title').css({'font-size': (19*persentage + 'px'), 'margin-top': (12*persentage + 'px'), 'line-height': (19*persentage + 'px')});
        $('.box-subtitle').css({'font-size': (15*persentage + 'px'), 'margin-top': (0*persentage + 'px'), 'line-height': (15*persentage + 'px')});
        $('.box-date').css({'font-size': (11*persentage + 'px'), 'bottom': (4*persentage + 'px'), 'line-height': (11*persentage + 'px')});

        $('.box-title-without-date').css({'font-size': (19*persentage + 'px'), 'margin-top': (12*persentage + 'px'), 'line-height': (19*persentage + 'px')});
        $('html[lang=hy] .box-title-without-date').css({'font-size': (17*persentage + 'px'), 'margin-top': (12*persentage + 'px'), 'line-height': (19*persentage + 'px')});

        $('.box-title-without-date-2').css({'font-size': (19*persentage + 'px'), 'margin-top': (20*persentage + 'px'), 'line-height': (19*persentage + 'px')});
        $('html[lang=hy] .box-title-without-date-2').css({'font-size': (17*persentage + 'px'), 'margin-top': (20*persentage + 'px'), 'line-height': (19*persentage + 'px')});

        $('.box-date-without-subtitle').css({'font-size': (11*persentage + 'px'), 'bottom': (16*persentage + 'px'), 'line-height': (11*persentage + 'px')});
        $('html[lang=hy] .box-date-without-subtitle').css({'font-size': (9*persentage + 'px'), 'bottom': (16*persentage + 'px'), 'line-height': (11*persentage + 'px')});

        $('.box-subtitle-alone').css({'font-size': (15*persentage + 'px'), 'line-height': (32*persentage + 'px'), 'margin-top': (0*persentage + 'px')});
        $('html[lang=hy] .box-subtitle-alone').css({'font-size': (13*persentage + 'px'), 'line-height': (32*persentage + 'px'), 'margin-top': (0*persentage + 'px')});

        $('.box-date-alone').css({'font-size': (11*persentage + 'px'), 'bottom': (24*persentage + 'px'), 'line-height': (11*persentage + 'px')});
        $('html[lang=hy] .box-date-alone').css({'font-size': (9*persentage + 'px'), 'bottom': (24*persentage + 'px'), 'line-height': (11*persentage + 'px')});
      }
    }
  });

  $( window ).on( "orientationchange", function(event) {
    $('.box-title, .box-subtitle, .box-date, .box-title-without-date, html[lang=hy] .box-title-without-date, .box-date-without-subtitle, html[lang=hy] .box-date-without-subtitle, .box-subtitle-alone, html[lang=hy] .box-subtitle-alone, .box-date-alone, html[lang=hy] .box-date-alone, .box-title-without-date-2, html[lang=hy] .box-title-without-date-2').each(function() {
      if(window.innerWidth > 320){
        var w = $('body').width();
        var persentage = 1;
        if (w > 320) {
          persentage = w / 320;
          $('.box-title').css({'font-size': (19*persentage + 'px'), 'margin-top': (12*persentage + 'px'), 'line-height': (19*persentage + 'px')});
          $('.box-subtitle').css({'font-size': (15*persentage + 'px'), 'margin-top': (0*persentage + 'px'), 'line-height': (15*persentage + 'px')});
          $('.box-date').css({'font-size': (11*persentage + 'px'), 'bottom': (4*persentage + 'px'), 'line-height': (11*persentage + 'px')});

          $('.box-title-without-date').css({'font-size': (19*persentage + 'px'), 'margin-top': (12*persentage + 'px'), 'line-height': (19*persentage + 'px')});
          $('html[lang=hy] .box-title-without-date').css({'font-size': (17*persentage + 'px'), 'margin-top': (12*persentage + 'px'), 'line-height': (19*persentage + 'px')});

          $('.box-title-without-date-2').css({'font-size': (19*persentage + 'px'), 'margin-top': (20*persentage + 'px'), 'line-height': (19*persentage + 'px')});
          $('html[lang=hy] .box-title-without-date-2').css({'font-size': (17*persentage + 'px'), 'margin-top': (20*persentage + 'px'), 'line-height': (19*persentage + 'px')});

          $('.box-date-without-subtitle').css({'font-size': (11*persentage + 'px'), 'bottom': (16*persentage + 'px'), 'line-height': (11*persentage + 'px')});
          $('html[lang=hy] .box-date-without-subtitle').css({'font-size': (9*persentage + 'px'), 'bottom': (16*persentage + 'px'), 'line-height': (11*persentage + 'px')});

          $('.box-subtitle-alone').css({'font-size': (15*persentage + 'px'), 'line-height': (32*persentage + 'px'), 'margin-top': (0*persentage + 'px')});
          $('html[lang=hy] .box-subtitle-alone').css({'font-size': (13*persentage + 'px'), 'line-height': (32*persentage + 'px'), 'margin-top': (0*persentage + 'px')});

          $('.box-date-alone').css({'font-size': (11*persentage + 'px'), 'bottom': (24*persentage + 'px'), 'line-height': (11*persentage + 'px')});
          $('html[lang=hy] .box-date-alone').css({'font-size': (9*persentage + 'px'), 'bottom': (24*persentage + 'px'), 'line-height': (11*persentage + 'px')});
        }
      } else {
        $('.box-title').css({'font-size': (19 + 'px'), 'margin-top': (12 + 'px'), 'line-height': (19 + 'px')});
        $('.box-subtitle').css({'font-size': (15 + 'px'), 'margin-top': (0 + 'px'), 'line-height': (15 + 'px')});
        $('.box-date').css({'font-size': (11 + 'px'), 'bottom': (4 + 'px'), 'line-height': (11 + 'px')});

        $('.box-title-without-date').css({'font-size': (19 + 'px'), 'margin-top': (12 + 'px'), 'line-height': (19 + 'px')});
        $('html[lang=hy] .box-title-without-date').css({'font-size': (17 + 'px'), 'margin-top': (12 + 'px'), 'line-height': (19 + 'px')});

        $('.box-title-without-date-2').css({'font-size': (19 + 'px'), 'margin-top': (20 + 'px'), 'line-height': (19 + 'px')});
        $('html[lang=hy] .box-title-without-date-2').css({'font-size': (17 + 'px'), 'margin-top': (20 + 'px'), 'line-height': (19 + 'px')});

        $('.box-date-without-subtitle').css({'font-size': (11 + 'px'), 'bottom': (16 + 'px'), 'line-height': (11 + 'px')});
        $('html[lang=hy] .box-date-without-subtitle').css({'font-size': (9 + 'px'), 'bottom': (16 + 'px'), 'line-height': (11 + 'px')});

        $('.box-subtitle-alone').css({'font-size': (15 + 'px'), 'line-height': (24 + 'px'), 'margin-top': (0 + 'px')});
        $('html[lang=hy] .box-subtitle-alone').css({'font-size': (13 + 'px'), 'line-height': (24 + 'px'), 'margin-top': (0 + 'px')});

        $('.box-date-alone').css({'font-size': (11 + 'px'), 'bottom': (24 + 'px'), 'line-height': (11 + 'px')});
        $('html[lang=hy] .box-date-alone').css({'font-size': (9 + 'px'), 'bottom': (24 + 'px'), 'line-height': (11 + 'px')});
      }
    });
  });

}

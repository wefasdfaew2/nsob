//= require jquery-1.10.2.js
//= require anytime.js
//= require jquery-migrate-1.2.1.js
//= require chosen.jquery.js
//= require bootstrap.js
//= require jquery.form.js

$(function() {
  $('.ajaxForm').each(function() {
    $(this).prepend('<div class="alert alert-success"></div>');
    $(this).prepend('<div class="alert alert-danger"></div>');
    var options = {
      dataType: 'json',
      success: function(response, s, x, e) {
        $('.alert', e).hide();
        $('input[type=password]', e).val('');
        var al = null;
        switch (response.status) {
          case 'redirect':
            window.location.href = response.url;
            return;
            break;
          case 'ok':
            al = $('.alert-success', e).text(response.message).show();
            break;
          case 'failed':
          case 'error':
            al = $('.alert-danger', e).text(response.reason).show();
            break;
          default:
        }
        if (al) {
          $('html, body').animate({
            scrollTop: al.offset().top - 65
          }, 300);
        }
      },
      error: function(jqXHR) {
        $('.alert-danger', arguments[3]).text('Error occurred!').show();
        $('html, body').animate({
          scrollTop: $('.alert-danger', arguments[3]).offset().top - 65
        }, 300);
      }
    };
    if ($(this).hasClass('ajaxClear')) {
      options.clearForm = true;
    }
    $(this).ajaxForm(options);
  });

  tinymce.init({
    selector: "textarea",
    plugins: [
      "autolink lists link",
      "code",
      "contextmenu paste"
    ],
    toolbar: "undo redo | bullist numlist link | removeformat code",
    menubar:false,
    statusbar: false,
    height : 300
  });

  $('#date').AnyTime_picker({ askSecond: false });

  $('.delete').on('click', function() {
    var c = confirm('Are you sure ?');
    if (!c) return false;
  });

  $("select").chosen({disable_search_threshold: 10});

  $('select#type').on('change', function() {
    $('#custom, #news, #events, #brands').addClass('hidden');

    var val = $(this).val();

    if (val == 'custom') {
      $('#custom').removeClass('hidden');
    }

    if (val == 'news') {
      $('#news').removeClass('hidden');
    }

    if (val == 'events') {
      $('#events').removeClass('hidden');
    }

    if (val == 'brands') {
      $('#brands').removeClass('hidden');
    }
  });

  $('#brand-section-select').on('change', function() {
    var section = $(this).val();

    $('.brand-section-category').addClass('hide');

    switch(section) {
      case 'shop':
          $('#shop-categories').removeClass('hide');
        break;
      case 'entertain':
          $('#entertain-categories').removeClass('hide');
        break;
      case 'dine':
          $('#dine-categories').removeClass('hide');
        break;
    }
  });
});

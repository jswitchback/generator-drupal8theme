(function($, Drupal, window, document, undefined) {
  var mobileBreakpoint = '(max-width:47.499em)';
  var mainNavToggle = $('.open-btn'),
      $body = $('body');

  $(mainNavToggle).on('click', function(event) {
    event.preventDefault();
    event.stopPropagation();
    $body.toggleClass('menu-open');
  });

  // media query event handler
  if (matchMedia) {
    var mq = window.matchMedia(mobileBreakpoint);
    mq.addListener(WidthChange);
    WidthChange(mq);
  }

  // media query change
  function WidthChange(mq) {
    if (mq.matches) {
      // window width is less than 47.499em
    } else {
      // window width is at least 47.499em
      $body.removeClass('menu-open');
    }
  }
})(jQuery, Drupal, this, this.document);

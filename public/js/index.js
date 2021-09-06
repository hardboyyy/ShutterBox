let $owl = $('#carousel1');

$owl.children().each( function(index) {
  $(this).attr('data-position', index);
});

$("#carousel1").owlCarousel({
  loop: true,
  center: true,
  rewind: true,
  autoplay: true,
  autoplaySpeed: 2000,
  margin: 0,
  responsiveClass: true,
  nav: false,
  responsive: {
    0: {
      items: 1
    },
    680: {
      items: 2
    },
    1000: {
      items: 3
    }
  }
});



// $('#wedding-cinema-gallery').lightGallery({
//   licenseKey: "",
//   loadYoutubeThumbnail: true,
//   youtubeThumbSize: 'default',
//   loadVimeoThumbnail: true,
//   vimeoThumbSize: 'thumbnail_medium'
// });
// $(document).ready(function() {


  // $('#pre-wedding-video-list-div').lightGallery({
  //   loadYoutubeThumbnail: true,
  //   youtubeThumbSize: 'default',
  //   loadVimeoThumbnail: true,
  //   vimeoThumbSize: 'thumbnail_medium'
  // });


// });


jQuery("#gallerylight")
  .justifiedGallery({
    captions: false,
    // lastRow: "hide",
    rowHeight: 180,
    margins: 5
  })
  .on("jg.complete", function () {
    window.lightGallery(
      document.getElementById("gallerylight"),
      {
        autoplayFirstVideo: false,
        pager: false,
        galleryId: "gallery",
        plugins: [lgZoom, lgThumbnail],
        mobileSettings: {
          controls: false,
          showCloseIcon: false,
          download: false,
          rotate: false
        }
      }
    );
  });

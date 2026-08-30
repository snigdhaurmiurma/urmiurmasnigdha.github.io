(function() {
  var videoController = {
    init: function() {
      var playBtn = document.getElementById("hero-video-play");
      var videoCard = document.getElementById("hero-video-card");
      var self = this;

      if (playBtn) {
        playBtn.addEventListener("click", function(e) {
          e.stopPropagation();
          self.openTheaterMode();
        });
      }
      if (videoCard) {
        videoCard.addEventListener("click", function(e) {
          if (!e.target.closest(".no-trigger")) {
            self.openTheaterMode();
          }
        });
      }
    },
    openTheaterMode: function() {
      var vData = (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.videoIntro) ? window.PORTFOLIO_DATA.videoIntro : {
        title: "Cinematic Reel & Creative Philosophy",
        subtitle: "A personal look into my design workflow and creative worldview.",
        videoSrc: "assets/video/intro-video.mp4",
        posterImage: "assets/video/video-poster.svg"
      };

      var videoModalHTML = '<div class="video-theater-wrap" style="width:100%;">' +
        '<div style="aspect-ratio:16/9;background:#000;border-radius:20px;overflow:hidden;position:relative;box-shadow:0 20px 60px rgba(0,0,0,0.9);">' +
        '<video id="theater-video-player" controls autoplay poster="' + vData.posterImage + '" style="width:100%;height:100%;object-fit:cover;">' + 
        '<source src="' + vData.videoSrc + '" type="video/mp4">' +
        'Your browser does not support the video tag.' +
        '</video>' +
        '</div>' +
        '<div style="margin-top:1.5rem;display:flex;justify-content;space-between;align-items:center;">' +
        '<div>' +
        '<h3 style="font-family:var(--font-display);font-size:1.3rem;color:#fff;margin-bottom:0.2rem;">' + vData.title + '</h3>' +
        '<p style="color:var(--text-muted);font-size:0.85rem;">' + (vData.subtitle || vData.description) + '</p>' +
        '</div>' +
        '<span class="category-pill">HD 1080p</span>' +
        '</div>' +
        '</div>';

      if (window.PORTFOLIO_LIGHTBOX) {
        window.PORTFOLIO_LIGHTBOX.open(videoModalHTML);
      }
    }
  };

  window.PORTFOLIO_VIDEO = videoController;
  document.addEventListener("DOMContentLoaded", function() {
    videoController.init();
  });
})();

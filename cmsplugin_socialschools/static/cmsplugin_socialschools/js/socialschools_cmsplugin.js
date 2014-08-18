'use strict';
/*global $:false */
/*global _:false */
var documentTemplate = _.template($('#document-template').html());
var postTemplate = _.template($('#post-template').html());
var photoTemplate = _.template($('#photo-template').html());
var newsTemplate = _.template($('#news-template').html());
var pubPhotoTemplate = _.template($('#pub-photo-template').html());


function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
}

function renderDocuments($post, documents) {
    _.each(documents.objects, function (document) {
        var documentFile = document.document_file;
        // trim the full path to just get filename
        document.document_file = documentFile.split('/')[4];
        var documentHtml = documentTemplate(document);
        $post.find('.post-photos-container').append(documentHtml);
    });
}

function renderNews(selector, posts) {
  $(selector).find('.css-posts-content').empty();
  _.each(posts.objects, function (post) {
    var newsHtml = newsTemplate(post),
        $post = $(document.createElement('div'));
    $post.html(newsHtml);
    $(selector).find('.news').append($post);
  });
  $(".inline").colorbox({inline:true, width:"80%"});
}

function renderPhotos($post, photos) {
  _.each(photos.objects, function (photo) {
    var photoHtml = photoTemplate(photo);
    $post.find('.post-photos-container').append(photoHtml);
  });
}

function renderVideos($post, videos) {
  _.each(videos, function (video) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/,
    match = video.url.match(regExp);
    if (match && match[7].length === 11) {
      var iframe = $('<div class="video-thumbnail"><iframe width="560" height="315" src="//www.youtube.com/embed/' + match[7] +'" frameborder="0" allowfullscreen></iframe></div>');
      $post.find('.post-videos-container').append(iframe);
    }
    else {
      var video_link = $('<a href=' + video.url + '>' + video.url +'</a>');
      $post.find('.post-videos-container').append(video_link);
    }
  });
}

function renderPublicPhotos(selector, photos) {
  $(selector).find('.css-pub-container').empty();
  _.each(photos.objects, function (photo) {
    var photoHTML = pubPhotoTemplate(photo);
    var photoTask = new $.Deferred();
    photoTask.done(function (photoHTML) {
      $(selector).find('.content-pub-photo').append(photoHTML);
    });
    photoTask.resolve(photoHTML);
    photoTask.done(function () {
      var photoList = $('.content-pub-photo > .item');
      photoList.first().addClass('active');
    });
  });
}

function renderPosts(selector, posts) {
  //$(selector).find('.css-posts-content').empty();
  _.each(posts.objects, function (post) {
      var descriptionUrlify = urlify(post.description);
      post.description = descriptionUrlify;
      var postHtml = postTemplate(post),
          $post = $(document.createElement('div'));
      $post.html(postHtml);
      $(selector).find('.css-posts-content').append($post);

      post.getDocuments(function (documents) {
        renderDocuments($post, documents);
      });

      post.getPhotos(function (photos) {
          renderPhotos($post, photos);
      });

      if (post.videos !== '') {
        renderVideos($post, post.getVideos());
      }
    });
    $(function () {
      if (!posts.nextUrl) {
        $(selector).find('a.css-posts-next-page').hide();
      } else {
        $(selector).find('a.css-posts-next-page').show();
      }
      if (!posts.prevUrl) {
        $(selector).find('a.css-posts-prev-page').hide();
      } else {
        $(selector).find('a.css-posts-prev-page').show();
      }
      $(selector).find('a.css-posts-next-page').off('click').on('click', function (e) {
        e.preventDefault();
        posts.getNextPage(function (posts) {
            renderPosts(selector, posts);
        });
      });
      $(selector).find('a.css-posts-prev-page').off('click').on('click', function (e) {
        e.preventDefault();
        posts.getPreviousPage(function (posts) {
          renderPosts(selector, posts);
        });
      });
    });
}

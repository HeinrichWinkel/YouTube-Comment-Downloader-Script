function getCSVFormattedComments() {
  const commentsData = [];
  const commentThreads = document.querySelectorAll('ytd-comment-thread-renderer');
  
  commentThreads.forEach(commentThread => {
    const commentText = commentThread.querySelector('yt-formatted-string#content-text');
    if (commentText) {
      const authorNameElement = commentThread.querySelector('h3.style-scope.ytd-comment-renderer span.style-scope.ytd-comment-renderer');
      const authorName = authorNameElement ? authorNameElement.innerText.trim() : '';
      
      const userProfileLinkElement = commentThread.querySelector('a#author-text');
      const userProfileIdLink = userProfileLinkElement ? userProfileLinkElement.getAttribute('href') : '';
      const userProfileId = userProfileIdLink ? userProfileIdLink.match(/\/channel\/([^/]+)/)[1] : '';
      
      const commentIdElement = commentThread.querySelector('a.yt-simple-endpoint.style-scope.yt-formatted-string');
      const commentIdLink = commentIdElement ? commentIdElement.getAttribute('href') : '';
      const commentId = commentIdLink ? commentIdLink.match(/v=([^&]+)/)[1] : '';
      
      const profileImageElement = commentThread.querySelector('img#img');
      const profileImageLink = profileImageElement ? profileImageElement.getAttribute('src') : '';

      const videoLinkElement = document.querySelector('link[rel="canonical"]');
      const videoLink = videoLinkElement ? videoLinkElement.getAttribute('href') : '';

      const thumbnailLinkElement = document.querySelector('link[as="image"]');
      const thumbnailLink = thumbnailLinkElement ? thumbnailLinkElement.getAttribute('href') : '';

      const videoTitleElement = document.querySelector('meta[property="og:title"]');
      const videoTitle = videoTitleElement ? videoTitleElement.getAttribute('content') : '';

      const channelNameElement = document.querySelector('yt-formatted-string.style-scope.ytd-channel-name a.yt-simple-endpoint');
      const channelName = channelNameElement ? channelNameElement.innerText : '';

      const commentData = [
        `"${authorName}"`,
        userProfileId,
        commentId,
        profileImageLink,
        `"${commentText.innerText.replace(/"/g, '""')}"`,
        videoLink,
        thumbnailLink,
        `"${videoTitle}"`,
        `"${channelName}"`
      ];

      commentsData.push(commentData.join(','));
    }
  });

  return 'Name,User Profile ID,Comment ID,Profile Image Link,Comment,Video Link,Thumbnail Link,Video Title,Channel Name\n' + commentsData.join('\n');
}

async function expandCommentSection() {
  const contentsDiv = document.querySelector('div#contents');
  if (contentsDiv) {
    const commentSection = contentsDiv.querySelector('ytd-comment-thread-renderer');
    if (commentSection) {
      await commentSection.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

function saveCommentsToCSV(comments, videoTitle) {
  const blob = new Blob([comments], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${videoTitle}_comments.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function getVideoTitle() {
  const titleElement = document.querySelector('yt-formatted-string.style-scope.ytd-watch-metadata');
  if (titleElement) {
    return titleElement.innerText.trim();
  }
  return 'youtube_video';
}

expandCommentSection().then(() => {
  const comments = getCSVFormattedComments();
  const videoTitle = getVideoTitle();
  saveCommentsToCSV(comments, videoTitle);
});

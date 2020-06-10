/* Your custom app logic goes here */
(function(){
  var turbo = Turbo({site_id: '5ed66b3030fce70015f72191'});
  // bind this to a click handler to upload files:
  $('.btn-upload').click(function(event) 
  {
    turbo.uploadFile(
      {
        apiKey: 'd2ca3dad-97b1-4080-9371-57483127bb78',
        completion: function(err, file)
        {
            if (err)
            {
              console.log(err);
              return
            }
          console.log('File Uploaded: ' + JSON.stringify(file.result.url));
          
          //var xhr = new XMLHttpRequest();
          var xhr = new window.XMLHttpRequest()
          //xhr.open("POST", '/upload', true);
          xhr.open('POST', '/upload', true);
          //Send the proper header information along with the request
          xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
          
          /*xhr.onreadystatechange = function() { // Call a function when the state changes.
              if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                  // Request finished. Do processing here.
                  console.log("xmlhttp testing");
              }
          }*/
          //console.log("post data:"+JSON.stringify({"_id":event.target.id,"url":file.result.url}));
          xhr.send(JSON.stringify({"id":event.target.id, "url":file.result.url}));
        }
      });
  });
})();

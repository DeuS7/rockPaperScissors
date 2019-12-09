let data = new RPSData();

data.load();

setTimeout(function() {
  console.log("Training begun");
  //train(model, data, 10);
}, 2000);

var video = document.querySelector("#videoElement");



document.addEventListener('keydown', function(e) {
  if (e.keyCode == 107) {
    console.log("started video stream");
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        video.srcObject = stream;
      })
      .catch(function (err0r) {
        console.log(err0r);
      });
    }
  }
  if (e.keyCode == 32) {
    console.log(doSinglePrediction(model, video));
  }
})
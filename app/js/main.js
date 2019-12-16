let data = new RPSData();

data.load();

setTimeout(function() {
  console.log("Training begun");
  train(model, data, 5);
}, 2000);

var video = document.querySelector("#videoElement");



document.addEventListener('keydown', function(e) {
  if (e.keyCode == 107) {
    startVideo();
  }
  if (e.keyCode == 32) {
    doSinglePrediction(model, video).then(function(res) {
      console.log(res[0] + res[1] + res[2]);
    })
  }
})

function startVideo() {
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
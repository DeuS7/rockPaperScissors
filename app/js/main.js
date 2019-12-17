let data = new RPSData();

data.load();

setTimeout(function() {
  console.log("Training begun");
  train(model, data, 1);
}, 2000);

document.addEventListener('keydown', function(e) {
  if (e.keyCode == 107) {
    startVideo();
  }
  if (e.keyCode == 32) {
    doSinglePrediction(model, cropVideo(video, true)).then(function(res) {
      console.log(res);
    })
  }
})

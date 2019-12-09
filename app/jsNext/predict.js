const classNames = ['Rock', 'Paper', 'Scissors'];
const testImage = document.getElementById("testImage");

const doSinglePrediction = async (model, img, options = {}) => {
  const resized = tf.tidy(() => {
    img = tf.browser.fromPixels(img)
    if (num_channels === 1) {
      
      const gray_mid = img.mean(2)
      img = gray_mid.expandDims(2) 
    }
    
    const alignCorners = true
    return tf.image.resizeBilinear(
      img,
      [imgWidth, imgHeight],
      alignCorners
    )
  })

  const logits = tf.tidy(() => {
    const batched = resized.reshape([
      1,
      imgWidth,
      imgHeight,
      num_channels
    ])

    
    return model.predict(batched)
  })

  const values = await logits.data()
  
  resized.dispose()
  logits.dispose()
  
  return classNames.map((className, idx) => ({
    className,
    probability: values[idx]
  }))
}
class RPSData {
	constructor() {
		this.shuffledTrainIndex = 0
		this.shuffledTestIndex = 0
	}

	async load() {
		const img = new Image()
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')

		const imgRequest = new Promise((resolve, _reject) => {
			img.crossOrigin = ''
			img.onload = () => {
				img.width = img.naturalWidth
				img.height = img.naturalHeight

				const datasetBytesBuffer = new ArrayBuffer(
					numDatasetElements * imgSize * 4 * numChannels 
					)

				const chunkSize = Math.floor(numTestElements * 0.15)
        canvas.width = img.width
        canvas.height = chunkSize

        for (let i = 0; i < numDatasetElements / chunkSize; i++) { 
        	const datasetBytesView = new Float32Array(
            datasetBytesBuffer, 
            i * chunkSize * imgSize * 4 * numChannels, 
            imgSize * chunkSize * numChannels 
          )

          ctx.drawImage(
            img,
            0,
            i * chunkSize,
            img.width,
            chunkSize,
            0,
            0,
            img.width,
            chunkSize
          )

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          let x = 0

          for (let j = 0; j < imageData.data.length; j += 4) {
            for (let i = 0; i < numChannels; i++) {
              datasetBytesView[x++] = imageData.data[j + i] / 255
            }
          }
        }
        this.datasetImages = new Float32Array(datasetBytesBuffer)
        resolve()
			}
			img.src = RPS_IMAGES_SPRITE_PATH;
		})

		const labelsRequest = fetch(RPS_LABELS_PATH)
		const [_imgResponse, labelsResponse] = await Promise.all([
      imgRequest,
      labelsRequest
    ]);

    this.datasetLabels = new Uint8Array(await labelsResponse.arrayBuffer());

    this.trainIndices = tf.util.createShuffledIndices(numTrainElements)
    this.testIndices = tf.util.createShuffledIndices(numTestElements)

    this.trainImages = this.datasetImages.slice(
      0,
      imgSize * numTrainElements * numChannels
    )
    this.testImages = this.datasetImages.slice(
      imgSize * numTrainElements * numChannels
    )
    this.trainLabels = this.datasetLabels.slice(
      0,
      numClasses * numTrainElements
    )
    this.testLabels = this.datasetLabels.slice(numClasses * numTrainElements)
	}

	nextTrainBatch(batchSize) {
    return this.nextBatch(
      batchSize,
      [this.trainImages, this.trainLabels],
      () => {
        this.shuffledTrainIndex =
          (this.shuffledTrainIndex + 1) % this.trainIndices.length
        return this.trainIndices[this.shuffledTrainIndex]
      }
    )
  }

  nextTestBatch(batchSize) {
    return this.nextBatch(batchSize, [this.testImages, this.testLabels], () => {
      this.shuffledTestIndex =
        (this.shuffledTestIndex + 1) % this.testIndices.length
      return this.testIndices[this.shuffledTestIndex]
    })
  }

  nextBatch(batchSize, data, index) {
    const batchImagesArray = new Float32Array(
      batchSize * imgSize * numChannels
    )
    const batchLabelsArray = new Uint8Array(batchSize * numClasses)

    for (let i = 0; i < batchSize; i++) {
      const idx = index()

      const startPoint = idx * imgSize * numChannels
      const image = data[0].slice(
        startPoint,
        startPoint + imgSize * numChannels
      )
      batchImagesArray.set(image, i * imgSize * numChannels)

      const label = data[1].slice(
        idx * numClasses,
        idx * numClasses + numClasses
      )
      batchLabelsArray.set(label, i * numClasses)
    }
    const xs = tf.tensor3d(batchImagesArray, [
      batchSize,
      imgSize,
      numChannels
    ])
    const labels = tf.tensor2d(batchLabelsArray, [batchSize, numClasses])
    return { xs, labels }
  }

}
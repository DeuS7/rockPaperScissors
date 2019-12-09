const RPS_IMAGES_SPRITE_PATH = '../data/data.png';
const RPS_LABELS_PATH = '../data/labels_uint8';

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
					num_dataset_elements * image_size * 4 * num_channels 
					)

				const chunkSize = Math.floor(num_test_elements * 0.15)
        canvas.width = img.width
        canvas.height = chunkSize

        for (let i = 0; i < num_dataset_elements / chunkSize; i++) { 
        	const datasetBytesView = new Float32Array(
            datasetBytesBuffer, 
            i * chunkSize * image_size * 4 * num_channels, 
            image_size * chunkSize * num_channels 
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
            for (let i = 0; i < num_channels; i++) {
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

    this.trainIndices = tf.util.createShuffledIndices(num_train_elements)
    this.testIndices = tf.util.createShuffledIndices(num_test_elements)

    this.trainImages = this.datasetImages.slice(
      0,
      image_size * num_train_elements * num_channels
    )
    this.testImages = this.datasetImages.slice(
      image_size * num_train_elements * num_channels
    )
    this.trainLabels = this.datasetLabels.slice(
      0,
      num_classes * num_train_elements
    )
    this.testLabels = this.datasetLabels.slice(num_classes * num_train_elements)
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
      batchSize * image_size * num_channels
    )
    const batchLabelsArray = new Uint8Array(batchSize * num_classes)

    for (let i = 0; i < batchSize; i++) {
      const idx = index()

      const startPoint = idx * image_size * num_channels
      const image = data[0].slice(
        startPoint,
        startPoint + image_size * num_channels
      )
      batchImagesArray.set(image, i * image_size * num_channels)

      const label = data[1].slice(
        idx * num_classes,
        idx * num_classes + num_classes
      )
      batchLabelsArray.set(label, i * num_classes)
    }
    const xs = tf.tensor3d(batchImagesArray, [
      batchSize,
      image_size,
      num_channels
    ])
    const labels = tf.tensor2d(batchLabelsArray, [batchSize, num_classes])
    return { xs, labels }
  }

}
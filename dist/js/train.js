const train = (model, data, numEpochs = 10) => {
	const metrics = ['loss', 'acc', 'val_acc'];
	const container = {
		name: 'Model Training',
		styles: { height: '1000px' }
	}
	const fitCallbacks = tfvis.show.fitCallbacks(container, metrics);
	tfvis.visor().setActiveTab('Visor')

	const [trainXs, trainYs] = tf.tidy(() => {
		const d = data.nextTrainBatch(numTrainElements)
		return [
		d.xs.reshape([
			numTrainElements,
			imgHeight,
			imgHeight,
			numChannels
			]),
		d.labels
		]
	})

	const [testXs, testYs] = tf.tidy(() => {
		const d = data.nextTestBatch(numTestElements)
		return [
		d.xs.reshape([
			numTestElements,
			imgHeight,
			imgHeight,
			numChannels
			]),
		d.labels
		]
	})

	return model.fit(trainXs, trainYs, {
    batchSize: batchSize,
    validationData: [testXs, testYs],
    epochs: numEpochs,
    shuffle: true,
    callbacks: fitCallbacks
  })
}
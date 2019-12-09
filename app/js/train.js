const train = (model, data, numEpochs = 10) => {
	const metrics = ['loss', 'acc', 'val_acc'];
	const container = {
		name: 'Model Training',
		styles: { height: '1000px' }
	}
	const fitCallbacks = tfvis.show.fitCallbacks(container, metrics);
	tfvis.visor().setActiveTab('Visor')

	const [trainXs, trainYs] = tf.tidy(() => {
		const d = data.nextTrainBatch(num_train_elements)
		return [
		d.xs.reshape([
			num_train_elements,
			imgHeight,
			imgHeight,
			num_channels
			]),
		d.labels
		]
	})

	const [testXs, testYs] = tf.tidy(() => {
		const d = data.nextTestBatch(num_test_elements)
		return [
		d.xs.reshape([
			num_test_elements,
			imgHeight,
			imgHeight,
			num_channels
			]),
		d.labels
		]
	})

	return model.fit(trainXs, trainYs, {
    batchSize: batch_size,
    validationData: [testXs, testYs],
    epochs: numEpochs,
    shuffle: true,
    callbacks: fitCallbacks
  })
}
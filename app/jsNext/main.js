//train(getSimpleModel(), data, numEpochs);
const data = new RPSDataset();
this.data = data;

const model = getSimpleModel();
tfvis.show.modelSummary(
	{ name: 'Simple Model Architecture' },
	model
	)
this.model = model

setTimeout(async () => {
	await data.load()
	await showExamples(data)
}, 10);

//Check untrained

setTimeout(async () => {
	await showAccuracy(this.model, this.data);
	await showConfusion(this.model, this.data, 'Untrained Matrix');
}, 500);

//Train model

setTimeout(async () => {
	console.log("training begun");

	const numEpochs = 12;
	await train(this.model, this.data, numEpochs);
}, 50000);
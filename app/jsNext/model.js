const RPS_IMAGES_SPRITE_PATH = '../data/data.png';
const RPS_LABELS_PATH = '../data/labels_uint8';

const imgSize = imgWidth * imgHeight;
const numClasses = 3;

const numDatasetElements = 2520;
const trainTestRatio = 5/6;
const numTrainElements = Math.floor(
  trainTestRatio * numDatasetElements
  )
const numTestElements = numDatasetElements - numTrainElements;
const batchSize = 75;

const model = tf.sequential();

model.add(
  tf.layers.conv2d({
    inputShape: [imgWidth, imgHeight, numChannels],
    kernelSize: 5,
    filters: 8,
    striders: 1,
    activation: 'relu',
    kernelInitializer: 'varianceScaling'
  })
);
model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));

model.add(
  tf.layers.conv2d({
    kernelSize: 5,
    filters: 16,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'varianceScaling'
  })
);
model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));

model.add(tf.layers.flatten());

model.add(
  tf.layers.dense({
    units: 3,
    kernelInitializer: 'varianceScaling',
    activation: 'softmax'
  })
);

model.compile({
  optimizer: tf.train.adam(),
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy']
});

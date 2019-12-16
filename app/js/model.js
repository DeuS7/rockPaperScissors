const image_size = imgWidth * imgHeight;
const num_classes = 3;

const num_dataset_elements = 2520;
const train_test_ratio = 5/6;
const num_train_elements = Math.floor(
  train_test_ratio * num_dataset_elements
)
const num_test_elements = num_dataset_elements - num_train_elements;
const batch_size = 150;

const model = tf.sequential();

model.add(
  tf.layers.conv2d({
    inputShape: [imgWidth, imgHeight, num_channels],
    kernelSize: 5,
    filters: 8,
    striders: 1,
    activation: 'relu',
    kernelInitializer: 'varianceScaling'
  })
)
// The MaxPooling layer acts as a sort of downsampling using max values
// in a region instead of averaging.
model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }))
// Repeat another conv2d + maxPooling stack.
// Note that we have more filters in the convolution.
model.add(
  tf.layers.conv2d({
    kernelSize: 5,
    filters: 16,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'varianceScaling'
  })
)
model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }))
// Now we flatten the output from the 2D filters into a 1D vector to prepare
// it for input into our last layer. This is common practice when feeding
// higher dimensional data to a final classification output layer.
model.add(tf.layers.flatten())
model.add(
    tf.layers.dense({
      units: 3,
      kernelInitializer: 'varianceScaling',
      activation: 'softmax'
    })
)
const optimizer = tf.train.adam();
model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  })

/*model.compile({
    optimizer: tf.train.sgd(0.15),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
});*/



//Right here model is ready.




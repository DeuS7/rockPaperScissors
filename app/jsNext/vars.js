const IMAGE_WIDTH = 64
const IMAGE_HEIGHT = 64
const IMAGE_SIZE = IMAGE_WIDTH * IMAGE_HEIGHT // Width of Spritesheet
const NUM_CLASSES = 3
const NUM_DATASET_ELEMENTS = 2520 // Height of Spritesheet
const BYTES_PER_UINT8 = 4
const BATCH_SIZE = 512

// 1, 3, or 4 (Red+Green+Blue+Alpha)
const NUM_CHANNELS = 3

// Break up dataset into train/test count
const TRAIN_TEST_RATIO = 5 / 6
const NUM_TRAIN_ELEMENTS = Math.floor(
  TRAIN_TEST_RATIO * NUM_DATASET_ELEMENTS
)
const NUM_TEST_ELEMENTS = NUM_DATASET_ELEMENTS - NUM_TRAIN_ELEMENTS
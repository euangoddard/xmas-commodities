const { data } = require('./data.json');

let int = 0;
function nextInt() {
  return ++int;
}

const PRICE_POINTS = 100 + (4 * 8 + 1) * 25;

const COMMODITIES = [
  {
    id: nextInt(),
    name: 'Mulled wine',
    colour: '#d50000',
  },
  {
    id: nextInt(),
    name: 'Spruce trees',
    colour: '#00e676',
  },
  {
    id: nextInt(),
    name: 'Turkeys',
    colour: '#8d6e63',
  },
  {
    id: nextInt(),
    name: 'Wrapping paper',
    colour: '#aa00ff',
  },
  {
    id: nextInt(),
    name: 'Satsumas',
    colour: '#ff6d00',
  },
  {
    id: nextInt(),
    name: 'Baubles',
    colour: '#ffd600',
  },
  {
    id: nextInt(),
    name: 'Snowmen',
    colour: '#fafafa',
  },
  {
    id: nextInt(),
    name: 'Mittens',
    colour: '#0091ea',
  },
];

exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ prices: buildPricesData() }),
  };
};

function buildPricesData() {
  const pricesSets = [...data];

  return COMMODITIES.map((commodity) => {
    return { commodity, prices: buildPrices(pricesSets) };
  });
}

function buildPrices(pricesSets) {
  const priceSet = popRandomChoice(pricesSets);
  const maxStartIndex = priceSet.length - PRICE_POINTS - 1;
  const startIndex = getRandomInt(0, maxStartIndex);
  const basePrices = priceSet.slice(startIndex, startIndex + PRICE_POINTS);
  const prices = [basePrices[0]];
  for (let index = 1; index < basePrices.length; index += 1) {
    const originalDelta = basePrices[index] - basePrices[index - 1];
    const delta = getRandomArbitrary(0.9, 1.1) * originalDelta;
    const nextPrice = prices[index - 1] + delta;
    prices.push(Math.max(roundTo2Dp(nextPrice), 0.01));
  }
  return prices;
}

function roundTo2Dp(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

function popRandomChoice(pricesSets) {
  const index = getRandomInt(0, pricesSets.length - 1);
  return pricesSets.splice(index, 1)[0];
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

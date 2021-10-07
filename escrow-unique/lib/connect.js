const { ApiPromise, WsProvider } = require('@polkadot/api');
const log = require('./log');
const rtt = require("../runtime_types.json");


module.exports = async function (config) {
  // Initialise the provider to connect to the node
  log(`Connecting to ${config.wsEndpoint}`);
  const wsProvider = new WsProvider(config.wsEndpoint);

  // Create the API and wait until ready
  const api = new ApiPromise({ 
    provider: wsProvider,
    types: rtt
  });

  api.on('disconnected', async (value) => {
    log(`disconnected: ${value}`);
    process.exit();
  });
  api.on('error', async (value) => {
    log(`error: ${value.toString()}`);
    process.exit();
  });

  await api.isReady;

  return api;
}
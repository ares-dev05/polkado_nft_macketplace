const { hexToU8a } = require('@polkadot/util');

function hexToString(hexStr) {
  if(!hexStr) {
    return hexStr;
  }

  if(!hexStr.startsWith('0x')) {
    return hexStr;
  }

  try {
    const bytes = hexToU8a(hexStr);
    return new TextDecoder().decode(bytes);
  } catch (error) {
    return hexStr;
  }
}


module.exports = hexToString;
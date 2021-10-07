const protobuf = require('protobufjs')
const { hexToU8a } = require('@polkadot/util');
const hexToString = require('./lib/hexToString');
const isNullOrWhitespace = require('./lib/is-null-or-whitespace');

function decodeMetaType(collection) {
  const schema = collection.toJSON().ConstOnChainSchema;
  const schemaStr = hexToString(schema);
  let protoJson = JSON.parse(schemaStr);

  let root = protobuf.Root.fromJSON(protoJson);
  // Obtain the message type
  let NFTMeta = root.lookupType("onChainMetaData.NFTMeta");
  return NFTMeta;
}

function decodeTokenMeta(collection, token) {
  try {
    let NFTMeta = decodeMetaType(collection);

    const constData = token.toJSON().ConstData;
    let tokenDataBuffer = hexToU8a(constData);

    // Decode a Uint8Array (browser) or Buffer (node) to a message
    var message = NFTMeta.decode(tokenDataBuffer);

    // Maybe convert the message back to a plain object
    var object = NFTMeta.toObject(message, {
      longs: String,  // longs as strings (requires long.js)
      bytes: String,  // bytes as base64 encoded strings
      defaults: true, // includes default values
      arrays: true,   // populates empty arrays (repeated fields) even if defaults=false
      objects: true,  // populates empty objects (map fields) even if defaults=false
      oneofs: true
    });

    return stringify(object);
  }
  catch (e) {
    return undefined;
  }
}

function decodeSearchKeywords(collection, token, tokenId) {
  try {

    let keywords = [];
    for(let k of getMetadataTokens(collection, token)) {
      keywords.push(k);
    }
    keywords.push({locale: null, text: tokenId});
    keywords.push({locale: null, text: hexToString(collection.toJSON().TokenPrefix)});
    return keywords.filter(({text}) => !isNullOrWhitespace(text));
  }
  catch (e) {
    return [];
  }
}

function* getMetadataTokens(collection, token) {
  try {
    let NFTMeta = decodeMetaType(collection);

    const constData = token.toJSON().ConstData;
    let tokenDataBuffer = hexToU8a(constData);

    // Decode a Uint8Array (browser) or Buffer (node) to a message
    var message = NFTMeta.decode(tokenDataBuffer);

    // Maybe convert the message back to a plain object
    var object = NFTMeta.toObject(message, {
      enums: String,
      longs: String,  // longs as strings (requires long.js)
      bytes: String,  // bytes as base64 encoded strings
      defaults: true, // includes default values
      arrays: true,   // populates empty arrays (repeated fields) even if defaults=false
      objects: true,  // populates empty objects (map fields) even if defaults=false
      oneofs: true
    });

    yield* getKeywords(object, NFTMeta);
  } catch(error) {

  }
}

function* getKeywords(object, NFTMeta){
  for (let key in object) {
    yield {locale: null, text: key};
    if (NFTMeta.fields[key].resolvedType.constructor.name == "Enum") {
      if (Array.isArray(object[key])) {
        for (let i = 0; i < object[key].length; i++) {
          yield* convertEnumToString(object[key][i], key, NFTMeta);
        }
      }
      else {
        yield* convertEnumToString(object[key], key, NFTMeta);
      }
    } else {
      yield { locale: null, text: object[key] };
    }
  }
}

function* convertEnumToString(value, key, NFTMeta) {
  try {
    let valueJsonComment = NFTMeta.fields[key].resolvedType.options[value];
    let translationObject = JSON.parse(valueJsonComment);
    if (translationObject) {
      yield* Object.keys(translationObject).map(k => ({ locale: k, text: translationObject[k] }));
    }
  } catch (e) {
    console.log("Error parsing schema when trying to convert enum to string: ", e);
  }
}

function stringify(val) {
  if (typeof val === 'object') {
    for (let key of Object.keys(val)) {
      val[key] = stringify(val[key]);
    }

    return val;
  }

  if (Array.isArray(val)) {
    return val.map(v => stringify(v));
  }

  if (val === undefined) {
    return val;
  }

  if (val === null) {
    return val;
  }

  return val.toString();
}

module.exports = {
  decodeTokenMeta,
  decodeSearchKeywords
};

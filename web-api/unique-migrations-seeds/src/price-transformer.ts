import { ValueTransformer } from "typeorm";

const priceTransformer: ValueTransformer = {
  to: (value) => {
    return value?.toString()?.padStart(40, '0');
  },
  from: (value) => {
    if(value == null) {
      return null;
    }

    return BigInt(value);
  }
}

export {priceTransformer};

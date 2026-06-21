import { getDefaultTamaguiConfig } from '@tamagui/config-default';
import { createTamagui } from 'tamagui';

const config = createTamagui(getDefaultTamaguiConfig());

export type Conf = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default config;

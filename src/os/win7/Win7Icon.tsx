import { win7Assets, type Win7IconName } from './assets';

export default function Win7Icon({ name, size = 32 }: { name: Win7IconName; size?: number }) {
  return <img src={win7Assets[name]} width={size} height={size} alt="" draggable={false} />;
}

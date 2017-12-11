function sleep(amount: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, amount);
  });
}

export function animate({
  node,
  time = 200,
  start,
  stop,
  property = "opacity"
}: {
  node: HTMLElement;
  time?: number;
  start: number;
  stop: number;
  property?: "opacity";
}): Promise<void> {
  // no need to re-render more often than 16ms – 1 frame
  const steps = Math.ceil(time / 16);
  return new Promise(async resolve => {
    const period = (stop - start) / steps;

    for (let i = 0; i < steps; i++) {
      node.style[property] = String(start + period * i);
      await sleep(time / steps);
    }

    resolve();
  });
}

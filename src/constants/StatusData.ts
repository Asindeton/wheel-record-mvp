export enum CustomerStatus {
  new = 'new',
  processed = 'processed',
  ready = 'ready',
  finish = 'finish',
}

export const StatusToColor = {
  [CustomerStatus.new]: '#DEE222',
  [CustomerStatus.processed]: '#21A038',
  [CustomerStatus.ready]: '#A274FF',
  [CustomerStatus.finish]: '#D9D9D9',
};

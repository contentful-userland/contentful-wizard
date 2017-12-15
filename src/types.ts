export declare type IEntryTitle =
  | {
      [key: string]: string;
    }
  | string;

export interface IStyle {
  [key: string]: string;
}

export interface IStyles {
  highlight?: IStyle;
  highlightHover?: IStyle;
  tooltip?: IStyle;
  overlay?: IStyle;
}

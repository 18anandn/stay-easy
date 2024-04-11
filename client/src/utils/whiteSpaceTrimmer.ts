export const whiteSpaceTrimmer = (val: string): string =>
  val.replace(/\s\s+/g, ' ').trim();

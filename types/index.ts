export enum OpenAIModel {
  DAVINCI_TURBO = "gpt-3.5-turbo"
}

export type Source = {
  title: string;
  image: string;
  url: string;
  domainName: string;
};

export type SearchQuery = {
  query: string;
  sourceLinks: Source[];
  relatedQuestions: string[];
};

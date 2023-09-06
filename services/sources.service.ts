const BASE_URL = 'https://hamza50-public-json.hf.space/api/predict/';

class _SourcesService {
  static instance: _SourcesService;

  static getInstance = () => {
    if (!_SourcesService.instance) {
      _SourcesService.instance = new _SourcesService();
    }

    return _SourcesService.instance;
  }

  private getHeaders = () => {
    return {
      'Content-Type': 'application/json',
    }
  }

  public getRelatedQuestions = async ({ query }: { query: string}) => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ data: [ query ]}),
    });

    if (!res || !res.ok) {
      throw new Error(`${_SourcesService.name}: response error: status: ${res?.status}`);
    }
    const json = await res.json();
    const data = json?.data
    if (!json || !data) {
      throw new Error('error getting related surces and links')
    }

    const sourceLinks = data[0] as { link: string }[];
    const relatedQuestions = data[1]?.related_questions?.split('\n') as string[];
    
    return { sourceLinks, relatedQuestions };
  }
}

export const sourcesService = _SourcesService.getInstance();
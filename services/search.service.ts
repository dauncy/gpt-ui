import { Source } from "@/types";
import endent from "endent";

class _SearchService {
  static instance: _SearchService;

  static getInstance() {
    if (!_SearchService.instance) {
      _SearchService.instance = new _SearchService();
    }
    return _SearchService.instance
  }

  private fetchSources = async ({ query, onError }: { query: string; onError: () => void }) => {
    const response = await fetch("/api/sources", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      onError();
      throw new Error(response.statusText);
    }

    const { sources, relatedQuestions }: { sources: Source[], relatedQuestions: string[] } = await response.json();
    return { sources, relatedQuestions };
  }

  private handleStream = async ({ sources, onAnswerUpdate, onDone }: { sources: Source[]; onAnswerUpdate: (answer: string) => void; onDone: (done: boolean) => void; }) => {
    const CLARITY_KEY = localStorage.getItem("CLARITY_KEY");
    if (!CLARITY_KEY) {
      return
    }
    try {
      const prompt = endent`Provide a 2-3 sentence answer to the query based on the following sources. Be original, concise, accurate, and helpful. Cite sources as [1] or [2] or [3] after each sentence (not just the very end) to back up your answer (Ex: Correct: [1], Correct: [2][3], Incorrect: [1, 2]).
      
      ${sources.map((source, idx) => `Source [${idx + 1}]:\n${source.url}`).join("\n\n")}
      `;

      const response = await fetch("/api/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt, apiKey: CLARITY_KEY })
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = response.body;

      if (!data) {
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        onAnswerUpdate(chunkValue);
      }

      onDone(true);
    } catch (err) {
      onAnswerUpdate("Error");
    }
  }

  public search = async ({ query, onSearch, onUpdate, onSuccess, onError }: { query: string; onUpdate: (answer: string) => void; onSuccess: (done: boolean) => void; onError: () => void; onSearch: ({relatedQuestions, sources} :{ relatedQuestions: string[]; sources: Source[]}) => void }) => {
    const { sources, relatedQuestions } = await this.fetchSources({ query, onError });
    onSearch({ sources, relatedQuestions });
    await this.handleStream({ sources, onAnswerUpdate: onUpdate, onDone: onSuccess })
  }
}

export const searchService = _SearchService.getInstance();
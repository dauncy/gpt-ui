import { SearchQuery } from "@/types";
import { IconReload } from "@tabler/icons-react";
import { FC } from "react";
import { SourceCard } from "./SourceCard";

interface AnswerProps {
  searchQuery: SearchQuery;
  answer: string;
  done: boolean;
  onRelatedQuestion: (prompt: string) => void
}

export const Answer: FC<AnswerProps> = ({ searchQuery, answer, done, onRelatedQuestion }) => {
  return (
    <div className="max-w-[800px] space-y-4 py-16 px-8 sm:px-24 sm:pt-16 pb-32">
      <div className="overflow-auto text-2xl sm:text-4xl">{searchQuery.query}</div>

      <div className="border-b border-zinc-800 pb-4">
        <div className="text-md text-blue-500">Answer</div>

        <div className="mt-2 overflow-auto">{replaceSourcesWithLinks(answer, searchQuery.sourceLinks.map((l) => l.url))}</div>
      </div>

      {done && (
        <>
          <div className="border-b border-zinc-800 pb-4">
            <div className="text-md text-blue-500">Sources</div>
            <div className="flex w-full gap-x-6 max-w-xl overflow-x-scroll items-stretch grow mt-4">
             { searchQuery.sourceLinks.map((source) => 
               <SourceCard source={source} key={source.url} />
             )}
            </div>
          </div>

          <div className="border-b border-zinc-800 pb-4">
            <div className="text-md text-blue-500">Similar Questions</div>
            <div className="flex flex-col gap-y-1 mt-4 ">
              {searchQuery.relatedQuestions.map((relatedQuestion) => 
                <p 
                  key={relatedQuestion.split('.')[0]}
                  className="text-white/80 hover:text-blue-300 hover:underline hover:cursor-pointer"
                  onClick={() => onRelatedQuestion(relatedQuestion.split('.')[1])}
                >
                  {relatedQuestion.split('.')[1]}
                </p>
              )}
            </div>
          </div>

          {/* <button
            className="flex h-10 w-52 items-center justify-center rounded-full bg-blue-500 p-2 hover:cursor-pointer hover:bg-blue-600"
            onClick={onReset}
          >
            <IconReload size={18} />
            <div className="ml-2">Ask New Question</div>
          </button> */}
        </>
      )}
    </div>
  );
};

const replaceSourcesWithLinks = (answer: string, sourceLinks: string[]) => {
  const elements = answer.split(/(\[[0-9]+\])/).map((part, index) => {
    if (/\[[0-9]+\]/.test(part)) {
      const link = sourceLinks[parseInt(part.replace(/[\[\]]/g, "")) - 1];

      return (
        <a
          key={index}
          className="hover:cursor-pointer text-blue-500"
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {part}
        </a>
      );
    } else {
      return part;
    }
  });

  return elements;
};

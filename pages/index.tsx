import { Answer } from "@/components/Answer";
import { Loading } from "@/components/Loading";
import { Search } from "@/components/Search";
import { searchService } from "@/services/search.service";
import { SearchQuery } from "@/types";
import { IconBrandGithub, IconBrandTwitter, IconReload } from "@tabler/icons-react";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { uuid as uuidv4 } from 'uuidv4';

export default function Home() {
  const currSearchRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({ query: "", sourceLinks: [], relatedQuestions: [] });
  const [queries, setQueries] = useState<{ id: string; answer: string; q: SearchQuery }[]>([]);
  const [answer, setAnswer] = useState<string>("");
  const [done, setDone] = useState<boolean>(false);
  const [loading, setLoading] = useState(false)

  const handleEndlessSearch = async (prompt: string) => {
    setLoading(true)
    setDone(false);
    await searchService.search({ 
      query: prompt, 
      onSearch: ({ relatedQuestions, sources }) => {
        setLoading(false);
        setSearchQuery({ query: prompt, sourceLinks: sources, relatedQuestions });
      },
      onUpdate: (answer: string) => {
        setAnswer((p) => p + answer)
      },
      onError: () => null,
      onSuccess: (done) => {
        setDone(done);
      },
    });
  }

  useEffect(() => {
    if (done) {
      const currQueries = [...queries];
      const finishedQuery = {
        ...searchQuery,
      }

      const newQ = { q: finishedQuery, answer, id: uuidv4() }

      setQueries([...currQueries, newQ]);
      setSearchQuery({ query: '', relatedQuestions: [], sourceLinks: [] });
      setAnswer('');
      setDone(false);
    }
  }, [done, answer, searchQuery, queries]);

  useEffect(() => {
    if (!done && !loading && answer.length > 0) {
      const scrollTo = currSearchRef.current;
      if (!scrollTo) {
        return;
      }
      scrollTo.scrollIntoView({
        block: 'end',
        behavior: 'auto',
      })
    }
  }, [done, loading, answer])

  return (
    <>
      <Head>
        <title>Clarity AI</title>
        <meta
          name="description"
          content="AI-powered search."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.png"
        />
      </Head>
      <div className="h-screen overflow-auto bg-[#18181C] text-[#D4D4D8]">
        { loading &&  <Loading />}
        <a
          className="absolute top-0 right-12 p-4 cursor-pointer"
          href="https://twitter.com/mckaywrigley"
          target="_blank"
          rel="noreferrer"
        >
          <IconBrandTwitter />
        </a>

        <a
          className="absolute top-0 right-2 p-4 cursor-pointer"
          href="https://github.com/mckaywrigley/clarity-ai"
          target="_blank"
          rel="noreferrer"
        >
          <IconBrandGithub />
        </a>

        {
          queries.length > 0 || answer ? 
          <>
            { queries.length > 0 && queries.map((query, i) => 

              <div key={query.id}>
                <Answer 
                  onRelatedQuestion={async (prompt) => await handleEndlessSearch(prompt)}
                  searchQuery={query.q}
                  answer={query.answer}
                  done={true}
                />
              </div>
            )}

            { answer &&
              <div ref={currSearchRef}>
                <Answer 
                  onRelatedQuestion={async (prompt) => await handleEndlessSearch(prompt)}
                  searchQuery={searchQuery}
                  answer={answer}
                  done={done}
                />
              </div>
            }

            { done || !answer && 
              <div className="max-w-[800px] flex -mt-24 px-8 sm:px-24 items-center justify-center">
                <button
                  className="flex h-10 w-52 items-center justify-center rounded-full bg-blue-500 p-2 hover:cursor-pointer hover:bg-blue-600"
                  onClick={() => {
                    setAnswer("");
                    setSearchQuery({ query: "", sourceLinks: [], relatedQuestions: [] });
                    setQueries([])
                    setDone(false);
                  }}
                >
                  <IconReload size={18} />
                  <div className="ml-2">Ask New Question</div>
                </button> 
              </div>
            }
          </>
          :
          <Search
            onSearch={(res) => setSearchQuery(res)}
            onAnswerUpdate={(value) => setAnswer((prev) => prev + value)}
            onDone={(val) => {
              setDone(val);
            }}
          />
        }
        {/* {answer ? (
          <Answer
            searchQuery={searchQuery}
            answer={answer}
            done={done}
            onReset={() => {
              setAnswer("");
              setSearchQuery({ query: "", sourceLinks: [], relatedQuestions: [] });
              setDone(false);
            }}
          />
        ) : (
          <Search
            onSearch={setSearchQuery}
            onAnswerUpdate={(value) => setAnswer((prev) => prev + value)}
            onDone={setDone}
          />
        )} */}
      </div>
    </>
  );
}

import { OpenAIModel, Source } from "@/types";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import type { NextApiRequest, NextApiResponse } from "next";
import { domainNameFromLink } from "../../utils/sources";
import { sourcesService } from '../../services/sources.service';

type Data = {
  sources: Source[];
  relatedQuestions: string[]
};

const searchHandler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const { query, model } = req.body as {
      query: string;
      model: OpenAIModel;
    };
    
    const { sourceLinks, relatedQuestions } = await sourcesService.getRelatedQuestions({ query });
    const sources: Source[] = [];
    for await (const link of sourceLinks.slice(0,4)) {
      try {
        const url = link.link
        const res = await fetch(url);
        const html = await res.text();
        const dom = new JSDOM(html);
        const doc = dom.window.document;
        const metaTags = doc.querySelectorAll('meta') || [];
        const metaImg = Array.from(metaTags).find((tag) => tag.getAttribute('property')?.includes('image'))?.content ?? '';
        const title = Array.from(metaTags).find((tag) => tag.getAttribute('property')?.includes('title'))?.content ?? '';

        const domainName = domainNameFromLink(link.link);

        sources.push({
          title,
          image: metaImg,
          url: link.link,
          domainName,
        });
      } catch (e) {
        console.error('error parsing dom...', { e })
        continue
      }
    }
    res.status(200).json({ sources: sources, relatedQuestions: relatedQuestions });
  } catch (err) {
    console.log(err);
    res.status(500).json({ sources: [], relatedQuestions: [] });
  }
};

export default searchHandler;

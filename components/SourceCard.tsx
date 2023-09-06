/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Source } from "@/types"

export const SourceCard = ({ source }: { source: Source}) => {
  return (
    <a href={source.url} target="_blank" rel="noreferrer" className="flex-1 flex">
      <div className="cursor-pointer hover:shadow-lg flex pb-2 rounded border-[0.1px] border-white/60 rounded-md w-[292px] flex-col gap-y-4">
        <img
          className="h-24 w-full object-cover object-center rounded-t-md"
          src={source.image}
        />

        <div className="mt-4 mt-auto w-full flex flex-col px-2 gap-y-2 overflow-hidden">
          <p className="text-white-80 tex-sm text-ellipsis clamp-2 leading-4" style={{display: 'block', lineClamp: 2, WebkitLineClamp: 2}}>{source.title}</p>
          <p className="text-blue-300 text-xs">{source.domainName}</p>
        </div>
      </div>
    </a>
  )
}
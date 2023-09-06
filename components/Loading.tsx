export const Loading = ({ text = 'One moment please...'}: { text?: string }) => {
  return(
    <div className="h-full w-full absolute top-0 left-0 z-[99] bg-black/40 flex items-center justify-center">
      <div className="flex px-8 py-2 rounded-md bg-blue-600 text-white items-center gap-x-2">
      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>

      <p className="text-white font-medium">{text}</p>
      </div>
    </div>
  )
}
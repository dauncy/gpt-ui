export const cleanSourceText = (text: string) => {
  return text
    .trim()
    .replace(/(\n){4,}/g, "\n\n\n")
    .replace(/\n\n/g, " ")
    .replace(/ {3,}/g, "  ")
    .replace(/\t/g, "")
    .replace(/\n+(\s*\n)*/g, "\n");
};

const urlPattern = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?]+)(?::\d+)?.*$/i;
export const domainNameFromLink = (link: string): string => {
  const match = link.match(urlPattern);
  const domain = match ? match[1] : '';
  return domain;
}

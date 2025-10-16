
import {type ParsedUrl, type UrlType } from "../utils/parseUrl";

interface HighlightedUrlPartProps {
  urlData: ParsedUrl;
  option: UrlType;
}

export default function HighlightedUrlPart({ urlData, option }: HighlightedUrlPartProps) {
    
  if (!urlData?.fullUrl) return null;

  const { rootDomain, subdomain, path } = urlData;

  let mainPart = "";
  let grayPart = "";

  switch (option) {
    case "root domain":
      mainPart = rootDomain || "";
      // Ako ima subfolder -> on ide sivo
      if (path && path !== "/") {
        grayPart = path;
      }
      break;

    case "subdomain":
      if (subdomain) {
        mainPart = `${subdomain}.${rootDomain}`;
        grayPart = path && path !== "/" ? path : "";
      } else {
        mainPart = rootDomain || "";
        grayPart = path && path !== "/" ? path : "";
      }
      break;

    case "subfolder":
      mainPart =
        subdomain && subdomain !== ""
          ? `${subdomain}.${rootDomain}${path}`
          : `${rootDomain}${path}`;
      grayPart = "";
      break;
  }

  return (
    <span className="text-sm">
      <span className="text-black">{mainPart}</span>
      {grayPart && <span className="text-gray-400">{grayPart}</span>}
    </span>
  );
}

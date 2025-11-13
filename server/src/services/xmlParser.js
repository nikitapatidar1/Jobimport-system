import { parseStringPromise } from "xml2js";
export const xmlToJson = async (xml) => {
  const json = await parseStringPromise(xml, { explicitArray: false });
  return json;
};

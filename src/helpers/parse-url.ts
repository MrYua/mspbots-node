import querystring from 'query-string';
import parse from 'url-parse'

export const parseUrl = (input: string) => {
  return querystring.parse(parse(input).query, {parseBooleans: true});
};

export function getQueryStringValue(key: string, path: string) {
  return decodeURIComponent(
    path.replace(
      new RegExp(
        '^(?:.*[&\\?]' + encodeURIComponent(key).replace(/[\\.\\+\\*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$',
        'i'
      ),
      '$1'
    )
  );
}

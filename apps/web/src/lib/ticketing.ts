export function ticketUrl(url: string, slug: string) {
  const result=new URL(url);
  if(!['https:','http:'].includes(result.protocol))throw new Error('Invalid ticket URL');
  result.searchParams.set('utm_source','livediscover');
  result.searchParams.set('utm_medium','referral');
  result.searchParams.set('utm_campaign',slug);
  return result.href;
}

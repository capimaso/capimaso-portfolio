/** Convert a shared Drive file link into its embedded player URL.
 * @param {string} value
 * @returns {string | null}
 */
export function googleDriveEmbed(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || !['drive.google.com', 'www.drive.google.com'].includes(url.hostname)
      || url.username || url.password || url.port) return null;
    const match = url.pathname.match(/^\/file\/d\/([A-Za-z0-9_-]+)(?:\/(?:view|preview|edit))?\/?$/);
    const id = match?.[1] ?? (/^\/(?:open|uc)\/?$/.test(url.pathname) ? url.searchParams.get('id') : null);
    if (!id || !/^[A-Za-z0-9_-]+$/.test(id)) return null;
    const embed = new URL(`https://drive.google.com/file/d/${id}/preview`);
    const resourceKey = url.searchParams.get('resourcekey');
    if (resourceKey) embed.searchParams.set('resourcekey', resourceKey);
    return embed.href;
  } catch {
    return null;
  }
}

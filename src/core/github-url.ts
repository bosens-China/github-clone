const GITHUB_HTTPS_RE = /^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/.*)?$/;
const GITHUB_SSH_RE = /^git@github\.com:([^/]+)\/([^/]+?)(?:\.git)?$/;

export interface ParsedGithubUrl {
  owner: string;
  repo: string;
  normalizedHttps: string;
}

export function isGithubLink(url: string): boolean {
  const trimmed = url.trim();
  return GITHUB_HTTPS_RE.test(trimmed) || GITHUB_SSH_RE.test(trimmed);
}

export function parseGithubUrl(url: string): ParsedGithubUrl {
  const trimmed = url.trim();
  const httpsMatch = GITHUB_HTTPS_RE.exec(trimmed);
  if (httpsMatch) {
    const [, owner, repo] = httpsMatch as RegExpExecArray & [string, string, string];
    return {
      owner,
      repo,
      normalizedHttps: `https://github.com/${owner}/${repo}.git`,
    };
  }

  const sshMatch = GITHUB_SSH_RE.exec(trimmed);
  if (sshMatch) {
    const [, owner, repo] = sshMatch as RegExpExecArray & [string, string, string];
    return {
      owner,
      repo,
      normalizedHttps: `https://github.com/${owner}/${repo}.git`,
    };
  }

  throw new Error(`无效的 GitHub 仓库地址：${url}`);
}

export function replaceMirrorHost(url: string, mirrorHost: string): string {
  const { normalizedHttps } = parseGithubUrl(url);
  return normalizedHttps.replace('github.com', mirrorHost);
}

export function getRepoDirName(url: string): string {
  const { repo } = parseGithubUrl(url);
  return repo;
}

export function buildMirrorProbeUrl(mirrorHost: string, repoPath: string): string {
  return `https://${mirrorHost}/${repoPath}`;
}

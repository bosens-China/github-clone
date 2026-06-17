const GITHUB_HTTPS_RE = /^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/.*)?$/;
const GITHUB_SSH_RE = /^git@github\.com:([^/]+)\/([^/]+?)(?:\.git)?$/;

export interface ParsedGithubUrl {
  owner: string;
  repo: string;
  normalizedHttps: string;
}

export function isGithubLink(url: string): boolean {
  return GITHUB_HTTPS_RE.test(url) || GITHUB_SSH_RE.test(url);
}

export function parseGithubUrl(url: string): ParsedGithubUrl {
  const httpsMatch = GITHUB_HTTPS_RE.exec(url);
  if (httpsMatch) {
    const [, owner, repo] = httpsMatch;
    return {
      owner,
      repo,
      normalizedHttps: `https://github.com/${owner}/${repo}.git`,
    };
  }

  const sshMatch = GITHUB_SSH_RE.exec(url);
  if (sshMatch) {
    const [, owner, repo] = sshMatch;
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

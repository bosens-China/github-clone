import pc from 'picocolors';
import { defaultConfigStore } from '../../config/mirror-store';
import { MIRROR_PRESETS, MIRROR_PROBE_REPO, type MirrorPreset } from '../../constants';
import { buildMirrorProbeUrl } from '../../core/github-url';

const PROBE_TIMEOUT_MS = 10_000;

export function printMirror(host: string | undefined): void {
  if (host) {
    console.log(`当前镜像：${pc.cyan(host)}`);
    return;
  }
  console.log(pc.yellow('当前未配置镜像，克隆将直连 GitHub'));
}

export function runMirrorSet(host: string): void {
  defaultConfigStore.setMirrorHost(host);
  console.log(pc.green(`镜像已设置为 ${host}`));
  console.log(pc.dim('提示：执行 g mirror test 验证镜像是否可用'));
}

export function runMirrorUnset(): void {
  defaultConfigStore.unsetMirrorHost();
  console.log(pc.green('已清除镜像配置，克隆将直连 GitHub'));
}

export function runMirrorList(): void {
  const current = defaultConfigStore.getMirrorHost();
  const isPresetCurrent = current ? MIRROR_PRESETS.some((p) => p.host === current) : false;

  console.log(pc.bold('可用镜像预设：'));
  for (const preset of MIRROR_PRESETS) {
    const marker = current === preset.host ? pc.green(' (当前)') : '';
    console.log(
      `  ${pc.cyan(preset.name.padEnd(8))} ${preset.host}  ${pc.dim(`— ${preset.description}`)}${marker}`,
    );
  }
  console.log('');
  if (current && !isPresetCurrent) {
    console.log(`当前配置：${pc.cyan(current)} ${pc.dim('（自定义镜像，非内置预设）')}`);
  } else if (!current) {
    console.log(pc.dim('当前未配置镜像，克隆将直连 GitHub'));
    console.log(pc.dim('提示：使用 g mirror set <host> 或 g mirror set <预设名> 进行配置'));
  }
}

function formatProbeError(error: unknown, mirrorHost: string): string {
  if (error instanceof Error) {
    // AbortSignal.timeout 触发的错误名为 'TimeoutError'
    if (error.name === 'TimeoutError') {
      return `镜像 ${mirrorHost} 探测超时（>${PROBE_TIMEOUT_MS / 1000}s），可能不可用`;
    }
    const cause = (error as Error & { cause?: { code?: string } }).cause;
    const code = cause?.code;
    if (code === 'ENOTFOUND' || code === 'EAI_AGAIN') {
      return `无法解析域名 ${mirrorHost}，请检查镜像地址是否正确`;
    }
    if (code === 'ECONNREFUSED' || code === 'ECONNRESET') {
      return `连接 ${mirrorHost} 被拒绝或重置，镜像可能不可用`;
    }
    if (error.message === 'fetch failed') {
      return `无法连接 ${mirrorHost}，请检查网络或镜像是否可用`;
    }
  }
  return `镜像 ${mirrorHost} 探测失败：${error instanceof Error ? error.message : String(error)}`;
}

export async function runMirrorTest(host?: string): Promise<void> {
  const mirrorHost = host ?? defaultConfigStore.getMirrorHost();
  if (!mirrorHost) {
    throw new Error('未配置镜像，请先执行 g mirror set <host> 或指定测试主机');
  }

  const probeUrl = buildMirrorProbeUrl(mirrorHost, MIRROR_PROBE_REPO);
  console.log(pc.dim(`正在探测 ${probeUrl}⋯⋯`));

  let response: Response;
  try {
    response = await fetch(probeUrl, {
      method: 'HEAD',
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
    });
  } catch (error) {
    throw new Error(formatProbeError(error, mirrorHost), { cause: error });
  }
  if (!response.ok) {
    throw new Error(`镜像 ${mirrorHost} 返回 HTTP ${response.status}，可能不可用`);
  }
  console.log(pc.green(`镜像 ${mirrorHost} 可用`));
}

export function resolveMirrorHostInput(input: string): string {
  const preset = MIRROR_PRESETS.find((item: MirrorPreset) => item.name === input || item.host === input);
  return preset?.host ?? input;
}

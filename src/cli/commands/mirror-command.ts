import pc from 'picocolors';
import { defaultConfigStore } from '../../config/mirror-store';
import { MIRROR_PRESETS, MIRROR_PROBE_REPO, type MirrorPreset } from '../../constants';
import { buildMirrorProbeUrl } from '../../core/github-url';

export function printMirror(host: string | undefined): void {
  if (host) {
    console.log(`当前镜像：${pc.cyan(host)}`);
    return;
  }
  console.log(pc.yellow('当前未配置镜像，clone 将直连 GitHub'));
}

export function runMirrorSet(host: string): void {
  defaultConfigStore.setMirrorHost(host);
  console.log(pc.green(`镜像已设置为 ${host}`));
}

export function runMirrorUnset(): void {
  defaultConfigStore.unsetMirrorHost();
  console.log(pc.green('已清除镜像配置，clone 将直连 GitHub'));
}

export function runMirrorList(): void {
  const current = defaultConfigStore.getMirrorHost();
  console.log(pc.bold('可用镜像预设：'));
  for (const preset of MIRROR_PRESETS) {
    const marker = current === preset.host ? pc.green(' (当前)') : '';
    console.log(`  ${pc.cyan(preset.name.padEnd(8))} ${preset.host}${marker}`);
    console.log(`           ${pc.dim(preset.description)}`);
  }
  if (!current) {
    console.log('');
    console.log(pc.dim('提示：使用 g mirror set <host> 或 g mirror set <preset名> 进行配置'));
  }
}

export async function runMirrorTest(host?: string): Promise<void> {
  const mirrorHost = host ?? defaultConfigStore.getMirrorHost();
  if (!mirrorHost) {
    throw new Error('未配置镜像，请先执行 g mirror set <host> 或指定测试主机');
  }

  const probeUrl = buildMirrorProbeUrl(mirrorHost, MIRROR_PROBE_REPO);
  console.log(pc.dim(`正在探测 ${probeUrl} ...`));

  const response = await fetch(probeUrl, { method: 'HEAD', signal: AbortSignal.timeout(10_000) });
  if (!response.ok) {
    throw new Error(`镜像探测失败，HTTP ${response.status}`);
  }
  console.log(pc.green(`镜像 ${mirrorHost} 可用`));
}

export function resolveMirrorHostInput(input: string): string {
  const preset = MIRROR_PRESETS.find((item: MirrorPreset) => item.name === input || item.host === input);
  return preset?.host ?? input;
}

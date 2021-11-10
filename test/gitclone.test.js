import GitClone from '../src/gitClone';

test(`构造函数传参测试`, () => {
  expect(new GitClone().option).toEqual({});
  expect(new GitClone({ url: 'xxx' }).option).toEqual({ url: 'xxx' });
});

test('测试github链接正确性', () => {
  const isGithubLink = (url) => {
    const gitClone = new GitClone();
    return gitClone.isGithubLink(url);
  };
  expect(isGithubLink('https://github.com/bosens-China/breeze-cli')).toBeTruthy();
  expect(isGithubLink('https://github.com/bosens-China/breeze-cli.git')).toBeTruthy();
  expect(isGithubLink('git@github.com:bosens-China/breeze-cli.git')).toBeTruthy();
  expect(isGithubLink('agit@github.com:bosens-China/breeze-cli.git')).toBeFalsy();
});

test('测试github链接替换', () => {
  const replaceMirror = (src, to) => {
    const gitClone = new GitClone();
    return gitClone.replaceMirror(src, to);
  };
  expect(replaceMirror('git@github.com:bosens-China/breeze-cli.git', 'github.com')).toBe(
    'https://github.com/bosens-China/breeze-cli.git',
  );
  expect(replaceMirror('https://github.com/bosens-China/breeze-cli', 'github.com')).toBe(
    'https://github.com/bosens-China/breeze-cli.git',
  );
});

test(`getDir`, () => {
  const gitClone = new GitClone();
  expect(gitClone.getDir('https://github.com/bosens-China/breeze-cli.git')).toBe('breeze-cli');
  expect(gitClone.getDir('https://github.com/bosens-China/breeze-cli')).toBe('breeze-cli');
});

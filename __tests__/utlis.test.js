import { isGithubLink, githubReplace, gitDir } from '../src/utils';
test('测试github链接正确性', () => {
  expect(isGithubLink('https://github.com/bosens-China/breeze-cli')).toBeTruthy();
  expect(isGithubLink('https://github.com/bosens-China/breeze-cli.git')).toBeTruthy();
  expect(isGithubLink('git@github.com:bosens-China/breeze-cli.git')).toBeTruthy();
  expect(isGithubLink('agit@github.com:bosens-China/breeze-cli.git')).toBeFalsy();
});

test('测试github链接替换', () => {
  expect(githubReplace('git@github.com:bosens-China/breeze-cli.git', 'github.com')).toBe(
    'https://github.com/bosens-China/breeze-cli.git',
  );
  expect(githubReplace('https://github.com/bosens-China/breeze-cli', 'github.com')).toBe(
    'https://github.com/bosens-China/breeze-cli.git',
  );
});

test('测试github目录', () => {
  const value = 'breeze-cli';
  expect(gitDir('https://github.com/bosens-China/breeze-cli')).toBe(value);
  expect(gitDir('https://github.com/bosens-China/breeze-cli.git')).toBe(value);
});

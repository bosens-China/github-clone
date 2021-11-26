import { isGithubLink, replaceMirror, getDir } from '../src/utils';

test('isGithubLink', () => {
  expect(isGithubLink('https://github.com/bosens-China/breeze-cli')).toBeTruthy();
  expect(isGithubLink('https://github.com/bosens-China/breeze-cli.git')).toBeTruthy();
  expect(isGithubLink('git@github.com:bosens-China/breeze-cli.git')).toBeTruthy();
  expect(isGithubLink('agit@github.com:bosens-China/breeze-cli.git')).toBeFalsy();
});

test('replaceMirror', () => {
  expect(replaceMirror('git@github.com:bosens-China/breeze-cli.git', 'github.com')).toBe(
    'https://github.com/bosens-China/breeze-cli.git',
  );
  expect(replaceMirror('https://github.com/bosens-China/breeze-cli', 'github.com')).toBe(
    'https://github.com/bosens-China/breeze-cli.git',
  );
});

test(`getDir`, () => {
  expect(getDir('https://github.com/bosens-China/breeze-cli.git')).toBe('breeze-cli');
  expect(getDir('https://github.com/bosens-China/breeze-cli')).toBe('breeze-cli');
});

import { formatURL, replaceProtocol } from './replace';

const list = [
  [
    'https://storage.360buyimg.com/print-tmpl/custom-f445fcb0-e611-4723-bf56-5d6df1cd29bb.1609948599555.txt',
    'https://template-content.jd.com/template-content/template-oss?templateVersion=-1&version=3.4.0.0&isCustom=1&path=print-tmpl%2Fcustom-f445fcb0-e611-4723-bf56-5d6df1cd29bb.1609948599555.txt',
  ],
  [
    'https://storage.jd.com/print-tmpl/custom-f445fcb0-e611-4723-bf56-5d6df1cd29bb.1609948599555.txt',
    'https://template-content.jd.com/template-content/template-oss?templateVersion=-1&version=3.4.0.0&isCustom=1&path=print-tmpl%2Fcustom-f445fcb0-e611-4723-bf56-5d6df1cd29bb.1609948599555.txt',
  ],
  [
    'https://template-content.jd.com/template-content?type=standards&id=100002',
    'https://template-content.jd.com/template-oss?templateVersion=-1&version=3.4.0.0&type=standards&id=100002',
  ],
];

test('测试地址1', () => {
  list.forEach(([source, target]) => {
    expect(formatURL(source)).toBe(target);
  });
});

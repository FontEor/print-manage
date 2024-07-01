export const openNewTab = (url: string) => {
  const save_link = document.createElement('a');
  save_link.href = url;
  save_link.target = '_blank';
  const ev = document.createEvent('MouseEvents');
  ev.initMouseEvent(
    'click',
    true,
    false,
    window,
    0,
    0,
    0,
    0,
    0,
    false,
    false,
    false,
    false,
    0,
    null,
  );
  save_link.dispatchEvent(ev);
};

export const openNewTabDownload = (url: string, filename: string) => {
  const save_link = document.createElement('a');
  save_link.href = url;
  save_link.download = filename;
  save_link.target = '_blank';
  const ev = document.createEvent('MouseEvents');
  ev.initMouseEvent(
    'click',
    true,
    false,
    window,
    0,
    0,
    0,
    0,
    0,
    false,
    false,
    false,
    false,
    0,
    null,
  );
  save_link.dispatchEvent(ev);
};

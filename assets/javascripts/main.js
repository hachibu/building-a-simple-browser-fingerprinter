// https://webbjocke.com/javascript-web-encryption-and-hashing-with-the-crypto-api/
// https://github.com/Valve/fingerprintjs2
// https://www.browserleaks.com/canvas#how-does-it-work

function supportsCrypto() {
  return window.crypto && crypto.subtle && window.TextEncoder;
}

function hex(buff) {
  return [].map.call(new Uint8Array(buff), b => ('00' + b.toString(16)).slice(-2)).join('');
}

function hash(algo, str) {
  return crypto.subtle.digest(algo, new TextEncoder().encode(str));
}

function fingerprintCanvas(txt) {
  // https://browserleaks.com/canvas#how-does-it-work
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');

  canvas.height = 40;
  canvas.width = 800;

  ctx.textBaseline = 'top';
  ctx.font = "14px 'Arial'";
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#f60';
  ctx.fillRect(125,1,40,20);
  ctx.fillStyle = '#069';
  ctx.fillText(txt, 2, 15);
  ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
  ctx.fillText(txt, 4, 17);

  document.body.append(canvas);

  return canvas.toDataURL();
}

function fingerprint() {
  var promise = new Promise(function(resolve, reject) {
    if (!supportsCrypto()) {
      reject('This browser does not suport the Web Crypto API.');
    }
    var components = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      canvas: fingerprintCanvas('Building a Simple Browser Fingerprinter'),
    };

    hash('SHA-256', Object.values(components).join('')).then(buffer => {
      resolve({ hash: hex(buffer), components });
    });
  });

  return promise;
}

fingerprint().then(
  function({ hash, components }) {
    console.table(components);
    fingerprintCanvas(`Your browser fingerprint is ${hash}`);
  },
  console.error
);

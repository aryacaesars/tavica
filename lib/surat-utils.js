// Utility untuk template surat PDF
// Setiap template menerima data (nama, nik, alamat, dst) dan return array of {text, x, y, size}

export function getSuratTemplate(type, data) {
  switch (type) {
    case "domisili":
      return domisiliTemplate(data);
    case "usaha":
      return usahaTemplate(data);
    case "tidak-mampu":
      return tidakMampuTemplate(data);
    case "kelahiran":
      return kelahiranTemplate(data);
    case "pengantar-ktp":
      return pengantarKtpTemplate(data);
    default:
      return defaultTemplate(data);
  }
}

function wrapText(text, maxLength = 50) {
  if (!text) return ['-'];
  const lines = [];
  let current = '';
  for (const word of text.split(' ')) {
    if ((current + word).length > maxLength) {
      lines.push(current.trim());
      current = '';
    }
    current += word + ' ';
  }
  if (current.trim()) lines.push(current.trim());
  return lines;
}

function domisiliTemplate({ nama, nik, tanggalLahir, noWa, dusun, rt, rw, desa, kecamatan, kabupaten, provinsi }) {
  let y = 660;
  const alamatFields = [
    { text: 'Alamat        :', x: 50, y: y, size: 12 },
    { text: `  Dusun        : ${dusun || '-'}`, x: 60, y: y - 15, size: 12 },
    { text: `  RT/RW        : ${(rt && rw) ? `${rt}/${rw}` : '-'}`, x: 60, y: y - 30, size: 12 },
    { text: `  Desa         : ${desa || '-'}`, x: 60, y: y - 45, size: 12 },
    { text: `  Kecamatan    : ${kecamatan || '-'}`, x: 60, y: y - 60, size: 12 },
    { text: `  Kabupaten    : ${kabupaten || '-'}`, x: 60, y: y - 75, size: 12 },
    { text: `  Provinsi     : ${provinsi || '-'}`, x: 60, y: y - 90, size: 12 },
  ];
  y = y - 90;
  const now = new Date();
  const tanggalSurat = `${kabupaten || '-'}, ${now.getDate()} ${now.toLocaleString('id-ID', { month: 'long' })} ${now.getFullYear()}`;
  // Penataan margin tanda tangan bawah
  const yTtd = 120;
  const xKiri = 60;
  const xKanan = 340;
  return [
    { text: "PEMERINTAH DESA/KELURAHAN", x: 180, y: 800, size: 12 },
    { text: "SURAT KETERANGAN DOMISILI", x: 150, y: 780, size: 16 },
    { text: "Yang bertanda tangan di bawah ini menerangkan:", x: 50, y: 740, size: 12 },
    { text: `Nama           : ${nama || '-' }`, x: 50, y: 720, size: 12 },
    { text: `NIK            : ${nik || '-' }`, x: 50, y: 700, size: 12 },
    { text: `Tanggal Lahir  : ${tanggalLahir ? new Date(tanggalLahir).toLocaleDateString('id-ID') : '-' }`, x: 50, y: 680, size: 12 },
    ...alamatFields,
    { text: `No. WhatsApp   : ${noWa || '-'}`, x: 50, y: y - 20, size: 12 },
    { text: "Keterangan     : Benar berdomisili di alamat tersebut di atas.", x: 50, y: y - 50, size: 12 },
    { text: "Keperluan      : Demikian surat ini dibuat untuk dipergunakan sebagaimana mestinya.", x: 50, y: y - 70, size: 12 },
  ];
}

function usahaTemplate({ nama, nik, tanggalLahir, noWa, dusun, rt, rw, desa, kecamatan, kabupaten, provinsi }) {
  let y = 660;
  const alamatFields = [
    { text: 'Alamat        :', x: 50, y: y, size: 12 },
    { text: `  Dusun        : ${dusun || '-'}`, x: 60, y: y - 15, size: 12 },
    { text: `  RT/RW        : ${(rt && rw) ? `${rt}/${rw}` : '-'}`, x: 60, y: y - 30, size: 12 },
    { text: `  Desa         : ${desa || '-'}`, x: 60, y: y - 45, size: 12 },
    { text: `  Kecamatan    : ${kecamatan || '-'}`, x: 60, y: y - 60, size: 12 },
    { text: `  Kabupaten    : ${kabupaten || '-'}`, x: 60, y: y - 75, size: 12 },
    { text: `  Provinsi     : ${provinsi || '-'}`, x: 60, y: y - 90, size: 12 },
  ];
  y = y - 90;
  const now = new Date();
  const tanggalSurat = `${kabupaten || '-'}, ${now.getDate()} ${now.toLocaleString('id-ID', { month: 'long' })} ${now.getFullYear()}`;
  const yTtd = 120;
  const xKiri = 60;
  const xKanan = 340;
  return [
    { text: "PEMERINTAH DESA/KELURAHAN", x: 180, y: 800, size: 12 },
    { text: "SURAT KETERANGAN USAHA", x: 150, y: 780, size: 16 },
    { text: "Yang bertanda tangan di bawah ini menerangkan:", x: 50, y: 740, size: 12 },
    { text: `Nama           : ${nama || '-' }`, x: 50, y: 720, size: 12 },
    { text: `NIK            : ${nik || '-' }`, x: 50, y: 700, size: 12 },
    { text: `Tanggal Lahir  : ${tanggalLahir ? new Date(tanggalLahir).toLocaleDateString('id-ID') : '-' }`, x: 50, y: 680, size: 12 },
    ...alamatFields,
    { text: `No. WhatsApp   : ${noWa || '-'}`, x: 50, y: y - 20, size: 12 },
    { text: "Keterangan     : Benar memiliki usaha di alamat tersebut.", x: 50, y: y - 50, size: 12 },
    { text: "Keperluan      : Surat ini dibuat untuk keperluan administrasi usaha.", x: 50, y: y - 70, size: 12 },
  ];
}

function tidakMampuTemplate({ nama, nik, tanggalLahir, noWa, dusun, rt, rw, desa, kecamatan, kabupaten, provinsi }) {
  let y = 660;
  const alamatFields = [
    { text: 'Alamat        :', x: 50, y: y, size: 12 },
    { text: `  Dusun        : ${dusun || '-'}`, x: 60, y: y - 15, size: 12 },
    { text: `  RT/RW        : ${(rt && rw) ? `${rt}/${rw}` : '-'}`, x: 60, y: y - 30, size: 12 },
    { text: `  Desa         : ${desa || '-'}`, x: 60, y: y - 45, size: 12 },
    { text: `  Kecamatan    : ${kecamatan || '-'}`, x: 60, y: y - 60, size: 12 },
    { text: `  Kabupaten    : ${kabupaten || '-'}`, x: 60, y: y - 75, size: 12 },
    { text: `  Provinsi     : ${provinsi || '-'}`, x: 60, y: y - 90, size: 12 },
  ];
  y = y - 90;
  const now = new Date();
  const tanggalSurat = `${kabupaten || '-'}, ${now.getDate()} ${now.toLocaleString('id-ID', { month: 'long' })} ${now.getFullYear()}`;
  const yTtd = 120;
  const xKiri = 60;
  const xKanan = 340;
  return [
    { text: "PEMERINTAH DESA/KELURAHAN", x: 180, y: 800, size: 12 },
    { text: "SURAT KETERANGAN TIDAK MAMPU", x: 130, y: 780, size: 16 },
    { text: "Yang bertanda tangan di bawah ini menerangkan:", x: 50, y: 740, size: 12 },
    { text: `Nama           : ${nama || '-' }`, x: 50, y: 720, size: 12 },
    { text: `NIK            : ${nik || '-' }`, x: 50, y: 700, size: 12 },
    { text: `Tanggal Lahir  : ${tanggalLahir ? new Date(tanggalLahir).toLocaleDateString('id-ID') : '-' }`, x: 50, y: 680, size: 12 },
    ...alamatFields,
    { text: `No. WhatsApp   : ${noWa || '-'}`, x: 50, y: y - 20, size: 12 },
    { text: "Keterangan     : Benar merupakan warga tidak mampu.", x: 50, y: y - 50, size: 12 },
    { text: "Keperluan      : Surat ini dibuat untuk keperluan bantuan sosial.", x: 50, y: y - 70, size: 12 },
  ];
}

// Penyesuaian posisi tanda tangan bawah, label formal, dan nama kepala desa dinamis
function kelahiranTemplate({ nama, nik, tanggalLahir, noWa, dusun, rt, rw, desa, kecamatan, kabupaten, provinsi, kepalaDesa }) {
  let y = 660;
  const alamatFields = [
    { text: 'Alamat        :', x: 50, y: y, size: 12 },
    { text: `  Dusun        : ${dusun || '-'}`, x: 60, y: y - 15, size: 12 },
    { text: `  RT/RW        : ${(rt && rw) ? `${rt}/${rw}` : '-'}`, x: 60, y: y - 30, size: 12 },
    { text: `  Desa         : ${desa || '-'}`, x: 60, y: y - 45, size: 12 },
    { text: `  Kecamatan    : ${kecamatan || '-'}`, x: 60, y: y - 60, size: 12 },
    { text: `  Kabupaten    : ${kabupaten || '-'}`, x: 60, y: y - 75, size: 12 },
    { text: `  Provinsi     : ${provinsi || '-'}`, x: 60, y: y - 90, size: 12 },
  ];
  y = y - 90;
  const tanggalSurat = `${kabupaten || '-'}, ${new Date().getDate()} ${new Date().toLocaleString('id-ID', { month: 'long' })} ${new Date().getFullYear()}`;
  const yTtd = 120;
  const xKiri = 60;
  const xKanan = 340;

  return [
    { text: "PEMERINTAH DESA/KELURAHAN", x: 180, y: 800, size: 12 },
    { text: "SURAT KETERANGAN KELAHIRAN", x: 130, y: 780, size: 16 },
    { text: "Yang bertanda tangan di bawah ini menerangkan:", x: 50, y: 740, size: 12 },
    { text: `Nama           : ${nama || '-' }`, x: 50, y: 720, size: 12 },
    { text: `NIK            : ${nik || '-' }`, x: 50, y: 700, size: 12 },
    { text: `Tanggal Lahir  : ${tanggalLahir ? new Date(tanggalLahir).toLocaleDateString('id-ID') : '-'}`, x: 50, y: 680, size: 12 },
    ...alamatFields,
    { text: `No. WhatsApp   : ${noWa || '-'}`, x: 50, y: y - 20, size: 12 },
    { text: "Keterangan     : Benar telah lahir di alamat tersebut.", x: 50, y: y - 50, size: 12 },
    { text: "Keperluan      : Surat ini dibuat untuk keperluan administrasi kependudukan.", x: 50, y: y - 70, size: 12 },
  ];
}

function pengantarKtpTemplate({ nama, nik, tanggalLahir, noWa, dusun, rt, rw, desa, kecamatan, kabupaten, provinsi }) {
  let y = 660;
  const alamatFields = [
    { text: 'Alamat        :', x: 50, y: y, size: 12 },
    { text: `  Dusun        : ${dusun || '-'}`, x: 60, y: y - 15, size: 12 },
    { text: `  RT/RW        : ${(rt && rw) ? `${rt}/${rw}` : '-'}`, x: 60, y: y - 30, size: 12 },
    { text: `  Desa         : ${desa || '-'}`, x: 60, y: y - 45, size: 12 },
    { text: `  Kecamatan    : ${kecamatan || '-'}`, x: 60, y: y - 60, size: 12 },
    { text: `  Kabupaten    : ${kabupaten || '-'}`, x: 60, y: y - 75, size: 12 },
    { text: `  Provinsi     : ${provinsi || '-'}`, x: 60, y: y - 90, size: 12 },
  ];
  y = y - 90;
  const now = new Date();
  const tanggalSurat = `${kabupaten || '-'}, ${now.getDate()} ${now.toLocaleString('id-ID', { month: 'long' })} ${now.getFullYear()}`;
  const yTtd = 120;
  const xKiri = 60;
  const xKanan = 340;
  return [
    { text: "PEMERINTAH DESA/KELURAHAN", x: 180, y: 800, size: 12 },
    { text: "SURAT PENGANTAR KTP", x: 150, y: 780, size: 16 },
    { text: "Yang bertanda tangan di bawah ini menerangkan:", x: 50, y: 740, size: 12 },
    { text: `Nama           : ${nama}`, x: 50, y: 720, size: 12 },
    { text: `NIK            : ${nik}`, x: 50, y: 700, size: 12 },
    { text: `Tanggal Lahir  : ${tanggalLahir ? new Date(tanggalLahir).toLocaleDateString('id-ID') : '-' }`, x: 50, y: 680, size: 12 },
    ...alamatFields,
    { text: `No. WhatsApp   : ${noWa || '-'}`, x: 50, y: y - 20, size: 12 },
    { text: "Keterangan     : Benar merupakan warga yang akan mengurus KTP.", x: 50, y: y - 50, size: 12 },
    { text: "Keperluan      : Surat ini dibuat untuk keperluan pengajuan KTP.", x: 50, y: y - 70, size: 12 },

  ];
}

function defaultTemplate({ nama, nik, alamat, tanggalLahir, noWa }) {
  const alamatLines = wrapText(alamat, 50);
  let y = 690;
  const alamatFields = alamatLines.map((line, idx) => ({
    text: `${idx === 0 ? 'Alamat        :' : '               '} ${line}`,
    x: 50,
    y: y - idx * 15,
    size: 14
  }));
  y = y - (alamatLines.length - 1) * 15;
  return [
    { text: `SURAT KETERANGAN`, x: 150, y: 780, size: 16 },
    { text: `Nama           : ${nama || '-'}`, x: 50, y: 750, size: 14 },
    { text: `NIK            : ${nik || '-'}`, x: 50, y: 730, size: 14 },
    { text: `Tanggal Lahir  : ${tanggalLahir ? new Date(tanggalLahir).toLocaleDateString('id-ID') : '-' }`, x: 50, y: 710, size: 14 },
    ...alamatFields,
    { text: `No. WhatsApp   : ${noWa || '-'}`, x: 50, y: y - 20, size: 14 },
  ];
}

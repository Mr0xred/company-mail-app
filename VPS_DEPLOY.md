# Panduan Menjalankan Company Mail App di VPS

Panduan ini akan menjelaskan cara paling mudah untuk menjalankan aplikasi secara *online* 24/7 di VPS (misalnya menggunakan OS Ubuntu). Kita akan menggunakan **PM2**, sebuah program pengelola aplikasi Node.js.

## Langkah 1: Persiapan VPS
Setelah Anda *login* ke VPS melalui SSH, pastikan Node.js dan Git sudah ter-install:
```bash
# Update sistem
sudo apt update

# Install Git & curl
sudo apt install git curl -y

# Install Node.js (Versi 20 LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

## Langkah 2: Unduh Kode dari GitHub
Kloning (*clone*) repository yang sudah kita push sebelumnya:
```bash
git clone https://github.com/Mr0xred/company-mail-app.git
cd company-mail-app
```

## Langkah 3: Setup Backend (Server Penarik Email)
Masuk ke folder backend, install dependencies, buat file `.env`, dan jalankan menggunakan PM2:
```bash
# Masuk ke folder backend
cd backend

# Install module
npm install

# Buat file konfigurasi kredensial (isi dengan email & password app Anda)
nano .env
# (Setelah mengisi, tekan Ctrl+O, Enter, lalu Ctrl+X untuk keluar)

# Install PM2 secara global
sudo npm install -g pm2

# Jalankan server backend di latar belakang (Background)
pm2 start server.js --name "mail-backend"
```

## Langkah 4: Setup Frontend (Tampilan Web)
Kembali ke folder utama, install module, build aplikasi, dan gunakan PM2 untuk menjalankan web statisnya:
```bash
# Kembali ke folder utama proyek
cd ..

# Install module
npm install

# Build aplikasi agar ringan dan cepat
npm run build

# Jalankan hasil build (folder dist) menggunakan PM2 di port 5173
pm2 serve dist 5173 --name "mail-frontend" --spa
```

## Langkah 5: Simpan Konfigurasi PM2
Agar aplikasi otomatis berjalan kembali jika VPS mengalami *restart* (reboot):
```bash
pm2 save
pm2 startup
# (Jalankan perintah tambahan yang muncul di layar terminal setelah mengetik pm2 startup)
```

## Selesai! 🎉
Sekarang aplikasi Anda sudah berjalan 24 jam. Anda bisa mengaksesnya dengan mengetikkan IP VPS Anda di browser:
`http://<IP_VPS_ANDA>:5173/`

### Perintah Berguna PM2:
- Melihat aplikasi yang berjalan: `pm2 list`
- Melihat error/log backend: `pm2 logs mail-backend`
- Merestart aplikasi: `pm2 restart all`
- Menghentikan aplikasi: `pm2 stop all`

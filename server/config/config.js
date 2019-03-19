// =========================================
//          PUERTO DE BASE DE DATOS
// =========================================
process.env.PORT = process.env.PORT || 3000;

// =========================================
//          ENTORNO DE DESPLIEGUE
// =========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =========================================
//          VENCIMIENTO DE TOKEN
// =========================================
// 60 segundos * 60 minutos * 24 horas * 30 días
//process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30
process.env.CADUCIDAD_TOKEN = '48h';

// =========================================
//          SEED DE AUTENTICACIÓN
// =========================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'
let urlDB;

// =========================================
//          AMBIENTE DE BASE DE DATOS
// =========================================

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

// =========================================
//          GOOGLE CLIENT ID
// =========================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '663358526182-9ec3c9bq2fjsnu7jcsr9hcj9qe1uefo9.apps.googleusercontent.com';
// =========================================
//          PUERTO DE BASE DE DATOS
//==========================================
process.env.PORT = process.env.PORT || 3000;

// =========================================
//          ENTORNO DE DESPLIEGUE
//==========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =========================================
//          AMBIENTE DE BASE DE DATOS
//==========================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://dpperalta:TaAMS626r3UUnbG@cluster0-35acl.mongodb.net/cafe';
}
process.env.URLDB = urlDB;
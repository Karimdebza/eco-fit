// // src/lib/wgerClient.ts
// import axios, { AxiosInstance } from 'axios';
// import { wrap } from 'axios-cookiejar-support';
// import * as tough from 'tough-cookie';
// import 'dotenv/config';

// const cookieJar = new tough.CookieJar();

// // 1) crée une instance Axios simple
// const client = axios.create({
//   baseURL: 'https://wger.de/api/v2',
//   withCredentials: true, // indique qu'on veut envoyer/recevoir des cookies
// });

// // 2) “Wrap” cette instance pour qu’elle supporte un cookie jar
// export const wgerClient: AxiosInstance = wrap(client);

// // 3) Associe-lui ton jar
// wgerClient.defaults.jar = cookieJar;

// // 4) (optionnel) Logger les headers/cookies en sortie
// wgerClient.interceptors.request.use(config => {
//   console.log('🛠️ wgerClient headers:', config.headers);
//   console.log('🛠️ wgerClient will send cookies:', cookieJar.getCookieStringSync('https://wger.de'));
//   return config;
// });

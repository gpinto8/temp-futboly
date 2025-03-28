export const serverConfig = {
  cookieName: 'futboly-auth-token',
  cookieSignatureKeys: ['secret1', 'secret2'],
  cookieSerializeOptions: {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    maxAge: 12 * 60 * 60 * 24,
  },
  serviceAccount: {
    projectId: 'test-dfffc',
    clientEmail: 'firebase-adminsdk-ef2bh@test-dfffc.iam.gserviceaccount.com',
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCclWoGZhCjEBTs\nPMxoPnLNgs2ZT3kEC6sTWngbRRf1DwBG8M6XgMUPAk4MGwRtveXo+BndbVDY/Ax+\neOv6lT5kaOZn+t9JKvmITcus03N0qugFaCfqRfnbRDi8DTgfAVhKrgiNmsbFCKSa\nvI3tzZhymlCmZHQYc39nqAtLpJLwBV2rNtWwGdkpKrl3mPvamaRacURU+d8O3pSu\nkW3bZOy0gHNkUzZfP2HQkgrKQL7Rh3HBg96f1fkA0NMZh5xgWQeF7MA6OHcFBNyT\nf81RA5Cr/uRpMwbGrLzLkvVkhVlhjyisT5dWxw1MRqOiPSChKF2HPQxo3HDQTQez\nybywB2VJAgMBAAECggEAAnIQGpLoqHfkQp8mwZBUsmcAu+fSkQnAePp64763Olvh\nw15zvdrfuQfcCsU3ig/QyLmz1bbJy3d+l5qDmG9RJbgJtKEu3ihlPZos4OX+RBCj\nRjN8rT/hriBN7on1vpLLzctcnoz9lOXwFn101yod34/GTB5sGTGqUU/93lBu/e2F\n0C6a2r+7obrAwzjadUPAZQLXAJGwm1SycwUy8EC00szorRMRToMpfOZtTIHvhLK9\nrzOZ2qkV0xf0uB+DEIw663v4rktw9D+hAIfUGRskrwglV6Zj9Po9ItWHl3wM1E7s\n48Hr6nFNPjOlDHMsHyev81beSYdNSDmvA2FvcFJ5nQKBgQDdJGxm4JL5XyQ+2aw2\npfGGC/fsVanDMsLh+ztZTMi8b+mUsH344UYvKlLa9TmRkTbR+wAhgu5e5o4+CEqi\n76CX67Lq6kQlZMlygInO7EkvmiVr8zftBioPRhuCm/inmUQOJU4alUn5kctw1txM\nKE30VNWV1IokjXGyOXnlbRcDVwKBgQC1Q+iB+u8SlnF431WAU3BJkAOl9qLincq4\nGEmxS6KZyuQaxHm2uCFtzS1hMMslKStDSW03ImLs164RIp3A7/xY8zgKjcVqZHRE\nsnZ/W05+ZTZznfUNsM/lYjbHdUhoqYU4p6x/angeLaonzUm/s/YcQ+Kk0ioUEfO2\nib3unhsYXwKBgQCXRFv2PzWp6J+lckXvl7FPTQ6Ilcwq3qUZ6T0eh3xkEXVIpTV2\nMbpNdvj4F3gKj7ddCQF86s/dEH5KBmfvblR+ttZLBHYa0gdOEIizh0NEkX95iQQ/\nWNEaY41b2Q7MrfU0a+YyHt5cHZN4mzBT09oHAKSc+aaI/EvCarhr7CQqvwKBgEe6\nCG4uqp2TVHF9BmtSGROy3g61Kr07rTTtv3Ndt4jdxSdmabdI40l8sCFOWoRo5wqo\nKoRvoe+QZPu40+29yQA1tg5PDThNacipScSZj9TqHgLgFVEGjy14kK6alT19Hw9N\nIjAFJGTksvku/ajTAGcs4alQ1H++ns6zcKnUfGpHAoGADkrKR+YR5MyCibG1pJSZ\nJbsoUyxRAp2YqhVIoyY6GOpRkEx7DuNj8jSKfjlKP7dzvnYavr/1bGTx1a5AFKvl\nBjcHTcR1HnUo0a9CwaxFyxhe661yDIbqqiRIadT+kOkjn+jrB+19QrSVwNwiZMUE\nFnmlfqLEP6aMyUCJe9d51Pg=\n-----END PRIVATE KEY-----\n',
  },
};

export const clientConfig = {
  projectId: 'test-dfffc',
  apiKey: 'AIzaSyBWsO6TCwBz8bb-umkghRn09iTWR8X4oeE',
  authDomain: 'test-dfffc.firebaseapp.com',
  databaseURL: 'test-dfffc.firebaseio.com',
  messagingSenderId: '166592074899',
};

export const DAY_OF_WEEK_MATCH = 5;

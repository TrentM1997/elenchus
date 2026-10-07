export const corsOptions = {
  origin: [
    "https://elenchusapp.io",
    "http://localhost:5173",
    "http://localhost:4173",
  ],
  credentials: true,
  methods: ["OPTIONS", "HEAD", "GET", "PUT", "POST", "DELETE"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
};

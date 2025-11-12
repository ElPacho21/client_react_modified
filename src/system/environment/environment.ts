export const environment = {
  authServerUrl: process.env.AUTH_SERVICE_URL || "http://localhost:3000/",
  cartServerUrl: process.env.CART_SERVICE_URL || "http://localhost:3003/",
  catalogServerUrl: process.env.CATALOG_SERVICE_URL || "http://localhost:3002/",
  imageServerUrl: process.env.IMAGE_SERVICE_URL || "http://localhost:3001/",
  orderServerUrl: process.env.ORDER_SERVICE_URL || "http://localhost:3004/",
  questionsServerUrl: process.env.QUESTIONS_SERVICE_URL || "http://localhost:3005/",
  production: false,
};

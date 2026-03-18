import { http, HttpResponse } from "msw";
import { mockProducts, mockUsers } from "./data";

export const handlers = [
  http.get("/api/products", () => {
    return HttpResponse.json(mockProducts);
  }),

  http.get("/api/products/:id", ({ params }) => {
    const product = mockProducts.find((p) => p.id === params.id);
    if (!product) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(product);
  }),

  http.post("/api/auth/login", async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    const user = mockUsers.find((u) => u.email === body.email);
    if (!user) {
      return new HttpResponse(null, { status: 401 });
    }
    return HttpResponse.json(user);
  }),

  http.post("/api/auth/signup", async ({ request }) => {
    const body = (await request.json()) as {
      email: string;
      password: string;
      name: string;
    };
    const newUser = {
      id: `user-${Date.now()}`,
      email: body.email,
      name: body.name,
    };
    return HttpResponse.json(newUser, { status: 201 });
  }),

  http.get("/api/auth/me", () => {
    return new HttpResponse(null, { status: 401 });
  }),
];

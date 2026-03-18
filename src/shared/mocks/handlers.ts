import { http, HttpResponse } from "msw";
import { mockProducts, mockUsers } from "./data";

export const handlers = [
  http.get("/api/products", () => {
    return HttpResponse.json({
      data: mockProducts,
      success: true,
    });
  }),

  http.get("/api/products/:id", ({ params }) => {
    const product = mockProducts.find((p) => p.id === params.id);
    if (!product) {
      return HttpResponse.json(
        { data: null, success: false, error: "Product not found" },
        { status: 404 },
      );
    }
    return HttpResponse.json({ data: product, success: true });
  }),

  http.post("/api/auth/login", async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    const user = mockUsers.find((u) => u.email === body.email);
    if (!user) {
      return HttpResponse.json(
        { data: null, success: false, error: "Invalid credentials" },
        { status: 401 },
      );
    }
    return HttpResponse.json({ data: user, success: true });
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
    return HttpResponse.json({ data: newUser, success: true }, { status: 201 });
  }),

  http.get("/api/auth/me", () => {
    return HttpResponse.json({ data: null, success: false, error: "Not authenticated" }, { status: 401 });
  }),
];

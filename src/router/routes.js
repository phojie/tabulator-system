const routes = [
  {
    path: "/login",
    name: "login",
    meta: { loginRequired: true },
    component: () => import("pages/Auth/login.vue")
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    meta: { authRequired: true },
    children: [
      {
        path: "",
        name: "dashboard",
        component: () => import("pages/Index.vue")
      }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;

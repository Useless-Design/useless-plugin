const commonRoutes = [
  {
    path: "/md",
    name: "md",
    component: () => import("../pages/index.md"),
  },
];

const routes = [...commonRoutes];

export default routes;

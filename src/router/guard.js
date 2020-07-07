export default function (to, from, next) {
    if (!this.auth && to.path !== '/login') {
        return next({ path: `/login?redirect=${to.fullPath}` });
    }

    if (this.auth && to.path === '/login') {
        return next({ path: '/' });
    }

    next();
}

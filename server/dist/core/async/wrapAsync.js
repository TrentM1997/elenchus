const wrapAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
export { wrapAsync };
//# sourceMappingURL=wrapAsync.js.map
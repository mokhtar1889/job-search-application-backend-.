export let isAuthorized = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role))
      return next(
        new Error("this account is not authorized to do this operation", {
          cause: 401,
        })
      );
    return next();
  };
};

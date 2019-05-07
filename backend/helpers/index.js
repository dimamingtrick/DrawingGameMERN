import { verify } from "jsonwebtoken";

/**
 * JWT validation function
 * if token is valid adds decoded userId to req.body
 * if token is not valid returns error
 */
const jwtValidate = (req, res, next) => {
  verify(req.headers["token"], "ming_trick", (err, { id, exp }) => {
    if (err) {
      return res.json({ status: "error", message: err.message });
    } else {
      if (Date.now > exp) {
        return res.json({ status: "error", message: "Token has been expired" });
      }

      req.body.userId = id; // add user id to request
      next();
    }
  });
};

export { jwtValidate };

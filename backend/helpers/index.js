import { verify } from "jsonwebtoken";

/**
 * JWT validation function
 * if token is valid adds decoded userId to req.body
 * if token is not valid returns error
 */
const jwtValidate = (req, res, next) => {
  verify(req.headers["token"], "ming_trick", (err, decoded) => {
    if (err) {
      return res.status(400).json({ status: "error", message: err.message });
    } else {
      if (Date.now > decoded.exp) {
        return res.json({ status: "error", message: "Token has been expired" });
      }

      req.body.userId = decoded.id; // add user id to request
      next();
    }
  });
};

export { jwtValidate };

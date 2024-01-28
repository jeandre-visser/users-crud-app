import crypto from "crypto";

/**
 * Generates a random string using crypto.
 * @returns {string} A random string.
 */
export const random = () => crypto.randomBytes(128).toString("base64");

const SECRET = "MY-REST-API";

/**
 * Creates a HMAC digest using the provided salt and password.
 * @param {string} salt - The salt to use in the HMAC creation.
 * @param {string} password - The password to use in the HMAC creation.
 * @returns {string} The HMAC digest.
 */
export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");
};

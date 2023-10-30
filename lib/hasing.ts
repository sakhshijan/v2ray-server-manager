import crypto from "crypto";

var algorithm = "aes256"; // or any other algorithm supported by OpenSSL
const SECRET = "App super secret";

export function encodeString(text: string) {
  var cipher = crypto.createCipher(algorithm, process.env.APP_SECRET || SECRET);
  return cipher.update(text, "utf8", "base64url") + cipher.final("base64url");
}

export function decodeString(encrypted: any) {
  var decipher = crypto.createDecipher(
    algorithm,
    process.env.APP_SECRET || SECRET,
  );
  return (
    decipher.update(encrypted, "base64url", "utf8") + decipher.final("utf8")
  );
}

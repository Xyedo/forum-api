import InvariantError from "./InvariantError";

type Props = {
  translate(error: Error): Error;
  directories: { [key: string]: Error };
};
const DomainErrorTranslator: Props = {
  directories: {
    "REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
      "tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada"
    ),
    "REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
      "tidak dapat membuat user baru karena tipe data tidak sesuai"
    ),
    "REGISTER_USER.USERNAME_LIMIT_CHAR": new InvariantError(
      "tidak dapat membuat user baru karena karakter username melebihi batas limit"
    ),
    "REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER": new InvariantError(
      "tidak dapat membuat user baru karena username mengandung karakter terlarang"
    ),
    "USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
      "harus mengirimkan username dan password"
    ),
    "USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
      "username dan password harus string"
    ),
    "REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN":
      new InvariantError("harus mengirimkan token refresh"),
    "REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION":
      new InvariantError("refresh token harus string"),
    "DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN":
      new InvariantError("harus mengirimkan token refresh"),
    "DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION":
      new InvariantError("refresh token harus string"),
    "NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
      "harus berisi title dan body properties pada request body"
    ),
    "NEW_THREAD.INVALID_TYPE": new InvariantError(
      "invalid type pada request body"
    ),
    "NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
      "request body harus berisi content"
    ),
    "NEW_COMMENT.NOT_EXPECTED_VALUE_TYPE": new InvariantError(
      "invalid type pada request body"
    ),
    "NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
      "request body harus berisi content"
    ),
    "NEW_REPLY.NOT_EXPECTED_VALUE_TYPE": new InvariantError(
      "invalid type pada request body"
    )

  },
  translate(error: Error): Error {
    return DomainErrorTranslator.directories[error.message] || error;
  },
};

export default DomainErrorTranslator;

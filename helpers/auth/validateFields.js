const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9]+([._][a-zA-Z0-9]+)*$/;

  if (
    !usernameRegex.test(username) ||
    username.length < 4 ||
    username.length > 16
  ) {
    throw new Error("Invalid username");
  }
  return true;
};

function validatePassword(password) {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;

  if (!passwordRegex.test(password)) {
    throw new Error("Invalid password");
  }
  return true;
}

function validateNickname(nickname) {
  const nicknameRegex = /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/;

  if (
    !nicknameRegex.test(nickname) ||
    nickname.length < 3 ||
    nickname.length > 24
  ) {
    throw new Error("Invalid nickname");
  }
  return true;
}

module.exports = { validateUsername, validatePassword, validateNickname };

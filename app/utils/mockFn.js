import { search, addUser } from './user.server'


export const search_User_Action = async (data) => {
  let actionData = {};
  let key, value;
  const keys = Object.keys(data);
  const values = Object.values(data);

  for (let i = 0; i < values.length; i++) {
    if (values[i] && values[i] !== 'select') {
      key = keys[i];
      value = values[i];
      break;
    }
  }
  if (key && value) {
    value = key === 'age' ? parseInt(value) : value;
    const res = await search({ key, value });
    if (res?.length > 0)
      actionData["users"] = res;
    else
      actionData["errors"] = { default: "No User Found !" };
  }
  else
    actionData["errors"] = { default: "Please provide an input" };


  return actionData;
}

export const add_User_Action = async (data) => {
  let actionData = {};

  const {
    firstName = null,
    lastName = null,
    username = null,
    maidenName = "",
    email = null,
    age = null,
    gender = null,
    phone = null,
    birthDate = null,
  } = data;
  const errors = {
    firstName: firstName ? null : "First Name is required",
    lastName: lastName ? null : "Last Name is required",
    username: username ? null : "username is required",
    age: age ? null : "age is required",
    gender: gender ? null : "age is required",
    phone: phone ? null : "phone is required",
    email: email ? null : "email is required",
    birthDate: birthDate ? null : "birthDate is required",
  };
  const hasErrors = Object.values(errors).some(
    (errorMessage) => errorMessage
  );
  if (hasErrors) {
    actionData["errors"] = errors;
  } else {
    const user = {
      firstName,
      maidenName,
      lastName,
      email,
      phone,
      birthDate,
      gender,
      age,
    };
    const res = await addUser(user);
    actionData["success"] = res;
  }
}
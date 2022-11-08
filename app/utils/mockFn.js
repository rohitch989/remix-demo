import { sendRequest } from './config';


export const search_User_Action = async (data, actionData) => {
  if (Object.values(data).every(x => x === null || x === '')) {
    actionData["users"] = false;
    actionData["errors"] = { default: "Please provide an input" }
  }
  else {
    const keys = Object.keys(data);
    const values = Object.values(data);
    let key, value;
    for (let i = 0; i < values.length; i++)
      if (values[i]) {
        key = keys[i];
        value = keys[i] === 'age' ? parseInt(values[i].trim()) : values[i].trim()
        break;
      }

    const result = await sendRequest('users', 'get');
    if (result?.items) {
      const search = result.items.filter(user => user[key] === value);
      if (search?.length > 0) {
        actionData["users"] = search;
        actionData["success"] = { default: "User Found !" }
      }
      else
        actionData["errors"] = { default: "User Not Found" };

    } else
      actionData["errors"] = { default: "Something goes wrong !" }
  }
  return actionData;

}

export const add_User_Action = async (data, actionData) => {
  const {
    firstName = null, lastName = null,
    username = null, maidenName = "",
    email = null, age = null,
    gender = null, phone = null } = data;

  const errors = {
    firstName: firstName ? null : "First Name is required",
    lastName: lastName ? null : "Last Name is required",
    username: username ? null : "username is required",
    age: age ? null : "age is required",
    gender: gender ? null : "age is required",
    phone: phone ? null : "phone is required",
    email: email ? null : "email is required",
  };
  const hasErrors = Object.values(errors).some(
    (errorMessage) => errorMessage
  );
  if (hasErrors)
    return actionData = { errors };

  const user = {
    "firstName": firstName.trim(), "maidenName": maidenName, "lastName": lastName.trim(), "email": email.trim(), "phone": phone.trim(), "post": [], "gender": gender.trim(), "age": parseInt(age.trim()), "username": username.trim()
  };

  const users = await sendRequest('users', 'get');
  if (users?.items) {
    const exist = users?.items ? users.items.filter(u => u.username === username) || users.items.filter(u => u.email === email) : [];
    if (exist?.length > 0)
      return actionData = { errors: { default: "User already exist with that email or username" } };

    const m = await sendRequest('users', 'post', user);

    if (m?.error)
      return actionData = { errors: { default: m.error } };
    else
      return actionData = { success: { default: "A User is created" } };
  }
  return actionData = { errors: { default: users.error } };
}

export const delete_User_Action = async (data, actionData) => {

  if (!data)
    return actionData;

  const m = await sendRequest(`users/${data}`, 'delete');


  if (m?.error) {
    actionData["errors"] = m.error;
    actionData["users"] = false
    actionData["success"] = false;
  }
  else {
    actionData["errors"] = false;
    actionData["users"] = false
    actionData["success"] = { default: "A User is Deleted !" };
  }
  return actionData
}

export const addPost = async (id, post) => {

  const res = await sendRequest(`users/${id}`, 'get');

  if (res?.error)
    return { error: res.error }

  const posts = res.post;
  posts.push(post);
  const respose = sendRequest('users', 'put', { _uuid: id, post: posts });
  if (respose?.error)
    return { error: res.error }
  return { success: true }
}





export const sendRequest = async (url, method, body = null) => {

  const options = {
    method: method,
    headers: new Headers({ "Accept": "application/json", 'content-type': 'application/json', 'Authorization': `Bearer ${process.env.API_KEY}` }),
    mode: 'no-cors'
  };
  const URL = `${process.env.API_URL}${url}`
  if (body)
    options.body = JSON.stringify([body]);

  return await fetch(URL, options).then(res => res.json()).catch(e => e.error);
}

export const dummyUser = (formData) => {
  const { _action, ...data } = Object.fromEntries(formData);
  const {
    firstName = null, lastName = null,
    username = null, maidenName = "",
    email = null,
    age = null,
    gender = null,
    phone = null,
  } = data;
  const errors = {
    firstName: firstName ? null : "First Name is required",
    lastName: lastName ? null : "Last Name is required",
    username: username ? null : "username is required",
    age: age ? null : "age is required",
    gender: gender ? null : "age is required",
    phone: phone ? null : "phone is required",
    email: email ? null : "email is required",
  };
  if (Object.values(errors).some(
    (errorMessage) => errorMessage
  ))
    return [];
  else {
    const user = {
      "firstName": firstName.trim(), "maidenName": maidenName, "lastName": lastName.trim(), "email": email.trim(), "phone": phone.trim(), "gender": gender.trim(), "age": parseInt(age.trim()), "username": username.trim()
    };
    return [user];
  }
}
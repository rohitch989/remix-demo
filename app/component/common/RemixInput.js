function RemixInput({ errors, id, name, type }) {
  return (
    <div className="form-control">
      <label htmlFor={id}>{name}:</label>
      <input type={type} name={name} id={id} />
      {errors ? <em className="text-red-600">{errors}</em> : null}
    </div>
  );
}

export default RemixInput;
